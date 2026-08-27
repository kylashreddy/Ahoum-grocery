import type { CategoryId, Product } from "../types/product";
import { CATEGORIES } from "../mocks/categories";
import { PRODUCTS } from "../mocks/products";
import { simulateNetwork } from "./client";

export interface ProductQueryOptions {
  signal?: AbortSignal;
  /** Force a failure for this call, used by the retry-state demo. */
  failRate?: number;
}

export async function fetchCategories(options: ProductQueryOptions = {}) {
  return simulateNetwork(() => CATEGORIES, options);
}

export async function fetchFeaturedProducts(options: ProductQueryOptions = {}) {
  return simulateNetwork(() => PRODUCTS.slice(0, 8), options);
}

export async function fetchProductsByCategory(categoryId: CategoryId, options: ProductQueryOptions = {}) {
  return simulateNetwork(() => PRODUCTS.filter((p) => p.categoryId === categoryId), options);
}

export async function fetchProductById(id: string, options: ProductQueryOptions = {}) {
  return simulateNetwork<Product | undefined>(() => PRODUCTS.find((p) => p.id === id), options);
}

export async function searchProducts(query: string, options: ProductQueryOptions = {}) {
  const q = query.trim().toLowerCase();
  return simulateNetwork<Product[]>(() => {
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, options);
}
