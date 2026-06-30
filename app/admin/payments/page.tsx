'use client'

import { useEffect, useState } from 'react'
import { paymentsApi, PaymentResponse } from '@/lib/api/payments'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  SUCCESS: 'bg-green-100 text-green-800',
  PENDING: 'bg-blue-100 text-blue-800',
  FAILED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-amber-100 text-amber-800',
  CANCELLED: 'bg-neutral-100 text-neutral-800',
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentResponse[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    paymentsApi.getAllPayments().then(setPayments).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleVerify = async (id: string, approved: boolean) => {
    await paymentsApi.adminVerifyPayment(id, approved)
    load()
  }

  if (loading) return <div className="flex justify-center h-64"><div className="animate-spin h-10 w-10 border-b-2 border-neutral-900 rounded-full" /></div>

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Payments</h1>
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Method</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Transaction</th>
              <th className="px-6 py-3 text-left">Order</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 font-mono text-xs">{p.id.slice(0, 8)}...</td>
                <td className="px-6 py-4">{formatPrice(p.amount)}</td>
                <td className="px-6 py-4">{p.method}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[p.status] || 'bg-neutral-100'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{p.transactionId || '—'}</td>
                <td className="px-6 py-4">
                  {p.orderNumber ? (
                    <Link href={`/orders/${p.orderId}`} className="text-xs text-blue-600 hover:underline">
                      {p.orderNumber}
                    </Link>
                  ) : '—'}
                </td>
                <td className="px-6 py-4">
                  {p.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleVerify(p.id, true)}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => handleVerify(p.id, false)}>Reject</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
