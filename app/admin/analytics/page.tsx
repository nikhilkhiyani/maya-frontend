'use client'

import { useEffect, useState } from 'react'
import { adminApi, AdminDashboard } from '@/lib/api/admin'
import { formatPrice } from '@/lib/utils'

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AdminDashboard | null>(null)

  useEffect(() => {
    adminApi.getDashboard().then(setData).catch(() => {})
  }, [])

  if (!data) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif text-neutral-900">Analytics</h1>
        <p className="text-neutral-500 mt-1">Sales and performance overview</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-neutral-100">
          <p className="text-sm text-neutral-500">Total Revenue</p>
          <p className="text-3xl font-bold mt-2">{formatPrice(data.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-neutral-100">
          <p className="text-sm text-neutral-500">Average Order Value</p>
          <p className="text-3xl font-bold mt-2">
            {data.totalOrders > 0 ? formatPrice(data.totalRevenue / data.totalOrders) : '₹0'}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-neutral-100">
          <p className="text-sm text-neutral-500">Conversion (orders/users)</p>
          <p className="text-3xl font-bold mt-2">
            {data.totalUsers > 0 ? ((data.totalOrders / data.totalUsers) * 100).toFixed(1) : '0'}%
          </p>
        </div>
      </div>
    </div>
  )
}
