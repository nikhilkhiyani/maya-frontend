'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/hooks/useCart'
import { useAuth } from '@/lib/hooks'
import { formatPrice } from '@/lib/utils'
import { getImageUrl } from '@/lib/utils/images'

export default function CartPage() {
  const { cartItems, isLoading, updateQuantity, removeFromCart } = useCart()
  const { isAuthenticated } = useAuth()

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const shipping = subtotal > 999 ? 0 : 99
  const tax = subtotal * 0.18
  const total = subtotal + shipping + tax

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-14 w-14 mx-auto text-neutral-300 mb-4" />
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4">Sign in to view your cart</h1>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900 mx-auto" />
        <p className="mt-4 text-neutral-500">Loading cart...</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-14 w-14 mx-auto text-neutral-300 mb-4" />
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-foreground/70 mb-8">Add some beautiful pieces to your cart</p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl shadow-sm border border-neutral-100 transition-shadow hover:shadow-md"
            >
              <div className="relative w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={getImageUrl(item.product.images[0])}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.product.slug}`}
                  className="font-semibold text-sm md:text-base line-clamp-2 hover:text-amber-700 transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="text-base font-semibold text-neutral-900 mt-1.5">
                  {formatPrice(item.product.price)}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 border border-neutral-200 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-3 py-2 hover:bg-neutral-50 rounded-l-lg"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-2 hover:bg-neutral-50 rounded-r-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-600 transition-colors p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-sm sm:text-base whitespace-nowrap">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 sticky top-28 shadow-sm border border-neutral-100">
            <h2 className="text-xl font-serif font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">GST (18%)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              {subtotal < 999 && (
                <p className="text-xs text-amber-700">
                  Add {formatPrice(999 - subtotal)} more for free shipping
                </p>
              )}
              <div className="border-t border-neutral-100 pt-3 flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-amber-700">{formatPrice(total)}</span>
              </div>
            </div>

            <Button asChild className="w-full h-11 bg-neutral-900 hover:bg-neutral-800">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <Button asChild variant="outline" className="w-full mt-3 h-11">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
