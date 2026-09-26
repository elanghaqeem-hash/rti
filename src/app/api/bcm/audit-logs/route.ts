import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const logs = await prisma.bcmAuditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    return NextResponse.json(logs);
  } catch (err: any) {
    console.error('Failed to fetch BCM audit logs:', err);
    return NextResponse.json({ error: 'Failed to fetch BCM audit logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, actor, role, ipAddress, details } = body;

    if (!action || !actor) {
      return NextResponse.json({ error: 'action and actor are required' }, { status: 400 });
    }

    const created = await prisma.bcmAuditLog.create({
      data: {
        action,
        actor,
        role: role || 'User',
        ipAddress: ipAddress || '127.0.0.1',
        details: details || ''
      }
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error('Failed to create BCM audit log:', err);
    return NextResponse.json({ error: 'Failed to create BCM audit log' }, { status: 500 });
  }
}
