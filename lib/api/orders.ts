import { apiClient } from './client'
import { BackendProduct } from './products'

export interface OrderItemRequest {
  productId: string
  quantity: number
  size?: string
}

export type PaymentMethod = 'UPI_QR' | 'RAZORPAY' | 'COD' | 'STRIPE'

export interface OrderRequest {
  items: OrderItemRequest[]
  addressId?: string
  shippingFullName?: string
  shippingPhone?: string
  shippingAddressLine1?: string
  shippingAddressLine2?: string
  shippingCity?: string
  shippingState?: string
  shippingPincode?: string
  couponCode?: string
  orderNotes?: string
  paymentMethod: PaymentMethod
  fromCart?: boolean
}

export interface BackendOrderItem {
  id: string
  product: BackendProduct
  quantity: number
  size?: string
  price: number
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_RECEIVED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'EXCHANGE_REQUESTED'
  | 'EXCHANGE_UNDER_REVIEW'
  | 'EXCHANGE_APPROVED'
  | 'EXCHANGE_REJECTED'
  | 'REFUND_INITIATED'
  | 'REFUND_COMPLETED'
  | 'CANCELLED'

export interface OrderTimelineEntry {
  id: string
  status: OrderStatus
  title: string
  description?: string
  updatedBy?: string
  createdAt: string
}

export interface BackendOrder {
  id: string
  userId: string
  orderNumber: string
  invoiceNumber?: string
  trackingNumber: string
  orderItems: BackendOrderItem[]
  totalAmount: number
  shippingAmount: number
  taxAmount: number
  discountAmount: number
  couponCode?: string
  orderNotes?: string
  courierName?: string
  shipmentNotes?: string
  customerShipmentNotes?: string
  shipmentDate?: string
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
  billingCity?: string
  billingState?: string
  billingPincode?: string
  paymentMethod: PaymentMethod
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED'
  status: OrderStatus
  expectedDelivery?: string
  createdAt: string
  updatedAt: string
}

export interface ShipmentUpdateRequest {
  courierName?: string
  trackingNumber?: string
  shipmentDate?: string
  expectedDelivery?: string
  shipmentNotes?: string
  customerShipmentNotes?: string
  status?: OrderStatus
}

export const ordersApi = {
  createOrder: async (data: OrderRequest): Promise<BackendOrder> => {
    const response = await apiClient.post('/orders', data)
    return response.data
  },

  getMyOrders: async (): Promise<BackendOrder[]> => {
    const response = await apiClient.get('/orders/my')
    return response.data
  },

  getOrderById: async (id: string): Promise<BackendOrder> => {
    const response = await apiClient.get(`/orders/${id}`)
    return response.data
  },

  getOrderTimeline: async (id: string): Promise<OrderTimelineEntry[]> => {
    const response = await apiClient.get(`/orders/${id}/timeline`)
    return response.data
  },

  downloadInvoice: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/orders/${id}/invoice`, { responseType: 'blob' })
    return response.data
  },

  getOrderByNumber: async (orderNumber: string): Promise<BackendOrder> => {
    const response = await apiClient.get(`/orders/track/${encodeURIComponent(orderNumber)}`)
    return response.data
  },

  getAllOrders: async (): Promise<BackendOrder[]> => {
    const response = await apiClient.get('/admin/orders')
    return response.data
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<BackendOrder> => {
    const response = await apiClient.put(`/admin/orders/${id}/status`, null, {
      params: { status },
    })
    return response.data
  },

  updateShipment: async (id: string, data: ShipmentUpdateRequest): Promise<BackendOrder> => {
    const response = await apiClient.put(`/admin/orders/${id}/shipment`, data)
    return response.data
  },
}
