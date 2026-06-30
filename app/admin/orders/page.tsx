'use client'

import { useEffect, useState } from 'react'
import { ordersApi, BackendOrder } from '@/lib/api'

export default function AdminOrders() {
  const [orders, setOrders] = useState<BackendOrder[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await ordersApi.getAllOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      alert('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusUpdate = async (orderId: string, newStatus: BackendOrder['status']) => {
    try {
      await ordersApi.updateOrderStatus(orderId, newStatus)
      alert('Order status updated successfully')
      fetchOrders()
    } catch (error: any) {
      console.error('Error updating order status:', error)
      alert(error.response?.data?.message || 'Failed to update order status')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING_PAYMENT: 'bg-gray-100 text-gray-800',
      PAYMENT_RECEIVED: 'bg-teal-100 text-teal-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-sky-100 text-sky-800',
      PACKED: 'bg-indigo-100 text-indigo-800',
      READY_TO_SHIP: 'bg-violet-100 text-violet-800',
      SHIPPED: 'bg-yellow-100 text-yellow-800',
      OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      EXCHANGE_REQUESTED: 'bg-purple-100 text-purple-800',
      REFUND_INITIATED: 'bg-pink-100 text-pink-800',
      REFUND_COMPLETED: 'bg-rose-100 text-rose-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.orderNumber || order.id.substring(0, 8)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.userId.substring(0, 8)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{order.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value as BackendOrder['status'])}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="PENDING_PAYMENT">Pending Payment</option>
                    <option value="PAYMENT_RECEIVED">Payment Received</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="PACKED">Packed</option>
                    <option value="READY_TO_SHIP">Ready to Ship</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="EXCHANGE_REQUESTED">Exchange Requested</option>
                    <option value="REFUND_INITIATED">Refund Initiated</option>
                    <option value="REFUND_COMPLETED">Refund Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No orders found
          </div>
        )}
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => ['CONFIRMED', 'PROCESSING', 'PENDING_PAYMENT', 'PAYMENT_RECEIVED'].includes(o.status)).length}
            </p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'SHIPPED').length}
            </p>
            <p className="text-sm text-gray-600">Shipped</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'DELIVERED').length}
            </p>
            <p className="text-sm text-gray-600">Delivered</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {orders.filter(o => o.status === 'CANCELLED').length}
            </p>
            <p className="text-sm text-gray-600">Cancelled</p>
          </div>
        </div>
      </div>
    </div>
  )
}
