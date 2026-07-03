'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Loader2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ordersApi, BackendOrder } from '@/lib/api'
import { formatPrice } from '@/lib/utils'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<BackendOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }
    ordersApi.getOrderById(orderId)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-neutral-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-8 animate-in zoom-in duration-500">
          <CheckCircle className="h-14 w-14 text-green-600" />
        </div>

        <h1 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-3">Order Placed!</h1>
        <p className="text-neutral-500 mb-8">
          Thank you for your purchase. A confirmation email with your invoice has been sent.
        </p>

        {order && (
          <Card className="border-0 shadow-xl rounded-3xl mb-8 text-left">
            <CardContent className="p-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Order Number</span>
                <span className="font-semibold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Paid</span>
                <span className="font-semibold text-green-700">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Items</span>
                <span>{order.orderItems?.length ?? 0} item(s)</span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tracking</span>
                  <span className="font-mono text-xs">{order.trackingNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {orderId && (
            <Button asChild className="h-12 px-8 bg-neutral-900">
              <Link href={`/orders/${orderId}`}>
                <Package className="h-4 w-4 mr-2" />
                View Order Details
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="h-12 px-8">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  )
}
