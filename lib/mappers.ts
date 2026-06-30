import { BackendProduct } from './api/products'
import { Product } from './types'
import { resolveProductImages } from './utils/images'

export function mapBackendProductToFrontend(
  backendProduct: BackendProduct
): Product {
  return {
    id: backendProduct.id,

    name: backendProduct.name,

    slug:
      backendProduct.slug ||
      backendProduct.name.toLowerCase().replace(/\s+/g, '-'),

    description: backendProduct.description,

    price:
      backendProduct.discountPrice ??
      backendProduct.price,

    originalPrice:
      backendProduct.discountPrice
        ? backendProduct.price
        : undefined,

    images: resolveProductImages(backendProduct.images),

    category: backendProduct.category,

    subcategory: backendProduct.subcategory,

    // Until backend supports sizes/colors
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Default'],

    fabric: backendProduct.fabric,

    inStock: backendProduct.stock > 0,

    isNew:
      Date.now() -
        new Date(
          backendProduct.createdAt
        ).getTime() <
      7 * 24 * 60 * 60 * 1000,

    isFeatured:
      backendProduct.isFeatured ?? false,

    readyToShip:
      backendProduct.isReadyToShip,

    onSale:
      !!backendProduct.discountPrice &&
      backendProduct.discountPrice <
        backendProduct.price,

    rating: backendProduct.rating ?? 0,

    reviews:
      backendProduct.reviews ?? 0,
  }
}

export function mapCategoryToBackend(
  category: string
): string {
  const categoryMap: Record<string, string> = {
    tunics: 'TUNICS',
    'top-and-bottoms': 'TOP_AND_BOTTOMS',
    'co-ords': 'CO_ORDS',
    dresses: 'DRESSES',
    women: 'WOMEN',
    men: 'MEN',
    saree: 'SAREE',
    jewelry: 'JEWELRY',
    lehenga: 'LEHENGA',
    kurti: 'KURTI',
    accessories: 'ACCESSORIES',
  }

  return categoryMap[category.toLowerCase()] || category.toUpperCase().replace(/-/g, '_')
}