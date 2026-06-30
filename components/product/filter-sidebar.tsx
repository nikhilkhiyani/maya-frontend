'use client'

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void
  onClose?: () => void
  isMobile?: boolean
}

const defaultCategories = ['Tunics', 'Top & Bottoms', 'Co-ords', 'Dresses']

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']

const colors = [
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'Green', value: 'green', hex: '#10B981' },
  { name: 'Yellow', value: 'yellow', hex: '#F59E0B' },
  { name: 'Pink', value: 'pink', hex: '#EC4899' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Indigo', value: 'indigo', hex: '#6366F1' },
]

const fabrics = ['Cotton', 'Silk', 'Linen', 'Khadi', 'Chanderi', 'Cotton Silk']

export function FilterSidebar({ onFilterChange, onClose, isMobile }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [availability, setAvailability] = useState<string>('all')
  
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'category', 'price', 'size', 'color', 'fabric', 'availability'
  ])

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(updated)
    onFilterChange({ categories: updated })
  }

  const handleSizeToggle = (size: string) => {
    const updated = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size]
    setSelectedSizes(updated)
    onFilterChange({ sizes: updated })
  }

  const handleColorToggle = (color: string) => {
    const updated = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color]
    setSelectedColors(updated)
    onFilterChange({ colors: updated })
  }

  const handleFabricToggle = (fabric: string) => {
    const updated = selectedFabrics.includes(fabric)
      ? selectedFabrics.filter(f => f !== fabric)
      : [...selectedFabrics, fabric]
    setSelectedFabrics(updated)
    onFilterChange({ fabrics: updated })
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedFabrics([])
    setPriceRange([0, 50000])
    setAvailability('all')
    onFilterChange({})
  }

  const FilterSection = ({ title, id, children }: { title: string; id: string; children: React.ReactNode }) => (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => toggleSection(id)}
        className="flex items-center justify-between w-full py-2 text-sm font-semibold"
      >
        {title}
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            expandedSections.includes(id) && 'rotate-180'
          )}
        />
      </button>
      {expandedSections.includes(id) && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className={cn(
      "bg-background",
      isMobile && "fixed inset-0 z-50 overflow-y-auto p-6"
    )}>
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-semibold">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        <FilterSection title="Category" id="category">
          {defaultCategories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </FilterSection>

        <FilterSection title="Price Range" id="price">
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => {
                const newRange: [number, number] = [0, parseInt(e.target.value)]
                setPriceRange(newRange)
                onFilterChange({ priceRange: newRange })
              }}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span>₹0</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Size" id="size">
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={cn(
                  "px-3 py-2 text-xs border rounded-md transition-colors",
                  selectedSizes.includes(size)
                    ? "bg-primary text-white border-primary"
                    : "border-border hover:border-primary"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Color" id="color">
          <div className="grid grid-cols-4 gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorToggle(color.name)}
                className={cn(
                  "relative w-10 h-10 rounded-full border-2 transition-all",
                  selectedColors.includes(color.name)
                    ? "border-primary scale-110"
                    : "border-border hover:scale-105"
                )}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
              >
                {selectedColors.includes(color.name) && (
                  <span className="absolute inset-0 flex items-center justify-center text-white">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Fabric" id="fabric">
          {fabrics.map((fabric) => (
            <label key={fabric} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFabrics.includes(fabric)}
                onChange={() => handleFabricToggle(fabric)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm">{fabric}</span>
            </label>
          ))}
        </FilterSection>

        <FilterSection title="Availability" id="availability">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={availability === 'all'}
                onChange={() => {
                  setAvailability('all')
                  onFilterChange({ availability: 'all' })
                }}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm">All Products</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={availability === 'in-stock'}
                onChange={() => {
                  setAvailability('in-stock')
                  onFilterChange({ availability: 'in-stock' })
                }}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="availability"
                checked={availability === 'ready-to-ship'}
                onChange={() => {
                  setAvailability('ready-to-ship')
                  onFilterChange({ availability: 'ready-to-ship' })
                }}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm">Ready to Ship</span>
            </label>
          </div>
        </FilterSection>
      </div>

      {isMobile && (
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={clearAllFilters} className="flex-1">
            Clear All
          </Button>
          <Button onClick={onClose} className="flex-1">
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  )
}
