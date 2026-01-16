import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { LicenseStatus, ResultStatus } from '@prisma/client'
import Link from 'next/link'

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
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
          נמצא
        </span>
      )
    case 'NOT_FOUND':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          לא נמצא
        </span>
      )
    case 'ERROR':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
          שגיאה
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
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
    <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#e5e7eb] flex justify-between items-center bg-gray-50/50">
        <h4 className="text-sm sm:text-base font-bold text-[#121417]">חיפושים אחרונים במערכת</h4>
        <Link href="/admin/search-logs" className="text-xs sm:text-sm text-[#1f66ad] font-bold hover:underline">
          צפה בהכל
        </Link>
      </div>
      
      {/* Mobile View - Cards */}
      <div className="block md:hidden divide-y divide-[#e5e7eb]">
        {searches.length === 0 ? (
          <div className="px-4 py-8 text-center text-[#657586]">
            אין חיפושים
          </div>
        ) : (
          searches.map((search) => (
            <Link
              key={search.id}
              href={`/car/${search.plateFormatted.replace(/-/g, '')}`}
              className="block px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-base text-[#121417]">
                  {search.plateFormatted}
                </span>
                {getStatusBadge(search.resultStatus)}
              </div>
              <div className="flex items-center justify-between text-xs text-[#657586]">
                <span>{getTimeAgo(search.createdAt)}</span>
                <span>{getVisitorDisplay(search.visitor.id)}</span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-[#f8f9fa] text-[#657586] text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">מספר רכב</th>
              <th className="px-6 py-3">זמן</th>
              <th className="px-6 py-3">סטטוס</th>
              <th className="px-6 py-3">משתמש</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {searches.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-[#657586]">
                  אין חיפושים
                </td>
              </tr>
            ) : (
              searches.map((search) => (
                <tr key={search.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-[#121417]">
                    {search.plateFormatted}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#657586]">
                    {getTimeAgo(search.createdAt)}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(search.resultStatus)}</td>
                  <td className="px-6 py-4 text-sm text-[#657586]">
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
