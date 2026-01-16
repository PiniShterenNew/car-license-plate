'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { MobileMenu } from './MobileMenu'
import { LayoutDashboard, Search, BarChart3, Mail, Settings as SettingsIcon } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'לוח בקרה', icon: LayoutDashboard },
  { href: '/admin/search-logs', label: 'יומני חיפוש', icon: Search },
  { href: '/admin/ads', label: 'דוחות והכנסות', icon: BarChart3 },
  { href: '/admin/contact', label: 'הודעות קשר', icon: Mail },
]

const systemItems: NavItem[] = [
  { href: '/admin/settings', label: 'הגדרות', icon: SettingsIcon },
]

export function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-[#657586] dark:text-slate-400 hover:bg-[#f0f2f4] dark:hover:bg-slate-800 rounded-lg transition-colors"
        aria-label="תפריט"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <MobileMenu 
        navItems={navItems}
        systemItems={systemItems}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
