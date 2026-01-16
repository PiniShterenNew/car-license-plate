import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateAdminKey, createAdminSession } from '@/lib/adminAuth'

const LoginSchema = z.object({
  key: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key } = LoginSchema.parse(body)

    const isValid = await validateAdminKey(key)
    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: 'מפתח לא תקין' },
        { status: 401 }
      )
    }

    await createAdminSession()

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: 'פורמט בקשה לא תקין' },
        { status: 400 }
      )
    }

    console.error('Admin login error:', error)
    return NextResponse.json(
      { ok: false, error: 'שגיאה בהתחברות' },
      { status: 500 }
    )
  }
}
