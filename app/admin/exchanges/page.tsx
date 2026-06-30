'use client'

import { useEffect, useState } from 'react'
import { exchangesApi, Exchange } from '@/lib/api/exchanges'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils/images'

export default function AdminExchangesPage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    exchangesApi.getAll().then(setExchanges).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleReview = async (id: string, approved: boolean) => {
    const remarks = prompt(approved ? 'Approval remarks (optional):' : 'Rejection reason:') || undefined
    await exchangesApi.review(id, approved, remarks)
    load()
  }

  if (loading) return <div className="flex justify-center h-64"><div className="animate-spin h-10 w-10 border-b-2 border-neutral-900 rounded-full" /></div>

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Exchange Requests</h1>
      <div className="space-y-4">
        {exchanges.map((ex) => (
          <div key={ex.id} className="bg-white rounded-2xl p-6 shadow border border-neutral-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold">{ex.orderNumber} — {ex.productName}</p>
                <p className="text-sm text-neutral-500">{ex.reason} · {ex.status}</p>
              </div>
              {ex.status === 'PENDING' || ex.status === 'UNDER_REVIEW' ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleReview(ex.id, true)}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => handleReview(ex.id, false)}>Reject</Button>
                </div>
              ) : null}
            </div>
            <p className="text-sm text-neutral-600 mb-4">{ex.description}</p>
            <div className="flex gap-2 flex-wrap">
              {ex.imageUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <Image src={getImageUrl(url)} alt="" fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
            {ex.adminRemarks && <p className="text-xs text-neutral-500 mt-3">Admin: {ex.adminRemarks}</p>}
          </div>
        ))}
        {exchanges.length === 0 && <p className="text-neutral-500">No exchange requests.</p>}
      </div>
    </div>
  )
}
