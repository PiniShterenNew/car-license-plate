'use client'

import * as simpleIcons from 'simple-icons'
import { Factory } from 'lucide-react'

interface ManufacturerIconProps {
  manufacturer: string
  className?: string
  size?: number
}

/**
 * Maps Hebrew/English manufacturer names to simple-icons slug names
 */
function getManufacturerSlug(manufacturer: string): string | null {
  if (!manufacturer) return null
  
  const normalized = manufacturer.toLowerCase().trim()
  
  // Map common manufacturer names to simple-icons slugs
  const manufacturerMap: Record<string, string> = {
    // Hebrew names
    'יונדאי': 'hyundai',
    'טויוטה': 'toyota',
    'מזדה': 'mazda',
    'הונדה': 'honda',
    'ניסאן': 'nissan',
    'סובארו': 'subaru',
    'מיצובישי': 'mitsubishi',
    'סוזוקי': 'suzuki',
    'קיה': 'kia',
    'שברולט': 'chevrolet',
    'פורד': 'ford',
    'דודג': 'dodge',
    'ג\'יפ': 'jeep',
    'ב.מ.וו': 'bmw',
    'ב.מ.ו': 'bmw',
    'ב.מ.ו.': 'bmw',
    'ב.מ.וו.': 'bmw',
    'ב.מ.ו': 'bmw',
    'ב.מ.וו': 'bmw',
    'מרצדס': 'mercedes',
    'מרצדס-enz': 'mercedes',
    'אאודי': 'audi',
    'פולקסווגן': 'volkswagen',
    'פולקסווגן': 'volkswagen',
    'וולבו': 'volvo',
    'פיג\'ו': 'peugeot',
    'רנו': 'renault',
    'סיטרואן': 'citroen',
    'אופל': 'opel',
    'פיאט': 'fiat',
    'אלפא רומיאו': 'alfaromeo',
    'לנד רובר': 'landrover',
    'יגואר': 'jaguar',
    'מיני': 'mini',
    'פורשה': 'porsche',
    'למבורגיני': 'lamborghini',
    'פרארי': 'ferrari',
    'מזראטי': 'maserati',
    'אינפיניטי': 'infiniti',
    'לקסוס': 'lexus',
    'אקורה': 'acura',
    'קאדילאק': 'cadillac',
    'לינקולן': 'lincoln',
    'בואיק': 'buick',
    'ג\'נרל מוטורס': 'generalmotors',
    'טסלה': 'tesla',
    'פולסטאר': 'polestar',
    'ריביאן': 'rivian',
    'לוציד': 'lucid',
    
    // English names (fallback)
    'hyundai': 'hyundai',
    'toyota': 'toyota',
    'mazda': 'mazda',
    'honda': 'honda',
    'nissan': 'nissan',
    'subaru': 'subaru',
    'mitsubishi': 'mitsubishi',
    'suzuki': 'suzuki',
    'kia': 'kia',
    'chevrolet': 'chevrolet',
    'ford': 'ford',
    'dodge': 'dodge',
    'jeep': 'jeep',
    'bmw': 'bmw',
    'mercedes': 'mercedes',
    'mercedes-benz': 'mercedes',
    'audi': 'audi',
    'volkswagen': 'volkswagen',
    'vw': 'volkswagen',
    'volvo': 'volvo',
    'peugeot': 'peugeot',
    'renault': 'renault',
    'citroen': 'citroen',
    'citroën': 'citroen',
    'opel': 'opel',
    'fiat': 'fiat',
    'alfa romeo': 'alfaromeo',
    'alfaromeo': 'alfaromeo',
    'land rover': 'landrover',
    'landrover': 'landrover',
    'jaguar': 'jaguar',
    'mini': 'mini',
    'porsche': 'porsche',
    'lamborghini': 'lamborghini',
    'ferrari': 'ferrari',
    'maserati': 'maserati',
    'infiniti': 'infiniti',
    'lexus': 'lexus',
    'acura': 'acura',
    'cadillac': 'cadillac',
    'lincoln': 'lincoln',
    'buick': 'buick',
    'general motors': 'generalmotors',
    'generalmotors': 'generalmotors',
    'gm': 'generalmotors',
    'tesla': 'tesla',
    'polestar': 'polestar',
    'rivian': 'rivian',
    'lucid': 'lucid',
  }
  
  // Direct match
  if (manufacturerMap[normalized]) {
    return manufacturerMap[normalized]
  }
  
  // Partial match - check if manufacturer name contains any key
  for (const [key, slug] of Object.entries(manufacturerMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return slug
    }
  }
  
  return null
}

export function ManufacturerIcon({ manufacturer, className = '', size = 24 }: ManufacturerIconProps) {
  const slug = getManufacturerSlug(manufacturer)
  
  if (!slug) {
    // Fallback to generic Factory icon if manufacturer not found
    return <Factory className={className} style={{ width: size, height: size }} />
  }
  
  // Get icon from simple-icons - format is si{Slug} (e.g., siHyundai, siToyota)
  // Convert slug to PascalCase: hyundai -> Hyundai, then prepend 'si'
  const pascalCase = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
  const iconKey = `si${pascalCase}` as keyof typeof simpleIcons
  const icon = simpleIcons[iconKey] as { title: string; path: string; hex: string } | undefined
  
  if (!icon || typeof icon !== 'object' || !icon.path) {
    // Fallback to generic Factory icon if icon not found in simple-icons
    return <Factory className={className} style={{ width: size, height: size }} />
  }
  
  // Render the SVG icon from simple-icons with brand color
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      style={{ width: size, height: size }}
      fill={`#${icon.hex}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  )
}
