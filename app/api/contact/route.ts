import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

// אימות חזק על כל השדות
const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'שם חייב להכיל לפחות 2 תווים')
    .max(100, 'שם לא יכול להכיל יותר מ-100 תווים')
    .regex(/^[\u0590-\u05FFa-zA-Z\s'-]+$/, 'שם יכול להכיל רק אותיות עבריות, אנגליות, רווחים, מקפים וגרשיים')
    .trim(),
  email: z
    .string()
    .min(1, 'אימייל הוא שדה חובה')
    .max(255, 'אימייל לא יכול להכיל יותר מ-255 תווים')
    .email('אימייל לא תקין')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .max(20, 'טלפון לא יכול להכיל יותר מ-20 תווים')
    .regex(/^[\d\s\-\(\)\+]*$/, 'טלפון יכול להכיל רק ספרות, רווחים, מקפים, סוגריים וסימן פלוס')
    .optional()
    .transform((val) => (val && val.trim() ? val.trim() : undefined)),
  subject: z
    .string()
    .min(3, 'נושא חייב להכיל לפחות 3 תווים')
    .max(200, 'נושא לא יכול להכיל יותר מ-200 תווים')
    .trim(),
  message: z
    .string()
    .min(10, 'הודעה חייבת להכיל לפחות 10 תווים')
    .max(5000, 'הודעה לא יכולה להכיל יותר מ-5000 תווים')
    .trim(),
})

// בדיקת תווים מסוכנים (XSS, SQL injection וכו')
function containsDangerousContent(text: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /expression\s*\(/i,
    /vbscript:/i,
    /data:text\/html/i,
    /SELECT\s+.*\s+FROM/i,
    /INSERT\s+INTO/i,
    /UPDATE\s+.*\s+SET/i,
    /DELETE\s+FROM/i,
    /DROP\s+TABLE/i,
    /UNION\s+SELECT/i,
  ]
  
  return dangerousPatterns.some((pattern) => pattern.test(text))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // אימות ראשוני עם Zod
    const validatedData = ContactFormSchema.parse(body)
    
    // בדיקת תוכן מסוכן
    if (containsDangerousContent(validatedData.name)) {
      return NextResponse.json(
        { ok: false, error: 'השם מכיל תווים לא מורשים' },
        { status: 400 }
      )
    }
    
    if (containsDangerousContent(validatedData.email)) {
      return NextResponse.json(
        { ok: false, error: 'האימייל מכיל תווים לא מורשים' },
        { status: 400 }
      )
    }
    
    if (validatedData.phone && containsDangerousContent(validatedData.phone)) {
      return NextResponse.json(
        { ok: false, error: 'הטלפון מכיל תווים לא מורשים' },
        { status: 400 }
      )
    }
    
    if (containsDangerousContent(validatedData.subject)) {
      return NextResponse.json(
        { ok: false, error: 'הנושא מכיל תווים לא מורשים' },
        { status: 400 }
      )
    }
    
    if (containsDangerousContent(validatedData.message)) {
      return NextResponse.json(
        { ok: false, error: 'ההודעה מכילה תווים לא מורשים' },
        { status: 400 }
      )
    }
    
    // בדיקת rate limiting בסיסי - מניעת spam
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const recentMessages = await db.contactMessage.count({
      where: {
        email: validatedData.email,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // שעה אחרונה
        },
      },
    })
    
    if (recentMessages >= 5) {
      return NextResponse.json(
        { ok: false, error: 'יותר מדי הודעות נשלחו מהאימייל הזה. אנא נסה שוב מאוחר יותר.' },
        { status: 429 }
      )
    }
    
    // שמירה במסד הנתונים
    const contactMessage = await db.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject,
        message: validatedData.message,
        status: 'PENDING',
      },
    })
    
    return NextResponse.json({
      ok: true,
      message: 'ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.',
      id: contactMessage.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return NextResponse.json(
        { ok: false, error: firstError?.message || 'שגיאה באימות הנתונים' },
        { status: 400 }
      )
    }
    
    console.error('Contact form error:', error)
    return NextResponse.json(
      { ok: false, error: 'שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.' },
      { status: 500 }
    )
  }
}
