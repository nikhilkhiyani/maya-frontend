import { apiClient } from './client'
import { PaymentMethod } from './orders'

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED'
export type VerificationStatus = 'UNVERIFIED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED'

export interface PaymentResponse {
  id: string
  checkoutSessionId?: string
  orderId?: string
  orderNumber?: string
  method: PaymentMethod
  status: PaymentStatus
  verificationStatus: VerificationStatus
  provider: string
  amount: number
  currency: string
  transactionId?: string
  failureReason?: string
  expiresAt?: string
  paidAt?: string
  createdAt: string
  qrImageUrl?: string
  logs?: { event: string; details?: string; actor?: string; createdAt: string }[]
}

export interface PaymentStatusResponse {
  paymentId: string
  status: PaymentStatus
  orderId?: string
  orderNumber?: string
  failureReason?: string
}

export interface RazorpayOrderResponse {
  orderId: string
  orderNumber: string
  razorpayOrderId: string
  razorpayKeyId: string
  amount: number
  currency: string
}

export interface PaymentVerifyRequest {
  orderId: string
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}

const TERMINAL_STATUSES: PaymentStatus[] = ['SUCCESS', 'FAILED', 'EXPIRED', 'CANCELLED']

export function isTerminalPaymentStatus(status: PaymentStatus): boolean {
  return TERMINAL_STATUSES.includes(status)
}

export const paymentsApi = {
  initiateUpiPayment: async (checkoutSessionId: string): Promise<PaymentResponse> => {
    const response = await apiClient.post(`/payments/upi/initiate/${checkoutSessionId}`)
    return response.data
  },

  getPaymentStatus: async (paymentId: string): Promise<PaymentResponse> => {
    const response = await apiClient.get(`/payments/${paymentId}/status`)
    return response.data
  },

  checkPaymentStatus: async (paymentId: string): Promise<PaymentStatusResponse> => {
    const response = await apiClient.get(`/payments/status/${paymentId}`)
    return response.data
  },

  retryPayment: async (paymentId: string): Promise<PaymentResponse> => {
    const response = await apiClient.post(`/payments/${paymentId}/retry`)
    return response.data
  },

  cancelPayment: async (paymentId: string): Promise<PaymentResponse> => {
    const response = await apiClient.post(`/payments/${paymentId}/cancel`)
    return response.data
  },

  getAllPayments: async (): Promise<PaymentResponse[]> => {
    const response = await apiClient.get('/payments/admin/all')
    return response.data
  },

  adminVerifyPayment: async (paymentId: string, approved: boolean, note?: string): Promise<PaymentResponse> => {
    const response = await apiClient.post(`/payments/admin/${paymentId}/verify`, null, {
      params: { approved, note },
    })
    return response.data
  },

  createRazorpayOrder: async (orderId: string): Promise<RazorpayOrderResponse> => {
    const response = await apiClient.post(`/payments/razorpay/create/${orderId}`)
    return response.data
  },

  verifyPayment: async (data: PaymentVerifyRequest): Promise<void> => {
    await apiClient.post('/payments/razorpay/verify', data)
  },
}
