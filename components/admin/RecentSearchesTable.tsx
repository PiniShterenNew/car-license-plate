import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { LicenseStatus, ResultStatus } from '@prisma/client'
import Link from 'next/link'
import { formatPlateWithDashes, normalizePlate } from '@/lib/plates'

interface RecentSearch {
  id: string
  plateFormatted: string
  createdAt: Date
  resultStatus: ResultStatus
  licenseStatus: LicenseStatus
  visitor: {
    id: string
  }
  vehicle: {
    plateFormatted: string
  } | null
}

interface RecentSearchesTableProps {
  searches: RecentSearch[]
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'לפני רגע'
  if (diffMins < 60) return `לפני ${diffMins} דקות`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `לפני ${diffHours} שעות`
  const diffDays = Math.floor(diffHours / 24)
  return `לפני ${diffDays} ימים`
}

function getStatusBadge(status: ResultStatus) {
  switch (status) {
    case 'FOUND':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
          נמצא
        </span>
      )
    case 'NOT_FOUND':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
          לא נמצא
        </span>
      )
    case 'ERROR':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
          שגיאה
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
          לא ידוע
        </span>
      )
  }
}

function getVisitorDisplay(visitorId: string): string {
  // Show "אורח" for guest users, or first 8 chars for registered
  if (visitorId.length > 20) {
    return 'אורח (API)'
  }
  return visitorId.slice(0, 8) + '...'
}

export function RecentSearchesTable({ searches }: RecentSearchesTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e5e7eb] dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none overflow-hidden transition-colors">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#e5e7eb] dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50 transition-colors">
        <h4 className="text-sm sm:text-base font-bold text-[#121417] dark:text-white">חיפושים אחרונים במערכת</h4>
        <Link href="/admin/search-logs" className="text-xs sm:text-sm text-primary font-bold hover:underline">
          צפה בהכל
        </Link>
      </div>
      
      {/* Mobile View - Cards */}
      <div className="block md:hidden">
        {searches.length === 0 ? (
          <div className="px-4 py-8 text-center text-[#657586] dark:text-slate-400">
            אין חיפושים
          </div>
        ) : (
          <div className="divide-y divide-[#e5e7eb] dark:divide-slate-800">
            {searches.map((search) => (
              <Link
                key={search.id}
                href={`/car/${normalizePlate(search.plateFormatted)}`}
                className="block px-4 py-4 active:bg-gray-50 dark:active:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-mono font-bold text-lg text-[#121417] dark:text-white mb-1">
                      {formatPlateWithDashes(normalizePlate(search.plateFormatted))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#657586] dark:text-slate-400">
                      <span>{getTimeAgo(search.createdAt)}</span>
                      <span>•</span>
                      <span>{getVisitorDisplay(search.visitor.id)}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {getStatusBadge(search.resultStatus)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-[#f8f9fa] dark:bg-slate-800/50 text-[#657586] dark:text-slate-400 text-xs font-bold uppercase tracking-wider transition-colors">
            <tr>
              <th className="px-6 py-3">מספר רכב</th>
              <th className="px-6 py-3">זמן</th>
              <th className="px-6 py-3">סטטוס</th>
              <th className="px-6 py-3">משתמש</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-slate-800">
            {searches.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-[#657586] dark:text-slate-400">
                  אין חיפושים
                </td>
              </tr>
            ) : (
              searches.map((search) => (
                <tr key={search.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-[#121417] dark:text-white">
                    {formatPlateWithDashes(normalizePlate(search.plateFormatted))}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#657586] dark:text-slate-400">
                    {getTimeAgo(search.createdAt)}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(search.resultStatus)}</td>
                  <td className="px-6 py-4 text-sm text-[#657586] dark:text-slate-400">
                    {getVisitorDisplay(search.visitor.id)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
