import { apiClient } from './client'

export interface AddressRequest {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault?: boolean
}

export interface BackendAddress {
  id: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
  createdAt: string
}

export const addressesApi = {
  getAll: async (): Promise<BackendAddress[]> => {
    const response = await apiClient.get('/addresses')
    return response.data
  },

  create: async (data: AddressRequest): Promise<BackendAddress> => {
    const response = await apiClient.post('/addresses', data)
    return response.data
  },

  update: async (id: string, data: AddressRequest): Promise<BackendAddress> => {
    const response = await apiClient.put(`/addresses/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/addresses/${id}`)
  },
}
