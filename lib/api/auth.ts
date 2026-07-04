import { apiClient } from './client'

export interface LoginRequest {
  identifier: string
  password: string
}

export interface RegisterRequest {
  name: string
  email?: string
  phone?: string
  password: string
}

export interface AuthResponse {
  token: string
  type: string
  user: {
    id: string
    name: string
    email?: string
    phone?: string
    role: string
    authProvider?: string
    createdAt: string
  }
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/google', { idToken })
    return response.data
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      document.cookie = 'token=; path=/; max-age=0'
    }
  },

  getStoredToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  },

  getStoredUser: (): AuthResponse['user'] | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  },

  storeAuth: (authResponse: AuthResponse) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', authResponse.token)
      localStorage.setItem('user', JSON.stringify(authResponse.user))
      document.cookie = `token=${authResponse.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
  },

  forgotPassword: async (identifier: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { identifier })
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { token, newPassword })
  },
}
