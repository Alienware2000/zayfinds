"use client";

/**
 * ProductsPage Component
 *
 * The full product browsing experience for zayfinds.
 * Uses data from lib/products.ts as the single source of truth.
 *
 * Design v2.0:
 * - Layered grey surface colors
 * - Refined typography
 * - Enhanced form controls
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

/* Data imports - single source of truth */
import {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
} from "@/lib/products";

/**
 * Sort options for the product list.
 */
type SortOption = "default" | "price-asc" | "price-desc";

/**
 * Get display label for breadcrumb.
 */
function getCategoryLabel(value: CategoryFilterValue): string {
  if (value === "all") return "ALL";
  return value.toUpperCase();
}

/**
 * ProductsPage is the main browsing interface.
 */
export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilterValue>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [displayCount, setDisplayCount] = useState(20);

  /**
   * Process products based on filters and sorting.
   * Uses centralized data helpers from lib/products.ts.
   */
  const processedProducts = useMemo(() => {
    // Start with base product list based on category and search
    let result =
      selectedCategory !== "all"
        ? getProductsByCategory(selectedCategory)
        : searchQuery.trim()
          ? searchProducts(searchQuery)
          : getAllProducts();

    // If both category and search are active, filter further
    if (selectedCategory !== "all" && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const displayedProducts = processedProducts.slice(0, displayCount);
  const hasMore = displayCount < processedProducts.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface-base">
        {/* Breadcrumb */}
        <div className="px-6 md:px-12 lg:px-16 py-4">
          <nav className="text-meta text-text-muted">
            <span className="hover:text-text-primary cursor-pointer transition-colors">
              HOME
            </span>
            <span className="mx-2 text-text-subtle">•</span>
            <span className="hover:text-text-primary cursor-pointer transition-colors">
              PRODUCTS
            </span>
            <span className="mx-2 text-text-subtle">•</span>
            <span className="text-text-primary">
              {getCategoryLabel(selectedCategory)}
            </span>
          </nav>
        </div>

        {/* Category Tab Bar */}
        <CategoryFilter
          value={selectedCategory}
          onChange={(val) => {
            setSelectedCategory(val);
            setDisplayCount(20);
          }}
        />

        {/* Search + Sort Toolbar */}
        <div
          className="
            px-6 md:px-12 lg:px-16
            py-4
            flex flex-col sm:flex-row
            items-stretch sm:items-center
            justify-between
            gap-4
            border-b border-border-default
          "
        >
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle"
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
                bg-surface-elevated
                border border-border-default
                rounded-lg
                text-sm text-text-primary
                placeholder:text-text-subtle
                focus:outline-none
                focus:border-border-strong
                transition-colors
              "
            />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-meta text-text-muted">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="
                px-4 py-3
                bg-surface-elevated
                border border-border-default
                rounded-lg
                text-sm text-text-primary
                focus:outline-none
                focus:border-border-strong
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

        {/* Product count & grid */}
        <div className="px-6 md:px-12 lg:px-16 py-8">
          <p className="text-meta text-text-muted mb-6">
            SHOWING {displayedProducts.length} OF {processedProducts.length}{" "}
            PRODUCTS
          </p>

          <ProductGrid products={displayedProducts} />
        </div>

        {/* Load more button */}
        {hasMore && (
          <div className="px-6 md:px-12 lg:px-16 pb-12 text-center">
            <button
              onClick={handleLoadMore}
              className="btn-secondary btn-lg px-12"
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
