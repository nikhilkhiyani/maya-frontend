import { apiClient } from './client'

export interface Category {
  id: string
  name: string
  slug: string
  code: string
  description?: string
  image?: string
  bannerImage?: string
  displayOrder: number
  enabled: boolean
  featured: boolean
  showOnHomepage: boolean
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  productCount?: number
}

export interface CategoryRequest {
  name: string
  slug?: string
  code?: string
  description?: string
  image?: string
  bannerImage?: string
  displayOrder?: number
  enabled?: boolean
  featured?: boolean
  showOnHomepage?: boolean
  seoTitle?: string
  seoDescription?: string
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories')
    return response.data
  },

  getHomepage: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories/homepage')
    return response.data
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get(`/categories/${slug}`)
    return response.data
  },

  getAllAdmin: async (): Promise<Category[]> => {
    const response = await apiClient.get('/admin/categories')
    return response.data
  },

  create: async (data: CategoryRequest): Promise<Category> => {
    const response = await apiClient.post('/admin/categories', data)
    return response.data
  },

  update: async (id: string, data: Partial<CategoryRequest>): Promise<Category> => {
    const response = await apiClient.put(`/admin/categories/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/categories/${id}`)
  },
}
