/**
 * ProductGrid Component
 *
 * Renders a dense, responsive grid of ProductCard components.
 * Redesigned for FINDS-style dense card layout.
 *
 * Design notes:
 * - Server component (no local state required)
 * - Dense grid: 2 cols → 3 cols → 4 cols → 5 cols
 * - Tighter gaps for compact appearance
 * - Empty state message when no products to display
 */

import { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

/**
 * Props for the ProductGrid component.
 */
interface ProductGridProps {
  /** Array of products to display in the grid */
  products: Product[];
}

/**
 * ProductGrid renders a dense responsive grid of product cards.
 * If the products array is empty, it shows an empty state message.
 */
export default function ProductGrid({ products }: ProductGridProps) {
  /**
   * Empty state: No products to display.
   * This can happen when a category filter has no matching products.
   */
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-neutral-500 text-sm">
          No products found.
        </p>
      </div>
    );
  }

  /**
   * Render the product grid.
   * Dense layout with more columns on larger screens:
   * - grid-cols-2: 2 columns on small screens (default)
   * - sm:grid-cols-3: 3 columns on small+ screens (640px+)
   * - lg:grid-cols-4: 4 columns on large screens (1024px+)
   * - xl:grid-cols-5: 5 columns on extra large screens (1280px+)
   * - gap-3: tighter spacing for dense appearance
   */
  return (
    <div
      className="
        grid
        gap-3
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
      "
    >
      {products.map((product, index) => (
        /* 
          Each ProductCard is keyed by product.id for efficient React reconciliation.
          First few products get a "BEST SELLING" badge.
        */
        <ProductCard
          key={product.id}
          product={product}
          badge={index < 3 ? "Best Selling" : undefined}
        />
      ))}
    </div>
  );
}
