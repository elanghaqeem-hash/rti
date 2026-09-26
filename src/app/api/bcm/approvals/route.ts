import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const approvals = await prisma.bcmApproval.findMany({
      orderBy: { approvalCode: 'asc' }
    });
    return NextResponse.json(approvals);
  } catch (err: any) {
    console.error('Failed to fetch BCM approvals:', err);
    return NextResponse.json({ error: 'Failed to fetch BCM approvals' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { approvalCode, status, approverName, digitalSignature } = body;

    if (!approvalCode || !status) {
      return NextResponse.json({ error: 'approvalCode and status are required' }, { status: 400 });
    }

    const updated = await prisma.bcmApproval.update({
      where: { approvalCode },
      data: {
        status,
        approvedAt: status === 'APPROVED' ? new Date() : null,
        approverName: approverName || 'Dr. Hendra Gunawan, MM',
        digitalSignature: digitalSignature || SIG-SHA256-
      }
    });

    // Record audit log
    await prisma.bcmAuditLog.create({
      data: {
        action: status === 'APPROVED' ? 'EXECUTIVE_SIGN_OFF_APPROVED' : 'EXECUTIVE_SIGN_OFF_REJECTED',
        actor: 'hendra_director',
        role: 'Director / Principal Advisor',
        ipAddress: '192.168.10.8',
        details: Approval desk  () set to  with cryptographic signature.
      }
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('Failed to update BCM approval:', err);
    return NextResponse.json({ error: 'Failed to update BCM approval' }, { status: 500 });
  }
}
