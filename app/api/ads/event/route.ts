import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getOrCreateVisitorId } from '@/lib/visitor'
import { db } from '@/lib/db'

const AdEventSchema = z.object({
  slotKey: z.string(),
  pagePath: z.string(),
  eventType: z.enum(['IMPRESSION', 'CLICK']),
})

// Simple rate limiting per visitor and slot (in-memory, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 100 // max events per minute per visitor+slot

function getRateLimitKey(visitorId: string, slotKey: string, eventType: string): string {
  return `${visitorId}:${slotKey}:${eventType}`
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(key)

  if (!limit || limit.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (limit.count >= RATE_LIMIT_MAX) {
    return false
  }

  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slotKey, pagePath, eventType } = AdEventSchema.parse(body)

    const visitorId = await getOrCreateVisitorId()
    const rateLimitKey = getRateLimitKey(visitorId, slotKey, eventType)

    if (!checkRateLimit(rateLimitKey)) {
      // Rate limited, but don't fail the request
      return NextResponse.json({ ok: true, rateLimited: true })
    }

    await db.adEvent.create({
      data: {
        visitorId,
        slotKey,
        pagePath,
        eventType,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: 'פורמט בקשה לא תקין' },
        { status: 400 }
      )
    }

    console.error('Ad event error:', error)
    return NextResponse.json(
      { ok: false, error: 'שגיאה בקביעת אירוע מודעה' },
      { status: 500 }
    )
  }
}
