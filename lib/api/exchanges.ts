import { apiClient } from './client'

export interface ExchangeRequest {
  orderId: string
  productId: string
  reason: 'DEFECTIVE' | 'DAMAGED' | 'INCORRECT_PRODUCT'
  description: string
}

export interface Exchange {
  id: string
  orderId: string
  orderNumber: string
  productId: string
  productName: string
  reason: string
  description: string
  imageUrls: string[]
  supportingFileUrls: string[]
  status: string
  adminRemarks?: string
  createdAt: string
  updatedAt: string
}

export const exchangesApi = {
  create: async (data: ExchangeRequest, images: File[], files?: File[]): Promise<Exchange> => {
    const formData = new FormData()
    formData.append('orderId', data.orderId)
    formData.append('productId', data.productId)
    formData.append('reason', data.reason)
    formData.append('description', data.description)
    images.forEach((img) => formData.append('images', img))
    files?.forEach((f) => formData.append('files', f))
    const response = await apiClient.post('/exchanges', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  getMyExchanges: async (): Promise<Exchange[]> => {
    const response = await apiClient.get('/exchanges/my')
    return response.data
  },

  getAll: async (): Promise<Exchange[]> => {
    const response = await apiClient.get('/exchanges/admin/all')
    return response.data
  },

  review: async (id: string, approved: boolean, remarks?: string): Promise<Exchange> => {
    const response = await apiClient.put(`/exchanges/admin/${id}/review`, null, {
      params: { approved, remarks },
    })
    return response.data
  },
}
