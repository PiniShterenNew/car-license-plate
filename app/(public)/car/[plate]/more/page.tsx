import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { normalizePlate, formatPlate, formatPlateWithDashes } from '@/lib/plates'
import Link from 'next/link'
import { ChevronRight, Info, ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ plate: string }>
  searchParams: Promise<{ from?: string }>
}

export default async function VehicleMorePage({ params, searchParams }: PageProps) {
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

  const additionalSpecs = [
    { label: 'כינוי מסחרי', value: vehicle.commercialName || 'לא זמין' },
    { label: 'מקור הנתונים', value: 'מאגר כלי רכב פרטיים ומסחריים (data.gov.il)' },
    { label: 'עודכן לאחרונה', value: new Date(vehicle.lastFetchedAt).toLocaleString('he-IL') },
    { label: 'מספר רכב (פנימי)', value: vehicle.plateNormalized },
    { label: 'מזהה מערכת', value: vehicle.id },
  ]

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
        <Link href={`/car/${normalized}${fromHistory ? '?from=history' : ''}`} className="hover:text-primary transition-colors">
          תוצאות עבור: {fromHistory ? formattedWithDashes : formatted}
        </Link>
        <ChevronRight className="w-4 h-4 rotate-180" />
        <span className="font-medium text-[#121417] dark:text-white">נתונים נוספים</span>
      </div>

      <section className="bg-white dark:bg-[#22262e] rounded-xl shadow-card overflow-hidden border border-gray-100 dark:border-gray-800 mb-8">
        <div className="h-1.5 w-full bg-gradient-to-l from-primary via-blue-400 to-primary"></div>
        <div className="p-6 md:p-8">
          <h1 className="text-2xl font-bold text-[#121417] dark:text-white mb-6">
            נתונים טכניים נוספים
          </h1>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {additionalSpecs.map((spec, index) => (
                <div key={index} className="flex flex-col p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">{spec.label}</span>
                  <span className="font-semibold text-[#121417] dark:text-white break-all">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex gap-3">
              <Info className="w-5 h-5 text-primary" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-bold mb-1">אודות המידע המוצג</p>
                <p>
                  הנתונים נלקחים בזמן אמת ממאגרי המידע הממשלתיים. המערכת שומרת עותק מקומי (Cache) למשך 24 שעות לשיפור הביצועים.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link 
              href={`/car/${normalized}${fromHistory ? '?from=history' : ''}`}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
            >
              <ArrowLeft className="w-5 h-5" />
              חזרה לסיכום הרכב
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
