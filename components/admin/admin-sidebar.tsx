'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Ticket,
  Image,
  Settings,
  LogOut,
  ChevronLeft,
  BarChart3,
  CreditCard,
  RefreshCw,
  Star,
} from 'lucide-react'
import { useAuth } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const navSections = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { name: 'Products', href: '/admin/products', icon: Package },
      { name: 'Categories', href: '/admin/categories', icon: FolderTree },
      { name: 'Banners', href: '/admin/banners', icon: Image },
    ],
  },
  {
    title: 'Sales',
    items: [
      { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Payments', href: '/admin/payments', icon: CreditCard },
      { name: 'Exchanges', href: '/admin/exchanges', icon: RefreshCw },
      { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    ],
  },
  {
    title: 'People',
    items: [
      { name: 'Customers', href: '/admin/users', icon: Users },
      { name: 'Reviews', href: '/admin/reviews', icon: Star },
    ],
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

interface AdminSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-neutral-950 text-white transition-all duration-300 flex flex-col',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        {!collapsed && (
          <div>
            <p className="font-serif text-lg tracking-[0.2em] uppercase">MAYA</p>
            <p className="text-[10px] text-neutral-400 tracking-widest uppercase">Admin Panel</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase text-neutral-500">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                      active
                        ? 'bg-white text-neutral-900 font-medium'
                        : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        {!collapsed && user && (
          <p className="text-xs text-neutral-400 mb-3 truncate">{user.name}</p>
        )}
        <div className="flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
            {!collapsed && <span>Back to Store</span>}
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/10 w-full"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
