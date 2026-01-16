import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Map, Home, Search, FileText, Mail, Info, Scale, Shield, Accessibility } from 'lucide-react'

export default function SitemapPage() {
  const mainPages = [
    { href: '/', label: 'דף הבית', icon: Home, description: 'עמוד הבית - חיפוש מידע על רכב' },
    { href: '/history', label: 'היסטוריה', icon: Search, description: 'היסטוריית חיפושים אישית' },
    { href: '/about', label: 'אודות', icon: Info, description: 'מידע על CheckCar' },
    { href: '/contact', label: 'צור קשר', icon: Mail, description: 'יצירת קשר עם הצוות' },
  ]

  const legalPages = [
    { href: '/terms', label: 'תנאי שימוש', icon: Scale, description: 'תנאי השימוש של השירות' },
    { href: '/privacy', label: 'מדיניות פרטיות', icon: Shield, description: 'מדיניות הפרטיות והגנת המידע' },
    { href: '/accessibility', label: 'נגישות', icon: Accessibility, description: 'מדיניות נגישות האתר' },
    { href: '/sitemap', label: 'מפת אתר', icon: Map, description: 'מפת האתר המלאה' },
  ]

  return (
    <div className="w-full bg-grid-pattern">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-bold mb-6 border border-blue-100 dark:border-blue-800">
            <Map className="w-4 h-4" />
            <span>מפת אתר</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#121417] dark:text-white tracking-tight leading-[1.1] mb-6">
            מפת
            <span className="text-primary relative inline-block mr-2">
              אתר
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300/50 -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
              </svg>
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            גלה את כל העמודים והפונקציות הזמינות ב-CheckCar.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">עמודים ראשיים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mainPages.map((page) => {
                  const IconComponent = page.icon
                  return (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-colors group"
                    >
                      <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#121417] dark:text-white mb-1 group-hover:text-primary transition-colors">
                          {page.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{page.description}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">מידע משפטי</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {legalPages.map((page) => {
                  const IconComponent = page.icon
                  return (
                    <Link
                      key={page.href}
                      href={page.href}
                      className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-colors group"
                    >
                      <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#121417] dark:text-white mb-1 group-hover:text-primary transition-colors">
                          {page.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{page.description}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">פונקציות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <div>
                  <h3 className="font-bold text-[#121417] dark:text-white mb-2">חיפוש רכב</h3>
                  <p>הזן מספר רישוי (7 או 8 ספרות) כדי לקבל מידע מפורט על הרכב, כולל מפרט טכני, תוקף רישיון, בדיקות אחרונות ועוד.</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#121417] dark:text-white mb-2">היסטוריית חיפושים</h3>
                  <p>צפה בכל החיפושים שביצעת, שמור חיפושים מועדפים וייצא את ההיסטוריה לקובץ CSV.</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#121417] dark:text-white mb-2">יצירת קשר</h3>
                  <p>שלח לנו הודעה דרך טופס יצירת קשר. נשתדל לענות בהקדם האפשרי.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>תאריך עדכון אחרון: {new Date().toLocaleDateString('he-IL')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
