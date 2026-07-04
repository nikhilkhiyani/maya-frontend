'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Heart, ShoppingBag, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CtaArrowButton } from '@/components/ui/cta-arrow-button'
import { useCart } from '@/lib/hooks/useCart'
import { useWishlist } from '@/lib/hooks/useWishlist'
import { useAuth } from '@/lib/hooks'
import { mapBackendProductToFrontend } from '@/lib/mappers'
import { formatPrice } from '@/lib/utils'
import { getImageUrl } from '@/lib/utils/images'
import { Product } from '@/lib/types'

export default function ProductPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/slug/${slug}`)
        if (!res.ok) return
        const data = await res.json()
        const mapped = mapBackendProductToFrontend(data)
        setProduct(mapped)
        if (mapped.sizes.length > 0) setSelectedSize(mapped.sizes[0])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchProduct()
  }, [slug])

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }

  const requireAuth = () => {
    if (!isAuthenticated) {
      showToast('Please sign in first')
      setTimeout(() => router.push('/login'), 1000)
      return false
    }
    return true
  }

  const handleAddToCart = async () => {
    if (!product || !requireAuth()) return
    if (product.sizes.length > 0 && !selectedSize) {
      showToast('Please select a size')
      return
    }
    try {
      await addToCart(product.id, quantity, selectedSize || undefined)
      showToast('Added to cart')
    } catch {
      showToast('Failed to add to cart')
    }
  }

  const handleBuyNow = async () => {
    if (!product || !requireAuth()) return
    if (product.sizes.length > 0 && !selectedSize) {
      showToast('Please select a size')
      return
    }
    try {
      await addToCart(product.id, quantity, selectedSize || undefined)
      router.push('/checkout')
    } catch {
      showToast('Failed to proceed')
    }
  }

  const handleWishlist = async () => {
    if (!product || !requireAuth()) return
    try {
      await addToWishlist(product.id)
      showToast('Added to wishlist')
    } catch {
      showToast('Failed to add to wishlist')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <h2 className="text-2xl font-serif">Product Not Found</h2>
      </div>
    )
  }

  const imageUrl = getImageUrl(product.images[0])

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className={`object-cover ${!product.inStock ? 'opacity-70' : ''}`}
              priority
              unoptimized
            />
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                <span className="px-4 py-2 bg-neutral-900 text-white text-[11px] font-medium tracking-widest uppercase rounded-full">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-[11px] tracking-widest uppercase text-amber-700 mb-1.5">{product.category}</p>
            <h1 className="text-xl md:text-2xl font-serif font-semibold text-neutral-900 mb-2">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="text-xl md:text-2xl font-semibold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-base text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-5">{product.description}</p>

            {product.fabric && (
              <p className="text-sm text-neutral-500 mb-5">
                <span className="font-medium text-neutral-700">Fabric:</span> {product.fabric}
              </p>
            )}

            <div className={`mb-5 ${product.sizes.length === 0 ? 'hidden' : ''}`}>
              <p className="text-sm font-medium mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-1.5 text-sm border rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-2 border border-neutral-200 rounded-lg w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 hover:bg-neutral-50">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 hover:bg-neutral-50">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {product.inStock ? (
              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-3">
                  <Button onClick={handleAddToCart}
                    className="flex-1 h-10 text-sm bg-neutral-900 hover:bg-neutral-800">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button onClick={handleWishlist} variant="outline" className="h-10 w-10 p-0 shrink-0">
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
                <CtaArrowButton onClick={handleBuyNow} className="w-full">
                  Buy Now
                </CtaArrowButton>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 mt-auto">
                <Button disabled className="flex-1 h-10 text-sm bg-neutral-200 text-neutral-500 cursor-not-allowed">
                  Sold Out
                </Button>
                <Button onClick={handleWishlist} variant="outline" className="h-10 w-10 p-0 shrink-0">
                  <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <p className="w-full text-sm text-neutral-500">
                  This piece is currently sold out. Add it to your wishlist and we&apos;ll restock soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl bg-neutral-900 text-white text-sm font-medium">
          {toast}
        </div>
      )}
    </>
  )
}
