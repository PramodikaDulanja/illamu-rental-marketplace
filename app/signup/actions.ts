'use server'

import { prisma } from '@/lib/prisma'

export async function signupAction(formData: FormData) {
  const name = formData.get('name') as string
  const phoneNumber = formData.get('phoneNumber') as string
  const address = formData.get('address') as string
  const password = formData.get('password') as string
  const email = formData.get('email') as string

  if (!name || !phoneNumber || !password) {
    return { success: false, error: 'Required fields are missing!' }
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { phoneNumber }
    })

    if (existingUser) {
      return { success: false, error: 'Phone number already registered!' }
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        address: address || '',
        password,
      },
    })

    return { success: true, data: newUser }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, error: 'Internal Server Error' }
  }
}