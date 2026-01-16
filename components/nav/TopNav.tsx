'use client'

import Link from 'next/link'
import { Car, Bell } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
}

interface TopNavProps {
  items?: NavItem[]
}

const defaultItems: NavItem[] = [
  { label: 'ראשי', href: '/' },
  { label: 'אודות', href: '/about' },
  { label: 'צור קשר', href: '/contact' },
]

function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  
  return (
    <>
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? 'text-sm font-bold text-primary relative after:absolute after:-bottom-5 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
                : 'text-sm font-medium text-text-secondary hover:text-primary transition-colors'
            }
          >
            {item.label}
          </Link>
        )
      })}
    </>
  )
}

export function TopNav({ items = defaultItems }: TopNavProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-surface-dark border-b border-secondary dark:border-gray-800 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <NavLinks items={items} />
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary dark:hover:bg-gray-700 transition-colors text-text-main dark:text-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg text-text-main dark:text-white">
                {process.env.NEXT_PUBLIC_APP_NAME || 'CheckCarIL'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
