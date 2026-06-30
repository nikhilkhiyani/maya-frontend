'use client'

import { useEffect, useState } from 'react'
import { adminApi, Coupon } from '@/lib/api/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    code: '',
    description: '',
    type: 'PERCENTAGE' as Coupon['type'],
    value: 10,
    minCartAmount: 0,
    usageLimit: 100,
    active: true,
  })

  const load = () => adminApi.getCoupons().then(setCoupons).catch(() => {})

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await adminApi.createCoupon(form)
    setShowModal(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return
    await adminApi.deleteCoupon(id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-neutral-900">Coupons</h1>
          <p className="text-neutral-500 mt-1">Manage discount codes and promotions</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-neutral-900 hover:bg-neutral-800">
          <Plus className="h-4 w-4 mr-2" /> Create Coupon
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-100">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Used</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4 font-mono font-semibold">{c.code}</td>
                <td className="px-6 py-4 text-sm">{c.type}</td>
                <td className="px-6 py-4 text-sm">{c.type === 'PERCENTAGE' ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="px-6 py-4 text-sm">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${c.active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-serif mb-4">New Coupon</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Coupon['type'] })} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="PERCENTAGE">Percentage</option>
                <option value="FLAT">Flat Amount</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
              <Input type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) })} required />
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-neutral-900 hover:bg-neutral-800">Create</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
