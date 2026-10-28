import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // කියවා නැති මුළු මැසේජ් සංඛ්‍යාව ලබා ගැනීම
    const unreadCount = await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    return NextResponse.json({ success: true, count: unreadCount }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}