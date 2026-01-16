import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateVisitorId } from '@/lib/visitor'
import { db } from '@/lib/db'
import { generateCSV } from '@/lib/csv'
import { LicenseStatus } from '@prisma/client'

function getLicenseStatus(licenseValidUntil: Date | null): LicenseStatus {
  if (!licenseValidUntil) return 'UNKNOWN'
  const now = new Date()
  if (licenseValidUntil > now) return 'VALID'
  return 'EXPIRED'
}

function getStatusLabel(status: LicenseStatus): string {
  switch (status) {
    case 'VALID':
      return 'תקין'
    case 'EXPIRED':
      return 'לא בתוקף'
    case 'UNKNOWN':
      return 'לא ידוע'
    default:
      return 'לא ידוע'
  }
}

export async function GET(request: NextRequest) {
  try {
    const visitorId = await getOrCreateVisitorId()

    const searchEvents = await db.searchEvent.findMany({
      where: { visitorId },
      include: {
        vehicle: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const rows = searchEvents
      .filter((event) => event.vehicle !== null)
      .map((event) => {
        const status = getLicenseStatus(event.vehicle?.licenseValidUntil || null)
        return {
          'מספר רישוי': event.plateFormatted,
          'יצרן': event.vehicle?.manufacturer || '',
          'דגם': event.vehicle?.modelName || '',
          'שנה': event.vehicle?.year?.toString() || '',
          'סטטוס רישיון': getStatusLabel(status),
          'תאריך חיפוש': event.createdAt.toISOString().split('T')[0],
        }
      })

    const csv = generateCSV(rows)

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="history-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('CSV export error:', error)
    return NextResponse.json(
      { error: 'שגיאה בייצוא CSV' },
      { status: 500 }
    )
  }
}
