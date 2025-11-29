"use client";

/**
 * ProductsPage Component
 *
 * The full product browsing experience for zayfinds.
 * Displays category filters and a filterable product grid.
 *
 * Features:
 * - Client component for managing filter state
 * - Category filtering with memoized product list
 * - Responsive layout with max-width container
 * - Anchor link targets for navigation (#categories, #products)
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

/* Data imports */
import { mockProducts } from "@/data/productsMock";

/* Type imports */
import { Category } from "@/types/product";

/**
 * All available product categories.
 * Used for validation and potential future features (e.g., showing category counts).
 */
const allCategories: Category[] = [
  "tops",
  "hoodies",
  "jackets",
  "pants",
  "shorts",
  "shoes",
  "bags",
  "jewelry",
  "accessories",
  "electronics",
  "misc",
];

/**
 * ProductsPage is the main browsing interface for zayfinds.
 * It manages category filter state and renders the product grid.
 */
export default function ProductsPage() {
  /**
   * State: Currently selected category filter.
   * - "all" shows all products (default)
   * - Any Category value filters to that specific category
   */
  const [selected, setSelected] = useState<CategoryFilterValue>("all");

  /**
   * Memoized filtered products list.
   * Recomputes only when `selected` changes, avoiding unnecessary re-renders.
   * - If "all" is selected, return the full product list
   * - Otherwise, filter products by the selected category
   */
  const filteredProducts = useMemo(() => {
    if (selected === "all") {
      return mockProducts;
    }
    return mockProducts.filter((product) => product.category === selected);
  }, [selected]);

  return (
    <>
      {/* 
        Navbar: Sticky header with logo and navigation links.
        Rendered outside <main> so it spans full width.
      */}
      <Navbar />

      {/* 
        Main content area: Centered container with max-width.
        - max-w-6xl: constrains content width on large screens
        - mx-auto: horizontally centers the container
        - px-4: horizontal padding for mobile
        - pb-16: bottom padding for breathing room
        - pt-8: top padding below navbar
      */}
      <main className="max-w-6xl mx-auto px-4 pb-16 pt-8">
        {/* 
          Page header: Title for the products page.
          Replaces Hero on this page since it's the browsing experience.
        */}
        <div className="mb-6">
          <h1
            className="
              text-2xl sm:text-3xl
              font-bold
              text-white
            "
          >
            All Products
          </h1>
          <p className="mt-2 text-neutral-400 text-sm">
            Browse our curated collection of rep finds.
          </p>
        </div>

        {/* 
          Category filter: Horizontal scrollable filter chips.
          - value: current selection state
          - onChange: updates selection state
          - Contains id="categories" for anchor link navigation
        */}
        <CategoryFilter value={selected} onChange={setSelected} />

        {/* 
          Products section: Grid of product cards.
          - id="products" for anchor link navigation
          - Section label for visual hierarchy
          - Conditional rendering based on filtered results
        */}
        <section id="products" className="mt-8">
          {/* 
            Section label: Small uppercase text above the grid.
            Shows count of filtered products.
          */}
          <h2
            className="
              text-xs font-medium
              tracking-widest uppercase
              text-neutral-400
              mb-4
            "
          >
            {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
          </h2>

          {/* 
            Product grid or empty state.
            - If no products match the filter, show a muted message
            - Otherwise, render the ProductGrid component
          */}
          {filteredProducts.length === 0 ? (
            <p className="text-neutral-500 text-sm py-8">
              No products in this category yet.
            </p>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </section>
      </main>
    </>
  );
}

