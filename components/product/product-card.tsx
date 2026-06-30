'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '@/lib/types'
import { useWishlist } from '@/lib/hooks/useWishlist'
import { useCart } from '@/lib/hooks/useCart'
import { useAuth } from '@/lib/hooks'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { getImageUrl } from '@/lib/utils/images'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [actionLoading, setActionLoading] = useState(false)

  const inWishlist = isInWishlist(product.id)

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0

  const requireAuth = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return false
    }
    return true
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!requireAuth()) return

    setActionLoading(true)
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id)
      } else {
        await addToWishlist(product.id)
      }
    } catch {
      // silently fail
    } finally {
      setActionLoading(false)
    }
  }

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!requireAuth()) return

    setActionLoading(true)
    try {
      await addToCart(product.id, 1)
    } catch {
      // silently fail
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100 mb-4 transition-transform duration-300 hover:scale-[1.02]">
        <Link href={`/product/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={getImageUrl(product.images[0])}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {product.onSale && discount > 0 && (
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-full">
            {discount}% OFF
          </div>
        )}

        {product.isNew && (
          <div className="absolute top-3 right-3 px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-full">
            NEW
          </div>
        )}

        <button
          onClick={handleWishlistToggle}
          disabled={actionLoading}
          className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-neutral-900 hover:text-white z-10 disabled:opacity-50"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className="h-4 w-4"
            fill={inWishlist ? 'currentColor' : 'none'}
          />
        </button>

        {product.inStock && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button
              onClick={handleQuickAdd}
              disabled={actionLoading}
              className="w-full py-3 bg-white text-neutral-900 font-medium rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-neutral-900 hover:text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" />
              Quick Add
            </button>
          </div>
        )}
      </div>

      <Link href={`/product/${product.slug}`} className="block space-y-2">
        <p className="text-xs text-neutral-500 uppercase tracking-wider">
          {product.category}
        </p>

        <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-base text-neutral-900">
            {formatPrice(product.price)}
          </span>

          {product.originalPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {product.rating !== undefined && product.rating > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.floor(product.rating ?? 0)
                      ? 'text-amber-500'
                      : 'text-neutral-200'
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-neutral-400">({product.reviews})</span>
          </div>
        )}

        {product.readyToShip && (
          <span className="inline-block text-xs text-green-700 font-medium">
            Ready to Ship
          </span>
        )}
      </Link>
    </motion.div>
  )
}

interface WishlistItemCardProps {
  product: Product
}

export function WishlistItemCard({ product }: WishlistItemCardProps) {
  const { removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [loading, setLoading] = useState<'cart' | 'remove' | null>(null)

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0

  const handleMoveToCart = async () => {
    setLoading('cart')
    try {
      await addToCart(product.id, 1)
      await removeFromWishlist(product.id)
    } catch {
      // fail silently
    } finally {
      setLoading(null)
    }
  }

  const handleRemove = async () => {
    setLoading('remove')
    try {
      await removeFromWishlist(product.id)
    } catch {
      // fail silently
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
      <Link
        href={`/product/${product.slug}`}
        className="relative w-full sm:w-28 h-36 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100"
      >
        <Image
          src={getImageUrl(product.images[0])}
          alt={product.name}
          fill
          unoptimized
          className="object-cover"
          sizes="112px"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
              {product.category}
            </p>
            <Link
              href={`/product/${product.slug}`}
              className="font-semibold text-neutral-900 hover:text-amber-800 transition-colors line-clamp-2"
            >
              {product.name}
            </Link>
          </div>

          <div className="sm:text-right">
            <p className="font-semibold text-lg text-neutral-900">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
            {discount > 0 && (
              <p className="text-xs text-green-600 font-medium mt-0.5">
                {discount}% off
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-neutral-500">
          {product.sizes.length > 0 && (
            <span>Size: {product.sizes[0]}</span>
          )}
          {product.colors.length > 0 && product.colors[0] !== 'Default' && (
            <span>Color: {product.colors[0]}</span>
          )}
          <span
            className={
              product.inStock
                ? 'text-green-600 font-medium'
                : 'text-red-500 font-medium'
            }
          >
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            size="sm"
            onClick={handleMoveToCart}
            disabled={!product.inStock || loading !== null}
            className="bg-neutral-900 hover:bg-neutral-800 h-9"
          >
            <ShoppingBag className="h-4 w-4 mr-1.5" />
            {loading === 'cart' ? 'Moving...' : 'Move to Cart'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleRemove}
            disabled={loading !== null}
            className="h-9 text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            {loading === 'remove' ? 'Removing...' : 'Remove'}
          </Button>

          <Button size="sm" variant="outline" asChild className="h-9">
            <Link href={`/product/${product.slug}`}>
              <ExternalLink className="h-4 w-4 mr-1.5" />
              View Product
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
