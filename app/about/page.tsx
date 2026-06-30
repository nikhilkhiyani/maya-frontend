import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&q=80"
          alt="About Neelkanth Atelier"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              Our Story
            </h1>
            <p className="text-lg md:text-xl">
              Where tradition meets contemporary elegance
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-center">
            The Philosophy of MAYA
          </h2>
          <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
            <p>
              MAYA draws its inspiration from the concept of the third eye—the inner vision 
              that sees beyond the surface. Just as the MAYA represents wisdom, insight, and the 
              perfect balance between tradition and innovation, our brand embodies the harmonious fusion 
              of Indian heritage and Latin minimalism.
            </p>
            <p>
              Founded with a vision to celebrate the rich tapestry of Indian craftsmanship 
              while embracing the clean, modern aesthetics of contemporary design, MAYA 
              is more than a fashion brand—it's a philosophy, a way of life.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80"
                alt="Craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Indo-Latin Fusion
              </h2>
              <p className="text-foreground/80 mb-4">
                Our design philosophy marries the ornate beauty of Indian textiles with 
                the understated elegance of Latin design principles. Each piece is 
                thoughtfully crafted to honor traditional techniques while presenting 
                them through a contemporary lens.
              </p>
              <p className="text-foreground/80 mb-6">
                From hand-block printed kurtas to minimalist sarees, from intricate 
                jewelry to clean-lined silhouettes, every creation tells a story of 
                cultural synthesis and artistic excellence.
              </p>
              <Button asChild size="lg">
                <Link href="/shop">Explore Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🎨</span>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Artisan Excellence</h3>
              <p className="text-foreground/70">
                Supporting traditional craftspeople and preserving age-old techniques
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🌿</span>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Sustainability</h3>
              <p className="text-foreground/70">
                Committed to eco-friendly practices and ethical production
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">✨</span>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Timeless Design</h3>
              <p className="text-foreground/70">
                Creating pieces that transcend trends and celebrate enduring beauty
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Join Our Journey
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Be part of a community that celebrates heritage, craftsmanship, and conscious fashion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="accent" size="lg">
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
