"use client";

/**
 * ProductsPage Component (FINDS-style layout)
 *
 * The full product browsing experience for zayfinds.
 * Redesigned to match FINDS structure with:
 * - Breadcrumb navigation
 * - Full-width category tab bar
 * - Search + Sort toolbar
 * - Dense product grid
 * - Load more button
 *
 * Route: /products
 */

import { useState, useMemo } from "react";

/* Component imports */
import Navbar from "@/components/Navbar";
import CategoryFilter, {
  CategoryFilterValue,
} from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

/* Data imports */
import { mockProducts } from "@/data/productsMock";

/* Type imports */
import { Product } from "@/types/product";

/**
 * Sort options for the product list.
 */
type SortOption = "default" | "price-asc" | "price-desc";

/**
 * Get display label for breadcrumb based on selected category.
 */
function getCategoryLabel(value: CategoryFilterValue): string {
  if (value === "all") return "ALL";
  if (value === "tops") return "T-SHIRTS";
  return value.toUpperCase();
}

/**
 * ProductsPage is the main browsing interface for zayfinds.
 * Manages category, search, and sort state.
 */
export default function ProductsPage() {
  /* ===========================================
     STATE
     =========================================== */

  /** Currently selected category filter */
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilterValue>("all");

  /** Search query for filtering by product name */
  const [searchQuery, setSearchQuery] = useState("");

  /** Sort option for ordering products */
  const [sortBy, setSortBy] = useState<SortOption>("default");

  /** Number of products to display (for load more) */
  const [displayCount, setDisplayCount] = useState(20);

  /* ===========================================
     FILTERING & SORTING PIPELINE
     =========================================== */

  /**
   * Memoized filtered and sorted products list.
   * Pipeline: category filter → search filter → sort → limit
   */
  const processedProducts = useMemo(() => {
    let result = [...mockProducts];

    // 1. Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // 2. Search filter (case-insensitive name match)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    }

    // 3. Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    // "default" keeps original order

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  /** Products to display (limited by displayCount) */
  const displayedProducts = processedProducts.slice(0, displayCount);

  /** Whether there are more products to load */
  const hasMore = displayCount < processedProducts.length;

  /** Load more products */
  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  /* ===========================================
     RENDER
     =========================================== */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black">
        {/* ===========================================
            BREADCRUMB
            =========================================== */}
        <div className="px-6 md:px-12 lg:px-16 py-4">
          <nav className="text-xs text-neutral-500 tracking-wider">
            <span className="hover:text-white cursor-pointer">HOME</span>
            <span className="mx-2">•</span>
            <span className="hover:text-white cursor-pointer">PRODUCTS</span>
            <span className="mx-2">•</span>
            <span className="text-white">
              {getCategoryLabel(selectedCategory)}
            </span>
          </nav>
        </div>

        {/* ===========================================
            CATEGORY TAB BAR
            =========================================== */}
        <CategoryFilter
          value={selectedCategory}
          onChange={(val) => {
            setSelectedCategory(val);
            setDisplayCount(20); // Reset on category change
          }}
        />

        {/* ===========================================
            SEARCH + SORT TOOLBAR
            =========================================== */}
        <div
          className="
            px-6 md:px-12 lg:px-16
            py-4
            flex flex-col sm:flex-row
            items-stretch sm:items-center
            justify-between
            gap-4
            border-b border-white/10
          "
        >
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            {/* Search icon */}
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder={`Search ${processedProducts.length} products...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full
                pl-10 pr-4 py-3
                bg-neutral-900
                border border-white/10
                rounded-lg
                text-sm text-white
                placeholder:text-neutral-500
                focus:outline-none
                focus:border-white/30
                transition-colors
              "
            />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 tracking-wider">
              SORT BY:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="
                px-4 py-3
                bg-neutral-900
                border border-white/10
                rounded-lg
                text-sm text-white
                focus:outline-none
                focus:border-white/30
                cursor-pointer
                transition-colors
              "
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ===========================================
            PRODUCT COUNT & GRID
            =========================================== */}
        <div className="px-6 md:px-12 lg:px-16 py-8">
          {/* Product count */}
          <p className="text-xs text-neutral-500 tracking-wider mb-6">
            SHOWING {displayedProducts.length} OF {processedProducts.length}{" "}
            PRODUCTS
          </p>

          {/* Product grid */}
          <ProductGrid products={displayedProducts} />
        </div>

        {/* ===========================================
            LOAD MORE BUTTON
            =========================================== */}
        {hasMore && (
          <div className="px-6 md:px-12 lg:px-16 pb-12 text-center">
            <button
              onClick={handleLoadMore}
              className="
                px-12 py-4
                text-sm font-semibold
                tracking-wider uppercase
                text-white
                bg-neutral-900
                border border-white/20
                rounded-lg
                transition-all duration-200
                hover:bg-neutral-800
                hover:border-white/40
              "
            >
              Load More
            </button>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
