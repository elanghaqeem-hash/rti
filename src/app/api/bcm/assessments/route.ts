import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const assessments = await prisma.bcmAssessment.findMany({
      orderBy: { processId: 'asc' }
    });
    return NextResponse.json(assessments);
  } catch (err: any) {
    console.error('Failed to fetch BCM assessments:', err);
    return NextResponse.json({ error: 'Failed to fetch BCM assessments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      processId,
      processName,
      businessUnit,
      operationalImpact,
      financialImpactPerHour,
      mtpdHours,
      rtoHours,
      rpoMinutes,
      spofComponents,
      recoveryStrategy,
      status
    } = body;

    if (!processId) {
      return NextResponse.json({ error: 'processId is required' }, { status: 400 });
    }

    const saved = await prisma.bcmAssessment.upsert({
      where: { processId },
      update: {
        ...(processName && { processName }),
        ...(businessUnit && { businessUnit }),
        ...(operationalImpact !== undefined && { operationalImpact: Number(operationalImpact) }),
        ...(financialImpactPerHour !== undefined && { financialImpactPerHour: Number(financialImpactPerHour) }),
        ...(mtpdHours !== undefined && { mtpdHours: Number(mtpdHours) }),
        ...(rtoHours !== undefined && { rtoHours: Number(rtoHours) }),
        ...(rpoMinutes !== undefined && { rpoMinutes: Number(rpoMinutes) }),
        ...(spofComponents !== undefined && { spofComponents }),
        ...(recoveryStrategy !== undefined && { recoveryStrategy }),
        ...(status && { status })
      },
      create: {
        processId,
        processName: processName || 'Business Process',
        businessUnit: businessUnit || 'Operations',
        operationalImpact: Number(operationalImpact || 3),
        financialImpactPerHour: Number(financialImpactPerHour || 100),
        mtpdHours: Number(mtpdHours || 4),
        rtoHours: Number(rtoHours || 2),
        rpoMinutes: Number(rpoMinutes || 15),
        spofComponents: spofComponents || null,
        recoveryStrategy: recoveryStrategy || null,
        status: status || 'REVIEWED'
      }
    });

    // Record audit log
    await prisma.bcmAuditLog.create({
      data: {
        action: 'BIA_PARAMETERS_UPDATED',
        actor: 'sarah_lead_bcm',
        role: 'Lead BCM Consultant',
        ipAddress: '192.168.10.12',
        details: `Updated BIA parameters for ${processId} (${saved.processName}): RTO=${saved.rtoHours}h, RPO=${saved.rpoMinutes}m, MTPD=${saved.mtpdHours}h.`
      }
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    console.error('Failed to save BCM assessment:', err);
    return NextResponse.json({ error: 'Failed to save BCM assessment' }, { status: 500 });
  }
}
