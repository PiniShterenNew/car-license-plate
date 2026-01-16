interface PlateDisplayProps {
  plate: string
  className?: string
}

export function PlateDisplay({ plate, className = '' }: PlateDisplayProps) {
  // Format plate: "12 345 67" -> "12 • 345 • 67"
  const formatted = plate.replace(/\s+/g, ' • ')
  
  return (
    <div className={`relative flex h-[70px] w-[320px] bg-plate-yellow rounded-lg border-[3px] border-black shadow-lg items-center overflow-hidden ${className}`}>
      {/* Blue stripe */}
      <div className="h-full w-[45px] bg-plate-blue flex flex-col items-center justify-between py-1 border-r border-black/20">
        <div className="text-white text-[10px] font-bold">IL</div>
        <div className="text-white text-[8px]">ישראל</div>
      </div>
      
      {/* Plate numbers */}
      <div className="flex-1 flex items-center justify-center gap-1 text-black font-mono text-4xl font-bold tracking-wider il-plate-font px-2">
        {formatted}
      </div>
    </div>
  )
}
