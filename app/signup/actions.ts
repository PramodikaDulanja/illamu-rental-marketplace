'use server'

import { prisma } from '@/lib/prisma'

// දුරකථන අංකය නිවැරදි ප්‍රමිතියට (9477xxxxxxx) සකස් කරගැනීමේ ශ්‍රිතය
const sanitizePhoneNumber = (phone: string) => {
  let cleaned = phone.replace(/\D/g, ''); // අංක හැර අනෙකුත් සියලුම characters (spaces, +, -) ඉවත් කරයි
  
  if (cleaned.startsWith('0')) {
    cleaned = '94' + cleaned.slice(1); // මුලින් ඇති '0' ඉවත් කර '94' එකතු කරයි
  } else if (!cleaned.startsWith('94') && cleaned.length === 9) {
    cleaned = '94' + cleaned; // 771234567 ලෙස ලබා දුන්නොත් ඉදිරියට '94' එකතු කරයි
  }
  
  return cleaned;
};

export async function signupAction(formData: FormData) {
  const name = formData.get('name') as string
  const rawPhoneNumber = formData.get('phoneNumber') as string
  const address = formData.get('address') as string
  const password = formData.get('password') as string
  const email = formData.get('email') as string

  if (!name || !rawPhoneNumber || !password) {
    return { success: false, error: 'Required fields are missing!' }
  }

  // අංකය පිරිසිදු කර ගැනීම
  const phoneNumber = sanitizePhoneNumber(rawPhoneNumber);

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
        phoneNumber, // දැන් මෙහි සේව් වන්නේ නිවැරදිව ෆෝමැට් වූ අංකයකි
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