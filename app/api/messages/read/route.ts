import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, userId } = body;

    if (!itemId || !userId) {
      return NextResponse.json({ success: false, error: 'Missing itemId or userId' }, { status: 400 });
    }

    // 🔄 අදාළ අයිතමයේ, මෙම යූසර්ට ලැබී ඇති (receiverId) සහ තවමත් කියවා නැති (isRead: false) මැසේජ් සියල්ල 'true' ලෙස අප්ඩේට් කිරීම
    const updatedMessages = await prisma.message.updateMany({
      where: {
        itemId: itemId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true, count: updatedMessages.count }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating read status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}