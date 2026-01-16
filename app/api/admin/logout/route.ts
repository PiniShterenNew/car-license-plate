import { NextResponse } from 'next/server'
import { deleteAdminSession } from '@/lib/adminAuth'

export async function POST() {
  try {
    await deleteAdminSession()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { ok: false, error: 'שגיאה בהתנתקות' },
      { status: 500 }
    )
  }
}
