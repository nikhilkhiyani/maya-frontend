'use client'

import { useState, useEffect } from 'react'
import { ordersApi, OrderRequest } from '../api'

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const backendOrders = await ordersApi.getMyOrders()
      setOrders(backendOrders)
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const createOrder = async (request: OrderRequest) => {
    try {
      const order = await ordersApi.createOrder(request)
      await fetchOrders()
      return order
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to create order'
      throw new Error(message || 'Failed to create order')
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return {
    orders,
    isLoading,
    createOrder,
    refreshOrders: fetchOrders,
  }
}
