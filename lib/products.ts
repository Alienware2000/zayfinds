/**
 * Product Data Layer
 *
 * Single source of truth for all product data in the app.
 * Imports from data/products.json and applies image overrides.
 *
 * All product queries should go through this module:
 * - getAllProducts()
 * - getAllCategories()
 * - getProductsByCategory()
 * - searchProducts()
 * - getProductBySlug()
 * - getRelatedProducts()
 */

import productsData from "@/data/products.json";
import imageOverrides from "@/data/image-overrides.json";

/* ===========================================
   TYPES
   =========================================== */

/**
 * Product interface matching the JSON schema from products.json.
 */
export interface Product {
  /** Unique sequential identifier */
  id: number;
  /** Product display name */
  name: string;
  /** Numeric price in USD for sorting/filtering, null if unparseable */
  price: number | null;
  /** Original price string for display (e.g., "90.00$") */
  priceText: string;
  /** Category name from CSV header, null for uncategorized products */
  category: string | null;
  /** External URL to the seller's product page */
  buyUrl: string;
  /** URL to the product image */
  imageUrl: string | null;
}

/**
 * Image overrides type - maps product ID to image URL.
 */
type ImageOverrides = Record<string, string | null>;

/**
 * Apply image overrides to products.
 * If an override exists for a product ID and is not null, use it.
 */
function applyImageOverrides(
  rawProducts: Product[],
  overrides: ImageOverrides
): Product[] {
  return rawProducts.map((product) => {
    const overrideUrl = overrides[String(product.id)];
    if (overrideUrl) {
      return { ...product, imageUrl: overrideUrl };
    }
    return product;
  });
}

/**
 * Load and process products with image overrides applied.
 */
const products: Product[] = applyImageOverrides(
  productsData as Product[],
  imageOverrides as ImageOverrides
);

/* ===========================================
   SLUG UTILITIES
   =========================================== */

/**
 * Converts a product name to a URL-safe slug.
 *
 * Examples:
 * - "Vetements Silk Road Tee" → "vetements-silk-road-tee"
 * - "Yeezy 350 V2 (High Quality)" → "yeezy-350-v2-high-quality"
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
 * Derives slug from the product name.
 *
 * @param product - The product to get slug for
 * @returns URL-safe slug string
 */
export function getProductSlug(product: Product): string {
  return slugify(product.name);
}

/* ===========================================
   CATEGORY CONSTANTS
   =========================================== */

/**
 * The 8 new categories for zayfinds.
 * This is the single source of truth for all category operations.
 * Must match the categories defined in scripts/csv-to-products.mjs
 */
export const NEW_CATEGORIES = [
  'Shirts',
  'Shorts',
  'Pants',
  'Shoes',
  'Outerwear',
  'Accessories',
  'Room decor',
  'Electronics',
  'Vehicle Modifications',
] as const;

/* ===========================================
   DATA ACCESS FUNCTIONS
   =========================================== */

/**
 * Returns all products from data/products.json.
 *
 * @returns Array of all products
 */
export function getAllProducts(): Product[] {
  return products;
}

/**
 * Returns the list of all valid categories.
 * Uses the NEW_CATEGORIES constant as the single source of truth.
 *
 * @returns Array of category names (the 8 new categories)
 */
export function getAllCategories(): string[] {
  return [...NEW_CATEGORIES];
}

/**
 * Gets products filtered by category.
 * Only accepts categories from NEW_CATEGORIES.
 *
 * @param category - The category name to filter by (must be one of NEW_CATEGORIES)
 * @returns Array of products in that category
 */
export function getProductsByCategory(category: string): Product[] {
  // Only filter if category is in the valid list
  if (!NEW_CATEGORIES.includes(category as any)) {
    return [];
  }
  
  return products.filter((product) => product.category === category);
}

/**
 * Searches products by name (case-insensitive).
 *
 * @param query - Search query string
 * @returns Array of matching products
 */
export function searchProducts(query: string): Product[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return products;

  return products.filter((product) =>
    product.name.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Looks up a single product by its slug.
 * Matches against derived slug from product name.
 *
 * @param slug - The URL slug to search for
 * @returns The matching product, or undefined if not found
 */
export function getProductBySlug(slug: string): Product | undefined {
  const normalizedSlug = slug.toLowerCase();

  return products.find((product) => slugify(product.name) === normalizedSlug);
}

/**
 * Looks up a single product by its ID.
 *
 * @param id - The product ID to search for
 * @returns The matching product, or undefined if not found
 */
export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id);
}

/**
 * Gets related products for a given product.
 * Returns products in the same category, excluding the current product.
 * Falls back to other products if category has few items.
 *
 * @param product - The product to find related items for
 * @param limit - Maximum number of related products to return (default: 4)
 * @returns Array of related products
 */
export function getRelatedProducts(
  product: Product,
  limit: number = 4
): Product[] {
  // Get products in the same category (excluding current product)
  const sameCategoryProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  // If we have enough same-category products, return those
  if (sameCategoryProducts.length >= limit) {
    return sameCategoryProducts.slice(0, limit);
  }

  // Otherwise, fill remaining slots with other products
  const otherProducts = products.filter(
    (p) => p.category !== product.category && p.id !== product.id
  );

  // Combine same-category products with others
  const combined = [
    ...sameCategoryProducts,
    ...otherProducts.slice(0, limit - sameCategoryProducts.length),
  ];

  return combined.slice(0, limit);
}

/* ===========================================
   CONSTANTS
   =========================================== */

/**
 * Total number of products in the data source.
 */
export const TOTAL_PRODUCT_COUNT = products.length;
