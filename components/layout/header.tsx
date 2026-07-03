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
        <div className="h-16 md:h-20 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* Left: mobile menu toggle */}
          <div className="flex items-center justify-start">
            <button
              className="md:hidden p-2 -ml-2 shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Center: logo */}
          <Link href="/" className="justify-self-center">
            <h1 className="font-serif text-lg sm:text-xl md:text-3xl tracking-[0.2em] sm:tracking-[0.25em] font-medium uppercase text-neutral-900 hover:tracking-[0.3em] transition-all duration-300 whitespace-nowrap">
              MAYA
            </h1>
          </Link>

          {/* Right: action icons */}
          <div className="flex items-center justify-end gap-0.5 sm:gap-1 md:gap-1.5">
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
              <>
                <Link
                  href="/orders"
                  className="nav-pill hidden sm:inline-flex"
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
              </>
            ) : (
              <Link
                href="/login"
                className="ml-0.5 sm:ml-1 inline-flex items-center h-9 px-3 sm:px-4 rounded-full bg-neutral-900 text-white text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] uppercase font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap"
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
          {isAuthenticated && (
            <Link
              href="/orders"
              className="block py-3 text-sm tracking-wider uppercase text-neutral-600 hover:text-neutral-900 border-b border-neutral-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Orders
            </Link>
          )}
          <Link
            href={isAuthenticated ? '/profile' : '/login'}
            className="block py-3 text-sm tracking-wider uppercase text-neutral-600 hover:text-neutral-900 border-b border-neutral-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            {isAuthenticated ? 'Account' : 'Sign In'}
          </Link>
          {isAuthenticated && isAdmin() && (
            <Link
              href="/admin"
              className="block py-3 text-sm tracking-wider uppercase text-amber-700 hover:text-amber-800 border-b border-neutral-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          )}
          {isAuthenticated && (
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                logout()
              }}
              className="block w-full text-left py-3 text-sm tracking-wider uppercase text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  )
}
