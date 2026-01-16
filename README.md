# CheckCarIL

מערכת לבדיקת מידע על רכב ישראלי לפי מספר רישוי באמצעות מאגר הנתונים הרשמי של הממשלה.

## התקנה

1. התקן את התלויות:
```bash
npm install
```

2. הגדר משתני סביבה ב-`.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/checkcaril?schema=public"
ADMIN_KEY="your-secure-admin-key-here"
NEXT_PUBLIC_APP_NAME="CheckCarIL"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

3. הכן את בסיס הנתונים:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. הפעל את השרת:
```bash
npm run dev
```

האפליקציה תהיה זמינה בכתובת [http://localhost:3000](http://localhost:3000)

## מבנה הפרויקט

- `app/` - דפים ונתיבי API (Next.js App Router)
- `components/` - רכיבי UI
- `lib/` - לוגיקה עסקית ומודולים שימושיים
- `prisma/` - סכמת בסיס הנתונים
- `middleware.ts` - middleware לטיפול במעקב מבקרים והגנת דפי מנהל

## תכונות

### למשתמשים
- חיפוש רכב לפי מספר רישוי (7 או 8 ספרות)
- הצגת מידע מפורט על הרכב כולל מפרט טכני מלא
- היסטוריית חיפושים אישית
- ייצוא CSV של היסטוריית חיפושים
- ממשק נגיש ומותאם למובייל
- תמיכה ב-RTL מלא

### למנהלים
- לוח בקרה עם סטטיסטיקות בזמן אמת
- יומני חיפוש מפורטים
- מעקב מודעות והכנסות
- ניהול הודעות קשר
- הגדרות מערכת

### תכונות נוספות
- טופס יצירת קשר עם אימות חזק
- עמודי מידע: אודות, תנאי שימוש, מדיניות פרטיות, נגישות, מפת אתר
- עמוד 404 מותאם
- הגנת אבטחה מפני XSS ו-SQL injection
- Rate limiting למניעת spam

## טכנולוגיות

- Next.js 14 (App Router)
- TypeScript
- PostgreSQL
- Prisma ORM
- Tailwind CSS
- shadcn/ui
- Recharts

## רישיון

כל הזכויות שמורות.
