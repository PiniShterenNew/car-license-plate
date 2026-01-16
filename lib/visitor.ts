import { cookies } from 'next/headers'
import { db } from './db'
import { createId } from '@paralleldrive/cuid2'

/**
 * Get or create visitor ID from cookie
 */
export async function getOrCreateVisitorId(): Promise<string> {
  const cookieStore = await cookies()
  let visitorId = cookieStore.get('vcid')?.value

  if (!visitorId) {
    visitorId = createId()
    cookieStore.set('vcid', visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
    })
  }

  // Ensure visitor exists in DB
  await db.visitor.upsert({
    where: { id: visitorId },
    create: {
      id: visitorId,
      lastSeenAt: new Date(),
    },
    update: {
      lastSeenAt: new Date(),
    },
  })

  return visitorId
}

/**
 * Update visitor last seen timestamp (throttled to once per day)
 */
export async function updateVisitorLastSeen(visitorId: string): Promise<void> {
  const visitor = await db.visitor.findUnique({
    where: { id: visitorId },
    select: { lastSeenAt: true },
  })

  if (!visitor) return

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  if (visitor.lastSeenAt < oneDayAgo) {
    await db.visitor.update({
      where: { id: visitorId },
      data: { lastSeenAt: new Date() },
    })
  }
}
