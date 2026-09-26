import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    const where = clientId ? { clientId } : {};
    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(tickets);
  } catch (err: any) {
    console.error('Failed to fetch tickets:', err);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, subject, message } = body;

    if (!clientId || !subject || !message) {
      return NextResponse.json({ error: 'clientId, subject, and message are required' }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        clientId,
        subject,
        message,
        status: 'OPEN'
      }
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (err: any) {
    console.error('Failed to create ticket:', err);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
