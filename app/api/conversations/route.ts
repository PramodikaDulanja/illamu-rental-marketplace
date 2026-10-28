import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        item: true,
        sender: { select: { id: true, name: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      const key = `${msg.itemId}-${otherUser.id}`;

      // මෙම මැසේජ් එක මෙම යූසර්ට ලැබී ඇති එකක් සහ කියවා නැත්තම් unread ලෙස සැලකේ
      const isUnread = msg.receiverId === userId && !msg.isRead;

      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          itemId: msg.itemId,
          itemTitle: msg.item.title,
          itemImage: msg.item.imageUrls?.[0] || '',
          otherUser,
          lastMessage: msg.content,
          createdAt: msg.createdAt,
          hasUnread: isUnread, // 👈 Unread ඇති බවට බුලියන් අගයක්
        });
      } else {
        // දැනටමත් මැප් එකේ ඇත්නම්, මෑතකදී ආපු මැසේජ් එක unread නම් hasUnread true කරන්න
        const existing = conversationsMap.get(key);
        if (isUnread) {
          existing.hasUnread = true;
        }
      }
    });

    const conversations = Array.from(conversationsMap.values());

    return NextResponse.json({ success: true, data: conversations }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}