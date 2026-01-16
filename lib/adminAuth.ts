import { cookies } from 'next/headers'
import { db } from './db'

const ADMIN_SESSION_COOKIE = 'admin_session'
const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)
  
  if (!session?.value) {
    return false
  }

  // Simple validation - in production, use JWT or session store
  const expectedValue = process.env.ADMIN_KEY
  return session.value === expectedValue
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, process.env.ADMIN_KEY!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_SESSION_DURATION / 1000,
    path: '/',
  })
}

export async function deleteAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

export async function validateAdminKey(key: string): Promise<boolean> {
  return key === process.env.ADMIN_KEY
}
