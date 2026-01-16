'use client'

import { Input } from '@/components/ui/input'
import { Car } from 'lucide-react'
import { useState, useEffect } from 'react'

interface PlateInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function PlateInput({ value, onChange, placeholder = '12-345-67', className = '' }: PlateInputProps) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value
    // Allow digits, dashes, and spaces
    input = input.replace(/[^\d\s-]/g, '')
    
    // Auto-format as user types
    const digits = input.replace(/\D/g, '')
    let formatted = digits
    
    if (digits.length > 0) {
      if (digits.length <= 2) {
        formatted = digits
      } else if (digits.length <= 5) {
        formatted = `${digits.slice(0, 2)}-${digits.slice(2)}`
      } else if (digits.length <= 7) {
        formatted = `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
      } else {
        formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 8)}`
      }
    }
    
    setDisplayValue(formatted)
    onChange(formatted)
  }

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pr-10 border-0 bg-transparent focus:ring-0 text-text-main dark:text-white placeholder:text-gray-400"
        dir="ltr"
        maxLength={11}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
        <Car className="h-4 w-4" />
      </div>
    </div>
  )
}
