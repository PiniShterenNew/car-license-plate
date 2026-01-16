'use client'

import { NotFoundScreen } from '@/components/ui/NotFoundScreen'
import { useRouter } from 'next/navigation'
import { normalizePlate, isValidPlate } from '@/lib/plates'
import { useState } from 'react'

interface NotFoundScreenClientProps {
  plate: string
}

export function NotFoundScreenClient({ plate }: NotFoundScreenClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRetry = () => {
    router.push('/')
  }

  const handleSearchAgain = async () => {
    const normalized = normalizePlate(plate)
    if (isValidPlate(normalized)) {
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
          // Stay on this page, error is already shown
        }
      } catch (err) {
        // Error handling
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <NotFoundScreen 
      plate={plate} 
      onRetry={handleRetry}
      onSearchAgain={handleSearchAgain}
    />
  )
}
