'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAdmin } from '@/lib/utils/auth'
import { useAuth } from '@/lib/hooks'
import { AdminSidebar } from './admin-sidebar'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()
  const [authorized, setAuthorized] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) return
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin()) {
        router.replace('/admin/login')
      } else {
        setAuthorized(true)
      }
    }
  }, [isAuthenticated, isLoading, router, isLoginPage])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading || !authorized) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main
        className="transition-all duration-300 min-h-screen p-6 md:p-8"
        style={{ marginLeft: collapsed ? 72 : 256 }}
      >
        {children}
      </main>
    </div>
  )
}
