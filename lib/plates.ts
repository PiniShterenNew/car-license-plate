/**
 * Normalize Israeli license plate to digits only
 * Accepts 7 or 8 digits, with or without dashes/spaces/dots
 */
export function normalizePlate(plate: string): string {
  return plate.replace(/[\s\-.]/g, '')
}

/**
 * Format normalized plate for display
 * 7 digits: XX.XXX.XX
 * 8 digits: XXX.XX.XXX
 */
export function formatPlate(normalized: string): string {
  const digits = normalized.replace(/\D/g, '')
  
  if (digits.length === 7) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  }
  
  if (digits.length === 8) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 5)}.${digits.slice(5)}`
  }
  
  return normalized
}

/**
 * Format normalized plate for display with dashes
 * 7 digits: XX-XXX-XX
 * 8 digits: XXX-XX-XXX
 */
export function formatPlateWithDashes(normalized: string): string {
  const digits = normalized.replace(/\D/g, '')
  
  if (digits.length === 7) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
  }
  
  if (digits.length === 8) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
  }
  
  return normalized
}

/**
 * Validate plate format (7 or 8 digits)
 */
export function isValidPlate(plate: string): boolean {
  const normalized = normalizePlate(plate)
  return /^\d{7,8}$/.test(normalized)
}
