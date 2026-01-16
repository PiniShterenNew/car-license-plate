import { Car, Users, MousePointerClick, TrendingUp, TrendingDown } from 'lucide-react'

interface KpiCardsProps {
  adImpressions: number
  uniqueVisitors: number
  searchesToday: number
}

export function KpiCards({ adImpressions, uniqueVisitors, searchesToday }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {/* Card 1 - Searches Today */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col justify-between min-h-[140px] sm:h-40 group hover:border-primary/50 transition-colors">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-blue-50 text-[#1f66ad] rounded-lg">
            <Car className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="flex items-center text-emerald-600 text-xs sm:text-sm font-bold bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            <span>12%</span>
          </span>
        </div>
        <div>
          <p className="text-[#657586] dark:text-slate-400 text-xs sm:text-sm font-medium mb-1">חיפושים היום</p>
          <h4 className="text-3xl sm:text-4xl font-black text-[#121417] dark:text-white tracking-tight group-hover:text-primary transition-colors">
            {searchesToday.toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Card 2 - Unique Visitors */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col justify-between min-h-[140px] sm:h-40 group hover:border-primary/50 transition-colors">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="flex items-center text-emerald-600 text-xs sm:text-sm font-bold bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            <span>5%</span>
          </span>
        </div>
        <div>
          <p className="text-[#657586] dark:text-slate-400 text-xs sm:text-sm font-medium mb-1">משתמשים ייחודיים</p>
          <h4 className="text-3xl sm:text-4xl font-black text-[#121417] dark:text-white tracking-tight group-hover:text-purple-600 transition-colors">
            {uniqueVisitors.toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Card 3 - Ad Impressions */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col justify-between min-h-[140px] sm:h-40 group hover:border-primary/50 transition-colors sm:col-span-2 md:col-span-1">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <MousePointerClick className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="flex items-center text-red-600 text-xs sm:text-sm font-bold bg-red-50 px-2 py-1 rounded-full">
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            <span>2%</span>
          </span>
        </div>
        <div>
          <p className="text-[#657586] dark:text-slate-400 text-xs sm:text-sm font-medium mb-1">חשיפות למודעות</p>
          <h4 className="text-3xl sm:text-4xl font-black text-[#121417] dark:text-white tracking-tight group-hover:text-orange-600 transition-colors">
            {adImpressions.toLocaleString()}
          </h4>
        </div>
      </div>
    </div>
  )
}
