'use client'

import { PlateInput } from '@/components/vehicle/PlateInput'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { normalizePlate, isValidPlate } from '@/lib/plates'
import { Loader2 } from 'lucide-react'

export function SearchForm() {
  const [plate, setPlate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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
        setError(data.error || 'רכב לא נמצא')
      }
    } catch (err) {
      setError('שגיאה בחיפוש. אנא נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <Button 
          type="submit" 
          size="lg" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 text-lg font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>בודק...</span>
            </>
          ) : (
            <span>בדוק רכב →</span>
          )}
        </Button>
        <div className="flex-1 relative">
          <PlateInput
            value={plate}
            onChange={setPlate}
            placeholder="12-345-67"
            className="w-full"
          />
          {/* Israeli Flag Icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-8 h-6 bg-white border border-gray-300 rounded flex items-center justify-center mb-1">
              <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">✡</span>
              </div>
            </div>
            <span className="text-[10px] text-gray-600 font-medium">IL</span>
            <span className="text-[10px] text-gray-600">ישראל</span>
          </div>
        </div>
      </form>
      {error && (
        <p className="text-sm text-destructive mt-2 text-center">{error}</p>
      )}
    </div>
  )
}
