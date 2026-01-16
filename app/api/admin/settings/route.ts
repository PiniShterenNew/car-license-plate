import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/adminAuth'
import { db } from '@/lib/db'
import { z } from 'zod'

const SettingsSchema = z.object({
  cpm: z.string().optional(),
  cpc: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifyAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json(
        { ok: false, error: 'לא מורשה' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const data = SettingsSchema.parse({
      cpm: formData.get('cpm'),
      cpc: formData.get('cpc'),
    })

    if (data.cpm) {
      await db.appSetting.upsert({
        where: { key: 'ad_cpm' },
        create: { key: 'ad_cpm', value: data.cpm },
        update: { value: data.cpm },
      })
    }

    if (data.cpc) {
      await db.appSetting.upsert({
        where: { key: 'ad_cpc' },
        create: { key: 'ad_cpc', value: data.cpc },
        update: { value: data.cpc },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: 'פורמט בקשה לא תקין' },
        { status: 400 }
      )
    }

    console.error('Settings update error:', error)
    return NextResponse.json(
      { ok: false, error: 'שגיאה בעדכון הגדרות' },
      { status: 500 }
    )
  }
}
