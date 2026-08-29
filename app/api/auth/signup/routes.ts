import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phoneNumber, address, password } = body

    if (!name || !phoneNumber || !password) {
      return NextResponse.json({ success: false, error: 'Required fields are missing!' }, { status: 400 })
    }

    const existingUser = await prisma.user.findFirst({
      where: { phoneNumber }
    })

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Phone number already registered!' }, { status: 400 })
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        address: address || '',
        password,
      },
    })

    return NextResponse.json({ success: true, data: newUser }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}