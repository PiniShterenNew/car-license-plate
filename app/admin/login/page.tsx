'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Moon, Sun, Shield, ShieldCheck, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react'

export default function AdminLoginPage() {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for dark mode preference
    const isDark = document.documentElement.classList.contains('dark')
    setDarkMode(isDark)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

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
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center transition-colors duration-200">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 left-4">
        <button
          className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          onClick={toggleDarkMode}
          type="button"
        >
          <Moon className="w-5 h-5 block dark:hidden text-slate-600" />
          <Sun className="w-5 h-5 hidden dark:block text-slate-300" />
        </button>
      </div>

      <main className="w-full max-w-xl px-4 py-12 flex flex-col items-center">
        {/* Header */}
        <header className="w-full flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                CheckCar
              </h1>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">ממשל זמין</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl border border-blue-100 dark:border-blue-800/50">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-blue-50/50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 rounded-full">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">גישה מוגבלת למנהלים בלבד</span>
          </div>
        </header>

        {/* Login Card */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-12 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">התחברות מנהל</h2>
            <p className="text-slate-500 dark:text-slate-400">הזן את מפתח המנהל כדי לגשת לפאנל הניהול</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 mr-1" htmlFor="admin-key">
                מפתח מנהל
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-12"
                  id="admin-key"
                  name="admin-key"
                  placeholder="הזן מפתח מנהל"
                  type={showPassword ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            <button
              className="w-full bg-primary hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="text-lg">מתחבר...</span>
              ) : (
                <>
                  <span className="text-lg">התחבר</span>
                  <LogIn className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-10 p-5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-2xl flex items-start gap-4">
            <div className="mt-1">
              <Shield className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1">אבטחה</h4>
              <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-500/80 font-medium">
                הגישה לפאנל הניהול מוגבלת למנהלים מורשים בלבד. כל פעולה נרשמת במערכת לצרכי ניטור ובקרה.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <Link
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors group font-medium"
          href="/"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>חזרה לאתר הראשי</span>
        </Link>
      </main>

      {/* Gradient Backgrounds */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/2 bg-gradient-to-bl from-blue-50 to-transparent dark:from-blue-900/10 opacity-50 blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/3 h-1/2 bg-gradient-to-tr from-slate-100 to-transparent dark:from-slate-800/20 opacity-50 blur-3xl pointer-events-none"></div>
    </div>
  )
}
