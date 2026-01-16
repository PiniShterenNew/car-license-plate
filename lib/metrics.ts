import { db } from './db'
import { startOfDay, subDays, startOfWeek, startOfMonth, startOfQuarter } from 'date-fns'

export interface TimeRange {
  start: Date
  end: Date
}

export function getTimeRange(range: '7d' | '30d' | 'quarter'): TimeRange {
  const end = new Date()
  
  switch (range) {
    case '7d':
      return { start: subDays(end, 7), end }
    case '30d':
      return { start: subDays(end, 30), end }
    case 'quarter':
      return { start: startOfQuarter(subDays(end, 90)), end }
    default:
      return { start: subDays(end, 7), end }
  }
}

export async function getAdImpressions(range: TimeRange): Promise<number> {
  return db.adEvent.count({
    where: {
      eventType: 'IMPRESSION',
      createdAt: {
        gte: range.start,
        lte: range.end,
      },
    },
  })
}

export async function getUniqueVisitors(range: TimeRange): Promise<number> {
  const result = await db.searchEvent.groupBy({
    by: ['visitorId'],
    where: {
      createdAt: {
        gte: range.start,
        lte: range.end,
      },
    },
  })
  
  return result.length
}

export async function getSearchesToday(): Promise<number> {
  const today = startOfDay(new Date())
  return db.searchEvent.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  })
}

export async function getSearchesInRange(range: TimeRange): Promise<number> {
  return db.searchEvent.count({
    where: {
      createdAt: {
        gte: range.start,
        lte: range.end,
      },
    },
  })
}

export interface WeeklySearchData {
  date: string
  count: number
}

export async function getWeeklySearchVolume(range: TimeRange): Promise<WeeklySearchData[]> {
  const searches = await db.searchEvent.findMany({
    where: {
      createdAt: {
        gte: range.start,
        lte: range.end,
      },
    },
    select: {
      createdAt: true,
    },
  })

  const grouped = new Map<string, number>()
  
  searches.forEach((search) => {
    const dateKey = startOfDay(search.createdAt).toISOString().split('T')[0]
    grouped.set(dateKey, (grouped.get(dateKey) || 0) + 1)
  })

  return Array.from(grouped.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function getRecentSearches(limit: number = 10) {
  return db.searchEvent.findMany({
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      vehicle: {
        select: {
          plateFormatted: true,
          manufacturer: true,
          modelName: true,
        },
      },
      visitor: {
        select: {
          id: true,
        },
      },
    },
  })
}

export async function getAdStats(range: TimeRange) {
  const [impressions, clicks] = await Promise.all([
    db.adEvent.count({
      where: {
        eventType: 'IMPRESSION',
        createdAt: { gte: range.start, lte: range.end },
      },
    }),
    db.adEvent.count({
      where: {
        eventType: 'CLICK',
        createdAt: { gte: range.start, lte: range.end },
      },
    }),
  ])

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0

  const bySlot = await db.adEvent.groupBy({
    by: ['slotKey'],
    where: {
      createdAt: { gte: range.start, lte: range.end },
    },
    _count: {
      id: true,
    },
  })

  const byPage = await db.adEvent.groupBy({
    by: ['pagePath'],
    where: {
      createdAt: { gte: range.start, lte: range.end },
    },
    _count: {
      id: true,
    },
  })

  return {
    impressions,
    clicks,
    ctr,
    bySlot: bySlot.map((s) => ({
      slotKey: s.slotKey,
      count: s._count.id,
    })),
    byPage: byPage.map((p) => ({
      pagePath: p.pagePath,
      count: p._count.id,
    })),
  }
}
