import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST: Aluth Category ekak add kirima
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, iconUrl } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required!' }, { status: 400 })
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        iconUrl: iconUrl || null,
      },
    })

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Category slug already exists or Internal Server Error' }, { status: 500 })
  }
}

// GET: Okkoma Categories fetch karaganna
export async function GET() {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json({ success: true, data: categories }, { status: 200 })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}