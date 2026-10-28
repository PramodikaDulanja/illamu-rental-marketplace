import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const resolvedParams = await params;
    const itemId = resolvedParams.itemId;

    const messages = await prisma.message.findMany({
      where: { itemId },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}