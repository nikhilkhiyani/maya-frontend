'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Clock, CheckCircle, AlertCircle, Loader2, XCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  checkoutApi,
  paymentsApi,
  CheckoutSession,
  PaymentResponse,
  isTerminalPaymentStatus,
} from '@/lib/api'
import { BACKEND_URL } from '@/lib/api/client'
import { formatPrice } from '@/lib/utils'

const POLL_INTERVAL_MS = 3000

function resolveQrUrl(qrImageUrl?: string): string {
  const path = qrImageUrl || '/uploads/IMG_4459.JPG'
  if (path.startsWith('http')) return path
  return `${BACKEND_URL}${path}`
}

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session')

  const [session, setSession] = useState<CheckoutSession | null>(null)
  const [payment, setPayment] = useState<PaymentResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [redirecting, setRedirecting] = useState(false)
  const [qrSrc, setQrSrc] = useState('')
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const updateTimerFromPayment = useCallback((pay: PaymentResponse) => {
    if (pay.expiresAt) {
      const remaining = Math.max(0, Math.floor((new Date(pay.expiresAt).getTime() - Date.now()) / 1000))
      setTimeLeft(remaining)
    }
  }, [])

  const loadPayment = useCallback(async () => {
    if (!sessionId) return
    try {
      setError('')
      const sess = await checkoutApi.getSession(sessionId)
      setSession(sess)
      const pay = await paymentsApi.initiateUpiPayment(sessionId)
      setPayment(pay)
      setQrSrc(resolveQrUrl(pay.qrImageUrl))
      updateTimerFromPayment(pay)

      if (pay.status === 'SUCCESS' && pay.orderId) {
        setRedirecting(true)
        router.replace(`/order-success?orderId=${pay.orderId}`)
      }
    } catch {
      setError('Unable to load payment session. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [sessionId, router, updateTimerFromPayment])

  useEffect(() => {
    if (!sessionId) {
      router.replace('/checkout')
      return
    }
    loadPayment()
  }, [sessionId, router, loadPayment])

  useEffect(() => {
    if (!payment || isTerminalPaymentStatus(payment.status) || redirecting) return

    const poll = async () => {
      try {
        const status = await paymentsApi.checkPaymentStatus(payment.id)
        if (status.status !== payment.status) {
          const full = await paymentsApi.getPaymentStatus(payment.id)
          setPayment(full)
          if (full.status === 'SUCCESS' && full.orderId) {
            setRedirecting(true)
            if (pollingRef.current) clearInterval(pollingRef.current)
            setTimeout(() => {
              router.replace(`/order-success?orderId=${full.orderId}`)
            }, 1500)
          }
        }
      } catch {
        /* network errors — keep polling */
      }
    }

    poll()
    pollingRef.current = setInterval(poll, POLL_INTERVAL_MS)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [payment?.id, payment?.status, redirecting, router])

  useEffect(() => {
    if (!payment || payment.status !== 'PENDING' || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        const next = Math.max(0, t - 1)
        if (next === 0) {
          setPayment((prev) =>
            prev && prev.status === 'PENDING'
              ? { ...prev, status: 'EXPIRED', failureReason: 'Payment timeout — QR code expired' }
              : prev
          )
        }
        return next
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [payment?.status, timeLeft, payment])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleRetry = async () => {
    if (!payment) return
    setRetrying(true)
    setError('')
    try {
      const newPayment = await paymentsApi.retryPayment(payment.id)
      setPayment(newPayment)
      setQrSrc(resolveQrUrl(newPayment.qrImageUrl))
      updateTimerFromPayment(newPayment)
      setRedirecting(false)
    } catch {
      setError('Failed to create a new payment session. Please try again.')
    } finally {
      setRetrying(false)
    }
  }

  const handleCancel = async () => {
    if (!payment) return
    setError('')
    try {
      const updated = await paymentsApi.cancelPayment(payment.id)
      if (pollingRef.current) clearInterval(pollingRef.current)
      setPayment(updated)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(message || 'Failed to cancel payment. Please try again.')
    }
  }

  const handleQrError = () => {
    setQrSrc(`${BACKEND_URL}/uploads/IMG_4459.JPG`)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-neutral-900" />
      </div>
    )
  }

  if (!session || !payment) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="text-neutral-600 text-center">{error || 'Payment session not found'}</p>
        <Button asChild><Link href="/checkout">Return to Checkout</Link></Button>
      </div>
    )
  }

  const isPending = payment.status === 'PENDING' && timeLeft > 0
  const isSuccess = payment.status === 'SUCCESS' || redirecting
  const isFailed = payment.status === 'FAILED'
  const isExpired = payment.status === 'EXPIRED' || (payment.status === 'PENDING' && timeLeft <= 0)
  const isCancelled = payment.status === 'CANCELLED'

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-2">Complete Payment</h1>
          <p className="text-neutral-500">Scan the QR code to pay via UPI</p>
        </div>

        {isSuccess && (
          <div className="text-center py-16 animate-in fade-in duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-14 w-14 text-green-600" />
            </div>
            <h2 className="text-3xl font-serif text-green-800 mb-2">Payment Successful</h2>
            <p className="text-green-600 mb-4">Payment received successfully.</p>
            <p className="text-neutral-500 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting...
            </p>
          </div>
        )}

        {!isSuccess && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="bg-neutral-900 text-white p-6 text-center">
                <p className="text-sm text-neutral-400">Amount to Pay</p>
                <p className="text-3xl font-serif text-amber-400 mt-1">{formatPrice(payment.amount)}</p>
              </div>
              <CardContent className="p-8 flex flex-col items-center">
                {isPending && (
                  <>
                    <div className="relative w-64 h-64 bg-white rounded-2xl border-2 border-neutral-100 shadow-inner flex items-center justify-center mb-6 overflow-hidden">
                      {/* Plain <img> (not next/image) so the merchant QR always renders
                          regardless of NEXT_PUBLIC_API_URL / remotePatterns config. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrSrc || `${BACKEND_URL}/uploads/IMG_4459.JPG`}
                        alt="Payment QR Code"
                        width={240}
                        height={240}
                        className="object-contain p-2"
                        onError={handleQrError}
                      />
                    </div>
                    <div className="w-full space-y-3 text-sm text-neutral-600">
                      <div className="flex items-center gap-2 justify-center">
                        <Clock className="h-4 w-4" />
                        <span>
                          Time remaining:{' '}
                          <strong className={timeLeft < 60 ? 'text-red-600' : ''}>
                            {formatTime(timeLeft)}
                          </strong>
                        </span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-left">
                        <li>Open your UPI app (GPay, PhonePe, Paytm, BHIM, etc.)</li>
                        <li>Scan the QR code above</li>
                        <li>Pay exactly {formatPrice(payment.amount)}</li>
                      </ol>
                    </div>
                  </>
                )}

                {isExpired && (
                  <div className="text-center py-8">
                    <Clock className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-serif text-neutral-900 mb-2">QR Code Expired</h3>
                    <p className="text-neutral-500 text-sm mb-6">
                      The payment window has closed. Generate a new QR to continue.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button onClick={handleRetry} disabled={retrying} className="w-full h-12 bg-neutral-900">
                        {retrying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        Generate New QR
                      </Button>
                      <Button asChild variant="outline" className="w-full h-12">
                        <Link href="/cart">Back to Cart</Link>
                      </Button>
                    </div>
                  </div>
                )}

                {(isFailed || isCancelled) && (
                  <div className="text-center py-8">
                    <XCircle className={`h-16 w-16 mx-auto mb-4 ${isCancelled ? 'text-neutral-400' : 'text-red-500'}`} />
                    <h3 className="text-xl font-serif text-neutral-900 mb-2">
                      {isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
                    </h3>
                    {payment.failureReason && (
                      <p className="text-neutral-500 text-sm mb-6">{payment.failureReason}</p>
                    )}
                    <div className="flex flex-col gap-3">
                      <Button onClick={handleRetry} disabled={retrying} className="w-full h-12 bg-neutral-900">
                        {retrying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        Retry Payment
                      </Button>
                      <Button asChild variant="outline" className="w-full h-12">
                        <Link href={isCancelled ? '/' : '/shop'}>
                          {isCancelled ? 'Home' : 'Continue Shopping'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-0 shadow-xl rounded-3xl">
                <CardContent className="p-8">
                  <h2 className="text-xl font-serif mb-4">Payment Status</h2>
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
                      isFailed ? 'bg-red-50 text-red-700' :
                      isExpired ? 'bg-amber-50 text-amber-700' :
                      isCancelled ? 'bg-neutral-50 text-neutral-700' :
                      'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Clock className="h-5 w-5" />}
                    <div>
                      <span className="font-medium block">
                        {isPending ? 'Waiting for Payment...' :
                         isExpired ? 'QR Code Expired' :
                         isCancelled ? 'Payment Cancelled' :
                         isFailed ? 'Payment Failed' : 'Processing...'}
                      </span>
                      {isPending && (
                        <span className="text-sm opacity-80">
                          Please complete payment using any UPI app.
                        </span>
                      )}
                    </div>
                  </div>

                  {isPending && (
                    <p className="text-sm text-neutral-500 mb-6 bg-neutral-50 p-4 rounded-xl">
                      We will automatically detect your payment. No need to enter a transaction ID.
                    </p>
                  )}

                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Payment ID</span>
                      <span className="font-mono text-xs">{payment.id.slice(0, 8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Amount</span>
                      <span className="font-semibold">{formatPrice(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Method</span>
                      <span>UPI QR</span>
                    </div>
                  </div>

                  {isPending && (
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="w-full h-11 text-neutral-600"
                    >
                      Cancel Payment
                    </Button>
                  )}

                  {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-3xl">
                <CardContent className="p-6 text-sm text-neutral-600">
                  <h3 className="font-medium text-neutral-900 mb-2">Order Summary</h3>
                  <p>{session.items.length} item(s) · Total {formatPrice(session.totalAmount)}</p>
                  <p className="mt-2">Ship to: {session.shippingCity}, {session.shippingPincode}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  )
}
