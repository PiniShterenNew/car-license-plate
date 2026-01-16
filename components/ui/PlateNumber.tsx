interface PlateNumberProps {
  plate: string
  className?: string
}

/**
 * Displays a license plate number with centered circular dots
 * Dots are vertically centered using flexbox
 */
export function PlateNumber({ plate, className = '' }: PlateNumberProps) {
  // Split by dots and render with centered circular dots
  const parts = plate.split('.')
  
  if (parts.length === 1) {
    // No dots, just return the number
    return <span className={className}>{plate}</span>
  }
  
  return (
    <span className={`inline-flex items-center ${className}`} style={{ lineHeight: '1.2' }}>
      {parts.map((part, index) => (
        <span key={index} className="inline-flex items-center">
          <span>{part}</span>
          {index < parts.length - 1 && (
            <span className="inline-flex items-center justify-center mx-1" style={{ 
              verticalAlign: 'middle', 
              lineHeight: '1',
            }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            </span>
          )}
        </span>
      ))}
    </span>
  )
}
