# Frontend-Backend Integration Guide

This guide explains how to integrate the Next.js frontend with the Spring Boot backend API.

## ✅ What's Been Set Up

### 1. **API Client Layer** (`lib/api/`)
- **client.ts** - Axios instance with JWT interceptor
- **auth.ts** - Authentication APIs (login, register, logout)
- **products.ts** - Product APIs (list, get by ID, filters)
- **cart.ts** - Cart management APIs
- **wishlist.ts** - Wishlist management APIs
- **orders.ts** - Order management APIs
- **users.ts** - User profile APIs

### 2. **Custom Hooks** (`lib/hooks/`)
- **useAuth** - Authentication state and methods
- **useProducts** - Fetch products with filters
- **useProduct** - Fetch single product by ID
- **useCart** - Cart state and operations
- **useWishlist** - Wishlist state and operations
- **useOrders** - Orders state and operations

### 3. **Utilities**
- **mappers.ts** - Convert backend data to frontend format
- Automatic JWT token attachment
- 401 error handling with redirect to login

---

## 🚀 How to Use in Your Pages

### **Authentication Example**

```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks'

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      window.location.href = '/' // Redirect after login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### **Product Listing Example**

```typescript
'use client'

import { useProducts } from '@/lib/hooks'
import { mapCategoryToBackend } from '@/lib/mappers'

export default function ShopPage({ params }: { params: { category: string } }) {
  const { products, isLoading, error } = useProducts({
    category: mapCategoryToBackend(params.category)
  })

  if (isLoading) return <div>Loading products...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### **Product Detail Example**

```typescript
'use client'

import { useProduct } from '@/lib/hooks'

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  // Note: You'll need to get the product ID from the slug
  // For now, you can pass the ID directly if available
  const { product, isLoading, error } = useProduct(productId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!product) return <div>Product not found</div>

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
      {/* Add to cart, wishlist buttons */}
    </div>
  )
}
```

### **Cart Integration Example**

```typescript
'use client'

import { useCart } from '@/lib/hooks'

export default function CartPage() {
  const { cartItems, isLoading, updateQuantity, removeFromCart } = useCart()

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId)
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (isLoading) return <div>Loading cart...</div>

  return (
    <div>
      {cartItems.map(item => (
        <div key={item.product.id}>
          <h3>{item.product.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <button onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}>
            +
          </button>
          <button onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}>
            -
          </button>
          <button onClick={() => handleRemove(item.product.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}
```

### **Wishlist Integration Example**

```typescript
'use client'

import { useWishlist } from '@/lib/hooks'

export default function WishlistPage() {
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist()

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId)
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (isLoading) return <div>Loading wishlist...</div>

  return (
    <div className="wishlist-grid">
      {wishlistItems.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <button onClick={() => handleRemove(product.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}
```

### **Add to Cart/Wishlist from Product Card**

```typescript
'use client'

import { useCart, useWishlist } from '@/lib/hooks'
import { Product } from '@/lib/types'

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist } = useWishlist()

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1)
      alert('Added to cart!')
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleToggleWishlist = async () => {
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id)
      } else {
        await addToWishlist(product.id)
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handleToggleWishlist}>
        {isInWishlist(product.id) ? '❤️' : '🤍'}
      </button>
    </div>
  )
}
```

### **Checkout/Place Order Example**

```typescript
'use client'

import { useCart, useOrders } from '@/lib/hooks'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cartItems } = useCart()
  const { createOrder } = useOrders()
  const router = useRouter()

  const handlePlaceOrder = async () => {
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))

      const order = await createOrder(orderItems)
      alert(`Order placed successfully! Order ID: ${order.id}`)
      router.push('/orders')
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h1>Checkout</h1>
      {/* Display cart items */}
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  )
}
```

### **Orders Page Example**

```typescript
'use client'

import { useOrders } from '@/lib/hooks'

export default function OrdersPage() {
  const { orders, isLoading } = useOrders()

  if (isLoading) return <div>Loading orders...</div>

  return (
    <div>
      <h1>My Orders</h1>
      {orders.map(order => (
        <div key={order.id}>
          <h3>Order #{order.id}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.totalAmount}</p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## 🔐 Protected Routes

For pages that require authentication, check auth status:

```typescript
'use client'

import { useAuth } from '@/lib/hooks'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return null

  return <div>Protected content</div>
}
```

---

## 🎯 Key Points

1. **All API calls are centralized** - No scattered fetch calls
2. **JWT tokens are automatically attached** - Stored in localStorage
3. **401 errors redirect to login** - Automatic auth handling
4. **Data is mapped from backend format** - Seamless integration
5. **Hooks handle loading/error states** - Clean component code

---

## 🔄 Data Flow

```
Component → Hook → API Service → Axios Client → Backend
                                      ↓
                              JWT Interceptor
                                      ↓
                              Authorization Header
```

---

## ⚠️ Important Notes

1. **Backend must be running** on `http://localhost:8080`
2. **Create an admin user** in the database for product management
3. **Products need to be added** via admin APIs or Swagger
4. **CORS is configured** for `http://localhost:3000`
5. **Token is stored** in localStorage (key: "token")

---

## 🧪 Testing the Integration

1. Start backend: `cd studio && ./mvnw spring-boot:run`
2. Start frontend: `cd neelkanth-atelier && npm run dev`
3. Create admin user in database
4. Add products via Swagger (`http://localhost:8080/swagger-ui.html`)
5. Test frontend at `http://localhost:3000`

---

## 📝 Next Steps

1. Replace static product data in existing pages with hooks
2. Create login/register pages
3. Update product listing pages to use `useProducts`
4. Update product detail pages to use `useProduct`
5. Integrate cart/wishlist buttons with hooks
6. Create checkout flow with order creation
7. Add error toast notifications
8. Add loading skeletons

---

## 🐛 Troubleshooting

**Products not loading?**
- Check backend is running
- Check CORS configuration
- Check browser console for errors

**401 Unauthorized?**
- Login first to get JWT token
- Check token in localStorage
- Token might be expired (24h expiry)

**Can't add to cart?**
- Must be logged in
- Check product ID is correct
- Check backend logs

**CORS errors?**
- Ensure backend CORS allows `http://localhost:3000`
- Check `SecurityConfig.java`
