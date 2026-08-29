import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST: Aluth User kenek add kirima
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phoneNumber, name } = body

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required!' }, { status: 400 })
    }

    const newUser = await prisma.user.create({
      data: {
        phoneNumber,
        name: name || null,
      },
    })

    return NextResponse.json({ success: true, data: newUser }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'User already exists or Internal Server Error' }, { status: 500 })
  }
}




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