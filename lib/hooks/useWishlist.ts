'use client'

import { useState, useEffect } from 'react'
import { wishlistApi, authApi, cartApi } from '../api'
import { Product } from '../types'
import { mapBackendProductToFrontend } from '../mappers'
import { useAuth } from './useAuth'

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  const fetchWishlist = async () => {
    const token = authApi.getStoredToken()
    if (!token) {
      setWishlistItems([])
      return
    }

    try {
      setIsLoading(true)
      const items = await wishlistApi.getWishlist()
      const mappedItems = items.map(item => mapBackendProductToFrontend(item.product))
      setWishlistItems(mappedItems)
    } catch (err: unknown) {
      const status = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { status?: number } }).response?.status
        : undefined
      if (status === 401 || status === 403) {
        setWishlistItems([])
        return
      }
    } finally {
      setIsLoading(false)
    }
  }

  const addToWishlist = async (productId: string) => {
    try {
      await wishlistApi.addToWishlist(productId)
      await fetchWishlist()
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to add to wishlist'
      throw new Error(message || 'Failed to add to wishlist')
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      await wishlistApi.removeFromWishlist(productId)
      await fetchWishlist()
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to remove from wishlist'
      throw new Error(message || 'Failed to remove from wishlist')
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId)
  }

  useEffect(() => {
    fetchWishlist()
  }, [isAuthenticated])

  const moveToCart = async (productId: string, quantity: number = 1) => {
    try {
      await cartApi.addToCart(productId, quantity)
      await wishlistApi.removeFromWishlist(productId)
      await fetchWishlist()
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to move to cart'
      throw new Error(message || 'Failed to move to cart')
    }
  }

  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isInWishlist,
    refreshWishlist: fetchWishlist,
  }
}
