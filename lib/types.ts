export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory?: string
  sizes: string[]
  colors: string[]
  fabric?: string
  inStock: boolean
  isNew?: boolean
  isFeatured?: boolean
  readyToShip?: boolean
  onSale?: boolean
  rating?: number
  reviews?: number
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor: string
}

export interface Order {
  id: string
  date: string
  status: 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled'
  items: CartItem[]
  total: number
  shippingAddress: Address
  trackingNumber?: string
}

export interface Address {
  id?: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  addresses: Address[]
}

export interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
  sizes: string[]
  colors: string[]
  fabrics: string[]
  availability: 'all' | 'in-stock' | 'ready-to-ship'
}

export type SortOption = 'popular' | 'price-low-high' | 'price-high-low' | 'new-arrivals'
