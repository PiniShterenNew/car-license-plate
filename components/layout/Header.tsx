'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, Menu, X } from 'lucide-react'
import { useState } from 'react'

function GlobalNavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={
        isActive
          ? 'text-sm font-medium text-primary transition-colors'
          : 'text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors'
      }
    >
      {label}
    </Link>
  )
}

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-[100] w-full bg-white/95 dark:bg-[#1a1d23]/95 backdrop-blur-md border-b border-[#f0f2f4] dark:border-gray-800 transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Car className="w-6 h-6" />
            </div>
            <Link href="/" className="text-[#121417] dark:text-white text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
              CheckCar
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <GlobalNavLink href="/" label="ראשי" isActive={pathname === '/'} />
            <GlobalNavLink href="/history" label="היסטוריה" isActive={pathname === '/history'} />
            <GlobalNavLink href="/about" label="אודות" isActive={pathname === '/about'} />
            <GlobalNavLink href="/contact" label="צור קשר" isActive={pathname === '/contact'} />
          </nav>
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
            aria-label="תפריט"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[99] md:hidden"
            onClick={closeMobileMenu}
          />
          {/* Menu Panel */}
          <nav className="absolute top-16 left-0 right-0 bg-white dark:bg-[#1a1d23] border-b border-[#f0f2f4] dark:border-gray-800 shadow-lg md:hidden z-[100]">
            <div className="px-4 py-4 space-y-1">
              <MobileNavLink href="/" label="ראשי" isActive={pathname === '/'} onClick={closeMobileMenu} />
              <MobileNavLink href="/history" label="היסטוריה" isActive={pathname === '/history'} onClick={closeMobileMenu} />
              <MobileNavLink href="/about" label="אודות" isActive={pathname === '/about'} onClick={closeMobileMenu} />
              <MobileNavLink href="/contact" label="צור קשר" isActive={pathname === '/contact'} onClick={closeMobileMenu} />
            </div>
          </nav>
        </>
      )}
    </header>
  )
}

function MobileNavLink({ href, label, isActive, onClick }: { href: string; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        isActive
          ? 'block px-4 py-3 text-base font-medium text-primary bg-primary/10 rounded-lg transition-colors'
          : 'block px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors'
      }
    >
      {label}
    </Link>
  )
}
