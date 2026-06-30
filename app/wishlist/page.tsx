'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WishlistItemCard } from '@/components/product/product-card'
import { useWishlist } from '@/lib/hooks/useWishlist'
import { useAuth } from '@/lib/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart } from 'lucide-react'

export default function WishlistPage() {
  const { wishlistItems, isLoading } = useWishlist()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
        <h1 className="text-3xl font-serif font-bold mb-4">Sign in to view your wishlist</h1>
        <p className="text-neutral-500 mb-8">Save your favorite pieces across devices</p>
        <Button asChild className="bg-neutral-900 hover:bg-neutral-800">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
        <h1 className="text-3xl font-serif font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-neutral-500 mb-8">Save your favorite items to your wishlist</p>
        <Button asChild className="bg-neutral-900 hover:bg-neutral-800">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">My Wishlist</h1>
        <p className="text-neutral-500">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      <div className="space-y-4 max-w-4xl">
        {wishlistItems.map((product) => (
          <WishlistItemCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
