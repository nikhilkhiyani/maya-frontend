import { apiClient } from './client'
import { PaymentMethod } from './orders'

export interface CheckoutRequest {
  addressId?: string
  billingAddressId?: string
  billingSameAsShipping?: boolean
  shippingFullName?: string
  shippingPhone?: string
  shippingAddressLine1?: string
  shippingAddressLine2?: string
  shippingCity?: string
  shippingState?: string
  shippingPincode?: string
  billingFullName?: string
  billingPhone?: string
  billingAddressLine1?: string
  billingAddressLine2?: string
  billingCity?: string
  billingState?: string
  billingPincode?: string
  email?: string
  gstNumber?: string
  couponCode?: string
  orderNotes?: string
  termsAccepted: boolean
  paymentMethod: PaymentMethod
  fromCart?: boolean
}

export interface CheckoutItem {
  productId: string
  productName: string
  productSlug: string
  productImage?: string
  quantity: number
  size?: string
  unitPrice: number
  lineTotal: number
}

export interface CheckoutSession {
  id: string
  items: CheckoutItem[]
  shippingFullName: string
  shippingPhone: string
  shippingAddressLine1: string
  shippingAddressLine2?: string
  shippingCity: string
  shippingState: string
  shippingPincode: string
  billingFullName?: string
  billingPhone?: string
  billingAddressLine1?: string
  billingAddressLine2?: string
  billingCity?: string
  billingState?: string
  billingPincode?: string
  billingSameAsShipping: boolean
  email?: string
  gstNumber?: string
  couponCode?: string
  orderNotes?: string
  subtotal: number
  shippingAmount: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  paymentMethod: PaymentMethod
  status: 'ACTIVE' | 'PAYMENT_PENDING' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED'
  expiresAt: string
  estimatedDelivery?: string
  orderId?: string
  orderNumber?: string
}

export const checkoutApi = {
  createSession: async (data: CheckoutRequest): Promise<CheckoutSession> => {
    const response = await apiClient.post('/checkout/sessions', data)
    return response.data
  },

  getSession: async (id: string): Promise<CheckoutSession> => {
    const response = await apiClient.get(`/checkout/sessions/${id}`)
    return response.data
  },
}
