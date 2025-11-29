/**
 * Product Helper Functions
 *
 * Utility functions for working with products.
 * Provides slug generation, lookups, and related product queries.
 *
 * These functions abstract data access so switching from mock data
 * to Google Sheets (or any other source) requires minimal changes.
 *
 * Routing patterns:
 * - Product detail: /products/[slug]
 * - Quality check: /quality/[slug]
 */

import { Product } from "@/types/product";
import { mockProducts } from "@/data/productsMock";

/* ===========================================
   SLUG UTILITIES
   =========================================== */

/**
 * Converts a product name to a URL-safe slug.
 *
 * Examples:
 * - "Vetements Silk Road Tee" → "vetements-silk-road-tee"
 * - "Yeezy 350 V2 (High Quality)" → "yeezy-350-v2-high-quality"
 * - "Ken Carson X Chain (Full)" → "ken-carson-x-chain-full"
 *
 * @param name - The product name to convert
 * @returns URL-safe lowercase slug
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Gets the slug for a product.
 * Uses the product's slug field if available, otherwise derives from name.
 *
 * @param product - The product to get slug for
 * @returns URL-safe slug string
 */
export function getProductSlug(product: Product): string {
  return product.slug || slugify(product.name);
}

/* ===========================================
   DATA ACCESS FUNCTIONS
   =========================================== */

/**
 * Returns all products from the data source.
 * Currently returns mock data; will be replaced with Sheets fetch later.
 *
 * @returns Array of all products
 */
export function getAllProducts(): Product[] {
  return mockProducts;
}

/**
 * Looks up a single product by its slug.
 * Checks both explicit slug field and derived slug from name.
 *
 * @param slug - The URL slug to search for
 * @returns The matching product, or undefined if not found
 */
export function getProductBySlug(slug: string): Product | undefined {
  const normalizedSlug = slug.toLowerCase();

  return mockProducts.find((product) => {
    // Check explicit slug field first
    if (product.slug && product.slug.toLowerCase() === normalizedSlug) {
      return true;
    }
    // Fall back to derived slug from name
    return slugify(product.name) === normalizedSlug;
  });
}

/**
 * Looks up a single product by its ID.
 *
 * @param id - The product ID to search for
 * @returns The matching product, or undefined if not found
 */
export function getProductById(id: string): Product | undefined {
  return mockProducts.find((product) => product.id === id);
}

/**
 * Gets related products for a given product.
 * Returns products in the same category, excluding the current product.
 * Falls back to random products if category has few items.
 *
 * @param product - The product to find related items for
 * @param limit - Maximum number of related products to return (default: 4)
 * @returns Array of related products
 */
export function getRelatedProducts(product: Product, limit: number = 4): Product[] {
  // Get products in the same category (excluding current product)
  const sameCategoryProducts = mockProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  // If we have enough same-category products, return those
  if (sameCategoryProducts.length >= limit) {
    return sameCategoryProducts.slice(0, limit);
  }

  // Otherwise, fill remaining slots with other products
  const otherProducts = mockProducts.filter(
    (p) => p.category !== product.category && p.id !== product.id
  );

  // Combine same-category products with random others
  const combined = [
    ...sameCategoryProducts,
    ...otherProducts.slice(0, limit - sameCategoryProducts.length),
  ];

  return combined.slice(0, limit);
}

/**
 * Gets products by category.
 *
 * @param category - The category to filter by
 * @returns Array of products in that category
 */
export function getProductsByCategory(category: string): Product[] {
  return mockProducts.filter((product) => product.category === category);
}

/**
 * Searches products by name (case-insensitive).
 *
 * @param query - Search query string
 * @returns Array of matching products
 */
export function searchProducts(query: string): Product[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return mockProducts;

  return mockProducts.filter((product) =>
    product.name.toLowerCase().includes(normalizedQuery)
  );
}

/* ===========================================
   CONSTANTS
   =========================================== */

/**
 * Total number of products in the data source.
 */
export const TOTAL_PRODUCT_COUNT = mockProducts.length;

