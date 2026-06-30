'use client'

import Link from 'next/link'
import {
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { useState, useEffect } from 'react'
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

          <div className="flex items-center gap-3 md:gap-5 ml-auto">
            <Link
              href="/wishlist"
              className="relative p-1.5 hover:opacity-70 transition-opacity"
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neutral-900 text-white text-[9px] flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-1.5 hover:opacity-70 transition-opacity"
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neutral-900 text-white text-[9px] flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="p-1.5 hover:opacity-70 transition-opacity"
                  title={user?.name}
                  aria-label="Account"
                >
                  <User size={20} strokeWidth={1.5} />
                </Link>
                {isAdmin() && (
                  <Link
                    href="/admin"
                    className="text-[10px] font-medium tracking-wider uppercase text-amber-700 hover:underline hidden lg:block"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="p-1.5 hover:opacity-70 transition-opacity hidden sm:block"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={18} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-[11px] tracking-[0.15em] uppercase font-medium hover:opacity-70 transition-opacity"
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
