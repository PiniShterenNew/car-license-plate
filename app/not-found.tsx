import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#121417] dark:text-white font-display min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="w-full bg-grid-pattern">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            {/* Page Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold mb-6 border border-red-100 dark:border-red-800">
                <span>404</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#121417] dark:text-white tracking-tight leading-[1.1] mb-6">
                עמוד לא
                <span className="text-primary relative inline-block mr-2">
                  נמצא
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300/50 -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
                  </svg>
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
                העמוד שחיפשת לא קיים או הועבר למיקום אחר.
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8 mb-16">
              <div className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl p-8 text-center">
                <div className="text-6xl font-black text-gray-300 dark:text-gray-600 mb-4">404</div>
                <h2 className="text-2xl font-bold text-[#121417] dark:text-white mb-4">
                  אופס! משהו השתבש
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  העמוד שחיפשת לא נמצא. ייתכן שהקישור שבור או שהעמוד הוסר.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    asChild
                    className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg shadow-lg shadow-primary/25 transition-all duration-200"
                  >
                    <Link href="/">
                      <Home className="w-5 h-5 ml-2" />
                      חזרה לדף הבית
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 px-8 rounded-xl border-2 font-bold text-lg"
                  >
                    <Link href="/history">
                      <Search className="w-5 h-5 ml-2" />
                      היסטוריית חיפושים
                      <ArrowRight className="w-5 h-5 mr-2 rtl:rotate-180" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Helpful Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/"
                  className="p-4 rounded-lg bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-center"
                >
                  <div className="font-bold text-[#121417] dark:text-white mb-1">דף הבית</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">חזרה לעמוד הראשי</div>
                </Link>
                <Link
                  href="/about"
                  className="p-4 rounded-lg bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-center"
                >
                  <div className="font-bold text-[#121417] dark:text-white mb-1">אודות</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">מידע על CheckCar</div>
                </Link>
                <Link
                  href="/contact"
                  className="p-4 rounded-lg bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-center"
                >
                  <div className="font-bold text-[#121417] dark:text-white mb-1">צור קשר</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">נשמח לעזור</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
