import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: අලුත් පණිවිඩයක් යැවීම
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, senderId, receiverId, content } = body;

    if (!itemId || !senderId || !receiverId || !content) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        itemId,
        senderId,
        receiverId,
        content,
      },
    });

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: අදාළ භාණ්ඩය සහ යූසර්වරුන් අතර පණිවිඩ ලබා ගැනීම
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const user1Id = searchParams.get('user1Id');
    const user2Id = searchParams.get('user2Id');

    if (!itemId) {
      return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        itemId,
        OR: user1Id && user2Id ? [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id },
        ] : undefined,
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}