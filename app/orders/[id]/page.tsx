'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Package, Truck, CheckCircle, MapPin, Box } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ordersApi, BackendOrder } from '@/lib/api'
import { formatPrice, cn } from '@/lib/utils'
import { getImageUrl } from '@/lib/utils/images'
import { use } from 'react'

const orderStatuses = [
  { id: 'PENDING_PAYMENT', label: 'Pending Payment', icon: Package },
  { id: 'PAYMENT_RECEIVED', label: 'Payment Received', icon: CheckCircle },
  { id: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
  { id: 'PROCESSING', label: 'Processing', icon: Box },
  { id: 'PACKED', label: 'Packed', icon: Box },
  { id: 'READY_TO_SHIP', label: 'Ready to Ship', icon: Box },
  { id: 'SHIPPED', label: 'Shipped', icon: Truck },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
]

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<BackendOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersApi.getOrderById(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900 mx-auto" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-serif font-bold mb-4">Order Not Found</h1>
        <Button asChild><Link href="/profile">View All Orders</Link></Button>
      </div>
    )
  }

  const currentStatusIndex = orderStatuses.findIndex((s) => s.id === order.status)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
          Order {order.orderNumber}
        </h1>
        <p className="text-neutral-500">
          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
        {order.trackingNumber && (
          <p className="text-sm text-amber-700 mt-1">
            Tracking: {order.trackingNumber}
            {order.courierName && ` via ${order.courierName}`}
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-neutral-100">
            <CardHeader>
              <CardTitle className="font-serif">Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {orderStatuses.map((status, index) => {
                  const Icon = status.icon
                  const isCompleted = currentStatusIndex >= 0 && index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex

                  return (
                    <div key={status.id} className="flex gap-4 pb-8 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                          isCompleted ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-200 text-neutral-400'
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {index < orderStatuses.length - 1 && (
                          <div className={cn('w-0.5 flex-1 mt-2', isCompleted ? 'bg-neutral-900' : 'bg-neutral-200')} />
                        )}
                      </div>
                      <div className="pt-2">
                        <p className={cn('font-medium', isCurrent && 'text-amber-700')}>{status.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-neutral-100">
            <CardHeader>
              <CardTitle className="font-serif">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-neutral-50">
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={getImageUrl(item.product.images?.[0] || '/placeholder-product.jpg')}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                    <p className="font-semibold mt-1">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-neutral-100">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.shippingFullName}</p>
              <p className="text-sm text-neutral-500">{order.shippingPhone}</p>
              <p className="text-sm text-neutral-600 mt-2">
                {order.shippingAddressLine1}
                {order.shippingAddressLine2 && `, ${order.shippingAddressLine2}`}
                <br />
                {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-neutral-100">
            <CardHeader>
              <CardTitle className="font-serif">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatPrice(order.totalAmount - order.shippingAmount - order.taxAmount + order.discountAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span>{order.shippingAmount === 0 ? 'Free' : formatPrice(order.shippingAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">GST</span>
                <span>{formatPrice(order.taxAmount)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                <span>Total</span>
                <span className="text-amber-700">{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-neutral-500">Payment</span>
                <span className="capitalize">{order.paymentMethod.toLowerCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status</span>
                <span className="font-medium capitalize">{order.status.toLowerCase().replace(/_/g, ' ')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
