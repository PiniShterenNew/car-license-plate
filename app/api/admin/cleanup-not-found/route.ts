import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdminSession } from '@/lib/adminAuth'

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json(
        { ok: false, error: 'לא מורשה' },
        { status: 401 }
      )
    }

    // Delete all NOT_FOUND search events
    const result = await db.searchEvent.deleteMany({
      where: {
        resultStatus: 'NOT_FOUND',
      },
    })

    return NextResponse.json({
      ok: true,
      deletedCount: result.count,
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { ok: false, error: 'שגיאה במחיקה' },
      { status: 500 }
    )
  }
}
