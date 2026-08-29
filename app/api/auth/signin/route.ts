import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body
    

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    // Database eken email match wena user wa hoyaganna
    const user = await prisma.user.findFirst({
      where: { email: email },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found with this email' }, { status: 404 })
    }

    // Password check kirima
    if ((user as any).password && (user as any).password !== password) {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 })
    }

    return NextResponse.json({ 
      success: true, 
      data: { id: user.id, name: user.name, email: user.email, phoneNumber: user.phoneNumber,isAdmin: (user as any).isAdmin } 
    }, { status: 200 })

  } catch (error) {
    console.error('Sign-in error:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}