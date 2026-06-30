export function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false

  const stored = localStorage.getItem('user')
  if (stored) {
    try {
      const user = JSON.parse(stored)
      if (user.role === 'ADMIN') return true
    } catch {
      // fall through
    }
  }

  const token = localStorage.getItem('token')
  if (!token) return false

  const decoded = decodeJWT(token)
  return decoded?.role === 'ADMIN'
}

export function getUserRole(): string | null {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem('user')
  if (stored) {
    try {
      return JSON.parse(stored).role || null
    } catch {
      // fall through
    }
  }

  const token = localStorage.getItem('token')
  if (!token) return null

  const decoded = decodeJWT(token)
  return (decoded?.role as string) || null
}
