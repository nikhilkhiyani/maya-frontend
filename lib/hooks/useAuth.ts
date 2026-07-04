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

  const login = async (identifier: string, password: string) => {
    const response = await authApi.login({ identifier, password })
    authApi.storeAuth(response)
    setUser(response.user)
    return response
  }

  const register = async (
    name: string,
    email: string | undefined,
    phone: string | undefined,
    password: string
  ) => {
    const response = await authApi.register({ name, email, phone, password })
    authApi.storeAuth(response)
    setUser(response.user)
    return response
  }

  const googleLogin = async (idToken: string) => {
    const response = await authApi.googleLogin(idToken)
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
    googleLogin,
    logout,
  }
}
