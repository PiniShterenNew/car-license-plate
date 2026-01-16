'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface AdSlotProps {
  slotKey: string
  pagePath: string
  variant?: 'banner' | 'card' | 'inline'
  className?: string
}

export function AdSlot({ slotKey, pagePath, variant = 'banner', className = '' }: AdSlotProps) {
  const [impressionLogged, setImpressionLogged] = useState(false)

  useEffect(() => {
    if (!impressionLogged) {
      logAdEvent('IMPRESSION')
      setImpressionLogged(true)
    }
  }, [impressionLogged])

  const logAdEvent = async (eventType: 'IMPRESSION' | 'CLICK') => {
    try {
      await fetch('/api/ads/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotKey,
          pagePath,
          eventType,
        }),
      })
    } catch (error) {
      console.error('Failed to log ad event:', error)
    }
  }

  const handleClick = () => {
    logAdEvent('CLICK')
  }

  if (variant === 'banner') {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center py-12 gap-4 group cursor-pointer hover:border-primary/30 transition-colors ${className}`}
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
        <p className="text-gray-400 dark:text-gray-500 font-bold text-sm tracking-wider uppercase z-10">שטח פרסום שמור</p>
        <div className="flex flex-col items-center gap-2 z-10 text-center">
          <h4 className="text-xl font-bold text-gray-700 dark:text-gray-300">חשיפה לאלפי רוכשי רכב ביום</h4>
          <Link
            href="/contact"
            className="text-primary font-medium text-sm flex items-center gap-1 group-hover:underline"
            onClick={handleClick}
          >
            צור קשר לפרטים
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return 'w-full min-h-[300px] bg-muted border-2 border-dashed border-muted-foreground/20 rounded-lg'
      case 'inline':
        return 'w-full min-h-[100px] bg-muted border-2 border-dashed border-muted-foreground/20'
      default:
        return 'w-full min-h-[250px] bg-muted border-2 border-dashed border-muted-foreground/20'
    }
  }

  return (
    <div className={`${getVariantStyles()} ${className} flex flex-col items-center justify-center p-4`}>
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">תוכן ממומן</p>
        <p className="text-xs text-muted-foreground/70">מודעה</p>
      </div>
    </div>
  )
}
