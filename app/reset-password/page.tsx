'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authApi } from '@/lib/api/auth'

function ResetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) { setError('Invalid reset link'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    try {
      await authApi.resetPassword(token, password)
      setDone(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch {
      setError('Failed to reset password. The link may have expired.')
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">Invalid or missing reset token.</p>
        <Button asChild><Link href="/forgot-password">Request New Link</Link></Button>
      </div>
    )
  }

  if (done) {
    return <p className="text-center text-green-700">Password reset successfully. Redirecting to login...</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Input type="password" placeholder="New password" value={password}
        onChange={(e) => setPassword(e.target.value)} className="h-12" required />
      <Input type="password" placeholder="Confirm password" value={confirm}
        onChange={(e) => setConfirm(e.target.value)} className="h-12" required />
      <Button type="submit" className="w-full h-12 bg-neutral-900">Reset Password</Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-md border border-neutral-100">
        <h1 className="text-3xl font-serif text-center mb-8">Set New Password</h1>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  )
}
