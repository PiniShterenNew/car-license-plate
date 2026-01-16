import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, Zap, Lock, Info, CheckCircle2, Search, FileText, CalendarCheck, History } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="w-full bg-grid-pattern">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-bold mb-6 border border-blue-100 dark:border-blue-800">
            <Info className="w-4 h-4" />
            <span>אודות CheckCar</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#121417] dark:text-white tracking-tight leading-[1.1] mb-6">
            אודות
            <span className="text-primary relative inline-block mr-2">
              CheckCar
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300/50 -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
              </svg>
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            CheckCar היא מערכת מתקדמת לבדיקת מידע על רכב ישראלי באמצעות מספר הרישוי.
            כל המידע מגיע ממאגר הנתונים הרשמי של משרד התחבורה.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 mb-16">
          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">מי אנחנו</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                CheckCar מספקת שירות מהיר ואמין לבדיקת מידע על רכב ישראלי. המערכת שלנו מתחברת ישירות למאגרי המידע הממשלתיים ומספקת מידע מדויק ומעודכן בזמן אמת.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">מה אנחנו מציעים</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <Search className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>בדיקת מידע רכב לפי מספר רישוי</span>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>מידע מפורט על הרכב כולל מפרט טכני</span>
                </li>
                <li className="flex items-start gap-3">
                  <CalendarCheck className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>תוקף רישיון ובדיקות אחרונות</span>
                </li>
                <li className="flex items-start gap-3">
                  <History className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>היסטוריית חיפושים אישית</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-background-light dark:bg-[#252a33] hover:shadow-md transition-shadow duration-300">
            <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#121417] dark:text-white mb-2">מידע רשמי ומאומת</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                הנתונים שלנו נמשכים בזמן אמת ישירות ממאגרי משרד התחבורה ורשות הרישוי.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-background-light dark:bg-[#252a33] hover:shadow-md transition-shadow duration-300">
            <div className="size-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#121417] dark:text-white mb-2">תוצאות תוך שניות</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                המערכת שלנו מעבדת את הבקשה ומפיקה דוח רכב מקיף באופן מיידי.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-background-light dark:bg-[#252a33] hover:shadow-md transition-shadow duration-300">
            <div className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#121417] dark:text-white mb-2">פרטיות ואבטחה</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                החיפושים שלך אנונימיים ומוצפנים. אנחנו מחויבים לסטנדרטים הגבוהים ביותר של אבטחת מידע.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
