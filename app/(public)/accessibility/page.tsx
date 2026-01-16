import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accessibility, Keyboard, Eye, Volume2 } from 'lucide-react'

export default function AccessibilityPage() {
  return (
    <div className="w-full bg-grid-pattern">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-bold mb-6 border border-blue-100 dark:border-blue-800">
            <Accessibility className="w-4 h-4" />
            <span>נגישות</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#121417] dark:text-white tracking-tight leading-[1.1] mb-6">
            נגישות
            <span className="text-primary relative inline-block mr-2">
              לאתר
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300/50 -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
              </svg>
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            CheckCar מחויבת לספק שירות נגיש לכל המשתמשים, ללא קשר ליכולותיהם.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white flex items-center gap-2">
                <Accessibility className="w-6 h-6 text-primary" />
                מחויבות לנגישות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                CheckCar מחויבת לספק שירות נגיש לכולם. אנו פועלים בהתאם לתקן WCAG 2.1 רמה AA ומשתדלים לשפר את הנגישות באופן מתמיד.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white flex items-center gap-2">
                <Keyboard className="w-6 h-6 text-primary" />
                ניווט במקלדת
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>כל הפונקציות באתר נגישות באמצעות מקלדת:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>ניתן לנווט בין כל הקישורים והכפתורים באמצעות Tab</li>
                  <li>ניתן להפעיל כפתורים באמצעות Enter או Space</li>
                  <li>ניתן לסגור תפריטים ודיאלוגים באמצעות Esc</li>
                  <li>ניתן לנווט בטופסים באמצעות Tab ו-Shift+Tab</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white flex items-center gap-2">
                <Eye className="w-6 h-6 text-primary" />
                תמיכה בקוראי מסך
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>האתר תומך בקוראי מסך כגון NVDA, JAWS ו-VoiceOver:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>כל התמונות כוללות טקסט חלופי (alt text)</li>
                  <li>כל הטופסים כוללים תוויות ברורות</li>
                  <li>המבנה הסמנטי של העמודים מאפשר ניווט קל</li>
                  <li>הודעות שגיאה והצלחה מוכרזות בקוראי מסך</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white flex items-center gap-2">
                <Volume2 className="w-6 h-6 text-primary" />
                תמיכה ב-RTL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                האתר תומך מלא בכיוון RTL (מימין לשמאל) עבור עברית וערבית, כולל תמיכה מלאה בטקסט דו-כיווני.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">צבעים וניגודיות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  האתר עומד בדרישות ניגודיות צבעים:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>ניגודיות מינימלית של 4.5:1 לטקסט רגיל</li>
                  <li>ניגודיות מינימלית של 3:1 לטקסט גדול</li>
                  <li>מידע לא מועבר רק באמצעות צבע</li>
                  <li>תמיכה במצב כהה (Dark Mode)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">גודל טקסט</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                ניתן להגדיל את הטקסט באתר באמצעות הגדרות הדפדפן (Ctrl/Cmd + Plus) או באמצעות הגדרות הנגישות של הדפדפן. האתר תומך בהגדלה עד 200% ללא אובדן פונקציונליות.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">דיווח על בעיות נגישות</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                אם נתקלת בבעיית נגישות באתר, אנא צור איתנו קשר דרך עמוד <a href="/contact" className="text-primary hover:underline">צור קשר</a>. נשתדל לטפל בבעיה בהקדם האפשרי.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">שיפורים עתידיים</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                אנו ממשיכים לשפר את הנגישות של האתר באופן קבוע. אם יש לך הצעות לשיפורים, נשמח לשמוע אותן.
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
