import { AdSlot } from '@/components/ads/AdSlot'
import { HeroSearchBox } from '@/components/ui/hero-search-box'
import { BadgeCheck, ShieldCheck, Zap, FileCheck } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex-grow flex flex-col items-center w-full bg-grid-pattern">
      {/* Hero Section */}
      <section className="w-full max-w-4xl px-4 pt-16 pb-12 sm:pt-24 sm:pb-16 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-bold mb-6 border border-blue-100 dark:border-blue-800">
          <BadgeCheck className="w-4 h-4" />
          <span>מחובר למאגר משרד התחבורה</span>
        </div>

        {/* Headlines */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#121417] dark:text-white tracking-tight leading-[1.1] mb-6">
          בדיקת רכב לפי <br className="hidden sm:block" />
          <span className="text-primary relative inline-block">
            מספר רישוי
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300/50 -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
              <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
            </svg>
          </span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-12 font-normal leading-relaxed">
          קבל את כל המידע הרשמי, היסטוריית בעלויות, שעבודים וקילומטראז' בשניות.
          <span className="hidden sm:inline"> השירות אמין, מהיר ומדויק.</span>
        </p>

        {/* Search Component */}
        <HeroSearchBox />
      </section>

      {/* Trust Indicators */}
      <section className="w-full bg-white dark:bg-[#1f232b] border-y border-[#f0f2f4] dark:border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-background-light dark:bg-[#252a33] hover:shadow-md transition-shadow duration-300">
              <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center">
                <FileCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#121417] dark:text-white mb-2">מידע רשמי ומאומת</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  הנתונים שלנו נמשכים בזמן אמת ישירות ממאגרי משרד התחבורה ורשות הרישוי. אמינות ללא פשרות.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-background-light dark:bg-[#252a33] hover:shadow-md transition-shadow duration-300">
              <div className="size-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#121417] dark:text-white mb-2">תוצאות תוך שניות</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  אין צורך להמתין. המערכת החכמה שלנו מעבדת את הבקשה ומפיקה דוח רכב מקיף באופן מיידי.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-background-light dark:bg-[#252a33] hover:shadow-md transition-shadow duration-300">
              <div className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#121417] dark:text-white mb-2">פרטיות ואבטחה</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  אנחנו מחויבים לסטנדרטים הגבוהים ביותר של אבטחת מידע. החיפושים שלך אנונימיים ומוצפנים.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Placeholder */}
      <section className="w-full max-w-5xl mx-auto px-4 py-16">
        <AdSlot slotKey="home-banner" pagePath="/" variant="banner" />
      </section>
    </div>
  )
}
