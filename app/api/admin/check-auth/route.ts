import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/adminAuth'

export async function GET() {
  const isAuthenticated = await verifyAdminSession()
  return NextResponse.json({ authenticated: isAuthenticated })
}
