/**
 * Mock Product Data for zayfinds
 *
 * This file contains hardcoded sample products used during development.
 * In production, this data will be replaced by fetching from Google Sheets.
 *
 * The mock data includes at least one product per category to ensure
 * all filters can be tested during development.
 */

import { Product } from "@/types/product";

/**
 * Array of mock products for development and testing.
 *
 * Each product represents a curated fashion find with:
 * - Realistic streetwear/rep fashion names
 * - Varied price points ($10 - $400+)
 * - Placeholder buy URLs (will be real seller links in production)
 * - Null imageUrls (components will render placeholders)
 *
 * Products are organized roughly by category for easier scanning,
 * but the order doesn't affect display (filtering handles categorization).
 */
export const mockProducts: Product[] = [
  // ============================================
  // TOPS - T-shirts, tank tops, graphic tees
  // ============================================
  {
    id: "prod_001",
    name: "Vetements Silk Road Tee",
    price: 44,
    priceRaw: "$44.00",
    imageUrl: null, // Placeholder - will show fallback in UI
    buyUrl: "https://example.com/product/001",
    category: "tops",
  },
  {
    id: "prod_002",
    name: "Vintage Logo Oversized Tee",
    price: 28,
    priceRaw: "$28.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/002",
    category: "tops",
  },

  // ============================================
  // HOODIES - Hoodies and sweatshirts
  // ============================================
  {
    id: "prod_003",
    name: "Anonymous Club Back-Print Hoodie",
    price: 26,
    priceRaw: "$26.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/003",
    category: "hoodies",
  },
  {
    id: "prod_004",
    name: "Number (N)ine Tribal Camo Hoodie",
    price: 31,
    priceRaw: "$31.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/004",
    category: "hoodies",
  },

  // ============================================
  // JACKETS - Bombers, leather, outerwear
  // ============================================
  {
    id: "prod_005",
    name: "Balenciaga Leather Jacket Zip-Up",
    price: 420,
    priceRaw: "$420.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/005",
    category: "jackets",
  },
  {
    id: "prod_006",
    name: "Mowalola My City Bomber",
    price: 78,
    priceRaw: "$78.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/006",
    category: "jackets",
  },

  // ============================================
  // PANTS - Jeans, trousers, joggers
  // ============================================
  {
    id: "prod_007",
    name: "Vanguardia Triple Waisted Sweats",
    price: 118,
    priceRaw: "$118.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/007",
    category: "pants",
  },

  // ============================================
  // SHORTS - All types of shorts
  // ============================================
  {
    id: "prod_008",
    name: "Mesh Basketball Shorts",
    price: 22,
    priceRaw: "$22.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/008",
    category: "shorts",
  },

  // ============================================
  // SHOES - Sneakers, boots, sandals
  // ============================================
  {
    id: "prod_009",
    name: "Balenciaga Stomper Boots",
    price: 138,
    priceRaw: "$138.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/009",
    category: "shoes",
  },
  {
    id: "prod_010",
    name: "Yeezy 350 V2 (High Quality)",
    price: 26,
    priceRaw: "$26.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/010",
    category: "shoes",
  },
  {
    id: "prod_011",
    name: "Bapesta Low (Many Colors)",
    price: 38,
    priceRaw: "$38.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/011",
    category: "shoes",
  },

  // ============================================
  // BAGS - Backpacks, totes, crossbody
  // ============================================
  {
    id: "prod_012",
    name: "Chrome Hearts Cemetery Crossbody",
    price: 65,
    priceRaw: "$65.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/012",
    category: "bags",
  },

  // ============================================
  // JEWELRY - Chains, rings, bracelets
  // ============================================
  {
    id: "prod_013",
    name: "Ken Carson X Chain (Full)",
    price: 198,
    priceRaw: "$198.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/013",
    category: "jewelry",
  },

  // ============================================
  // ACCESSORIES - Hats, belts, sunglasses
  // ============================================
  {
    id: "prod_014",
    name: "Mowalola Chinese Embroidered Cap",
    price: 18,
    priceRaw: "$18.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/014",
    category: "accessories",
  },
  {
    id: "prod_015",
    name: "Playboi Carti Yvl Hats (All Colors)",
    price: 10,
    priceRaw: "$10.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/015",
    category: "accessories",
  },

  // ============================================
  // ELECTRONICS - Tech gadgets, headphones
  // ============================================
  {
    id: "prod_016",
    name: "Wireless Earbuds Pro Clone",
    price: 35,
    priceRaw: "$35.00",
    imageUrl: null,
    buyUrl: "https://example.com/product/016",
    category: "electronics",
  },

  // ============================================
  // MISC - Everything else
  // ============================================
  {
    id: "prod_017",
    name: "Designer Phone Case Set",
    price: null, // Price varies by phone model
    priceRaw: "Price varies",
    imageUrl: null,
    buyUrl: "https://example.com/product/017",
    category: "misc",
  },
];

/**
 * Helper constant: Total number of mock products.
 * Useful for displaying counts or pagination in the future.
 */
export const MOCK_PRODUCT_COUNT = mockProducts.length;

