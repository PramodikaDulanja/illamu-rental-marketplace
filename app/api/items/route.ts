import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST: Aluth Item ekak Add kirima
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, pricePerDay, depositAmount, district, subLocation, location, imageUrls, userId, categoryId } = body

    // Validation - district saha subLocation check kirima (location eka optional karanna puluwan)
    if (!title || !pricePerDay || !district || !subLocation || !userId || !categoryId) {
      return NextResponse.json({ error: 'Required fields are missing!' }, { status: 400 })
    }

    // Database ekata data save kirima
    const newItem = await prisma.item.create({
      data: {
        title,
        description,
        pricePerDay: parseFloat(pricePerDay),
        depositAmount: depositAmount ? parseFloat(depositAmount) : null,
        district,
        subLocation,
        location: location || `${district} - ${subLocation}`,
        imageUrls: imageUrls || [],
        userId,
        categoryId: parseInt(categoryId),
        isAvailable: true,
      },
    })

    return NextResponse.json({ success: true, data: newItem }, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// GET: Okkoma Items tika fetch karaganna
export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: items }, { status: 200 })
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}