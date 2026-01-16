import React from 'react'
import { 
  Factory, Car, Palette, Calendar, Settings, Fuel, Copyright, ShieldCheck, Leaf, 
  Wrench, CheckCircle2 
} from 'lucide-react'

interface VehicleSpecGridProps {
  manufacturer: string
  modelName: string
  year: number | null
  trimLevel: string | null
  safetyLevel: string | null
  pollutionGroup: string | null
  ownership: string | null
  licenseValidUntil: Date | null
  lastTestDate: Date | null
  color: string | null
  engineModel: string | null
  vehicleType: string | null
  commercialName: string | null
  frontTire: string | null
  rearTire: string | null
  fuelType: string | null
}

export function VehicleSpecGrid({
  manufacturer,
  modelName,
  year,
  trimLevel,
  safetyLevel,
  pollutionGroup,
  ownership,
  licenseValidUntil,
  lastTestDate,
  color,
  engineModel,
  vehicleType,
  commercialName,
  frontTire,
  rearTire,
  fuelType,
}: VehicleSpecGridProps) {
  const formatDate = (date: Date | null): string => {
    if (!date) return 'לא זמין'
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  const getColorSwatch = (colorName: string | null) => {
    if (!colorName) return null
    
    const colorMap: Record<string, string> = {
      'אפור': '#808080',
      'אפור מטאלי': '#708090',
      'כסף': '#C0C0C0',
      'שחור': '#000000',
      'לבן': '#FFFFFF',
      'כחול': '#0000FF',
      'אדום': '#FF0000',
      'ירוק': '#008000',
      'בז': '#F5F5DC',
      'חום': '#A52A2A',
      'כתום': '#FFA500',
      'צהוב': '#FFFF00',
      'זהב': '#FFD700',
      'ברונזה': '#CD7F32',
      'סגול': '#800080',
    }
    
    // Simple heuristic to find color if partial match
    const normalizedColor = colorName.trim()
    let colorValue = '#808080' // default gray
    
    for (const [key, value] of Object.entries(colorMap)) {
      if (normalizedColor.includes(key)) {
        colorValue = value
        break
      }
    }
    
    return (
      <span 
        className="size-3 rounded-full border border-gray-200 ring-1 ring-offset-1 ring-gray-200" 
        style={{ backgroundColor: colorValue }}
      ></span>
    )
  }

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    factory: Factory,
    directions_car: Car,
    palette: Palette,
    calendar_month: Calendar,
    branding_watermark: Settings,
    local_gas_station: Fuel,
    copyright: Copyright,
    safety_check: ShieldCheck,
    eco: Leaf,
    tire_repair: Wrench,
    event_available: CheckCircle2,
    tune: Settings,
  }

  const specs = [
    { 
      icon: 'factory', 
      label: 'יצרן', 
      value: manufacturer,
    },
    { 
      icon: 'directions_car', 
      label: 'דגם', 
      value: modelName,
    },
    ...(commercialName ? [{
      icon: 'directions_car' as const,
      label: 'כינוי מסחרי',
      value: commercialName,
      highlight: true
    }] : []),
    { 
      icon: 'directions_car', 
      label: 'סוג דגם', 
      value: vehicleType || 'לא זמין',
    },
    { 
      icon: 'palette', 
      label: 'צבע רכב', 
      value: color || 'לא זמין',
      colorSwatch: getColorSwatch(color)
    },
    { 
      icon: 'calendar_month', 
      label: 'שנת ייצור', 
      value: year?.toString() || 'לא זמין',
    },
    { 
      icon: 'branding_watermark', 
      label: 'דגם מנוע', 
      value: engineModel || 'לא זמין',
      highlight: true
    },
    { 
      icon: 'local_gas_station', 
      label: 'סוג דלק', 
      value: fuelType || 'לא זמין',
      highlight: true
    },
    { 
      icon: 'copyright', 
      label: 'בעלות מקורית', 
      value: ownership || 'לא זמין' 
    },
    { 
      icon: 'safety_check', 
      label: 'רמת אבזור בטיחותי', 
      value: safetyLevel || 'לא זמין' 
    },
    { 
      icon: 'eco', 
      label: 'קבוצת זיהום', 
      value: pollutionGroup || 'לא זמין' 
    },
    { 
      icon: 'tire_repair', 
      label: 'צמיג קדמי', 
      value: frontTire || 'לא זמין',
      mono: true
    },
    { 
      icon: 'tire_repair', 
      label: 'צמיג אחורי', 
      value: rearTire || 'לא זמין',
      mono: true
    },
    { 
      icon: 'event_available', 
      label: 'תוקף רישיון עד', 
      value: formatDate(licenseValidUntil) 
    },
    { 
      icon: 'calendar_month', 
      label: 'תאריך בדיקה אחרונה', 
      value: formatDate(lastTestDate) 
    },
  ]

  return (
    <section className="bg-white dark:bg-[#22262e] rounded-xl shadow-subtle border border-gray-100 dark:border-gray-800 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Settings className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-[#121417] dark:text-white">מפרט טכני מלא</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
        {specs.map((spec, index) => {
          const IconComponent = iconMap[spec.icon] || Settings
          return (
          <div key={index} className="flex gap-4 items-start group">
            <div className={`mt-1 transition-colors ${spec.highlight ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {spec.label}
              </p>
              <p className={`text-base font-bold text-[#121417] dark:text-white flex items-center gap-2 ${spec.mono ? 'font-mono' : ''} ${spec.highlight ? 'text-primary' : ''}`}>
                {spec.value}
                {spec.colorSwatch}
              </p>
            </div>
          </div>
          )
        })}
      </div>
    </section>
  )
}
