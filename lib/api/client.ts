import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : 'http://localhost:8080/api'

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/** Server-side fetches (SSR). In Docker, use internal service URL e.g. http://backend:8080 */
export const SERVER_BACKEND_URL =
  process.env.API_INTERNAL_URL || BACKEND_URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        document.cookie = 'token=; path=/; max-age=0'
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
