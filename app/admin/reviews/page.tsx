'use client'

import { useEffect, useState } from 'react'
import { reviewsApi, Review } from '@/lib/api/reviews'
import { Button } from '@/components/ui/button'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    reviewsApi.getPending().then(setReviews).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const moderate = async (id: string, status: Review['status']) => {
    await reviewsApi.moderate(id, status)
    load()
  }

  if (loading) return <div className="flex justify-center h-64"><div className="animate-spin h-10 w-10 border-b-2 border-neutral-900 rounded-full" /></div>

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Review Moderation</h1>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl p-6 shadow border border-neutral-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{r.productName} — {'★'.repeat(r.rating)}</p>
                <p className="text-sm text-neutral-500">by {r.userName} · {r.status}</p>
                <p className="font-medium mt-2">{r.title}</p>
                <p className="text-sm text-neutral-600 mt-1">{r.comment}</p>
              </div>
              {r.status === 'PENDING' && (
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" onClick={() => moderate(r.id, 'APPROVED')}>Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => moderate(r.id, 'REJECTED')}>Reject</Button>
                  <Button size="sm" variant="outline" onClick={() => moderate(r.id, 'HIDDEN')}>Hide</Button>
                  <Button size="sm" variant="outline" onClick={() => moderate(r.id, 'SPAM')}>Spam</Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-neutral-500">No pending reviews.</p>}
      </div>
    </div>
  )
}
