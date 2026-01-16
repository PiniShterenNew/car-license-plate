interface PlateImageProps {
  plate: string
  className?: string
}

export function PlateImage({ plate, className = '' }: PlateImageProps) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-300 rounded-md px-4 py-2 font-mono font-bold text-blue-900 shadow-sm ${className}`}
      dir="ltr"
    >
      <span className="text-lg">{plate}</span>
    </div>
  )
}
