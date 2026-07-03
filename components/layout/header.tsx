'use client'

import Link from 'next/link'
import {
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  Package,
} from 'lucide-react'
import { useState, useEffect, type CSSProperties } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import { useWishlist } from '@/lib/hooks/useWishlist'
import { useAuth } from '@/lib/hooks'
import { isAdmin } from '@/lib/utils/auth'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'New Arrivals', href: '/shop?sort=new-arrivals' },
  { label: 'Collections', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { cartItems } = useCart()
  const { wishlistItems } = useWishlist()
  const { isAuthenticated, user, logout } = useAuth()

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      } border-neutral-200`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-16 md:h-20 flex items-center justify-between gap-4">
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] tracking-[0.2em] uppercase text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav> */}

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="pt-5 font-serif text-xl md:text-3xl tracking-[0.25em] font-medium uppercase text-neutral-900 hover:tracking-[0.3em] transition-all duration-300">
              MAYA
            </h1>
          </Link>

          <div className="flex items-center gap-1 md:gap-1.5 ml-auto">
            <Link
              href="/wishlist"
              className="nav-pill"
              style={{ '--i': '#9f1239', '--j': '#e11d48' } as CSSProperties}
              aria-label="Wishlist"
            >
              <span className="nav-pill-icon">
                <Heart size={19} strokeWidth={1.5} />
                {wishlistItems.length > 0 && (
                  <span className="nav-badge">{wishlistItems.length}</span>
                )}
              </span>
              <span className="nav-pill-label">Wishlist</span>
            </Link>

            <Link
              href="/cart"
              className="nav-pill"
              style={{ '--i': '#92400e', '--j': '#d97706' } as CSSProperties}
              aria-label="Cart"
            >
              <span className="nav-pill-icon">
                <ShoppingBag size={19} strokeWidth={1.5} />
                {cartItemsCount > 0 && (
                  <span className="nav-badge">{cartItemsCount}</span>
                )}
              </span>
              <span className="nav-pill-label">Cart</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-1 md:gap-1.5">
                <Link
                  href="/orders"
                  className="nav-pill"
                  style={{ '--i': '#1f2937', '--j': '#4b5563' } as CSSProperties}
                  title="My Orders"
                  aria-label="My Orders"
                >
                  <span className="nav-pill-icon">
                    <Package size={19} strokeWidth={1.5} />
                  </span>
                  <span className="nav-pill-label">Orders</span>
                </Link>
                <Link
                  href="/profile"
                  className="nav-pill"
                  style={{ '--i': '#3f3f46', '--j': '#a16207' } as CSSProperties}
                  title={user?.name}
                  aria-label="Account"
                >
                  <span className="nav-pill-icon">
                    <User size={19} strokeWidth={1.5} />
                  </span>
                  <span className="nav-pill-label">Account</span>
                </Link>
                {isAdmin() && (
                  <Link
                    href="/admin"
                    className="text-[10px] font-medium tracking-wider uppercase text-amber-700 hover:underline hidden lg:block ml-1"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="nav-pill hidden sm:inline-flex"
                  style={{ '--i': '#7f1d1d', '--j': '#b91c1c' } as CSSProperties}
                  title="Logout"
                  aria-label="Logout"
                >
                  <span className="nav-pill-icon">
                    <LogOut size={18} strokeWidth={1.5} />
                  </span>
                  <span className="nav-pill-label">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-1 inline-flex items-center h-9 px-4 rounded-full bg-neutral-900 text-white text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-neutral-800 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-sm tracking-wider uppercase text-neutral-600 hover:text-neutral-900 border-b border-neutral-50 last:border-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/wishlist"
            className="block py-3 text-sm tracking-wider uppercase text-neutral-600 hover:text-neutral-900 border-b border-neutral-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Wishlist
          </Link>
          <Link
            href="/cart"
            className="block py-3 text-sm tracking-wider uppercase text-neutral-600 hover:text-neutral-900 border-b border-neutral-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            Cart
          </Link>
          <Link
            href={isAuthenticated ? '/profile' : '/login'}
            className="block py-3 text-sm tracking-wider uppercase text-neutral-600 hover:text-neutral-900"
            onClick={() => setMobileMenuOpen(false)}
          >
            {isAuthenticated ? 'Account' : 'Sign In'}
          </Link>
        </div>
      )}
    </header>
  )
}
