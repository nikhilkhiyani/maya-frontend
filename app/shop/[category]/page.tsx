'use client'

import { use, useState, useMemo, useEffect } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ProductGrid } from '@/components/product/product-grid'
import { FilterSidebar } from '@/components/product/filter-sidebar'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/lib/hooks/useProducts'
import { categoriesApi, Category } from '@/lib/api/categories'
import { mapCategoryToBackend } from '@/lib/mappers'

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Popular', value: 'popular' },
]

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categorySlug } = use(params)
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null)
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [priceFilter, setPriceFilter] = useState<{ minPrice?: number; maxPrice?: number }>({})
  const [search, setSearch] = useState('')

  useEffect(() => {
    categoriesApi.getBySlug(categorySlug)
      .then(setCategoryInfo)
      .catch(() => setCategoryInfo(null))
  }, [categorySlug])

  const categoryCode = categoryInfo?.code ?? mapCategoryToBackend(categorySlug)
  const categoryName = categoryInfo?.name ?? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' ')

  const filters = useMemo(() => ({
    category: categoryCode,
    page,
    size: 12,
    minPrice: priceFilter.minPrice,
    maxPrice: priceFilter.maxPrice,
    search: search || undefined,
  }), [categoryCode, page, priceFilter, search])

  const { products, totalPages, totalElements, isLoading } = useProducts(filters)

  const sortedProducts = useMemo(() => {
    const sorted = [...products]
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'popular':
        return sorted.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
      default:
        return sorted
    }
  }, [products, sort])

  const handleFilterChange = (filters: { priceRange?: [number, number] }) => {
    if (filters.priceRange) {
      setPriceFilter({ minPrice: filters.priceRange[0], maxPrice: filters.priceRange[1] })
    }
    setPage(0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Collections', href: '/shop' }, { label: categoryName }]} />

      <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">{categoryName}</h1>
          {categoryInfo?.description && (
            <p className="text-neutral-500 mt-1 max-w-xl">{categoryInfo.description}</p>
          )}
          <p className="text-neutral-500 mt-1">{totalElements} products</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search in category..."
            className="border border-neutral-200 rounded-lg px-4 py-2 text-sm w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <FilterSidebar onFilterChange={handleFilterChange} />
        </aside>

        <div>
          <ProductGrid products={sortedProducts} loading={isLoading} />

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    page === i
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
