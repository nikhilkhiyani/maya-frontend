'use client'

import { useEffect, useState } from 'react'
import { adminApi, Banner } from '@/lib/api/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { getImageUrl } from '@/lib/utils/images'
import Image from 'next/image'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    buttonText: '',
    buttonLink: '/shop',
    priority: 0,
    active: true,
  })

  const load = () => adminApi.getBanners().then(setBanners).catch(() => {})

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', subtitle: '', image: '', buttonText: 'Shop Now', buttonLink: '/shop', priority: 0, active: true })
    setShowModal(true)
  }

  const openEdit = (b: Banner) => {
    setEditing(b)
    setForm({
      title: b.title,
      subtitle: b.subtitle || '',
      image: b.image,
      buttonText: b.buttonText || '',
      buttonLink: b.buttonLink || '/shop',
      priority: b.priority,
      active: b.active,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, type: 'HERO' as const }
    if (editing) {
      await adminApi.updateBanner(editing.id, payload)
    } else {
      await adminApi.createBanner(payload)
    }
    setShowModal(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return
    await adminApi.deleteBanner(id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-neutral-900">Banners</h1>
          <p className="text-neutral-500 mt-1">Manage homepage hero banners</p>
        </div>
        <Button onClick={openCreate} className="bg-neutral-900 hover:bg-neutral-800">
          <Plus className="h-4 w-4 mr-2" /> Add Banner
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
            <div className="relative aspect-[16/9] bg-neutral-100">
              <Image src={getImageUrl(banner.image)} alt={banner.title} fill className="object-cover" unoptimized />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{banner.title}</h3>
              <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{banner.subtitle}</p>
              <div className="flex justify-between items-center mt-4">
                <span className={`text-xs px-2 py-1 rounded-full ${banner.active ? 'bg-green-100 text-green-700' : 'bg-neutral-100'}`}>
                  {banner.active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(banner)} className="p-2 hover:bg-neutral-100 rounded-lg"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(banner.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-serif mb-4">{editing ? 'Edit Banner' : 'New Banner'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              <Input placeholder="Image path or URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
              <Input placeholder="Button text" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} />
              <Input placeholder="Button link" value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} />
              <Input type="number" placeholder="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-neutral-900 hover:bg-neutral-800">{editing ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
