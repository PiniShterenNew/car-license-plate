'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { normalizePlate, isValidPlate } from '@/lib/plates'
import { NotFoundScreen } from './NotFoundScreen'
import { Loader2, Search, ArrowRight, Lock, AlertCircle } from 'lucide-react'

export function HeroSearchBox() {
  const [plate, setPlate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchedPlate, setSearchedPlate] = useState('') // Store the plate that was searched
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const normalized = normalizePlate(plate)
    if (!isValidPlate(normalized)) {
      setError('מספר רישוי לא תקין. אנא הזן 7 או 8 ספרות.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/vehicle/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate: normalized }),
      })

      const data = await response.json()
      
      if (data.ok) {
        router.push(`/car/${normalized}`)
      } else {
        setSearchedPlate(normalized) // Store the plate that was searched
        setError(data.error || 'רכב לא נמצא')
      }
    } catch (err) {
      setError('שגיאה בחיפוש. אנא נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value
    // Only allow digits - remove everything else
    const digits = input.replace(/\D/g, '')
    
    // Limit to 8 digits maximum
    const limitedDigits = digits.slice(0, 8)
    
    // Store only digits (no dots) - overlay will display dots
    setPlate(limitedDigits)
  }

  return (
    <div className="w-full max-w-2xl relative group">
      {/* Decorative blur behind */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500 -z-10"></div>
      
      <form onSubmit={handleSubmit} className="relative bg-white dark:bg-[#252a33] p-2 sm:p-3 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-stretch gap-2 z-0">
        {/* Input Wrapper with "IL" visual strip - Yellow plate background */}
        <div className="relative flex-grow flex items-center bg-[#ffcc00] dark:bg-[#ffcc00] rounded-xl border-2 border-primary/50 transition-all duration-300 overflow-hidden shadow-md">
          {/* Visual IL Strip */}
          <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 bg-[#003399] flex flex-col items-center justify-between py-2 sm:py-3 z-10">
            <div className="w-full flex justify-center">
              {/* Israeli Flag approximation */}
              <div className="w-6 h-4 bg-white relative overflow-hidden rounded-[1px]">
                <div className="absolute top-[3px] left-0 w-full h-[2px] bg-[#003399]"></div>
                <div className="absolute bottom-[3px] left-0 w-full h-[2px] bg-[#003399]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#003399] text-[8px]">✡</div>
              </div>
            </div>
            <span className="text-white font-bold text-xs sm:text-sm tracking-widest">IL</span>
            <span className="text-white text-[8px] sm:text-[10px]">ישראל</span>
          </div>
          
          {/* The Actual Input */}
          <label className="sr-only" htmlFor="license-plate">מספר רכב</label>
          <div className="relative flex-1 flex items-center justify-center">
            <input
              id="license-plate"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={plate}
              onChange={handleChange}
              maxLength={8}
              placeholder=""
              disabled={loading}
              dir="ltr"
              className="w-full h-14 sm:h-16 bg-transparent border-none focus:ring-0 text-center text-3xl sm:text-4xl font-bold text-transparent caret-[#121417] dark:caret-[#121417] plate-input-text pl-12 sm:pl-16 pr-4 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ lineHeight: '1.5', verticalAlign: 'middle' }}
            />
            {/* Circular dots overlay for formatted plate */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pl-12 sm:pl-16 pr-4">
              <div className="text-3xl sm:text-4xl font-bold plate-input-text flex items-center" dir="ltr" style={{ lineHeight: '1.5' }}>
                {plate.length > 0 ? (
                  // Display formatted plate with circular dots
                  (() => {
                    const digits = plate.replace(/\D/g, '')
                    let parts: string[] = []
                    
                    if (digits.length <= 2) {
                      parts = [digits]
                    } else if (digits.length <= 5) {
                      parts = [digits.slice(0, 2), digits.slice(2)]
                    } else if (digits.length <= 7) {
                      parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5)]
                    } else {
                      parts = [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5, 8)]
                    }
                    
                    return parts.map((part, index, array) => (
                      <span key={index} className="inline-flex items-center">
                        <span className="text-[#121417] dark:text-[#121417]">{part}</span>
                        {index < array.length - 1 && (
                          <span className="inline-flex items-center justify-center mx-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#121417] dark:bg-[#121417]"></span>
                          </span>
                        )}
                      </span>
                    ))
                  })()
                ) : (
                  // Placeholder: 12•345•67 with circular dots
                  <>
                    <span className="text-[#121417]/40 dark:text-[#121417]/40">12</span>
                    <span className="inline-flex items-center justify-center mx-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#121417]/40 dark:bg-[#121417]/40"></span>
                    </span>
                    <span className="text-[#121417]/40 dark:text-[#121417]/40">345</span>
                    <span className="inline-flex items-center justify-center mx-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#121417]/40 dark:bg-[#121417]/40"></span>
                    </span>
                    <span className="text-[#121417]/40 dark:text-[#121417]/40">67</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          disabled={loading}
          className="h-14 sm:h-auto px-8 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg shadow-lg shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>בודק...</span>
            </>
          ) : error && (error.includes('לא נמצא') || error.includes('לא נמצא במאגר')) ? (
            <>
              <span>בדוק שוב</span>
              <Search className="w-5 h-5" />
            </>
          ) : (
            <>
              <span>בדוק רכב</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      {/* Helper text under input */}
      <div className="flex justify-between items-center px-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span>* גישה ישירה למאגרי המידע הממשלתיים</span>
        <span className="flex items-center gap-1">
          <Lock className="w-3.5 h-3.5" />
          מאובטח SSL
        </span>
      </div>

      {error && (error.includes('לא נמצא') || error.includes('לא נמצא במאגר')) && searchedPlate && (
        <NotFoundScreen 
          plate={searchedPlate} 
          onRetry={() => {
            setError('')
            setPlate('')
            setSearchedPlate('')
          }} 
          onSearchAgain={async () => {
            if (searchedPlate) {
              const normalized = normalizePlate(searchedPlate)
              if (isValidPlate(normalized)) {
                setError('')
                setLoading(true)
                try {
                  const response = await fetch('/api/vehicle/lookup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plate: normalized }),
                  })
                  const data = await response.json()
                  if (data.ok) {
                    router.push(`/car/${normalized}`)
                  } else {
                    setError(data.error || 'רכב לא נמצא')
                    setSearchedPlate(normalized) // Keep the searched plate
                  }
                } catch (err) {
                  setError('שגיאה בחיפוש. אנא נסה שוב.')
                } finally {
                  setLoading(false)
                }
              }
            }
          }} 
        />
      )}
      
      {error && !error.includes('לא נמצא') && !error.includes('לא נמצא במאגר') && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300 relative z-10">
          <div className="flex items-start gap-3 p-4 rounded-xl border-2 shadow-none bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50">
            <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-red-100 dark:bg-red-900/40">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 text-right">
              <h4 className="font-bold text-sm mb-1 text-red-900 dark:text-red-200">
                שגיאה
              </h4>
              <p className="text-sm leading-relaxed text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
