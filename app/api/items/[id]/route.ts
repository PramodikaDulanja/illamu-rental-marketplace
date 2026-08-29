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
      },
    })

    return NextResponse.json({ success: true, data: newItem }, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// GET: Okkoma Items tika fetch karaganna
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params)
    const id = resolvedParams.id

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            name: true,
            phoneNumber: true,
            isVerified: true,
          },
        },
      },
    })

    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: item }, { status: 200 })
  } catch (error) {
    console.error('Error fetching single item:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}



export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js වල params එක await කර ගැනීම
    const { id } = await params

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID is missing' }, { status: 400 })
    }

    // Database එකෙන් ad එක delete කිරීම
    await prisma.item.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Ad deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete ad' }, { status: 500 })
  }
}


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { 
      title, 
      description, 
      pricePerDay, 
      depositAmount, 
      district, 
      subLocation, 
      location, 
      imageUrls, 
      categoryId,
      isAvailable 
    } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID is missing' }, { status: 400 })
    }

    // අදාළ field එක undefined නොවේ නම් පමණක් data object එකට එකතු කිරීම
    const updateData: any = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (pricePerDay !== undefined) updateData.pricePerDay = parseFloat(pricePerDay)
    if (depositAmount !== undefined) updateData.depositAmount = depositAmount ? parseFloat(depositAmount) : null
    if (district !== undefined) updateData.district = district
    if (subLocation !== undefined) updateData.subLocation = subLocation
    if (location !== undefined) updateData.location = location
    if (imageUrls !== undefined) updateData.imageUrls = imageUrls
    if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId)
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable

    const updatedItem = await prisma.item.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: updatedItem }, { status: 200 })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update ad' }, { status: 500 })
  }
}