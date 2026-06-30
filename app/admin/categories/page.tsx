'use client'

import { useEffect, useState } from 'react'
import { categoriesApi, Category, CategoryRequest } from '@/lib/api/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

const emptyForm: CategoryRequest = {
  name: '',
  slug: '',
  code: '',
  description: '',
  image: '',
  displayOrder: 0,
  enabled: true,
  featured: false,
  showOnHomepage: true,
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<CategoryRequest>(emptyForm)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    categoriesApi.getAllAdmin()
      .then(setCategories)
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
    setError('')
  }

  const openEdit = (cat: Category) => {
    setEditing(cat)
    setForm({
      name: cat.name,
      slug: cat.slug,
      code: cat.code,
      description: cat.description || '',
      image: cat.image || '',
      displayOrder: cat.displayOrder,
      enabled: cat.enabled,
      featured: cat.featured,
      showOnHomepage: cat.showOnHomepage,
    })
    setShowModal(true)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await categoriesApi.update(editing.id, form)
      } else {
        await categoriesApi.create(form)
      }
      setShowModal(false)
      load()
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to save category'
      setError(message || 'Failed to save category')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products must be reassigned first.')) return
    try {
      await categoriesApi.delete(id)
      load()
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to delete'
      alert(message || 'Failed to delete category')
    }
  }

  const toggleEnabled = async (cat: Category) => {
    await categoriesApi.update(cat.id, { enabled: !cat.enabled })
    load()
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-neutral-900">Categories</h1>
          <p className="text-neutral-500 mt-1">Manage product categories for your store</p>
        </div>
        <Button onClick={openCreate} className="bg-neutral-900 hover:bg-neutral-800">
          <Plus className="h-4 w-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-100">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-neutral-50/50">
                <td className="px-6 py-4">
                  <p className="font-medium text-neutral-900">{cat.name}</p>
                  {cat.featured && <span className="text-[10px] text-amber-700 uppercase tracking-wider">Featured</span>}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-500">{cat.slug}</td>
                <td className="px-6 py-4 text-sm">{cat.productCount ?? 0}</td>
                <td className="px-6 py-4 text-sm">{cat.displayOrder}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${cat.enabled ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                    {cat.enabled ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => toggleEnabled(cat)} className="p-2 hover:bg-neutral-100 rounded-lg" title={cat.enabled ? 'Disable' : 'Enable'}>
                      {cat.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-neutral-400" />}
                    </button>
                    <button onClick={() => openEdit(cat)} className="p-2 hover:bg-neutral-100 rounded-lg">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-serif mb-4">{editing ? 'Edit Category' : 'New Category'}</h2>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Name (e.g. Tunics)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Slug (auto-generated if empty)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <Input placeholder="Code (e.g. TUNICS)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm min-h-[80px]"
              />
              <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <Input type="number" placeholder="Display order" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} />
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} /> Enabled</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.showOnHomepage} onChange={(e) => setForm({ ...form, showOnHomepage: e.target.checked })} /> Homepage</label>
              </div>
              <div className="flex gap-3 pt-2">
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
