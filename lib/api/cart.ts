import { apiClient } from './client'
import { BackendProduct } from './products'

export interface BackendCartItem {
  id: string
  product: BackendProduct
  quantity: number
  createdAt: string
  updatedAt: string
}

export const cartApi = {
  getCart: async (): Promise<BackendCartItem[]> => {
    const response = await apiClient.get('/cart')
    return response.data
  },

  addToCart: async (productId: string, quantity: number = 1): Promise<BackendCartItem> => {
    const response = await apiClient.post('/cart', null, {
      params: { productId, quantity }
    })
    return response.data
  },

  updateQuantity: async (productId: string, quantity: number): Promise<BackendCartItem> => {
    const response = await apiClient.put('/cart', null, {
      params: { productId, quantity }
    })
    return response.data
  },

  removeFromCart: async (productId: string): Promise<void> => {
    await apiClient.delete('/cart', {
      params: { productId }
    })
  },
}
