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

## העלאת המסד נתונים ל-Neon

Neon הוא שירות PostgreSQL מבוסס cloud. להעלאת המסד:

### שלב 1: יצירת חשבון ב-Neon

1. היכנס ל-[https://neon.tech](https://neon.tech)
2. לחץ על "Sign Up" ויצור חשבון (ניתן להתחבר עם GitHub)
3. לאחר ההתחברות, לחץ על "Create Project"

### שלב 2: יצירת Project חדש

1. בחר שם ל-Project (למשל: `checkcar-production`)
2. בחר Region קרוב (למשל: `AWS eu-central-1` - פרנקפורט)
3. בחר גרסת PostgreSQL (מומלץ: `PostgreSQL 16`)
4. לחץ על "Create Project"

### שלב 3: קבלת Connection String

1. לאחר יצירת ה-Project, תועבר לדף ה-Dashboard
2. תחת "Connection Details", תראה את ה-Connection String
3. לחץ על "Copy" כדי להעתיק את ה-Connection String
4. ה-Connection String נראה כך:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

### שלב 4: עדכון משתני הסביבה

עדכן את קובץ `.env.local` עם ה-Connection String מ-Neon:

```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"
ADMIN_KEY="your-secure-admin-key-here"
NEXT_PUBLIC_APP_NAME="CheckCarIL"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**חשוב:** הוסף את הפרמטר `?sslmode=require` בסוף ה-Connection String כדי לאפשר חיבור מאובטח.

### שלב 5: הרצת המיגרציות על Neon

1. ודא שהחיבור למסד המקומי עובד:
   ```bash
   npx prisma db pull
   ```

2. צור את כל המיגרציות:
   ```bash
   npx prisma migrate dev --name init
   ```

3. או אם יש לך מיגרציות קיימות, הרץ:
   ```bash
   npx prisma migrate deploy
   ```

4. ודא שהמיגרציות הוחלו:
   ```bash
   npx prisma db push
   ```

5. צור את Prisma Client:
   ```bash
   npx prisma generate
   ```

### שלב 6: בדיקת החיבור

הרץ את השרת ובדוק שהכל עובד:
```bash
npm run dev
```

### הערות חשובות:

- **SSL חובה:** Neon דורש חיבור מאובטח (SSL), לכן חשוב להוסיף `?sslmode=require`
- **Connection Pooling:** אם אתה משתמש ב-Connection Pooling, השתמש ב-Connection String עם `-pooler` בסוף
- **Backup:** Neon מספק גיבויים אוטומטיים, אך מומלץ גם ליצור גיבויים ידניים
- **Environment Variables:** ב-production, השתמש ב-Environment Variables של הפלטפורמה (Vercel, Railway וכו')

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

## העלאת המסד נתונים ל-Neon

למדריך מפורט, ראה [docs/NEON_SETUP.md](docs/NEON_SETUP.md)

### סיכום מהיר:

1. **צור חשבון ב-Neon:** [https://neon.tech](https://neon.tech)
2. **צור Project חדש** עם PostgreSQL 16
3. **העתק את ה-Connection String** מה-Dashboard
4. **עדכן את `.env.local`:**
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"
   ```
5. **הרץ מיגרציות:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

**חשוב:** הוסף `?sslmode=require` ל-Connection String!

## רישיון

כל הזכויות שמורות.
