'use client'

import { PlateInput } from '@/components/vehicle/PlateInput'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { normalizePlate, isValidPlate } from '@/lib/plates'

export function SearchForm() {
  const [plate, setPlate] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const normalized = normalizePlate(plate)
    if (!isValidPlate(normalized)) {
      setError('מספר רישוי לא תקין. אנא הזן 7 או 8 ספרות.')
      return
    }

    router.push(`/car/${normalized}`)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <PlateInput
            value={plate}
            onChange={setPlate}
            placeholder="12-345-67"
            className="w-full"
          />
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </div>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          בדוק רכב
        </Button>
      </div>
    </form>
  )
}
