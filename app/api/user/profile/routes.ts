import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        items: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}





// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params
//     const body = await request.json()
//     const { name, phoneNumber, address, email } = body

//     if (!id) {
//       return NextResponse.json({ success: false, error: 'User ID is missing' }, { status: 400 })
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data: {
//         name,
//         phoneNumber,
//         address,
//         email,
//       },
//     })

//     return NextResponse.json({ success: true, data: updatedUser }, { status: 200 })
//   } catch (error) {
//     console.error('User update error:', error)
//     return NextResponse.json({ success: false, error: 'Failed to update user profile' }, { status: 500 })
//   }
// }