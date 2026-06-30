import { apiClient } from './client'
import { BackendProduct } from './products'

export interface BackendWishlistItem {
  id: string
  product: BackendProduct
  createdAt: string
}

export const wishlistApi = {
  getWishlist: async (): Promise<BackendWishlistItem[]> => {
    const response = await apiClient.get('/wishlist')
    return response.data
  },

  addToWishlist: async (productId: string): Promise<BackendWishlistItem> => {
    const response = await apiClient.post('/wishlist', null, {
      params: { productId }
    })
    return response.data
  },

  removeFromWishlist: async (productId: string): Promise<void> => {
    await apiClient.delete('/wishlist', {
      params: { productId }
    })
  },
}
