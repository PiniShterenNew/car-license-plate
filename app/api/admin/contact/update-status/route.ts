import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { verifyAdminSession } from '@/lib/adminAuth'
import { ContactStatus } from '@prisma/client'

const UpdateStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['PENDING', 'READ', 'REPLIED', 'ARCHIVED']),
})

export async function POST(request: NextRequest) {
  try {
    // בדיקת הרשאות מנהל
    const isAuthenticated = await verifyAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json(
        { ok: false, error: 'אין הרשאה' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, status } = UpdateStatusSchema.parse(body)

    // עדכון הסטטוס
    const updateData: {
      status: ContactStatus
      readAt?: Date
      repliedAt?: Date
    } = {
      status: status as ContactStatus,
    }

    // עדכון תאריכים לפי הסטטוס
    if (status === 'READ' || status === 'REPLIED') {
      const message = await db.contactMessage.findUnique({
        where: { id },
        select: { readAt: true },
      })

      if (!message?.readAt) {
        updateData.readAt = new Date()
      }
    }

    if (status === 'REPLIED') {
      const message = await db.contactMessage.findUnique({
        where: { id },
        select: { repliedAt: true },
      })

      if (!message?.repliedAt) {
        updateData.repliedAt = new Date()
      }
    }

    await db.contactMessage.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: 'פורמט בקשה לא תקין' },
        { status: 400 }
      )
    }

    console.error('Update contact status error:', error)
    return NextResponse.json(
      { ok: false, error: 'שגיאה בעדכון הסטטוס' },
      { status: 500 }
    )
  }
}
