import { getOrCreateVisitorId } from '@/lib/visitor'
import { db } from '@/lib/db'
import { HistoryRowItem } from '@/components/history/HistoryRowItem'
import { Card, CardContent } from '@/components/ui/card'
import { HistoryFiltersClient } from './components/HistoryFiltersClient'
import { normalizePlate } from '@/lib/plates'
import { LicenseStatus } from '@prisma/client'
import { Download, ChevronDown } from 'lucide-react'

interface SearchParams {
  search?: string
  dateRange?: string
  status?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

function getLicenseStatus(licenseValidUntil: Date | null): LicenseStatus {
  if (!licenseValidUntil) return 'UNKNOWN'
  const now = new Date()
  if (licenseValidUntil > now) return 'VALID'
  return 'EXPIRED'
}

export default async function HistoryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const visitorId = await getOrCreateVisitorId()

  let where: any = {
    visitorId,
  }

  // Apply search filter
  if (params.search) {
    const normalized = normalizePlate(params.search)
    where.plateNormalized = {
      contains: normalized,
    }
  }

  // Apply date range filter
  if (params.dateRange && params.dateRange !== 'all') {
    const now = new Date()
    let startDate: Date
    
    switch (params.dateRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0) // All time
    }
    
    where.createdAt = {
      gte: startDate,
    }
  }

  // Only show FOUND searches (exclude NOT_FOUND and ERROR)
  const searchEvents = await db.searchEvent.findMany({
    where: {
      ...where,
      resultStatus: 'FOUND', // Only show successful searches
    },
    include: {
      vehicle: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  })

  // Filter by status if needed
  let filteredEvents = searchEvents
  if (params.status && params.status !== 'all') {
    filteredEvents = searchEvents.filter((event) => {
      if (!event.vehicle) {
        return false
      }
      
      const status = getLicenseStatus(event.vehicle.licenseValidUntil)
      return status.toLowerCase() === params.status?.toLowerCase()
    })
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#121417] dark:text-white tracking-tight mb-2">
            היסטוריית חיפושים
          </h2>
          <p className="text-[#657586] dark:text-gray-400 text-lg">
            נהל ועיין בבדיקות הרכב הקודמות שביצעת
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#22262e] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-[#121417] dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download className="w-5 h-5" />
            <span>ייצוא ל-CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <HistoryFiltersClient
        initialSearch={params.search}
        initialDateRange={params.dateRange}
        initialStatus={params.status}
      />

      {/* History List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card className="bg-white dark:bg-surface-dark">
            <CardContent className="pt-6 text-center text-text-secondary">
              לא נמצאו חיפושים
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event, index) => {
            // Show events even if vehicle is null (NOT_FOUND cases)
            const licenseStatus = event.vehicle 
              ? getLicenseStatus(event.vehicle.licenseValidUntil)
              : event.licenseStatus
            
            return (
              <HistoryRowItem
                key={event.id}
                plateFormatted={event.plateFormatted}
                manufacturer={event.vehicle?.manufacturer || 'לא נמצא'}
                modelName={event.vehicle?.modelName || ''}
                year={event.vehicle?.year || null}
                licenseStatus={licenseStatus}
                createdAt={event.createdAt}
                eventId={event.id}
                plateNormalized={event.plateNormalized}
                isFirst={index === 0}
              />
            )
          })
        )}
      </div>

      {/* Load More Button */}
      {filteredEvents.length >= 50 && (
        <div className="flex items-center justify-center pt-8 pb-4">
          <button className="text-sm font-bold text-[#657586] dark:text-gray-400 hover:text-primary transition-colors flex flex-col items-center gap-1">
            <span>טען חיפושים קודמים</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
