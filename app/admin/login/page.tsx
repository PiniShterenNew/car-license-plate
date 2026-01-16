'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield, BadgeCheck, AlertCircle, Loader2, LogIn, ArrowRight } from 'lucide-react'

export default function AdminLoginPage() {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })

      if (response.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('מפתח לא תקין')
      }
    } catch (err) {
      setError('שגיאה בהתחברות')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
              <Shield className="w-7 h-7" />
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black text-[#121417] dark:text-white tracking-tight">
                CheckCar
              </h1>
              <p className="text-xs text-[#657586] font-medium">ממשל זמין</p>
            </div>
          </Link>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-bold border border-blue-100 dark:border-blue-800 mb-4">
            <BadgeCheck className="w-4 h-4" />
            <span>גישה מוגבלת למנהלים בלבד</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[#1a1d23] rounded-2xl shadow-lg border border-[#f0f2f4] dark:border-gray-800 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-[#121417] dark:text-white mb-2">
              התחברות מנהל
            </h2>
            <p className="text-sm text-[#657586] dark:text-gray-400">
              הזן את מפתח המנהל כדי לגשת לפאנל הניהול
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-key" className="block text-sm font-medium text-[#121417] dark:text-white mb-2">
                מפתח מנהל
              </label>
              <Input
                id="admin-key"
                type="password"
                placeholder="הזן מפתח מנהל"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
                className="h-12 text-right bg-background-light dark:bg-[#252a33] border-[#e5e7eb] dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary"
                disabled={loading}
              />
              {error && (
                <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4.5 h-4.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md transition-all duration-200" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>מתחבר...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  <span>התחבר</span>
                </span>
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-[#f0f2f4] dark:border-gray-800">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-right flex-1">
                <p className="text-xs font-medium text-amber-900 dark:text-amber-200 mb-1">
                  אבטחה
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  הגישה לפאנל הניהול מוגבלת למנהלים מורשים בלבד. כל פעולה נרשמת במערכת.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-[#657586] hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4.5 h-4.5" />
            <span>חזרה לאתר הראשי</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
