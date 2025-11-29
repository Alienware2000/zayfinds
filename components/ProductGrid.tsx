/**
 * ProductGrid Component
 *
 * Renders a responsive grid of ProductCard components.
 * Handles the empty state when no products match the current filter.
 *
 * Design notes:
 * - Server component (no local state required)
 * - Responsive grid: 2 columns on mobile, 3 on tablet, 4 on desktop
 * - Consistent gap between cards
 * - Empty state message when no products to display
 */

import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

/**
 * Props for the ProductGrid component.
 */
interface ProductGridProps {
  /** Array of products to display in the grid */
  products: Product[];
}

/**
 * ProductGrid renders a responsive grid of product cards.
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
   * - grid: enables CSS grid layout
   * - gap-4: consistent spacing between cards
   * - grid-cols-2: 2 columns on small screens (default)
   * - md:grid-cols-3: 3 columns on medium screens (768px+)
   * - lg:grid-cols-4: 4 columns on large screens (1024px+)
   */
  return (
    <div
      className="
        grid
        gap-4
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
      "
    >
      {products.map((product) => (
        /* 
          Each ProductCard is keyed by product.id for efficient React reconciliation.
          The product object is passed as a prop to ProductCard.
        */
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

