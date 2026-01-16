'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, RefreshCw, CheckCircle2, AlertCircle, X } from 'lucide-react'

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  // אימות בצד הלקוח
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'שם הוא שדה חובה'
        if (value.trim().length < 2) return 'שם חייב להכיל לפחות 2 תווים'
        if (value.length > 100) return 'שם לא יכול להכיל יותר מ-100 תווים'
        if (!/^[\u0590-\u05FFa-zA-Z\s'-]+$/.test(value)) {
          return 'שם יכול להכיל רק אותיות עבריות, אנגליות, רווחים, מקפים וגרשיים'
        }
        break
      case 'email':
        if (!value.trim()) return 'אימייל הוא שדה חובה'
        if (value.length > 255) return 'אימייל לא יכול להכיל יותר מ-255 תווים'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'אימייל לא תקין'
        break
      case 'phone':
        if (value && value.length > 20) return 'טלפון לא יכול להכיל יותר מ-20 תווים'
        if (value && !/^[\d\s\-\(\)\+]*$/.test(value)) {
          return 'טלפון יכול להכיל רק ספרות, רווחים, מקפים, סוגריים וסימן פלוס'
        }
        break
      case 'subject':
        if (!value.trim()) return 'נושא הוא שדה חובה'
        if (value.trim().length < 3) return 'נושא חייב להכיל לפחות 3 תווים'
        if (value.length > 200) return 'נושא לא יכול להכיל יותר מ-200 תווים'
        break
      case 'message':
        if (!value.trim()) return 'הודעה היא שדה חובה'
        if (value.trim().length < 10) return 'הודעה חייבת להכיל לפחות 10 תווים'
        if (value.length > 5000) return 'הודעה לא יכולה להכיל יותר מ-5000 תווים'
        break
    }
    return undefined
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    // אימות בזמן אמת
    if (errors[name as keyof FormErrors]) {
      const error = validateField(name, value)
      setErrors({
        ...errors,
        [name]: error,
      })
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors({
      ...errors,
      [name]: error,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('idle')
    setSubmitMessage('')
    
    // אימות כל השדות
    const newErrors: FormErrors = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        newErrors[key as keyof FormErrors] = error
      }
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSubmitStatus('error')
      setSubmitMessage('אנא תקן את השגיאות בטופס')
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (data.ok) {
        setSubmitStatus('success')
        setSubmitMessage(data.message || 'ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        
        // הסתרת הודעת הצלחה אחרי 5 שניות
        setTimeout(() => {
          setSubmitStatus('idle')
          setSubmitMessage('')
        }, 5000)
      } else {
        setSubmitStatus('error')
        setSubmitMessage(data.error || 'שגיאה בשליחת ההודעה. אנא נסה שוב.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full bg-grid-pattern">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-bold mb-6 border border-blue-100 dark:border-blue-800">
            <Mail className="w-4 h-4" />
            <span>צור קשר</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#121417] dark:text-white tracking-tight leading-[1.1] mb-6">
            צור
            <span className="text-primary relative inline-block mr-2">
              קשר
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300/50 -z-10" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8"></path>
              </svg>
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            יש לך שאלה או בקשה? אנחנו כאן לעזור. מלא את הטופס ונחזור אליך בהקדם.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#121417] dark:text-white mb-1">אימייל</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">info@checkcar.co.il</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#121417] dark:text-white mb-1">טלפון</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">1-800-CHECKCAR</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#121417] dark:text-white mb-1">כתובת</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">תל אביב, ישראל</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-[#252a33] border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#121417] dark:text-white">שלח לנו הודעה</CardTitle>
              </CardHeader>
              <CardContent>
                {/* הודעת הצלחה/שגיאה */}
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        {submitMessage}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSubmitStatus('idle')
                        setSubmitMessage('')
                      }}
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        {submitMessage}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSubmitStatus('idle')
                        setSubmitMessage('')
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#121417] dark:text-white">
                        שם מלא <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-[#121417] dark:text-white ${
                          errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''
                        }`}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#121417] dark:text-white">
                        אימייל <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-[#121417] dark:text-white ${
                          errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
                        }`}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#121417] dark:text-white">טלפון</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-[#121417] dark:text-white ${
                          errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-[#121417] dark:text-white">
                        נושא <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-[#121417] dark:text-white ${
                          errors.subject ? 'border-red-500 focus-visible:ring-red-500' : ''
                        }`}
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#121417] dark:text-white">
                      הודעה <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      rows={6}
                      className={`bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-[#121417] dark:text-white ${
                        errors.message ? 'border-red-500 focus-visible:ring-red-500' : ''
                      }`}
                    />
                    <div className="flex items-start justify-between">
                      {errors.message && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mr-auto">
                        {formData.message.length}/5000 תווים
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto h-12 px-8 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg shadow-lg shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        שולח...
                      </>
                    ) : (
                      <>
                        <span>שלח הודעה</span>
                        <Send className="h-5 w-5 rtl:rotate-180" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
