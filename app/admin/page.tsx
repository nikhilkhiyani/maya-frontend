'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminApi, AdminDashboard } from '@/lib/api/admin'
import { formatPrice } from '@/lib/utils'
import {
  Users,
  ShoppingCart,
  Package,
  IndianRupee,
  AlertTriangle,
  Clock,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900" />
      </div>
    )
  }

  if (!data) {
    return <p className="text-neutral-500">Failed to load dashboard data.</p>
  }

  const stats = [
    { label: 'Total Revenue', value: formatPrice(data.totalRevenue), icon: IndianRupee, color: 'bg-emerald-500' },
    { label: 'Total Orders', value: data.totalOrders.toString(), icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Customers', value: data.totalUsers.toString(), icon: Users, color: 'bg-violet-500' },
    { label: 'Products', value: data.totalProducts.toString(), icon: Package, color: 'bg-amber-500' },
    { label: "Today's Orders", value: data.todayOrders.toString(), icon: Clock, color: 'bg-cyan-500' },
    { label: 'Pending Orders', value: data.pendingOrders.toString(), icon: ShoppingCart, color: 'bg-orange-500' },
    { label: 'Low Stock', value: data.lowStockProducts.toString(), icon: AlertTriangle, color: 'bg-red-500' },
    { label: "Today's Revenue", value: formatPrice(data.todayRevenue), icon: IndianRupee, color: 'bg-green-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 mt-1">Welcome back. Here&apos;s what&apos;s happening at MAYA.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-2.5 rounded-xl text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-5 border-b border-neutral-100 flex justify-between items-center">
            <h2 className="font-semibold text-neutral-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-amber-700 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {data.recentOrders.length === 0 ? (
              <p className="p-5 text-neutral-500 text-sm">No orders yet</p>
            ) : (
              data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-neutral-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatPrice(order.totalAmount)}</p>
                    <p className="text-xs text-amber-700 capitalize">{order.status.toLowerCase().replace(/_/g, ' ')}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5">
          <h2 className="font-semibold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Product', href: '/admin/products' },
              { label: 'Manage Categories', href: '/admin/categories' },
              { label: 'View Orders', href: '/admin/orders' },
              { label: 'Create Coupon', href: '/admin/coupons' },
              { label: 'Edit Banners', href: '/admin/banners' },
              { label: 'Customers', href: '/admin/users' },
            ].map((action) => (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="p-4 rounded-xl border border-neutral-100 hover:border-neutral-300 hover:shadow-sm transition-all text-sm font-medium text-neutral-700"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
