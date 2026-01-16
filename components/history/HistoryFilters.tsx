'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'
import { useState } from 'react'

interface HistoryFiltersProps {
  onSearchChange: (value: string) => void
  onDateRangeChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onExport: () => void
}

export function HistoryFilters({
  onSearchChange,
  onDateRangeChange,
  onStatusFilterChange,
  onExport,
}: HistoryFiltersProps) {
  const [searchValue, setSearchValue] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const statusOptions = [
    { value: 'all', label: 'הכל' },
    { value: 'valid', label: 'תקין' },
    { value: 'warning', label: 'אזהרה' },
    { value: 'expired', label: 'לא בתוקף' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="הקלד מספר רישוי"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            onSearchChange(e.target.value)
          }}
          className="flex-1"
        />
        <Select defaultValue="all" onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="כל הזמן" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הזמן</SelectItem>
            <SelectItem value="7d">7 ימים</SelectItem>
            <SelectItem value="30d">30 יום</SelectItem>
            <SelectItem value="quarter">רבעון</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onExport} variant="outline">
          <Download className="h-4 w-4 ml-2" />
          ייצוא ל CSV
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Badge
            key={option.value}
            variant={selectedStatus === option.value ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => {
              setSelectedStatus(option.value)
              onStatusFilterChange(option.value)
            }}
          >
            {option.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}
