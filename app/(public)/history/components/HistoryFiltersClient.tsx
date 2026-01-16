'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'

interface HistoryFiltersClientProps {
  initialSearch?: string
  initialDateRange?: string
  initialStatus?: string
}

export function HistoryFiltersClient({
  initialSearch,
  initialDateRange,
  initialStatus,
}: HistoryFiltersClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch || '')
  const [dateRange, setDateRange] = useState(initialDateRange || 'all')
  const [status, setStatus] = useState(initialStatus || 'all')

  const updateURL = useCallback((newSearch: string, newDateRange: string, newStatus: string) => {
    const params = new URLSearchParams()
    if (newSearch) {
      params.set('search', newSearch)
    }
    if (newDateRange !== 'all') {
      params.set('dateRange', newDateRange)
    }
    if (newStatus !== 'all') {
      params.set('status', newStatus)
    }
    const queryString = params.toString()
    router.push(`/history${queryString ? `?${queryString}` : ''}`)
  }, [router])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    updateURL(value, dateRange, status)
  }

  const handleDateRangeChange = (value: string) => {
    setDateRange(value)
    updateURL(search, value, status)
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    updateURL(search, dateRange, value)
  }

  const statusOptions = [
    { value: 'all', label: 'הכל' },
    { value: 'valid', label: 'מועדפים' },
    { value: 'expired', label: 'רכבים גנובים' },
  ]

  return (
    <div className="bg-white dark:bg-[#22262e] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <label className="block text-sm font-semibold text-[#121417] dark:text-white mb-1.5">
            חיפוש לפי מספר רכב
          </label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              placeholder="הקלד מספר רישוי..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-11 pr-10 pl-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-[#121417] dark:text-white font-medium placeholder:text-gray-400 transition-all"
            />
          </div>
        </div>

        {/* Date Filter */}
        <div className="md:col-span-3 relative">
          <label className="block text-sm font-semibold text-[#121417] dark:text-white mb-1.5">
            תאריך
          </label>
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-full h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-[#121417] dark:text-white font-medium cursor-pointer">
              <SelectValue placeholder="כל הזמן" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הזמן</SelectItem>
              <SelectItem value="7d">7 ימים אחרונים</SelectItem>
              <SelectItem value="30d">30 ימים אחרונים</SelectItem>
              <SelectItem value="quarter">השנה הנוכחית</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filters (Chips) */}
        <div className="md:col-span-4 flex items-center justify-end gap-2 pb-1">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={
                status === option.value
                  ? 'px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 transition-colors'
                  : 'px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-[#657586] dark:text-gray-300 text-sm font-medium border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
