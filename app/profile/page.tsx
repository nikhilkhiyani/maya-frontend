'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, MapPin, ShoppingBag, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/hooks'
import { useWishlist } from '@/lib/hooks/useWishlist'
import { usersApi, addressesApi, ordersApi, BackendAddress, BackendOrder } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { WishlistItemCard } from '@/components/product/product-card'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { user } = useAuth()
  const { wishlistItems } = useWishlist()

  const [profile, setProfile] = useState({ name: '', email: '', phone: '' })
  const [addresses, setAddresses] = useState<BackendAddress[]>([])
  const [orders, setOrders] = useState<BackendOrder[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email, phone: '' })
    }
    addressesApi.getAll().then(setAddresses).catch(() => {})
    ordersApi.getMyOrders().then(setOrders).catch(() => {})
  }, [user])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await usersApi.updateProfile({ name: profile.name })
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        localStorage.setItem('user', JSON.stringify({ ...parsed, name: profile.name }))
      }
    } catch {
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold mb-8">My Account</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside>
          <Card className="rounded-2xl border-neutral-100">
            <CardContent className="p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-neutral-900 text-white'
                        : 'hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <Card className="rounded-2xl border-neutral-100">
              <CardHeader><CardTitle className="font-serif">Profile</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input value={profile.name} placeholder="Name"
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                <Input value={profile.email} placeholder="Email" disabled
                  className="bg-neutral-50" />
                <Button onClick={handleSaveProfile} disabled={saving}
                  className="bg-neutral-900 hover:bg-neutral-800">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'addresses' && (
            <Card className="rounded-2xl border-neutral-100">
              <CardHeader><CardTitle className="font-serif">Saved Addresses</CardTitle></CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <p className="text-neutral-500">No addresses saved. Add one during checkout.</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="p-4 rounded-xl border border-neutral-100">
                        <p className="font-medium">{addr.fullName}</p>
                        <p className="text-sm text-neutral-500">{addr.phone}</p>
                        <p className="text-sm text-neutral-600 mt-1">
                          {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        {addr.isDefault && (
                          <span className="text-xs text-amber-700 font-medium mt-2 inline-block">Default</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card className="rounded-2xl border-neutral-100">
              <CardHeader><CardTitle className="font-serif">Order History</CardTitle></CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-neutral-500 mb-4">No orders yet</p>
                    <Button asChild><Link href="/">Start Shopping</Link></Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Link key={order.id} href={`/orders/${order.id}`}
                        className="block p-4 rounded-xl border border-neutral-100 hover:border-amber-200 hover:shadow-sm transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-neutral-500">
                              {new Date(order.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                            <p className="text-xs capitalize text-amber-700">
                              {order.status.toLowerCase().replace(/_/g, ' ')}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'wishlist' && (
            <Card className="rounded-2xl border-neutral-100">
              <CardHeader><CardTitle className="font-serif">Wishlist</CardTitle></CardHeader>
              <CardContent>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-neutral-500 mb-4">Your wishlist is empty</p>
                    <Button asChild><Link href="/">Browse Collection</Link></Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlistItems.map((item) => (
                      <WishlistItemCard key={item.id} product={item} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
