# Admin Panel Documentation

## 🔐 Access

**URL**: `http://localhost:3000/admin`

**Authorization**: Only users with `ADMIN` role can access the admin panel.

**Protection**: 
- JWT token is decoded to check user role
- Non-admin users are automatically redirected to homepage
- All admin routes are protected by the admin layout

---

## 📊 Dashboard (`/admin`)

### Features:
- **Total Users** - Count of all registered users
- **Total Orders** - Count of all orders
- **Total Revenue** - Sum of all order amounts
- **Total Products** - Count of all products

### Quick Actions:
- Navigate to Products Management
- Navigate to Orders Management
- Navigate to Users List

---

## 📦 Products Management (`/admin/products`)

### View Products Table:
- Product Name
- Category
- Price
- Stock Level

### Actions:

#### Create Product
1. Click "Create Product" button
2. Fill in the form:
   - **Name** (required)
   - **Description** (required)
   - **Category** (dropdown: WOMEN, MEN, JEWELRY, SAREE, LEHENGA, KURTI, ACCESSORIES)
   - **Stock** (required, number)
   - **Price** (required, number)
   - **Discount Price** (optional, number)
   - **Images** (comma-separated URLs)
   - **Ready to Ship** (checkbox)
3. Click "Create"

**API**: `POST /api/admin/products`

#### Edit Product
1. Click "Edit" on any product row
2. Modify fields in the modal
3. Click "Update"

**API**: `PUT /api/admin/products/{id}`

#### Delete Product
1. Click "Delete" on any product row
2. Confirm deletion
3. Product is removed

**API**: `DELETE /api/admin/products/{id}`

---

## 🛒 Orders Management (`/admin/orders`)

### View Orders Table:
- Order ID (truncated)
- User ID (truncated)
- Total Amount
- Status (color-coded badge)
- Order Date

### Update Order Status:
1. Use the dropdown in the "Actions" column
2. Select new status:
   - **PLACED** (Blue) - Order received
   - **SHIPPED** (Yellow) - Order dispatched
   - **DELIVERED** (Green) - Order completed
   - **CANCELLED** (Red) - Order cancelled
3. Status updates immediately

**API**: `PUT /api/admin/orders/{id}/status?status={STATUS}`

### Order Statistics:
- Count of orders by status (Placed, Shipped, Delivered, Cancelled)

---

## 👥 Users Management (`/admin/users`)

### View Users Table:
- Name
- Email
- Role (ADMIN or USER badge)
- Join Date

### User Statistics:
- Total Users
- Admin Count
- Customer Count

**Note**: Currently read-only. Role changes must be done via database.

---

## 🎨 UI Features

### Layout:
- **Sidebar Navigation** with icons
- Active route highlighting
- "Back to Store" link at bottom
- User name display in header

### Design:
- Clean, minimal interface
- Responsive tables
- Modal forms for create/edit
- Color-coded status badges
- Loading states
- Empty state messages

---

## 🔧 Technical Details

### Authorization Flow:
1. User logs in via `/login` (to be created)
2. JWT token stored in localStorage
3. Token decoded to check role
4. Admin layout checks `isAdmin()` function
5. Non-admin redirected to homepage

### JWT Decoding:
```typescript
// lib/utils/auth.ts
export function isAdmin(): boolean {
  const token = localStorage.getItem('token')
  const decoded = decodeJWT(token)
  return decoded?.role === 'ADMIN'
}
```

### API Integration:
All admin pages use the existing API layer:
- `productsApi.getAll()`, `create()`, `update()`, `delete()`
- `ordersApi.getAllOrders()`, `updateOrderStatus()`
- `usersApi.getAllUsers()`

---

## 🚀 Getting Started

### 1. Create Admin User

Since registration creates USER role by default, manually update in database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### 2. Login as Admin

Create a login page (or use existing) and login with admin credentials.

### 3. Access Admin Panel

Navigate to `http://localhost:3000/admin`

### 4. Add Products

1. Go to Products Management
2. Click "Create Product"
3. Fill in product details
4. Submit

### 5. Manage Orders

1. Go to Orders Management
2. Update order statuses as needed

---

## 📝 Example Product Creation

```json
{
  "name": "Silk Saree",
  "description": "Beautiful handwoven silk saree",
  "category": "SAREE",
  "price": 5999,
  "discountPrice": 4999,
  "stock": 10,
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "isReadyToShip": true,
  "rating": 0
}
```

---

## 🛡️ Security

- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Auto-redirect for unauthorized users
- ✅ Token stored securely in localStorage

---

## 🎯 Features Checklist

- ✅ Dashboard with statistics
- ✅ Products CRUD operations
- ✅ Order status management
- ✅ User listing
- ✅ Role-based protection
- ✅ Clean minimal UI
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ API integration

---

## 🔮 Future Enhancements (Optional)

- User role management from UI
- Bulk product upload
- Order filtering and search
- Sales analytics charts
- Product image upload
- Export data to CSV
- Email notifications
- Inventory alerts

---

## 🐛 Troubleshooting

**Can't access admin panel?**
- Ensure you're logged in
- Check your role is ADMIN in database
- Clear localStorage and login again

**Products not showing?**
- Check backend is running
- Verify API endpoints are accessible
- Check browser console for errors

**Can't create products?**
- Ensure all required fields are filled
- Check image URLs are valid
- Verify backend validation rules

---

## 📞 Support

For issues or questions, check:
- `INTEGRATION_GUIDE.md` - API integration details
- `QUICK_START.md` - Setup instructions
- Backend Swagger: `http://localhost:8080/swagger-ui.html`
