import { apiClient } from './client'

export interface ReviewRequest {
  orderId: string
  productId: string
  rating: number
  title: string
  comment: string
}

export interface Review {
  id: string
  productId: string
  productName: string
  userId: string
  userName: string
  orderId: string
  rating: number
  title: string
  comment: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN' | 'SPAM'
  pinned: boolean
  featured: boolean
  adminReply?: string
  createdAt: string
}

export const reviewsApi = {
  create: async (data: ReviewRequest): Promise<Review> => {
    const response = await apiClient.post('/reviews', data)
    return response.data
  },

  getByProduct: async (productId: string): Promise<Review[]> => {
    const response = await apiClient.get(`/products/${productId}/reviews`)
    return response.data
  },

  getMyReviews: async (): Promise<Review[]> => {
    const response = await apiClient.get('/reviews/my')
    return response.data
  },

  canReview: async (orderId: string, productId: string): Promise<boolean> => {
    const response = await apiClient.get('/reviews/can-review', { params: { orderId, productId } })
    return response.data
  },

  getPending: async (): Promise<Review[]> => {
    const response = await apiClient.get('/admin/reviews')
    return response.data
  },

  moderate: async (id: string, status: Review['status'], adminReply?: string): Promise<Review> => {
    const response = await apiClient.put(`/admin/reviews/${id}/moderate`, { status, adminReply })
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/reviews/${id}`)
  },
}
