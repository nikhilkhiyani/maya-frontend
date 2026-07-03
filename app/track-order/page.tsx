'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ordersApi } from '@/lib/api'
import { useAuth } from '@/lib/hooks'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function TrackOrderPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = query.trim()
    if (!value) return

    setLoading(true)
    setError('')

    try {
      if (UUID_REGEX.test(value)) {
        router.push(`/orders/${value}`)
        return
      }

      if (!isAuthenticated) {
        setError('Please sign in to track by order number, or use the order ID from your confirmation email.')
        return
      }

      const order = await ordersApi.getOrderByNumber(value)
      router.push(`/orders/${order.id}`)
    } catch {
      setError('Order not found. Check your order number or sign in to the account used for purchase.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-center">
          Track Your Order
        </h1>
        <p className="text-neutral-500 text-center mb-8">
          Enter your order number (e.g. MAYA1782732455251456) or order ID from your confirmation email
        </p>

        <Card className="rounded-2xl border-neutral-100">
          <CardHeader>
            <CardTitle className="font-serif">Order Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrack} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Order Number or ID</label>
                <Input
                  placeholder="MAYA1782732455251456"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-neutral-900 hover:bg-neutral-800" disabled={loading}>
                <Search className="h-5 w-5 mr-2" />
                {loading ? 'Looking up...' : 'Track Order'}
              </Button>
            </form>

            {!isAuthenticated && (
              <p className="mt-4 text-sm text-neutral-500 text-center">
                <Link href="/login" className="text-amber-700 hover:underline">Sign in</Link>
                {' '}to track using your order number
              </p>
            )}

            <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
              <p className="text-sm font-medium mb-2">Need Help?</p>
              <p className="text-sm text-neutral-500">
                Your order number is in the confirmation email sent after checkout.
                When email delivery is enabled, you will receive tracking updates automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
