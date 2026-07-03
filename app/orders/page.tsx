'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ordersApi, BackendOrder, OrderStatus } from '@/lib/api'
import { formatPrice, cn } from '@/lib/utils'
import { getImageUrl } from '@/lib/utils/images'
import { useAuth } from '@/lib/hooks'

const STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT: 'bg-amber-50 text-amber-700 border-amber-200',
  PAYMENT_RECEIVED: 'bg-blue-50 text-blue-700 border-blue-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-blue-50 text-blue-700 border-blue-200',
  PACKED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  READY_TO_SHIP: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  SHIPPED: 'bg-violet-50 text-violet-700 border-violet-200',
  OUT_FOR_DELIVERY: 'bg-violet-50 text-violet-700 border-violet-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  REFUND_INITIATED: 'bg-red-50 text-red-700 border-red-200',
  REFUND_COMPLETED: 'bg-red-50 text-red-700 border-red-200',
}

function statusLabel(status: OrderStatus) {
  return status.toLowerCase().replace(/_/g, ' ')
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize',
        STATUS_STYLES[status] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200'
      )}
    >
      {statusLabel(status)}
    </span>
  )
}

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState<BackendOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.replace('/login?redirect=/orders')
      return
    }
    ordersApi
      .getMyOrders()
      .then((data) =>
        setOrders(
          [...data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        )
      )
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [authLoading, isAuthenticated, router])

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900 mx-auto" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 md:py-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-neutral-400 mb-1">Account</p>
        <h1 className="text-lg md:text-xl font-serif font-semibold">My Orders</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {orders.length > 0
            ? `${orders.length} order${orders.length > 1 ? 's' : ''}`
            : 'Your order history will appear here.'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50 py-16 text-center">
          <Package className="h-10 w-10 text-neutral-300" strokeWidth={1.5} />
          <p className="mt-4 font-medium text-neutral-700">No orders yet</p>
          <p className="mt-1 text-sm text-neutral-500">
            Once you place an order, you can track it here.
          </p>
          <Button asChild className="mt-5">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-2xl border border-neutral-100 bg-white p-4 transition-colors hover:border-neutral-300 md:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-neutral-400">Order</p>
                  <p className="text-sm font-medium break-all md:text-base">
                    {order.orderNumber}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex -space-x-3">
                  {order.orderItems.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="relative h-12 w-10 overflow-hidden rounded-md border-2 border-white bg-neutral-100"
                    >
                      <Image
                        src={getImageUrl(item.product.images?.[0] || '/placeholder-product.jpg')}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                  {order.orderItems.length > 4 && (
                    <div className="flex h-12 w-10 items-center justify-center rounded-md border-2 border-white bg-neutral-100 text-xs font-medium text-neutral-600">
                      +{order.orderItems.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-xs text-neutral-500">
                      {order.orderItems.reduce((n, i) => n + i.quantity, 0)} item
                      {order.orderItems.reduce((n, i) => n + i.quantity, 0) > 1 ? 's' : ''}
                    </p>
                    <p className="font-semibold text-amber-700">{formatPrice(order.totalAmount)}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
