'use client'

interface WeeklySearchData {
  date: string
  count: number
}

interface SearchVolumeChartProps {
  data: WeeklySearchData[]
}

const hebrewDays = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']

export function SearchVolumeChart({ data }: SearchVolumeChartProps) {
  // Normalize data to 7 days, fill missing days with 0
  const normalizedData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    const existing = data.find((d) => d.date === dateStr)
    return {
      date: dateStr,
      count: existing?.count || 0,
      dayLabel: hebrewDays[i],
    }
  })

  const maxCount = Math.max(...normalizedData.map((d) => d.count), 1)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none transition-colors">
      <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-[#121417] dark:text-white">נפח חיפושים שבועי</h4>
          <p className="text-xs sm:text-sm text-[#657586] dark:text-slate-400 hidden sm:block">מספר בדיקות רכב לפי יום בשבוע האחרון</p>
        </div>
        <button className="p-2 text-[#657586] dark:text-slate-400 hover:bg-[#f0f2f4] dark:hover:bg-slate-800 rounded-lg transition-colors hidden sm:block">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Custom CSS Bar Chart */}
      <div className="w-full relative">
        <div className="h-48 sm:h-56 md:h-64 w-full flex items-end gap-1 sm:gap-2 md:gap-4 lg:gap-8 xl:gap-12 relative pb-0 pt-4">
          {/* Y-axis Grid Lines (Decorative) */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 pb-8 sm:pb-8 md:pb-8">
            <div className="w-full h-px bg-gray-100 dark:bg-slate-800 border-t border-dashed border-gray-200 dark:border-slate-700"></div>
            <div className="w-full h-px bg-gray-100 dark:bg-slate-800 border-t border-dashed border-gray-200 dark:border-slate-700"></div>
            <div className="w-full h-px bg-gray-100 dark:bg-slate-800 border-t border-dashed border-gray-200 dark:border-slate-700"></div>
            <div className="w-full h-px bg-gray-100 dark:bg-slate-800 border-t border-dashed border-gray-200 dark:border-slate-700"></div>
            <div className="w-full h-px bg-gray-100 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700"></div>
          </div>

          {/* Bars */}
          {normalizedData.map((item, index) => {
            const heightPercent = (item.count / maxCount) * 100
            const isHighest = item.count === maxCount
            
            return (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center justify-end h-full z-10 group cursor-pointer"
              >
                <div
                  className={`relative w-full max-w-[32px] sm:max-w-[40px] md:max-w-[48px] transition-all duration-300 rounded-t-sm ${
                    isHighest
                      ? 'bg-primary hover:bg-primary shadow-md shadow-primary/20'
                      : 'bg-primary/20 hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30'
                  }`}
                  style={{ height: `${Math.max(heightPercent, 5)}%` }}
                >
                  <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-slate-800 text-white dark:text-slate-200 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 border border-slate-700">
                    {item.count} חיפושים
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {/* Day Labels - Separate container for better spacing */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4 lg:gap-8 xl:gap-12 mt-2 sm:mt-0 px-0 sm:px-0">
          {normalizedData.map((item, index) => {
            const isHighest = item.count === maxCount
            return (
              <span
                key={item.date}
                className={`flex-1 text-center text-xs sm:text-sm font-medium ${
                  isHighest ? 'text-primary font-bold' : 'text-[#657586] dark:text-slate-400'
                }`}
              >
                {item.dayLabel}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
