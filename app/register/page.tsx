'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/hooks'
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button'

export default function RegisterPage() {
  const router = useRouter()
  const { register, googleLogin } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !password) {
      setError('Please fill all required fields')
      return
    }
    if (!email && !phone) {
      setError('Please provide an email or mobile number')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')
    try {
      await register(name, email || undefined, phone || undefined, password)
      router.push('/')
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Registration failed'
      setError(message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (idToken: string) => {
    setLoading(true)
    setError('')
    try {
      await googleLogin(idToken)
      router.push('/')
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
          <h1 className="text-3xl font-serif text-neutral-900 mb-2">Join MAYA</h1>
          <p className="text-neutral-500 text-sm">Create your luxury fashion account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Full Name</label>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Mobile number</label>
            <Input
              type="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12"
            />
            <p className="text-xs text-neutral-500 mt-1">Provide email, phone, or both</p>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Password</label>
            <Input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white"
          >
            {loading ? 'Creating account...' : 'Create Account'}
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
          Already have an account?{' '}
          <Link href="/login" className="text-amber-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
