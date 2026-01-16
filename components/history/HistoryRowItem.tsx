'use client'

import { format } from 'date-fns'
import { LicenseStatus } from '@prisma/client'
import { deleteSearchEvent, refreshSearch } from '@/app/(public)/history/actions'
import { useRouter } from 'next/navigation'
import { LicensePlateDisplay } from '@/components/vehicle/LicensePlateDisplay'
import { Calendar, Clock, Trash2, RefreshCw } from 'lucide-react'

interface HistoryRowItemProps {
  plateFormatted: string
  manufacturer: string
  modelName: string
  year: number | null
  licenseStatus: LicenseStatus
  createdAt: Date
  mileage?: number | null
  eventId: string
  plateNormalized: string
  isFirst?: boolean
}


export function HistoryRowItem({
  plateFormatted,
  manufacturer,
  modelName,
  year,
  licenseStatus,
  createdAt,
  mileage,
  eventId,
  plateNormalized,
  isFirst = false,
}: HistoryRowItemProps) {
  const router = useRouter()

  const handleRefresh = async () => {
    await refreshSearch(plateNormalized)
  }

  const handleDelete = async () => {
    await deleteSearchEvent(eventId)
    router.refresh()
  }

  // Normalize plate to get clean digits for LicensePlateDisplay
  const plateDigits = plateNormalized || plateFormatted.replace(/[.\s-]/g, '')

  const handleRowClick = () => {
    if (plateNormalized) {
      router.push(`/car/${plateNormalized}?from=history`)
    }
  }

  const getStatusBadge = () => {
    switch (licenseStatus) {
      case 'VALID':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
            תקין
          </span>
        )
      case 'EXPIRED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
            לא בתוקף
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
            לא ידוע
          </span>
        )
    }
  }

  const formattedDate = format(createdAt, 'dd/MM/yyyy')
  const formattedTime = format(createdAt, 'HH:mm')

  return (
    <div 
      className={`group relative bg-white dark:bg-[#22262e] rounded-xl ${
        isFirst 
          ? 'border-l-4 border-l-primary border-y border-r border-gray-200 dark:border-gray-700' 
          : 'border border-gray-200 dark:border-gray-700'
      } shadow-sm hover:shadow-md transition-all duration-200 p-4 md:p-5 cursor-pointer`}
      onClick={handleRowClick}
    >
      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden gap-4">
        {/* Top Row: Plate and Status */}
        <div className="flex items-center justify-between gap-3">
          <div className="shrink-0">
            <LicensePlateDisplay plate={plateDigits} />
          </div>
          {getStatusBadge()}
        </div>
        
        {/* Car Info */}
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-[#121417] dark:text-white">
            {manufacturer} {modelName}
            {year && <span className="font-normal"> ({year})</span>}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#657586] dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
          <button 
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg shadow-sm transition-all active:scale-95 ${
              isFirst
                ? 'bg-primary text-white shadow-primary/30 hover:bg-primary-dark'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-[#121417] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4" />
            <span>בדוק שוב</span>
          </button>
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-lg text-[#657586] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 transition-colors border border-gray-200 dark:border-gray-600"
            onClick={handleDelete}
            title="מחק מההיסטוריה"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between gap-4">
        {/* Car Info & Plate */}
        <div className="flex items-center gap-5 flex-1 min-w-0">
          {/* Plate Visualization */}
          <div className="shrink-0">
            <LicensePlateDisplay plate={plateDigits} />
          </div>
          
          {/* Details */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-lg font-bold text-[#121417] dark:text-white truncate">
                {manufacturer} {modelName}
                {year && <span className="font-normal"> ({year})</span>}
              </h3>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-3 text-sm text-[#657586] dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>נבדק: {formattedDate}</span>
              </div>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Additional Info */}
          {(mileage !== null && mileage !== undefined) && (
            <div className="flex flex-col items-end mr-4 text-xs text-[#657586] dark:text-gray-400 opacity-60">
              <span>ק"מ אחרון: {mileage.toLocaleString()}</span>
            </div>
          )}
          
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-lg text-[#657586] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 transition-colors"
            onClick={handleDelete}
            title="מחק מההיסטוריה"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <button 
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg shadow-sm transition-all active:scale-95 ${
              isFirst
                ? 'bg-primary text-white shadow-primary/30 hover:bg-primary-dark'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-[#121417] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4.5 h-4.5" />
            <span>בדוק שוב</span>
          </button>
        </div>
      </div>
    </div>
  )
}
