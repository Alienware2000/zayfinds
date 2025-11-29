/**
 * Product Types for zayfinds
 *
 * These types define the data model for products displayed on the site.
 * Products are curated fashion finds that link out to external sellers.
 */

/**
 * Category represents the product classification.
 * Used for filtering products on the main grid.
 *
 * Categories are lowercase strings to ensure consistent matching
 * when filtering and to simplify URL query parameters in the future.
 */
export type Category =
  | "tops" // T-shirts, tank tops, blouses
  | "hoodies" // Hoodies and sweatshirts
  | "jackets" // Bombers, leather jackets, outerwear
  | "pants" // Jeans, trousers, joggers
  | "shorts" // All types of shorts
  | "shoes" // Sneakers, boots, sandals
  | "bags" // Backpacks, totes, crossbody bags
  | "jewelry" // Chains, rings, bracelets, watches
  | "accessories" // Hats, belts, sunglasses, scarves
  | "electronics" // Tech gadgets, headphones, etc.
  | "misc"; // Everything else that doesn't fit above

/**
 * Product represents a single item displayed in the product grid.
 *
 * Products don't have internal inventory or checkout — they link
 * directly to external seller pages (Taobao, Weidian, etc.).
 */
export interface Product {
  /** Unique identifier for the product (e.g., "prod_001") */
  id: string;

  /** Display name shown on the product card */
  name: string;

  /**
   * URL-safe slug for routing (e.g., "vetements-silk-road-tee").
   * Optional in the interface — can be derived from name if not provided.
   */
  slug?: string;

  /**
   * Numeric price in USD for sorting/filtering.
   * Null if price is unknown or varies by option.
   */
  price: number | null;

  /**
   * Original price string for display (e.g., "$44.00", "Price varies").
   * Always shown to the user as-is.
   */
  priceRaw: string;

  /**
   * URL to the product image.
   * Null if no image is available (component will show placeholder).
   */
  imageUrl: string | null;

  /** External URL that opens when user clicks "Buy" */
  buyUrl: string;

  /** Product category for filtering */
  category: Category;

  /**
   * Optional array of additional image URLs for gallery/detail pages.
   * Used on product detail page for image carousel (future feature).
   * Can be empty or undefined; single imageUrl is always the primary.
   */
  galleryImages?: string[];
}
