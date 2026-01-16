'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Shield, UserCog, LayoutDashboard, Search, BarChart3, Mail, Settings as SettingsIcon } from 'lucide-react'
import { LogoutButton } from './LogoutButton'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface MobileMenuProps {
  navItems: NavItem[]
  systemItems: NavItem[]
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ navItems, systemItems, isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[99] md:hidden"
        onClick={onClose}
      />
      {/* Menu Panel */}
      <aside className="fixed top-0 right-0 h-full w-72 bg-white dark:bg-slate-900 border-l border-[#e5e7eb] dark:border-slate-800 z-[100] md:hidden flex flex-col transition-colors">
        <div className="p-6 border-b border-[#f0f2f4] dark:border-slate-800 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight text-[#121417] dark:text-white">מאגר הרכב</h1>
              <p className="text-xs text-[#657586] dark:text-slate-400 font-medium">ממשל זמין</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#657586] dark:text-slate-400 hover:bg-[#f0f2f4] dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="סגור תפריט"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <div className="px-4 py-2 mb-2 text-xs font-bold text-[#657586] dark:text-slate-400 uppercase tracking-wider">ראשי</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/admin' && pathname === '/admin')
            const IconComponent = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold dark:bg-primary/20'
                    : 'hover:bg-[#f0f2f4] dark:hover:bg-slate-800 text-[#657586] dark:text-slate-300 font-medium'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          
          <div className="px-4 py-2 mt-6 mb-2 text-xs font-bold text-[#657586] dark:text-slate-400 uppercase tracking-wider">מערכת</div>
          {systemItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const IconComponent = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold dark:bg-primary/20'
                    : 'hover:bg-[#f0f2f4] dark:hover:bg-slate-800 text-[#657586] dark:text-slate-300 font-medium'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
        
        <div className="p-4 border-t border-[#f0f2f4] dark:border-slate-800 space-y-3 transition-colors">
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-bold text-[#121417] dark:text-white">מנהל מערכת</span>
              <span className="text-xs text-[#657586] dark:text-slate-400">מנהל מערכת</span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>
    </>
  )
}
