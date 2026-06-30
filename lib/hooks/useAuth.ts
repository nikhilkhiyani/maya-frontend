'use client'

import { useState, useEffect } from 'react'
import { authApi, AuthResponse } from '../api'

export function useAuth() {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = authApi.getStoredUser()
    const token = authApi.getStoredToken()
    
    if (storedUser && token) {
      setUser(storedUser)
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password })
    authApi.storeAuth(response)
    setUser(response.user)
    return response
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await authApi.register({ name, email, password })
    authApi.storeAuth(response)
    setUser(response.user)
    return response
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    window.location.href = '/'
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }
}
