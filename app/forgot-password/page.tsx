'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { authApi } from '@/lib/api/auth'

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier) return
    try {
      await authApi.forgotPassword(identifier)
      setSubmitted(true)
      setError('')
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to send reset link. Please try again.'
      setError(message || 'Failed to send reset link. Please try again.')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-md border border-neutral-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-neutral-900 mb-2">Reset Password</h1>
          <p className="text-neutral-500 text-sm">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <p className="text-neutral-600 mb-6">
              If an account exists for <strong>{identifier}</strong>, you&apos;ll receive a reset link shortly.
            </p>
            <Button asChild className="bg-neutral-900 hover:bg-neutral-800">
              <Link href="/login">Back to Sign In</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Input
              type="text"
              placeholder="Email or mobile number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-12"
              required
            />
            <Button type="submit" className="w-full h-12 bg-neutral-900 hover:bg-neutral-800">
              Send Reset Link
            </Button>
            <p className="text-center text-sm text-neutral-500">
              <Link href="/login" className="text-amber-700 hover:underline">
                Back to Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
