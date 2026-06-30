import { BACKEND_URL } from '@/lib/api/client'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'

export function getImageUrl(src: string | undefined | null): string {
  if (!src || src === 'string' || src.trim() === '') {
    return FALLBACK_IMAGE
  }
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }
  if (src.startsWith('/uploads')) {
    return `${BACKEND_URL}${src}`
  }
  if (src.startsWith('/')) {
    return src
  }
  return `${BACKEND_URL}/${src}`
}

export function resolveProductImages(images?: string[] | null): string[] {
  if (!images?.length) {
    return [FALLBACK_IMAGE]
  }
  const resolved = images
    .filter((img) => img && img !== 'string' && img.trim() !== '')
    .map((img) => getImageUrl(img))
  return resolved.length > 0 ? resolved : [FALLBACK_IMAGE]
}

export { FALLBACK_IMAGE }
