import { verifyAdminSession } from '@/lib/adminAuth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Search, Shield, LayoutDashboard, BarChart3, Settings as SettingsIcon, UserCog, Mail } from 'lucide-react'
import { LogoutButton } from './components/LogoutButton'
import { MobileMenuButton } from './components/MobileMenuButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get pathname from headers - middleware sets x-pathname header
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  
  // Skip auth check and layout UI for login page
  const isLoginPage = pathname === '/admin/login'
  
  if (isLoginPage) {
    // Return children without admin layout UI for login page
    return <>{children}</>
  }
  
  // Check authentication for all other admin pages
  const isAuthenticated = await verifyAdminSession()
  if (!isAuthenticated) {
    redirect('/admin/login')
  }

  const navItems = [
    { href: '/admin', label: 'לוח בקרה', icon: LayoutDashboard },
    { href: '/admin/search-logs', label: 'יומני חיפוש', icon: Search },
    { href: '/admin/ads', label: 'דוחות והכנסות', icon: BarChart3 },
    { href: '/admin/contact', label: 'הודעות קשר', icon: Mail },
  ]

  const systemItems = [
    { href: '/admin/settings', label: 'הגדרות', icon: SettingsIcon },
  ]

  return (
    <div className="flex h-screen w-full bg-[#f3f5f7]">
      {/* Side Navigation (Right Side due to RTL) */}
      <aside className="w-72 bg-white border-r border-[#e5e7eb] hidden md:flex flex-col shrink-0 z-20">
        <div className="p-6 border-b border-[#f0f2f4] flex items-center gap-3">
          <div className="size-8 bg-[#1f66ad] rounded-lg flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-[#121417]">מאגר הרכב</h1>
            <p className="text-xs text-[#657586] font-medium">ממשל זמין</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <div className="px-4 py-2 mb-2 text-xs font-bold text-[#657586] uppercase tracking-wider">ראשי</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/admin' && pathname === '/admin')
            const IconComponent = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#1f66ad]/10 text-[#1f66ad] font-bold'
                    : 'hover:bg-[#f0f2f4] text-[#657586] font-medium'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          
          <div className="px-4 py-2 mt-6 mb-2 text-xs font-bold text-[#657586] uppercase tracking-wider">מערכת</div>
          {systemItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const IconComponent = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#1f66ad]/10 text-[#1f66ad] font-bold'
                    : 'hover:bg-[#f0f2f4] text-[#657586] font-medium'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
        
        <div className="p-4 border-t border-[#f0f2f4] space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="size-10 rounded-full bg-[#1f66ad]/10 border border-[#1f66ad]/20 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-[#1f66ad]" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-bold text-[#121417]">מנהל מערכת</span>
              <span className="text-xs text-[#657586]">מנהל מערכת</span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="bg-white border-b border-[#e5e7eb] px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <MobileMenuButton />
            <h2 className="text-lg sm:text-xl font-bold text-[#121417] hidden sm:block">סקירה כללית</h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#657586]">
                <Search className="h-5 w-5" />
              </span>
              <input
                className="pl-4 pr-10 py-2 rounded-full bg-[#f0f2f4] border-none text-sm focus:ring-2 focus:ring-[#1f66ad] w-64 text-right placeholder-[#657586]"
                placeholder="חיפוש מספר רכב..."
                type="text"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  )
}
