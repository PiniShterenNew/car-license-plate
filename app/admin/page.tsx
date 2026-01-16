import { getTimeRange, getAdImpressions, getUniqueVisitors, getSearchesToday, getWeeklySearchVolume, getRecentSearches } from '@/lib/metrics'
import { KpiCards } from '@/components/admin/KpiCards'
import { SearchVolumeChart } from '@/components/admin/SearchVolumeChart'
import { RecentSearchesTable } from '@/components/admin/RecentSearchesTable'
import Link from 'next/link'

interface SearchParams {
  range?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const range = (params.range as '7d' | '30d' | 'quarter') || '7d'
  const timeRange = getTimeRange(range)

  const [adImpressions, uniqueVisitors, searchesToday, weeklyData, recentSearches] = await Promise.all([
    getAdImpressions(timeRange),
    getUniqueVisitors(timeRange),
    getSearchesToday(),
    getWeeklySearchVolume(timeRange),
    getRecentSearches(10),
  ])

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-0">
      {/* Page Heading & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl sm:text-3xl font-black text-[#121417]">ביצועי מערכת</h3>
          <p className="text-sm sm:text-base text-[#657586]">נתונים בזמן אמת על שאילתות ואימותי רישוי</p>
        </div>
        <div className="flex items-center bg-white p-1 rounded-lg border border-[#e5e7eb] shadow-sm w-full md:w-auto">
          <Link
            href="?range=7d"
            className={`flex-1 md:flex-none px-3 sm:px-4 py-2 rounded text-xs sm:text-sm font-bold transition-colors text-center ${
              range === '7d'
                ? 'bg-[#1f66ad] text-white shadow-sm'
                : 'text-[#657586] hover:bg-[#f0f2f4] font-medium'
            }`}
          >
            7 ימים
          </Link>
          <Link
            href="?range=30d"
            className={`flex-1 md:flex-none px-3 sm:px-4 py-2 rounded text-xs sm:text-sm transition-colors text-center ${
              range === '30d'
                ? 'bg-[#1f66ad] text-white shadow-sm font-bold'
                : 'text-[#657586] hover:bg-[#f0f2f4] font-medium'
            }`}
          >
            30 יום
          </Link>
          <Link
            href="?range=quarter"
            className={`flex-1 md:flex-none px-3 sm:px-4 py-2 rounded text-xs sm:text-sm transition-colors text-center ${
              range === 'quarter'
                ? 'bg-[#1f66ad] text-white shadow-sm font-bold'
                : 'text-[#657586] hover:bg-[#f0f2f4] font-medium'
            }`}
          >
            רבעון
          </Link>
        </div>
      </div>

      {/* Stats / KPI Cards */}
      <KpiCards
        adImpressions={adImpressions}
        uniqueVisitors={uniqueVisitors}
        searchesToday={searchesToday}
      />

      {/* Main Chart Section */}
      <SearchVolumeChart data={weeklyData} />

      {/* Recent Logs Table Preview */}
      <RecentSearchesTable searches={recentSearches as any} />
    </div>
  )
}
