import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : 'http://localhost:8080/api'

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

/** Server-side fetches (SSR). Prefer internal URL in Docker; fall back to public URL on Render. */
export const SERVER_BACKEND_URL =
  process.env.API_INTERNAL_URL || BACKEND_URL

function getServerBackendCandidates(): string[] {
  const publicUrl = BACKEND_URL
  const internalUrl = process.env.API_INTERNAL_URL?.replace(/\/$/, '')

  if (internalUrl && internalUrl !== publicUrl) {
    return [internalUrl, publicUrl]
  }

  return [publicUrl]
}

/** Fetch from backend during SSR with internal-network fallback to the public API URL. */
export async function serverFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  let lastError: unknown

  for (const baseUrl of getServerBackendCandidates()) {
    try {
      const response = await fetch(`${baseUrl}${normalizedPath}`, {
        ...init,
        cache: init?.cache ?? 'no-store',
      })

      if (response.ok) {
        return response
      }

      lastError = new Error(`Request failed with status ${response.status}`)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Failed to fetch ${normalizedPath}`)
}

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
