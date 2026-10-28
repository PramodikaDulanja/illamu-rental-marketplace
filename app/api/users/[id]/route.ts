import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch user details and their posted ads
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is missing' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error('Fetch user error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

// POST: Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, name, email, address, avatarUrl } = body;

    if (!phoneNumber) {
      return NextResponse.json({ success: false, error: 'Phone number is required!' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        phoneNumber,
        name: name || null,
        email: email || null,
        address: address || null,
        avatarUrl: avatarUrl || null,
      },
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, error: 'User already exists or Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update user profile including avatarUrl
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, phoneNumber, address, email, avatarUrl } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is missing' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        phoneNumber,
        address,
        email,
        avatarUrl, // 🗂️ Updates profile picture URL in database
      },
    });

    return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update user profile' }, { status: 500 });
  }
}

// DELETE: Delete user account
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is missing' }, { status: 400 });
    }

    await prisma.item.deleteMany({
      where: { userId: id },
    });

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('User delete error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete user account' }, { status: 500 });
  }
}