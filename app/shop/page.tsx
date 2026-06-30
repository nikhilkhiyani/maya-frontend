'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ProductGrid } from '@/components/product/product-grid'
import { FilterSidebar } from '@/components/product/filter-sidebar'
import { Button } from '@/components/ui/button'
import { useProducts } from '@/lib/hooks/useProducts'

const sortOptions = [
  { label: 'Newest', value: 'new-arrivals' },
  { label: 'Price: Low to High', value: 'price-low-high' },
  { label: 'Price: High to Low', value: 'price-high-low' },
  { label: 'Popular', value: 'popular' },
]

function ShopContent() {
  const searchParams = useSearchParams()
  const initialSort = searchParams.get('sort') || 'new-arrivals'

  const [page, setPage] = useState(0)
  const [sort, setSort] = useState(initialSort)
  const [showFilters, setShowFilters] = useState(false)
  const [priceFilter, setPriceFilter] = useState<{ minPrice?: number; maxPrice?: number }>({})
  const [search, setSearch] = useState('')

  const filters = useMemo(() => ({
    page,
    size: 12,
    minPrice: priceFilter.minPrice,
    maxPrice: priceFilter.maxPrice,
    search: search || undefined,
  }), [page, priceFilter, search])

  const { products, totalPages, totalElements, isLoading } = useProducts(filters)

  const sortedProducts = useMemo(() => {
    const sorted = [...products]
    switch (sort) {
      case 'price-low-high':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-high-low':
        return sorted.sort((a, b) => b.price - a.price)
      case 'popular':
        return sorted.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
      case 'new-arrivals':
      default:
        return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    }
  }, [products, sort])

  const handleFilterChange = (newFilters: { priceRange?: [number, number] }) => {
    if (newFilters.priceRange) {
      setPriceFilter({ minPrice: newFilters.priceRange[0], maxPrice: newFilters.priceRange[1] })
    }
    setPage(0)
  }

  const pageTitle = sort === 'new-arrivals' ? 'New Arrivals' : 'All Collections'

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: pageTitle }]} />

      <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold">{pageTitle}</h1>
          <p className="text-neutral-500 mt-1">{totalElements} products</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
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
            aria-label="Toggle filters"
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

          {!isLoading && sortedProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg mb-2">No products found</p>
              <p className="text-neutral-400 text-sm">Try adjusting your filters or search</p>
            </div>
          )}

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

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
