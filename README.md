# MAYA - Premium Indo-Latin Fusion E-commerce

A production-ready, fully responsive e-commerce web application for a premium clothing brand featuring Indo-Latin fusion wear. Built with Next.js 16, TypeScript, Tailwind CSS v4, and modern web technologies.

## 🎨 Design Philosophy

**Indo-Latin Fusion Theme:**
- Primary: Deep Indigo (#1e3a5f)
- Secondary: Ivory/Off-white (#f5f1e8)
- Accent: Gold (#c9a961) & Muted Terracotta (#d4a59a)
- Typography: Playfair Display (serif headings) + Inter (sans-serif body)
- Aesthetic: Elegant, breathable spacing, high-end fashion editorial

## ✨ Features

### Core Pages
- **Home Page**: Hero carousel, featured collections, product sections, newsletter
- **Product Listing**: Advanced filters, sorting, 21,038+ products across categories
- **Product Detail**: Image gallery, size/color variants, reviews, related products
- **Shopping Cart**: Quantity controls, price breakdown, shipping calculator
- **Wishlist**: Save favorite items
- **Checkout**: Address management, payment options, order summary
- **User Profile**: Account management, saved addresses, order history
- **Order Tracking**: Real-time order status timeline
- **About Page**: Brand story, values, philosophy

### Key Features
- ✅ Fully responsive (mobile-first design)
- ✅ Dark mode support
- ✅ Advanced product filtering (category, price, size, color, fabric)
- ✅ Product sorting (popular, price, new arrivals)
- ✅ Wishlist functionality
- ✅ Cart management with persistence
- ✅ Order tracking system
- ✅ Recently viewed products
- ✅ SEO-optimized structure
- ✅ Smooth animations with Framer Motion
- ✅ Image optimization with Next.js Image
- ✅ State management with Zustand
- ✅ Type-safe with TypeScript

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components following shadcn/ui patterns
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand with persistence
- **Fonts**: Google Fonts (Playfair Display, Inter)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
neelkanth-atelier/
├── app/                      # Next.js App Router pages
│   ├── about/               # About page
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout flow
│   ├── orders/              # Order details & tracking
│   ├── product/[slug]/      # Product detail pages
│   ├── profile/             # User profile
│   ├── shop/[category]/     # Category listing pages
│   ├── track-order/         # Order tracking
│   ├── wishlist/            # Wishlist page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── home/                # Home page components
│   │   └── hero-carousel.tsx
│   ├── layout/              # Layout components
│   │   ├── header.tsx
│   │   └── footer.tsx
│   ├── product/             # Product components
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   └── filter-sidebar.tsx
│   └── ui/                  # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── modal.tsx
│       ├── skeleton.tsx
│       └── breadcrumb.tsx
├── lib/
│   ├── data/
│   │   └── products.ts      # Product data
│   ├── store.ts             # Zustand state management
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## 🎯 Key Components

### State Management (Zustand)
- Cart management (add, remove, update quantities)
- Wishlist functionality
- Recently viewed products
- Order history
- Address management
- Dark mode toggle
- Persistent storage

### Product Features
- 12 sample products with full details
- Multiple images per product
- Size and color variants
- Stock management
- Sale pricing with discount calculation
- Product ratings and reviews
- Category and subcategory organization

### UI/UX Features
- Smooth hover animations
- Micro-interactions on buttons
- Lazy loading images
- Loading skeletons
- Clean page transitions
- Responsive navigation
- Sticky header
- Mobile-friendly filters

## 🚀 Performance Optimizations

- Next.js Image component for optimized images
- Code splitting with dynamic imports
- Tailwind CSS purging for minimal CSS
- Font optimization with Google Fonts
- Lazy loading for below-fold content
- Optimized bundle size

## 🎨 Customization

### Theme Colors
Edit `app/globals.css` to customize the color palette:
```css
:root {
  --primary: #1e3a5f;
  --secondary: #f5f1e8;
  --accent-gold: #c9a961;
  --accent-terracotta: #d4a59a;
}
```

### Product Data
Add or modify products in `lib/data/products.ts`

### Categories
Update navigation links in `components/layout/header.tsx`

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1280px

## 🔮 Future Enhancements

- Backend API integration
- User authentication
- Payment gateway integration
- Product search functionality
- Product reviews system
- Email notifications
- Admin dashboard
- Analytics integration
- Multi-language support
- Currency conversion

## 📄 License

This project is created for demonstration purposes.

## 🤝 Contributing

This is a showcase project. Feel free to fork and customize for your own use.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
