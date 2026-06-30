'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await login(email, password)
      if (response.user.role !== 'ADMIN') {
        setError('Access denied. Admin credentials required.')
        return
      }
      router.replace('/admin')
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl tracking-[0.25em] text-white uppercase mb-2">MAYA</h1>
          <p className="text-neutral-400 text-sm">Admin Panel Sign In</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@maya.com"
                className="h-12"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-neutral-900 hover:bg-neutral-800"
            >
              {loading ? 'Signing in...' : 'Sign In to Admin'}
            </Button>
          </form>
          <p className="text-center text-sm text-neutral-500 mt-6">
            <Link href="/" className="text-amber-700 hover:underline">← Back to store</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
