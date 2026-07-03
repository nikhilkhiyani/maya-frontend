import Link from 'next/link'
import Image from 'next/image'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { ProductGrid } from '@/components/product/product-grid'
import { heroSlides } from '@/lib/data/products'
import { mapBackendProductToFrontend } from '@/lib/mappers'
import { serverFetch } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Product } from '@/lib/types'
import { getImageUrl } from '@/lib/utils/images'

export const dynamic = 'force-dynamic'

async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await serverFetch('/api/products?page=0&size=100')
    const data = await response.json()
    return (data.content || []).map(mapBackendProductToFrontend)
  } catch {
    return []
  }
}

async function fetchHomepageCategories() {
  try {
    const response = await serverFetch('/api/categories/homepage')
    return await response.json()
  } catch {
    return []
  }
}

const fallbackCategories = [
  { name: 'Tunics', slug: 'tunics', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80' },
  { name: 'Top & Bottoms', slug: 'top-and-bottoms', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80' },
  { name: 'Co-ords', slug: 'co-ords', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80' },
  { name: 'Dresses', slug: 'dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80' },
]

const testimonials = [
  { name: 'Priya S.', text: 'The craftsmanship is exceptional. Every piece feels luxurious and unique.', rating: 5 },
  { name: 'Ananya R.', text: 'Fast delivery and beautiful packaging. My go-to for festive wear.', rating: 5 },
  { name: 'Meera K.', text: 'Love the fusion of traditional and contemporary styles. Truly MAYA.', rating: 5 },
]

export default async function Home() {
  const products = await fetchProducts()
  const apiCategories = await fetchHomepageCategories()
  const categories: { name: string; href: string; image: string }[] = apiCategories.length > 0
    ? apiCategories.map((c: { name: string; slug: string; image?: string }) => ({
        name: c.name,
        href: `/shop/${c.slug}`,
        image: getImageUrl(c.image) || fallbackCategories[0].image,
      }))
    : fallbackCategories.map((c) => ({ ...c, href: `/shop/${c.slug}` }))

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4)
  const bestSellers = [...products]
    .sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
    .slice(4, 8)
  const newArrivals = [...products]
    .filter((p) => p.isNew)
    .slice(8, 12)
  // const onSaleProducts = products.filter((p) => p.onSale).slice(0, 4)

  const displayNewArrivals = newArrivals.length > 0 ? newArrivals : products.slice(0, 4)
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)
  const displayBestSellers = bestSellers.length > 0 ? bestSellers : products.slice(4, 8)

  return (
    <div>
      <HeroCarousel slides={heroSlides} />

      {/* Categories */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-3">Shop by Category</h2>
            <p className="text-neutral-500">Curated collections for every occasion</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white font-medium tracking-wider text-sm uppercase">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {displayNewArrivals.length > 0 && (
        <section className="py-8 md:py-12 bg-[#faf8f5]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-6 md:mb-8 gap-4">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-amber-700 mb-2">Just Dropped</p>
                <h2 className="text-2xl md:text-3xl font-serif text-neutral-900">New Arrivals</h2>
              </div>
              <Link
                href="/shop?sort=new-arrivals"
                className="text-sm font-medium text-neutral-900 hover:text-amber-700 transition-colors underline underline-offset-4"
              >
                View All
              </Link>
            </div>
            <ProductGrid products={displayNewArrivals} />
          </div>
        </section>
      )}

      {/* Featured Collections */}
      {displayFeatured.length > 0 && (
        <section className="py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-6 md:mb-8 gap-4">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-amber-700 mb-2">Curated</p>
                <h2 className="text-2xl md:text-3xl font-serif text-neutral-900">Featured Collections</h2>
              </div>
              <Link
                href="/shop"
                className="text-sm font-medium text-neutral-900 hover:text-amber-700 transition-colors underline underline-offset-4"
              >
                Explore All
              </Link>
            </div>
            <ProductGrid products={displayFeatured} />
          </div>
        </section>
      )}

      {/* Editorial Banner */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* <Image
          src=""
          alt="MAYA Editorial"
          fill
          className="object-cover"
          sizes="100vw"
        /> */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-2xl text-white">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 text-white/80">The MAYA Edit</p>
            <h2 className="text-2xl md:text-4xl font-serif mb-6 leading-tight">
              Where Tradition Meets Modern Elegance
            </h2>
            <Button asChild className="bg-white text-neutral-900 hover:bg-neutral-100 h-12 px-8">
              <Link href="/about">Discover Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {displayBestSellers.length > 0 && (
        <section className="py-8 md:py-12 bg-[#faf8f5]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-6 md:mb-8 gap-4">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-amber-700 mb-2">Most Loved</p>
                <h2 className="text-2xl md:text-3xl font-serif text-neutral-900">Best Sellers</h2>
              </div>
              <Link
                href="/shop?sort=popular"
                className="text-sm font-medium text-neutral-900 hover:text-amber-700 transition-colors underline underline-offset-4"
              >
                View All
              </Link>
            </div>
            <ProductGrid products={displayBestSellers} />
          </div>
        </section>
      )}

      {/* On Sale / Trending */}
      {/* {onSaleProducts.length > 0 && (
        <section className="py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-6 md:mb-8 gap-4">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-amber-700 mb-2">Limited Time</p>
                <h2 className="text-2xl md:text-3xl font-serif text-neutral-900">Trending Offers</h2>
              </div>
            </div>
            <ProductGrid products={onSaleProducts} />
          </div>
        </section>
      )} */}

      {/* Instagram Gallery */}
      {/* <section className="py-8 md:py-12 bg-neutral-200 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 text-white">
            <h2 className="text-2xl md:text-3xl font-serif">Follow Our Journey</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {[
              // 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
              // 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
              // 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
              // 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80',
            ].map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <Image src={img} alt={`MAYA style ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="25vw" />
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="py-8 md:py-12 bg-[#faf8f5]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-3">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-amber-500">★</span>
                  ))}
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <p className="font-medium text-neutral-900 text-sm">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-8 md:py-12 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-3xl font-serif text-neutral-900 mb-3">Join the MAYA Circle</h2>
          <p className="text-neutral-500 mb-8">
            Be the first to know about new arrivals, exclusive offers, and styling tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/30"
            />
            <Button type="submit" className="bg-neutral-900 hover:bg-neutral-800 h-12 px-8">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
