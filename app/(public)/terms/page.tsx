import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Scale } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="w-full bg-grid-pattern">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-bold mb-6 border border-blue-100 dark:border-blue-800">
            <Scale className="w-4 h-4" />
            <span>תנאי שימוש</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#121417] dark:text-white tracking-tight leading-[1.1] mb-6">
            תנאי
            <span className="text-primary relative inline-block mr-2">
              שימוש
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300/50 -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
              </svg>
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            אנא קרא בעיון את תנאי השימוש לפני השימוש בשירות CheckCar.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">1. הסכמה לתנאים</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                על ידי גישה לשירות CheckCar ושימוש בו, אתה מסכים להיות כפוף לתנאי השימוש הללו. אם אינך מסכים לתנאים אלה, אנא אל תשתמש בשירות.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">2. שימוש בשירות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  CheckCar מספקת שירות לבדיקת מידע על רכב ישראלי באמצעות מספר הרישוי. המידע מסופק למטרות מידע בלבד ואינו מהווה ייעוץ משפטי או מקצועי.
                </p>
                <p>
                  אתה מסכים להשתמש בשירות רק למטרות חוקיות ולכבד את כל החוקים והתקנות החלים.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">3. דיוק המידע</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                אנו משתדלים לספק מידע מדויק ומעודכן, אך איננו יכולים להבטיח שהמידע המוצג הוא מדויק, שלם או מעודכן. המידע נמשך ממאגרי הנתונים הממשלתיים ואנו לא אחראים לכל שגיאות או אי-דיוקים.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">4. הגבלת אחריות</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                CheckCar מסופקת "כפי שהיא" ללא כל אחריות מפורשת או משתמעת. אנו לא נהיה אחראים לכל נזק ישיר, עקיף, מקרי או תוצאתי הנובע משימוש או אי-יכולת להשתמש בשירות.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">5. שינויים בתנאים</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                אנו שומרים לעצמנו את הזכות לעדכן או לשנות את תנאי השימוש בכל עת. שינויים ייכנסו לתוקף מייד עם פרסומם באתר. המשך השימוש בשירות לאחר שינויים מהווה הסכמה לתנאים המעודכנים.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">6. צור קשר</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                אם יש לך שאלות לגבי תנאי השימוש, אנא צור איתנו קשר דרך עמוד <a href="/contact" className="text-primary hover:underline">צור קשר</a>.
              </p>
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
