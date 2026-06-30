import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem, Order, Address } from './types'

interface StoreState {
  cart: CartItem[]
  wishlist: Product[]
  recentlyViewed: Product[]
  orders: Order[]
  addresses: Address[]
  darkMode: boolean
  
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void
  removeFromCart: (productId: string, size: string, color: string) => void
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  
  addToRecentlyViewed: (product: Product) => void
  
  addOrder: (order: Order) => void
  
  addAddress: (address: Address) => void
  updateAddress: (address: Address) => void
  removeAddress: (addressId: string) => void
  
  toggleDarkMode: () => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      recentlyViewed: [],
      orders: [],
      addresses: [],
      darkMode: false,
      
      addToCart: (product, size, color, quantity = 1) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) =>
              item.product.id === product.id &&
              item.selectedSize === size &&
              item.selectedColor === color
          )
          
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id &&
                item.selectedSize === size &&
                item.selectedColor === color
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          
          return {
            cart: [...state.cart, { product, quantity, selectedSize: size, selectedColor: color }],
          }
        })
      },
      
      removeFromCart: (productId, size, color) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(item.product.id === productId &&
                item.selectedSize === size &&
                item.selectedColor === color)
          ),
        }))
      },
      
      updateCartQuantity: (productId, size, color, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
              ? { ...item, quantity }
              : item
          ),
        }))
      },
      
      clearCart: () => set({ cart: [] }),
      
      addToWishlist: (product) => {
        set((state) => {
          if (state.wishlist.find((p) => p.id === product.id)) {
            return state
          }
          return { wishlist: [...state.wishlist, product] }
        })
      },
      
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((p) => p.id !== productId),
        }))
      },
      
      isInWishlist: (productId) => {
        return get().wishlist.some((p) => p.id === productId)
      },
      
      addToRecentlyViewed: (product) => {
        set((state) => {
          const filtered = state.recentlyViewed.filter((p) => p.id !== product.id)
          return {
            recentlyViewed: [product, ...filtered].slice(0, 12),
          }
        })
      },
      
      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }))
      },
      
      addAddress: (address) => {
        set((state) => ({
          addresses: [...state.addresses, { ...address, id: Date.now().toString() }],
        }))
      },
      
      updateAddress: (address) => {
        set((state) => ({
          addresses: state.addresses.map((a) => (a.id === address.id ? address : a)),
        }))
      },
      
      removeAddress: (addressId) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== addressId),
        }))
      },
      
      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }))
      },
    }),
    {
      name: 'neelkanth-atelier-storage',
    }
  )
)
