import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const users = await prisma.bcmUser.findMany({
      orderBy: { userCode: 'asc' }
    });
    return NextResponse.json(users);
  } catch (err: any) {
    console.error('Failed to fetch BCM users:', err);
    return NextResponse.json({ error: 'Failed to fetch BCM users' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userCode, status } = body;

    if (!userCode || !status) {
      return NextResponse.json({ error: 'userCode and status are required' }, { status: 400 });
    }

    const updated = await prisma.bcmUser.update({
      where: { userCode },
      data: { status }
    });

    // Also record audit log in DB
    await prisma.bcmAuditLog.create({
      data: {
        action: status === 'ACTIVE' ? 'USER_ACCOUNT_UNLOCKED' : 'USER_ACCOUNT_LOCKED',
        actor: 'superadmin_sec',
        role: 'Super Administrator',
        ipAddress: '192.168.10.4',
        details: Account  () status changed to .
      }
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('Failed to update BCM user:', err);
    return NextResponse.json({ error: 'Failed to update BCM user' }, { status: 500 });
  }
}
