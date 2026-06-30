'use client'

import { useState, useEffect } from 'react'
import { productsApi, ProductFilters } from '../api'
import { Product } from '../types'
import { mapBackendProductToFrontend } from '../mappers'

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await productsApi.getAll(filters)
        const mappedProducts = response.content.map(mapBackendProductToFrontend)
        setProducts(mappedProducts)
        setTotalPages(response.totalPages)
        setTotalElements(response.totalElements)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products')
        console.error('Error fetching products:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [filters?.category, filters?.search, filters?.minPrice, filters?.maxPrice, filters?.page, filters?.size])

  return { products, totalPages, totalElements, isLoading, error }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const backendProduct = await productsApi.getById(id)
        const mappedProduct = mapBackendProductToFrontend(backendProduct)
        setProduct(mappedProduct)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product')
        console.error('Error fetching product:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, isLoading, error }
}
