import { Progress } from '@/components/ui/progress'

interface QuickStatsStripProps {
  lastTestDate: Date | null
  licenseValidUntil: Date | null
  trimLevel: string | null
  pollutionGroup: string | null
  year: number | null
  roadDate: Date | null
}

export function QuickStatsStrip({
  lastTestDate,
  licenseValidUntil,
  trimLevel,
  pollutionGroup,
  year,
  roadDate,
}: QuickStatsStripProps) {
  const formatDate = (date: Date | null): string => {
    if (!date) return 'לא זמין'
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  const getDaysUntilNextTest = (lastTestDate: Date | null): number | null => {
    if (!lastTestDate) return null
    
    // Create dates in local timezone to avoid timezone issues
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // Calculate next test date: one year after last test
    const lastTest = new Date(lastTestDate)
    const nextTestDate = new Date(lastTest.getFullYear() + 1, lastTest.getMonth(), lastTest.getDate())
    const target = new Date(nextTestDate.getFullYear(), nextTestDate.getMonth(), nextTestDate.getDate())
    
    const diff = target.getTime() - today.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days < 0) return 0 // Test is overdue
    return days
  }

  const daysUntilExpiry = getDaysUntilNextTest(lastTestDate)
  
  // Calculate next test date for display
  const getNextTestDate = (): Date | null => {
    if (!lastTestDate) return null
    const lastTest = new Date(lastTestDate)
    return new Date(lastTest.getFullYear() + 1, lastTest.getMonth(), lastTest.getDate())
  }
  
  const nextTestDate = getNextTestDate()
  const progressPercentage = daysUntilExpiry !== null && daysUntilExpiry > 0 
    ? Math.min((daysUntilExpiry / 365) * 100, 100) 
    : 0

  const formatMonthYear = (date: Date | null): string => {
    if (!date) return 'לא זמין'
    const d = new Date(date)
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
    return `${months[d.getMonth()]} ${d.getFullYear()}`
  }

  return (
    <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">תוקף טסט</span>
        {/* Display next test date (lastTestDate + 1 year) */}
        <span className="text-sm font-bold text-[#121417] dark:text-white">{formatDate(nextTestDate)}</span>
        
        {daysUntilExpiry !== null && (
          daysUntilExpiry > 0 ? (
            <>
              <div className="w-full bg-gray-200 dark:bg-gray-600 h-1.5 rounded-full mt-2">
                <div className="bg-success h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">נותרו {daysUntilExpiry} ימים</span>
            </>
          ) : (
            <span className="text-[10px] text-red-500 font-bold mt-1">פג תוקף</span>
          )
        )}
      </div>
      
      <div className="flex flex-col border-r border-gray-200 dark:border-gray-600 md:border-r-0 md:border-r-transparent pr-4 md:pr-0">
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">רמת גימור</span>
        <span className="text-sm font-bold text-[#121417] dark:text-white">{trimLevel || 'לא זמין'}</span>
      </div>
      
      <div className="flex flex-col border-r border-gray-200 dark:border-gray-600 md:border-r-0 md:border-r-transparent pr-4 md:pr-0">
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">קבוצת רישוי</span>
        <span className="text-sm font-bold text-[#121417] dark:text-white">{pollutionGroup || 'לא זמין'}</span>
      </div>
      
      <div className="flex flex-col border-r border-gray-200 dark:border-gray-600 md:border-r-0 md:border-r-transparent pr-4 md:pr-0">
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">עלייה לכביש</span>
        <span className="text-sm font-bold text-[#121417] dark:text-white">
          {roadDate ? formatMonthYear(roadDate) : (year ? formatMonthYear(new Date(year, 0, 1)) : 'לא זמין')}
        </span>
      </div>
    </div>
  )
}
