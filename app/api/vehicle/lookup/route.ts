import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { normalizePlate, formatPlate, isValidPlate } from '@/lib/plates'
import { fetchVehicleData } from '@/lib/govApi'
import { db } from '@/lib/db'
import { getOrCreateVisitorId, updateVisitorLastSeen } from '@/lib/visitor'
import { LicenseStatus } from '@prisma/client'

const LookupSchema = z.object({
  plate: z.string().min(1),
})

const CACHE_DURATION_MS = 6 * 60 * 60 * 1000 // 6 hours

function getLicenseStatus(licenseValidUntil: Date | null): LicenseStatus {
  if (!licenseValidUntil) return 'UNKNOWN'
  const now = new Date()
  if (licenseValidUntil > now) return 'VALID'
  return 'EXPIRED'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plate } = LookupSchema.parse(body)

    const normalized = normalizePlate(plate)
    if (!isValidPlate(normalized)) {
      return NextResponse.json(
        { ok: false, error: 'מספר רישוי לא תקין' },
        { status: 400 }
      )
    }
    const visitorId = await getOrCreateVisitorId()
    await updateVisitorLastSeen(visitorId)

    const startTime = Date.now()

    // Check cache
    let vehicle = await db.vehicle.findUnique({
      where: { plateNormalized: normalized },
    })
    let shouldFetch = true
    if (vehicle) {
      const cacheAge = Date.now() - vehicle.lastFetchedAt.getTime()
      if (cacheAge < CACHE_DURATION_MS) {
        shouldFetch = false
      }
    }

    // Fetch from API if needed
    if (shouldFetch) {
    
      
      try {
        const vehicleData = await fetchVehicleData(normalized)
        // 
        if (!vehicleData) {
          // Don't save NOT_FOUND searches to history
          return NextResponse.json({
            ok: false,
            error: 'רכב לא נמצא במאגר',
          })
        }

        // Upsert vehicle
        vehicle = await db.vehicle.upsert({
          where: { plateNormalized: normalized },
          create: {
            plateNormalized: normalized,
            plateFormatted: formatPlate(normalized),
            manufacturer: vehicleData.manufacturer,
            modelName: vehicleData.modelName,
            year: vehicleData.year,
            trimLevel: vehicleData.trimLevel,
            ownership: vehicleData.ownership,
            licenseValidUntil: vehicleData.licenseValidUntil,
            lastTestDate: vehicleData.lastTestDate,
            color: vehicleData.color,
            safetyLevel: vehicleData.safetyLevel,
            pollutionGroup: vehicleData.pollutionGroup,
            engineModel: vehicleData.engineModel,
            vehicleType: vehicleData.vehicleType,
            frontTire: vehicleData.frontTire,
            rearTire: vehicleData.rearTire,
            fuelType: vehicleData.fuelType,
            roadDate: vehicleData.roadDate,
            commercialName: vehicleData.commercialName,
            lastFetchedAt: new Date(),
          },
          update: {
            manufacturer: vehicleData.manufacturer,
            modelName: vehicleData.modelName,
            year: vehicleData.year,
            trimLevel: vehicleData.trimLevel,
            ownership: vehicleData.ownership,
            licenseValidUntil: vehicleData.licenseValidUntil,
            lastTestDate: vehicleData.lastTestDate,
            color: vehicleData.color,
            safetyLevel: vehicleData.safetyLevel,
            pollutionGroup: vehicleData.pollutionGroup,
            engineModel: vehicleData.engineModel,
            vehicleType: vehicleData.vehicleType,
            frontTire: vehicleData.frontTire,
            rearTire: vehicleData.rearTire,
            fuelType: vehicleData.fuelType,
            roadDate: vehicleData.roadDate,
            commercialName: vehicleData.commercialName,
            lastFetchedAt: new Date(),
          },
        })
      } catch (error) {
        console.error('Error fetching vehicle data:', error)
        // Handle ZodError specifically
        if (error instanceof z.ZodError) {
          console.error('Zod validation error in fetchVehicleData:', {
            errors: error.errors,
            normalizedPlate: normalized,
          })
          
          const responseMs = Date.now() - startTime
          await db.searchEvent.create({
            data: {
              visitorId,
              plateNormalized: normalized,
              plateFormatted: formatPlate(normalized),
              resultStatus: 'ERROR',
              licenseStatus: 'UNKNOWN',
              responseMs,
              userAgent: request.headers.get('user-agent') || undefined,
            },
          })

          return NextResponse.json(
            { ok: false, error: 'שגיאה בעיבוד נתונים מהשרת' },
            { status: 400 }
          )
        }

        const responseMs = Date.now() - startTime
        await db.searchEvent.create({
          data: {
            visitorId,
            plateNormalized: normalized,
            plateFormatted: formatPlate(normalized),
            resultStatus: 'ERROR',
            licenseStatus: 'UNKNOWN',
            responseMs,
            userAgent: request.headers.get('user-agent') || undefined,
          },
        })

        return NextResponse.json(
          { ok: false, error: 'שגיאה בקבלת נתונים מהשרת' },
          { status: 500 }
        )
      }
    }

    if (!vehicle) {
      return NextResponse.json(
        { ok: false, error: 'רכב לא נמצא' },
        { status: 404 }
      )
    }

    const responseMs = Date.now() - startTime
    const licenseStatus = getLicenseStatus(vehicle.licenseValidUntil)

    // Log search event
    await db.searchEvent.create({
      data: {
        visitorId,
        vehicleId: vehicle.id,
        plateNormalized: normalized,
        plateFormatted: formatPlate(normalized),
        resultStatus: 'FOUND',
        licenseStatus,
        responseMs,
        userAgent: request.headers.get('user-agent') || undefined,
      },
    })

    return NextResponse.json({
      ok: true,
      vehicle: {
        id: vehicle.id,
        plateFormatted: vehicle.plateFormatted,
        manufacturer: vehicle.manufacturer,
        modelName: vehicle.modelName,
        year: vehicle.year,
        trimLevel: vehicle.trimLevel,
        ownership: vehicle.ownership,
        licenseValidUntil: vehicle.licenseValidUntil,
        lastTestDate: vehicle.lastTestDate,
        color: vehicle.color,
        safetyLevel: vehicle.safetyLevel,
        pollutionGroup: vehicle.pollutionGroup,
        engineModel: vehicle.engineModel,
        vehicleType: vehicle.vehicleType,
        commercialName: vehicle.commercialName,
        licenseStatus,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: 'פורמט בקשה לא תקין' },
        { status: 400 }
      )
    }

    console.error('Vehicle lookup error:', error)
    return NextResponse.json(
      { ok: false, error: 'שגיאה פנימית' },
      { status: 500 }
    )
  }
}
