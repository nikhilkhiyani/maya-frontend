'use client'

import { useState, useEffect } from 'react'
import { cartApi, authApi } from '../api'
import { mapBackendProductToFrontend } from '../mappers'
import { useAuth } from './useAuth'
import { CartItem } from '../types'

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const { isAuthenticated } = useAuth()

  const fetchCart = async () => {
    const token = authApi.getStoredToken()
    if (!token) {
      setCartItems([])
      setIsLoading(false)
      setHasLoaded(true)
      return
    }

    try {
      setIsLoading(true)
      const items = await cartApi.getCart()
      const mappedItems = items.map(item => ({
        product: mapBackendProductToFrontend(item.product),
        quantity: item.quantity,
        selectedSize: item.size || '',
        selectedColor: 'Default',
      }))
      setCartItems(mappedItems)
    } catch (err: unknown) {
      const status = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { status?: number } }).response?.status
        : undefined
      if (status === 401 || status === 403) {
        setCartItems([])
        return
      }
    } finally {
      setIsLoading(false)
      setHasLoaded(true)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1, size?: string) => {
    try {
      await cartApi.addToCart(productId, quantity, size)
      await fetchCart()
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to add to cart'
      throw new Error(message || 'Failed to add to cart')
    }
  }

  const updateQuantity = async (productId: string, quantity: number, size?: string) => {
    try {
      await cartApi.updateQuantity(productId, quantity, size)
      await fetchCart()
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to update quantity'
      throw new Error(message || 'Failed to update quantity')
    }
  }

  const removeFromCart = async (productId: string, size?: string) => {
    try {
      await cartApi.removeFromCart(productId, size)
      await fetchCart()
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to remove from cart'
      throw new Error(message || 'Failed to remove from cart')
    }
  }

  useEffect(() => {
    fetchCart()
  }, [isAuthenticated])

  return {
    cartItems,
    isLoading,
    hasLoaded,
    addToCart,
    updateQuantity,
    removeFromCart,
    refreshCart: fetchCart,
  }
}
