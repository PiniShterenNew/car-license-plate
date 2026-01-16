import Link from 'next/link'
import { Car } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1a1d23] border-t border-[#f0f2f4] dark:border-gray-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright & Logo */}
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-right">
            <div className="flex items-center gap-2 text-[#121417] dark:text-white font-bold">
              <Car className="w-5 h-5" />
              <span>CheckCar</span>
            </div>
            <p className="text-sm text-gray-500">© 2024 CheckCar. כל הזכויות שמורות.</p>
          </div>
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-8">
            <Link className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href="/terms">תנאי שימוש</Link>
            <Link className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href="/privacy">מדיניות פרטיות</Link>
            <Link className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href="/accessibility">נגישות</Link>
            <Link className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href="/sitemap">מפת אתר</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
