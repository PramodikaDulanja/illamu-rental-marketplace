import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: User කෙනෙකුගේ විස්තර සහ ඔහුගේ Ads (items) ලබා ගැනීම
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is missing' }, { status: 400 })
    }

    // Item එකක් නොව, User කෙනෙක්ව ID එක හරහා සෙවිය යුතුය
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        items: true, // එම user දමා ඇති සියලුම ads (items) සමඟ ලබා ගැනීම
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 })
  } catch (error) {
    console.error('Fetch user error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch user profile' }, { status: 500 })
  }
}

// POST: අලුත් User කෙනෙක් add කිරීම
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phoneNumber, name, email, address } = body

    if (!phoneNumber) {
      return NextResponse.json({ success: false, error: 'Phone number is required!' }, { status: 400 })
    }

    const newUser = await prisma.user.create({
      data: {
        phoneNumber,
        name: name || null,
        email: email || null,
        address: address || null,
      },
    })

    return NextResponse.json({ success: true, data: newUser }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ success: false, error: 'User already exists or Internal Server Error' }, { status: 500 })
  }
}

// PUT: User ගේ ප්‍රොෆයිල් විස්තර update කිරීම (Name, Phone, Address, Email)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, phoneNumber, address, email } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is missing' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        phoneNumber,
        address,
        email,
      },
    })

    return NextResponse.json({ success: true, data: updatedUser }, { status: 200 })
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update user profile' }, { status: 500 })
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is missing' }, { status: 400 })
    }

    // මුලින්ම අදාළ user දමා ඇති සියලුම items (ads) මකා දැමීම
    await prisma.item.deleteMany({
      where: { userId: id },
    })

    // ඊටපස්සේ user ව මකා දැමීම
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'User and their ads deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 })
  }
}