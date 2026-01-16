'use client'

import { Button } from '@/components/ui/button'
import { LicensePlateDisplay } from '../vehicle/LicensePlateDisplay'
import { useMemo } from 'react'
import { AlertCircle, Search, RefreshCw } from 'lucide-react'

interface NotFoundScreenProps {
  plate: string
  onRetry: () => void
  onSearchAgain: () => void
}

export function NotFoundScreen({ plate, onRetry, onSearchAgain }: NotFoundScreenProps) {
  // Memoize the plate to prevent it from changing when search field is cleared
  const normalizedPlate = useMemo(() => {
    return plate.replace(/\D/g, '')
  }, [plate])

  return (
    <section className="w-full max-w-2xl px-6 pb-24 flex flex-col items-center text-center animate-in fade-in duration-300 mt-8">
      
      {/* Visual License Plate Display */}
      <div className="mb-10 scale-110">
        <LicensePlateDisplay plate={normalizedPlate} key={normalizedPlate} />
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-black text-[#121417] dark:text-white mb-4">
        רכב זה אינו מופיע במאגר
      </h2>

      {/* Description */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6 max-w-lg mb-8">
        <div className="flex flex-col items-center gap-2 text-red-800 dark:text-red-200">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p className="font-bold text-lg">לא נמצאו נתונים עבור מספר רישוי זה</p>
          <p className="text-sm opacity-90 leading-relaxed">
            יתכן והמספר שגוי, או שהרכב חדש מאוד וטרם עודכן במאגרי משרד התחבורה.
            כמו כן, רכבי ביטחון ורכבים מסוימים אינם מופיעים במאגר הציבורי.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Button
          onClick={(e) => {
            e.preventDefault()
            onRetry() // Actually calls router.push('/') based on parent component
          }}
          className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-base shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          חפש מספר אחר
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault()
            onSearchAgain()
          }}
          variant="outline"
          className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2d333d] hover:border-gray-300 dark:hover:border-gray-500 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          נסה שוב
        </Button>
      </div>
    </section>
  )
}
