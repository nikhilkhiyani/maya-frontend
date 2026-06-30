import { apiClient } from './client'

export interface BackendUser {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export interface UserUpdateRequest {
  name: string
}

export const usersApi = {
  getProfile: async (): Promise<BackendUser> => {
    const response = await apiClient.get('/users/profile')
    return response.data
  },

  updateProfile: async (data: UserUpdateRequest): Promise<BackendUser> => {
    const response = await apiClient.put('/users/profile', data)
    return response.data
  },

  getAllUsers: async (): Promise<BackendUser[]> => {
    const response = await apiClient.get('/admin/users')
    return response.data
  },
}
