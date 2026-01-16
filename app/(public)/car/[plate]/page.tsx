import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { normalizePlate, formatPlate, formatPlateWithDashes } from '@/lib/plates'
import { VehicleSummaryCardNew } from '@/components/vehicle/VehicleSummaryCardNew'
import { VehicleSpecGrid } from '@/components/vehicle/VehicleSpecGrid'
import { QuickStatsStrip } from '@/components/vehicle/QuickStatsStrip'
import { AdSlot } from '@/components/ads/AdSlot'
import Link from 'next/link'
import { LicenseStatus } from '@prisma/client'
import { ArrowLeft, RefreshCw, ChevronRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ plate: string }>
  searchParams: Promise<{ from?: string }>
}

function getLicenseStatus(licenseValidUntil: Date | null): LicenseStatus {
  if (!licenseValidUntil) return 'UNKNOWN'
  const now = new Date()
  if (licenseValidUntil > now) return 'VALID'
  return 'EXPIRED'
}

function getDaysUntilExpiry(licenseValidUntil: Date | null): number | null {
  if (!licenseValidUntil) return null
  
  // Create dates in local timezone to avoid timezone issues
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  const targetDate = new Date(licenseValidUntil)
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
  
  const diff = target.getTime() - today.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days < 0) return 0 // Expired
  return days
}

export default async function VehiclePage({ params, searchParams }: PageProps) {
  const { plate } = await params
  const { from } = await searchParams
  const normalized = normalizePlate(plate)
  const formatted = formatPlate(normalized)
  const formattedWithDashes = formatPlateWithDashes(normalized)
  const fromHistory = from === 'history'

  const vehicle = await db.vehicle.findUnique({
    where: { plateNormalized: normalized },
  })

  if (!vehicle) {
    notFound()
  }

  const licenseStatus = getLicenseStatus(vehicle.licenseValidUntil)
  const daysUntilExpiry = getDaysUntilExpiry(vehicle.licenseValidUntil)

  return (
    <main className="flex-1 w-full max-w-[1024px] mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-[#657586] dark:text-gray-400">
        <Link href="/" className="hover:text-primary transition-colors">דף הבית</Link>
        <ChevronRight className="w-4 h-4 rotate-180" />
        {fromHistory ? (
          <>
            <Link href="/history" className="hover:text-primary transition-colors">היסטוריה</Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
          </>
        ) : (
          <>
            <Link href="/" className="hover:text-primary transition-colors">חיפוש</Link>
            <ChevronRight className="w-4 h-4 rotate-180" />
          </>
        )}
        <span className="font-medium text-[#121417] dark:text-white">תוצאות עבור: {fromHistory ? formattedWithDashes : formatted}</span>
      </div>

      {/* Vehicle Summary Card */}
      <VehicleSummaryCardNew
        plate={normalized}
        manufacturer={vehicle.manufacturer}
        modelName={vehicle.modelName}
        commercialName={vehicle.commercialName}
        year={vehicle.year}
        licenseStatus={licenseStatus}
        ownership={vehicle.ownership}
        trimLevel={vehicle.trimLevel}
      />

      {/* Quick Stats Strip */}
      <QuickStatsStrip
        lastTestDate={vehicle.lastTestDate}
        licenseValidUntil={vehicle.licenseValidUntil}
        trimLevel={vehicle.trimLevel}
        pollutionGroup={vehicle.pollutionGroup}
        year={vehicle.year}
        roadDate={vehicle.roadDate}
      />

      {/* Insurance Ad Banner */}
      <div className="w-full flex justify-center mb-8">
        <AdSlot slotKey="vehicle-insurance" pagePath={`/car/${normalized}`} variant="banner" />
      </div>

      {/* Technical Specs */}
      <div className="mb-8">
        <VehicleSpecGrid
          manufacturer={vehicle.manufacturer}
          modelName={vehicle.modelName}
          year={vehicle.year}
          trimLevel={vehicle.trimLevel}
          safetyLevel={vehicle.safetyLevel}
          pollutionGroup={vehicle.pollutionGroup}
          ownership={vehicle.ownership}
          licenseValidUntil={vehicle.licenseValidUntil}
          lastTestDate={vehicle.lastTestDate}
          color={vehicle.color}
          engineModel={vehicle.engineModel}
          vehicleType={vehicle.vehicleType}
          commercialName={vehicle.commercialName}
          frontTire={vehicle.frontTire}
          rearTire={vehicle.rearTire}
          fuelType={vehicle.fuelType}
        />
      </div>

      {/* More Info Link */}
      <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-center">
        <Link
          href={`/car/${normalized}/more${fromHistory ? '?from=history' : ''}`}
          className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
        >
          הצג נתונים נוספים והיסטוריית בעלויות
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Footer / Timestamp */}
      <footer className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500 dark:text-gray-400">
          <RefreshCw className="w-4 h-4" />
          עודכן לאחרונה: {new Date(vehicle.lastFetchedAt).toLocaleDateString('he-IL')} בשעה {new Date(vehicle.lastFetchedAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <p className="mt-4 text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
          המידע המוצג מבוסס על מאגרי מידע ממשלתיים פתוחים. אנו עושים כמיטב יכולתנו לשמור על המידע עדכני ומדויק, אך אין לראות בו אסמכתא משפטית רשמית. למידע מחייב יש לפנות למשרד הרישוי.
        </p>
      </footer>
    </main>
  )
}
