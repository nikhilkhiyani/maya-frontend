import { apiClient } from './client'

export interface BackendProduct {
  id: string
  name: string
  description: string
  category: string
  subcategory?: string
  price: number
  discountPrice?: number | null
  stock: number
  images: string[]
  isReadyToShip: boolean
  rating?: number
  reviews?: number
  slug?: string
  fabric?: string
  isFeatured?: boolean
  createdAt: string
}

export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
}

export interface PaginatedResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<BackendProduct>> => {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters?.page !== undefined) params.append('page', filters.page.toString())
    if (filters?.size !== undefined) params.append('size', filters.size.toString())
    
    const response = await apiClient.get(`/products?${params.toString()}`)
    const data = response.data
    // Spring Boot nests pagination under `page`
    if (data.page) {
      return {
        content: data.content,
        totalPages: data.page.totalPages,
        totalElements: data.page.totalElements,
        size: data.page.size,
        number: data.page.number,
      }
    }
    return data
  },

  getById: async (id: string): Promise<BackendProduct> => {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  },

  create: async (data: Partial<BackendProduct>): Promise<BackendProduct> => {
    const response = await apiClient.post('/admin/products', data)
    return response.data
  },

  createWithImage: async (data: Partial<BackendProduct>, image: File): Promise<BackendProduct> => {
    const formData = new FormData()
    formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }))
    formData.append('image', image)
    const response = await apiClient.post('/admin/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  update: async (id: string, data: Partial<BackendProduct>): Promise<BackendProduct> => {
    const response = await apiClient.put(`/admin/products/${id}`, data)
    return response.data
  },

  updateWithImage: async (id: string, data: Partial<BackendProduct>, image?: File): Promise<BackendProduct> => {
    const formData = new FormData()
    formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }))
    if (image) formData.append('image', image)
    const response = await apiClient.put(`/admin/products/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/products/${id}`)
  },
}
