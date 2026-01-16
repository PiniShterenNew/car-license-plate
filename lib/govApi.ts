import { z } from 'zod'

const GOV_API_BASE = 'https://data.gov.il/api/3/action/datastore_search'
const RESOURCE_ID = '053cea08-09bc-40ec-8f7a-156f0677aff3'

// Helper to coerce number/string/null to string
const coerceToString = z.preprocess((val) => {
  if (val === null || val === undefined) return undefined
  return String(val)
}, z.string().optional())

// Raw schema that accepts both number and string from API
const GovApiRecordSchema = z.object({
  mispar_rechev: z.preprocess((val) => String(val), z.string()),
  tozeret_nm: z.string().optional(),
  degem_nm: z.string().optional(),
  shnat_yitzur: z.preprocess((val) => {
    if (val === null || val === undefined) return undefined
    return String(val)
  }, z.string().optional()),
  ramat_gimur: z.string().optional(),
  baalut: z.string().optional(),
  tokef_dt: z.string().optional(),
  mivchan_acharon_dt: z.string().optional(),
  tzeva_rechev: z.string().optional(),
  ramat_eivzur_betihuty: coerceToString,
  kvutzat_zihum: coerceToString,
  degem_manoa: z.string().optional(),
  sug_degem: z.string().optional(),
  
  // New fields
  zmig_kidmi: z.string().optional(),
  zmig_ahori: z.string().optional(),
  sug_delek_nm: z.string().optional(),
  moed_aliya_lakvish: z.string().optional(),
  kinuy_mishari: z.string().optional(),
})

const GovApiResponseSchema = z.object({
  success: z.boolean(),
  result: z.object({
    records: z.array(GovApiRecordSchema),
  }),
})

export type GovApiRecord = z.infer<typeof GovApiRecordSchema>

export interface VehicleData {
  manufacturer: string
  modelName: string
  year: number | null
  trimLevel: string | null
  ownership: string | null
  licenseValidUntil: Date | null
  lastTestDate: Date | null
  color: string | null
  safetyLevel: string | null
  pollutionGroup: string | null
  engineModel: string | null
  
  // New Fields
  frontTire: string | null
  rearTire: string | null
  fuelType: string | null
  roadDate: Date | null
  commercialName: string | null
}

/**
 * Parse date string from API (format: YYYY-MM-DD or similar)
 */
function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null
  try {
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? null : date
  } catch {
    return null
  }
}

/**
 * Parse year string to number
 */
function parseYear(yearStr: string | undefined): number | null {
  if (!yearStr) return null
  const year = parseInt(yearStr, 10)
  return isNaN(year) ? null : year
}

/**
 * Map raw API record to normalized vehicle input for Prisma
 */
function mapGovRecordToVehicleInput(record: z.infer<typeof GovApiRecordSchema>): VehicleData {
  return {
    manufacturer: record.tozeret_nm || '',
    modelName: record.degem_nm || '',
    year: parseYear(record.shnat_yitzur),
    trimLevel: record.ramat_gimur || null,
    ownership: record.baalut || null,
    licenseValidUntil: parseDate(record.tokef_dt),
    lastTestDate: parseDate(record.mivchan_acharon_dt),
    color: record.tzeva_rechev || null,
    safetyLevel: record.ramat_eivzur_betihuty || null,
    pollutionGroup: record.kvutzat_zihum || null,
    engineModel: record.degem_manoa || null,
    vehicleType: record.sug_degem || null,
    
    // New mappings
    frontTire: record.zmig_kidmi || null,
    rearTire: record.zmig_ahori || null,
    fuelType: record.sug_delek_nm || null,
    roadDate: parseDate(record.moed_aliya_lakvish),
    commercialName: record.kinuy_mishari || null,
  }
}

/**
 * Fetch vehicle data from government API
 */
export async function fetchVehicleData(plateNormalized: string): Promise<VehicleData | null> {
  const url = new URL(GOV_API_BASE)
  url.searchParams.set('resource_id', RESOURCE_ID)
  url.searchParams.set('limit', '1')
  url.searchParams.set('filters', JSON.stringify({ mispar_rechev: plateNormalized }))

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      // Revalidate every 24 hours to keep data relatively fresh
      next: { revalidate: 86400 } 
    })

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()
    
    const validated = GovApiResponseSchema.parse(data)

    if (!validated.success || validated.result.records.length === 0) {
      return null
    }
    
    const record = validated.result.records[0]
    return mapGovRecordToVehicleInput(record)
  } catch (error) {
    console.error('Error fetching vehicle data:', error)
    throw error
  }
}
