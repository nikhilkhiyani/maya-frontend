# Quick Start - Frontend Integration

## 🚀 Getting Started

### 1. Start the Backend
```bash
cd /Users/nikhilkhiyani/Desktop/jiya/studio
./mvnw spring-boot:run
```

Backend will run on: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 2. Start the Frontend
```bash
cd /Users/nikhilkhiyani/Desktop/jiya/neelkanth-atelier
npm run dev
```

Frontend will run on: `http://localhost:3000`

---

## 📦 What's Already Installed

- ✅ **axios** - HTTP client
- ✅ **API client** with JWT interceptor
- ✅ **Custom hooks** for all features
- ✅ **Type-safe** API services
- ✅ **Auto token** management
- ✅ **Error handling** with redirects

---

## 🔧 Quick Integration Examples

### Replace Static Products

**Before:**
```typescript
import { products } from '@/lib/data/products'

export default function ShopPage() {
  return <ProductGrid products={products} />
}
```

**After:**
```typescript
'use client'
import { useProducts } from '@/lib/hooks'

export default function ShopPage() {
  const { products, isLoading } = useProducts()
  
  if (isLoading) return <div>Loading...</div>
  return <ProductGrid products={products} />
}
```

### Add Authentication

```typescript
'use client'
import { useAuth } from '@/lib/hooks'

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  
  return (
    <header>
      {isAuthenticated ? (
        <>
          <span>Hello, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </header>
  )
}
```

### Connect Cart

```typescript
'use client'
import { useCart } from '@/lib/hooks'

export function AddToCartButton({ productId }: { productId: string }) {
  const { addToCart } = useCart()
  
  const handleClick = async () => {
    try {
      await addToCart(productId, 1)
      alert('Added to cart!')
    } catch (err: any) {
      alert(err.message)
    }
  }
  
  return <button onClick={handleClick}>Add to Cart</button>
}
```

---

## 📋 Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Database created (`MAYA_db`)
- [ ] Admin user created
- [ ] Products added via Swagger
- [ ] Test login functionality
- [ ] Test product listing
- [ ] Test add to cart
- [ ] Test wishlist
- [ ] Test checkout

---

## 🎯 Priority Integration Order

1. **Authentication** - Login/Register pages
2. **Product Listing** - Shop pages with filters
3. **Product Detail** - Individual product pages
4. **Cart** - Cart page and add-to-cart buttons
5. **Wishlist** - Wishlist page and toggle buttons
6. **Checkout** - Order placement
7. **Orders** - Order history page

---

## 💡 Pro Tips

1. **Use hooks in client components** - Add `'use client'` directive
2. **Handle loading states** - Show skeletons/spinners
3. **Handle errors gracefully** - Toast notifications
4. **Check authentication** - Redirect if needed
5. **Refresh data** - Call refresh functions after mutations

---

## 🔗 Useful Links

- Backend API: `http://localhost:8080/api`
- Swagger Docs: `http://localhost:8080/swagger-ui.html`
- Frontend: `http://localhost:3000`

---

## 📞 Need Help?

Check `INTEGRATION_GUIDE.md` for detailed examples and troubleshooting.
