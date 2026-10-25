import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: යූසර්ගේ Saved items ලැයිස්තුව ලබා ගැනීම
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const savedItems = await prisma.savedItem.findMany({
      where: { userId },
      include: {
        item: {
          include: {
            user: { select: { name: true, phoneNumber: true, avatarUrl: true } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: savedItems.map((s: { item: any }) => s.item) }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching saved items:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: අයිතමයක් Wishlist එකට එකතු කිරීම හෝ ඉවත් කිරීම (Toggle Bookmark)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, itemId } = body;

    if (!userId || !itemId) {
      return NextResponse.json({ success: false, error: 'User ID and Item ID are required' }, { status: 400 });
    }

    // දැනටමත් සේව් කර ඇද්දැයි පරීක්ෂා කිරීම
    const existingBookmark = await prisma.savedItem.findUnique({
      where: {
        userId_itemId: { userId, itemId },
      },
    });

    if (existingBookmark) {
      // තිබේ නම් අයින් කිරීම (Remove)
      await prisma.savedItem.delete({
        where: { id: existingBookmark.id },
      });
      return NextResponse.json({ success: true, saved: false, message: 'Removed from wishlist' }, { status: 200 });
    } else {
      // නැත්නම් අලුතින් එකතු කිරීම (Add)
      const newBookmark = await prisma.savedItem.create({
        data: { userId, itemId },
      });
      return NextResponse.json({ success: true, saved: true, message: 'Added to wishlist' }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error toggling wishlist:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}