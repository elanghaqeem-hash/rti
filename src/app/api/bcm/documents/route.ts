import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const docs = await prisma.bcmDocument.findMany({
      orderBy: { docCode: 'asc' }
    });
    return NextResponse.json(docs);
  } catch (err: any) {
    console.error('Failed to fetch BCM documents:', err);
    return NextResponse.json({ error: 'Failed to fetch BCM documents' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { docCode, status, submissionDate, fileUrl, notes } = body;

    if (!docCode) {
      return NextResponse.json({ error: 'docCode is required' }, { status: 400 });
    }

    const updated = await prisma.bcmDocument.update({
      where: { docCode },
      data: {
        ...(status && { status }),
        ...(submissionDate && { submissionDate }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(notes !== undefined && { notes })
      }
    });

    // Record audit log
    await prisma.bcmAuditLog.create({
      data: {
        action: 'DRL_DOCUMENT_UPDATED',
        actor: 'rian_coord',
        role: 'Client BCM Coordinator',
        ipAddress: '10.20.1.88',
        details: `DRL Document ${docCode} (${updated.title}) status updated to ${status}.`
      }
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('Failed to update BCM document:', err);
    return NextResponse.json({ error: 'Failed to update BCM document' }, { status: 500 });
  }
}
