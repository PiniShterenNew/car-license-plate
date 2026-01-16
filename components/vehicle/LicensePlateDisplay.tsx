'use client'

import { formatPlate } from '@/lib/plates'
import { useMemo } from 'react'

interface LicensePlateDisplayProps {
  plate: string
  className?: string
}

export function LicensePlateDisplay({ plate, className = '' }: LicensePlateDisplayProps) {
  // Memoize the plate processing to prevent re-renders from affecting display
  const parts = useMemo(() => {
    // Ensure we always work with normalized digits only
    const digits = plate.replace(/\D/g, '')
    
    // Same formatting logic as hero-search-box
    if (digits.length <= 2) {
      return [digits]
    } else if (digits.length <= 5) {
      return [digits.slice(0, 2), digits.slice(2)]
    } else if (digits.length <= 7) {
      return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5)]
    } else {
      return [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5, 8)]
    }
  }, [plate])

  return (
    <div className={`relative flex items-center bg-[#ffcc00] dark:bg-[#ffcc00] rounded-lg border-2 border-primary/50 overflow-visible shadow-md h-10 sm:h-12 min-w-[200px] sm:min-w-[240px] ${className}`} dir="ltr">
      {/* Visual IL Strip - Same as hero-search-box */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-10 bg-[#003399] flex flex-col items-center justify-between py-1 sm:py-1.5 z-10">
        <div className="w-full flex justify-center">
          {/* Israeli Flag approximation */}
          <div className="w-5 h-3 bg-white relative overflow-hidden rounded-[1px]">
            <div className="absolute top-[2px] left-0 w-full h-[1.5px] bg-[#003399]"></div>
            <div className="absolute bottom-[2px] left-0 w-full h-[1.5px] bg-[#003399]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#003399] text-[6px]">✡</div>
          </div>
        </div>
        <span className="text-white font-bold text-[10px] sm:text-xs tracking-widest">IL</span>
        <span className="text-white text-[6px] sm:text-[8px]">ישראל</span>
      </div>
      
      {/* Numbers with circular dots - Same styling as hero-search-box */}
      <div className="flex-1 flex items-center justify-center pl-10 sm:pl-12 pr-3">
        <div className="text-xl sm:text-2xl font-bold plate-input-text flex items-center" style={{ lineHeight: '1.5' }}>
          {parts.map((part, index, array) => (
            <span key={index} className="inline-flex items-center">
              <span className="text-[#121417] dark:text-[#121417]">{part}</span>
              {index < array.length - 1 && (
                <span className="inline-flex items-center justify-center mx-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#121417] dark:bg-[#121417]"></span>
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
