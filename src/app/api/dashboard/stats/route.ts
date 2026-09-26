import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type OrderDistributionRow = {
  serviceType: string;
};

type RecentLead = {
  source: string;
  name: string;
  company: string;
  createdAt: Date;
};

type RecentProposal = {
  name: string;
  company: string;
  createdAt: Date;
};

type RecentOrder = {
  companyName: string;
  serviceType: string;
  createdAt: Date;
};

type ActivityItem = {
  type: 'lead' | 'proposal' | 'order';
  title: string;
  detail: string;
  at: Date;
};

export async function GET() {
  try {
    // 1. Fetch counts
    const leadsCount = await prisma.lead.count();
    const proposalsCount = await prisma.proposal.count();
    const ordersCount = await prisma.order.count();
    const academyCount = await prisma.academyRegistration.count();
    const bookingsCount = await prisma.booking.count();

    // 2. Fetch converted status
    const convertedLeads = await prisma.lead.count({
      where: { status: 'CONVERTED' }
    });

    // 3. Fetch only the fields needed to generate the chart.
    // Explicit result typing keeps the route type-safe even when Prisma's
    // generated declarations are unavailable during a CI dependency install.
    const orders = await prisma.order.findMany({
      select: { serviceType: true }
    }) as OrderDistributionRow[];

    const serviceTypeDistribution = orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.serviceType] = (acc[order.serviceType] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(serviceTypeDistribution).map(([name, value]) => ({
      name,
      value
    }));

    const totalLeadsAndProposals = leadsCount + proposalsCount;
    const conversionRate = totalLeadsAndProposals > 0
      ? Math.round(((convertedLeads + ordersCount) / totalLeadsAndProposals) * 100)
      : 0;

    // 4. Build real recent activity feed from the latest records.
    // Select only the fields used by the dashboard and explicitly type each
    // result so callback parameters never fall back to implicit any in CI.
    const [recentLeads, recentProposals, recentOrders] = await Promise.all([
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          source: true,
          name: true,
          company: true,
          createdAt: true
        }
      }) as Promise<RecentLead[]>,
      prisma.proposal.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          name: true,
          company: true,
          createdAt: true
        }
      }) as Promise<RecentProposal[]>,
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          companyName: true,
          serviceType: true,
          createdAt: true
        }
      }) as Promise<RecentOrder[]>
    ]);

    const activityItems: ActivityItem[] = [
      ...recentLeads.map((lead): ActivityItem => ({
        type: 'lead',
        title: `Lead baru dari ${lead.source}`,
        detail: `${lead.name} (${lead.company})`,
        at: lead.createdAt
      })),
      ...recentProposals.map((proposal): ActivityItem => ({
        type: 'proposal',
        title: 'Permintaan proposal masuk',
        detail: `${proposal.name} (${proposal.company})`,
        at: proposal.createdAt
      })),
      ...recentOrders.map((order): ActivityItem => ({
        type: 'order',
        title: 'Pemesanan layanan baru',
        detail: `${order.companyName} (${order.serviceType})`,
        at: order.createdAt
      }))
    ];

    const recentActivity = activityItems
      .sort((a, b) => b.at.getTime() - a.at.getTime())
      .slice(0, 6)
      .map((item, idx) => ({ id: idx + 1, ...item }));

    return NextResponse.json({
      leadsCount,
      proposalsCount,
      ordersCount,
      academyCount,
      bookingsCount,
      conversionRate: `${conversionRate}%`,
      chartData,
      recentActivity
    }, { status: 200 });
  } catch (err: any) {
    console.error('[API ERROR] Failed to fetch dashboard stats:', err);
    return NextResponse.json(
      { error: 'Internal server error occurred.' },
      { status: 500 }
    );
  }
}
