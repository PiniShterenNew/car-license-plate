import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Eye, Database } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="w-full bg-grid-pattern">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-bold mb-6 border border-blue-100 dark:border-blue-800">
            <Shield className="w-4 h-4" />
            <span>מדיניות פרטיות</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#121417] dark:text-white tracking-tight leading-[1.1] mb-6">
            מדיניות
            <span className="text-primary relative inline-block mr-2">
              פרטיות
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300/50 -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
              </svg>
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            CheckCar מחויבת להגנה על פרטיותך. מדיניות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע שלך.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white flex items-center gap-2">
                <Database className="w-6 h-6 text-primary" />
                איסוף מידע
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  אנו אוספים מידע מוגבל בלבד:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>מזהה משתמש אנונימי (Visitor ID) הנשמר בעוגיה לצורך מעקב אחר חיפושים</li>
                  <li>מספרי רישוי שחיפשת לצורך שמירת היסטוריית חיפושים</li>
                  <li>מידע טכני בסיסי (User Agent, IP Hash) למטרות אבטחה</li>
                </ul>
                <p>
                  אנו לא אוספים מידע אישי מזהה כגון שם, כתובת, מספר טלפון או פרטי תשלום.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white flex items-center gap-2">
                <Eye className="w-6 h-6 text-primary" />
                שימוש במידע
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>המידע שאנו אוספים משמש למטרות הבאות:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>מתן שירות בדיקת מידע על רכב</li>
                  <li>שמירת היסטוריית חיפושים אישית</li>
                  <li>שיפור השירות והביצועים</li>
                  <li>ניתוח סטטיסטיקות שימוש כלליות</li>
                  <li>מניעת שימוש לרעה והגנה על האתר</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                הגנה על מידע
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  אנו משתמשים באמצעי אבטחה מתקדמים להגנה על המידע שלך:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>הצפנת תקשורת (HTTPS)</li>
                  <li>הגנה מפני התקפות אבטחה נפוצות</li>
                  <li>גיבוי קבוע של הנתונים</li>
                  <li>גישה מוגבלת למידע רק לאנשים מורשים</li>
                </ul>
                <p>
                  עם זאת, אין שיטת אבטחה מושלמת, ואנו לא יכולים להבטיח אבטחה מוחלטת.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">שיתוף מידע</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                אנו לא מוכרים, משכירים או חושפים את המידע שלך לצדדים שלישיים. אנו עשויים לשתף מידע אנונימי וכללי למטרות סטטיסטיות בלבד, ללא זיהוי אישי.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">עוגיות</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                אנו משתמשים בעוגיות (Cookies) לשמירת מזהה משתמש אנונימי ולשמירת העדפותיך. אתה יכול להגדיר את הדפדפן שלך לדחות עוגיות, אך זה עלול להשפיע על תפקוד השירות.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">זכויותיך</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>לפי חוק הגנת הפרטיות, יש לך זכות:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>לבקש גישה למידע האישי שלך</li>
                  <li>לבקש תיקון או מחיקה של מידע</li>
                  <li>להתנגד לעיבוד המידע שלך</li>
                  <li>לבקש העברה של המידע</li>
                </ul>
                <p>
                  למימוש זכויותיך, אנא צור איתנו קשר דרך עמוד <a href="/contact" className="text-primary hover:underline">צור קשר</a>.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">שינויים במדיניות</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                אנו שומרים לעצמנו את הזכות לעדכן את מדיניות הפרטיות בכל עת. שינויים משמעותיים יפורסמו באתר. המשך השימוש בשירות לאחר שינויים מהווה הסכמה למדיניות המעודכנת.
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
