'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/hooks'
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, googleLogin } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectAfterAuth = () => {
    const redirect = searchParams.get('redirect') || '/'
    router.push(redirect)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier || !password) {
      setError('Please enter email/phone and password')
      return
    }

    setLoading(true)
    setError('')
    try {
      await login(identifier, password)
      redirectAfterAuth()
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Login failed. Please check your credentials.'
      setError(message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (idToken: string) => {
    setLoading(true)
    setError('')
    try {
      await googleLogin(idToken)
      redirectAfterAuth()
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Google sign-in failed.'
      setError(message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const hasGoogleAuth = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-md border border-neutral-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-neutral-900 mb-2">Welcome Back</h1>
          <p className="text-neutral-500 text-sm">Sign in to your MAYA account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
              Email or mobile number
            </label>
            <Input
              type="text"
              placeholder="you@example.com or 9876543210"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-12"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-amber-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {hasGoogleAuth && (
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-neutral-500">Or</span>
              </div>
            </div>
            <GoogleSignInButton
              onSuccess={handleGoogleLogin}
              onError={setError}
              disabled={loading}
            />
          </div>
        )}

        <p className="text-center text-sm text-neutral-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-amber-700 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
