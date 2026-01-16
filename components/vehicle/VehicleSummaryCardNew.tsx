'use client'

import { LicensePlateDisplay } from './LicensePlateDisplay'
import { formatPlate } from '@/lib/plates'
import { LicenseStatus } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'
import { CheckCircle2, AlertCircle, HelpCircle, ShieldCheck, Calendar, User, Settings, Printer, Share2, Building2, Cog } from 'lucide-react'
import { ManufacturerIcon } from './ManufacturerIcon'

interface VehicleSummaryCardNewProps {
  plate: string
  manufacturer: string
  modelName: string
  commercialName: string | null
  year: number | null
  licenseStatus: LicenseStatus
  ownership: string | null
  trimLevel: string | null
}

export function VehicleSummaryCardNew({
  plate,
  manufacturer,
  modelName,
  commercialName,
  year,
  licenseStatus,
  ownership,
  trimLevel,
}: VehicleSummaryCardNewProps) {
  // Memoize plate to prevent re-renders from affecting display
  const normalizedPlate = useMemo(() => {
    return plate.replace(/\D/g, '')
  }, [plate])
  
  const formattedPlate = useMemo(() => formatPlate(normalizedPlate), [normalizedPlate])

  const getStatusBadge = () => {
    switch (licenseStatus) {
      case 'VALID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold border border-success/20">
            <CheckCircle2 className="w-4 h-4" />
            רישיון בתוקף
          </span>
        )
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 text-danger text-xs font-bold border border-danger/20">
              <AlertCircle className="w-4 h-4" />
            רישיון לא בתוקף
          </span>
        )
      case 'UNKNOWN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold border border-gray-200 dark:border-gray-600">
            <HelpCircle className="w-4 h-4" />
            סטטוס לא ידוע
          </span>
        )
      default:
        return null
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `מידע על רכב ${formattedPlate}`,
        text: `${manufacturer} ${modelName}${year ? ` ${year}` : ''}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <section className="bg-white dark:bg-[#22262e] rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800 mb-8 relative group hover:shadow-xl transition-shadow duration-300">
      {/* Decorative top line with gradient */}
      <div className="h-2 w-full bg-gradient-to-l from-primary via-blue-500 to-primary relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Vehicle Info */}
        <div className="flex-1 w-full">
          {/* Status Badges - Enhanced */}
          <div className="flex flex-wrap gap-2.5 mb-4">
            {getStatusBadge()}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              ללא דיווח גניבה
            </span>
          </div>
          
          {/* Vehicle Title - Enhanced typography with manufacturer icon */}
          <div className="flex items-center gap-3 mb-3">
            <div className="shrink-0 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <ManufacturerIcon 
                manufacturer={manufacturer} 
                className="text-[#121417] dark:text-white" 
                size={32}
              />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#121417] dark:text-white leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-[#121417] to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {manufacturer} {commercialName || modelName}
              </span>
              {trimLevel && (
                <span className="block md:inline md:mr-2 text-xl md:text-2xl font-light text-gray-500 dark:text-gray-400 mt-1 md:mt-0">
                  {trimLevel}
                </span>
              )}
            </h1>
          </div>
          
          {/* Vehicle Details - Enhanced with better spacing and visual hierarchy */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[#657586] dark:text-gray-400 text-sm md:text-base">
            {year && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold">
                <Calendar className="w-4 h-4" />
                {year}
              </span>
            )}
            {ownership && (
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold ${
                ownership.toLowerCase().includes('סוחר') || ownership.toLowerCase().includes('מסחר')
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                  : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
              }`}>
                {ownership.toLowerCase().includes('סוחר') || ownership.toLowerCase().includes('מסחר') ? (
                  <Building2 className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                {ownership}
              </span>
            )}
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-semibold">
              <Cog className="w-4 h-4" />
              אוטומט
            </span>
          </div>
        </div>
        
        {/* License Plate Graphic - Enhanced */}
        <div className="flex flex-col items-center gap-4 shrink-0 mx-auto md:mx-0 w-full md:w-auto">
          <div className="relative group/plate">
            <LicensePlateDisplay plate={normalizedPlate} key={normalizedPlate} />
            <div className="absolute -inset-1 bg-primary/10 rounded-xl blur-sm opacity-0 group-hover/plate:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
          
          {/* Action Buttons - Enhanced with better styling */}
          <div className="flex gap-2.5 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 h-10 px-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">הדפס</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 h-10 px-5 bg-primary/5 dark:bg-primary/10 border-2 border-primary/30 dark:border-primary/40 rounded-xl text-sm font-bold text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">שתף</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
