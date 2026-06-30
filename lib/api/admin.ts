import { apiClient } from './client'

export interface AdminDashboard {
  totalUsers: number
  totalOrders: number
  totalProducts: number
  pendingOrders: number
  lowStockProducts: number
  totalRevenue: number
  todayRevenue: number
  todayOrders: number
  topProducts: { id: string; name: string; soldCount: number; revenue: number }[]
  recentOrders: {
    id: string
    orderNumber: string
    customerName: string
    totalAmount: number
    status: string
    createdAt: string
  }[]
}

export interface Banner {
  id: string
  title: string
  subtitle?: string
  image: string
  buttonText?: string
  buttonLink?: string
  type: 'HERO' | 'CATEGORY' | 'OFFER' | 'POPUP'
  priority: number
  active: boolean
  startsAt?: string
  endsAt?: string
  createdAt: string
}

export interface Coupon {
  id: string
  code: string
  description?: string
  type: 'PERCENTAGE' | 'FLAT' | 'FREE_SHIPPING'
  value: number
  minCartAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  validFrom?: string
  validUntil?: string
  active: boolean
  createdAt: string
}

export const adminApi = {
  getDashboard: async (): Promise<AdminDashboard> => {
    const response = await apiClient.get('/admin/dashboard')
    return response.data
  },

  getBanners: async (): Promise<Banner[]> => {
    const response = await apiClient.get('/admin/banners')
    return response.data
  },

  getHeroBanners: async (): Promise<Banner[]> => {
    const response = await apiClient.get('/banners/hero')
    return response.data
  },

  createBanner: async (data: Partial<Banner>): Promise<Banner> => {
    const response = await apiClient.post('/admin/banners', data)
    return response.data
  },

  updateBanner: async (id: string, data: Partial<Banner>): Promise<Banner> => {
    const response = await apiClient.put(`/admin/banners/${id}`, data)
    return response.data
  },

  deleteBanner: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/banners/${id}`)
  },

  getCoupons: async (): Promise<Coupon[]> => {
    const response = await apiClient.get('/admin/coupons')
    return response.data
  },

  createCoupon: async (data: Partial<Coupon>): Promise<Coupon> => {
    const response = await apiClient.post('/admin/coupons', data)
    return response.data
  },

  updateCoupon: async (id: string, data: Partial<Coupon>): Promise<Coupon> => {
    const response = await apiClient.put(`/admin/coupons/${id}`, data)
    return response.data
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/coupons/${id}`)
  },
}
