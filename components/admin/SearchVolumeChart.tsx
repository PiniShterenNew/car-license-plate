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
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 sm:p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
        <div>
          <h4 className="text-base sm:text-lg font-bold text-[#121417]">נפח חיפושים שבועי</h4>
          <p className="text-xs sm:text-sm text-[#657586] hidden sm:block">מספר בדיקות רכב לפי יום בשבוע האחרון</p>
        </div>
        <button className="p-2 text-[#657586] hover:bg-[#f0f2f4] rounded-lg transition-colors hidden sm:block">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Custom CSS Bar Chart */}
      <div className="h-48 sm:h-56 md:h-64 w-full flex items-end gap-1 sm:gap-2 md:gap-4 lg:gap-8 xl:gap-12 relative pb-6 sm:pb-8 pt-4">
        {/* Y-axis Grid Lines (Decorative) */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
          <div className="w-full h-px bg-gray-100 border-t border-dashed border-gray-200"></div>
          <div className="w-full h-px bg-gray-100 border-t border-dashed border-gray-200"></div>
          <div className="w-full h-px bg-gray-100 border-t border-dashed border-gray-200"></div>
          <div className="w-full h-px bg-gray-100 border-t border-dashed border-gray-200"></div>
          <div className="w-full h-px bg-gray-100 border-t border-gray-200"></div>
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
                    ? 'bg-[#1f66ad] hover:bg-[#1f66ad] shadow-md shadow-[#1f66ad]/20'
                    : 'bg-[#1f66ad]/20 hover:bg-[#1f66ad] group-hover:shadow-lg group-hover:shadow-[#1f66ad]/30'
                }`}
                style={{ height: `${Math.max(heightPercent, 5)}%` }}
              >
                <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  {item.count} חיפושים
                </div>
              </div>
              <span
                className={`absolute -bottom-5 sm:-bottom-6 text-xs sm:text-sm font-medium ${
                  isHighest ? 'text-[#1f66ad] font-bold' : 'text-[#657586]'
                }`}
              >
                {item.dayLabel}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
