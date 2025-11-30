/**
 * VerticalScrollSection Component
 *
 * A showcase section that displays products in animated columns.
 *
 * Desktop (≥lg/1024px):
 * - 3 vertical columns with animated scrolling
 * - Left column: scrolls up
 * - Center column: scrolls down
 * - Right column: scrolls up
 * - Fills parent height
 *
 * Mobile/Tablet (<lg):
 * - Auto-scrolling horizontal carousel
 * - Seamless infinite loop with duplicated content
 * - Edge gradient fade effects
 *
 * Note: This component sits beside the Hero section on desktop.
 */

import { Product } from "@/lib/products";
import VerticalScrollColumn from "@/components/VerticalScrollColumn";
import ProductCard from "@/components/ProductCard";

/**
 * Props for the VerticalScrollSection component.
 */
interface VerticalScrollSectionProps {
  /** Array of products to display across all columns */
  products: Product[];
}

/**
 * Splits an array into chunks of specified size.
 * Used to distribute products evenly across columns.
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * VerticalScrollSection renders a dynamic product showcase.
 * Shows animated vertical columns on desktop, horizontal scroll on mobile.
 */
export default function VerticalScrollSection({ products }: VerticalScrollSectionProps) {
  /* 
    Calculate products per column.
    We want roughly equal distribution across 3 columns.
    Minimum 4 products per column for good visual density.
  */
  const productsPerColumn = Math.max(4, Math.ceil(products.length / 3));
  
  /* 
    Split products into 3 groups for each column.
    If we don't have enough products, some columns may have fewer items.
  */
  const columnProducts = chunkArray(products, productsPerColumn);
  
  /* Ensure we always have 3 columns worth of data (even if empty) */
  const leftProducts = columnProducts[0] || [];
  const centerProducts = columnProducts[1] || columnProducts[0] || [];
  const rightProducts = columnProducts[2] || columnProducts[0] || [];

  return (
    <div className="w-full h-full">
      {/* ===========================================
          DESKTOP LAYOUT (lg and above)
          3 animated vertical columns - fills parent height
          Includes subtle gradient fade at top and bottom edges
          =========================================== */}
      <div className="hidden lg:block relative h-full">
        {/* 
          TOP EDGE: No gradient - cards visible from the top.
          Only bottom has fade effect for cleaner look.
        */}

        {/* 
          BOTTOM EDGE GRADIENT: Subtle fade from transparent to black.
          Creates smooth visual boundary at bottom.
        */}
        <div
          className="
            absolute bottom-0 left-0 right-0
            h-16 lg:h-24
            bg-gradient-to-t from-black/80 via-black/40 to-transparent
            z-10
            pointer-events-none
          "
        />

        {/* 
          Grid container for the 3 columns.
        */}
        <div
          className="
            grid grid-cols-3
            gap-3
            h-full
            overflow-hidden
            p-2
          "
        >
          {/* 
            Left column: Scrolls upward at normal speed.
          */}
          <VerticalScrollColumn
            products={leftProducts}
            direction="up"
            speed="normal"
          />

          {/* 
            Center column: Scrolls downward at normal speed.
          */}
          <VerticalScrollColumn
            products={centerProducts}
            direction="down"
            speed="normal"
          />

          {/* 
            Right column: Scrolls upward at same speed as left.
            Both left and right columns stay aligned.
          */}
          <VerticalScrollColumn
            products={rightProducts}
            direction="up"
            speed="normal"
          />
        </div>
      </div>

      {/* ===========================================
          MOBILE/TABLET LAYOUT (below lg)
          Auto-scrolling horizontal carousel
          =========================================== */}
      <div className="lg:hidden">
        {/* Section title */}
        <h2
          className="
            text-xs font-bold
            tracking-widest uppercase
            text-neutral-500
            mb-4 px-4
          "
        >
          Trending Products
        </h2>

        {/* Auto-scrolling carousel container */}
        <div className="relative w-full overflow-hidden">
          {/* Left edge gradient */}
          <div
            className="
              absolute left-0 top-0
              w-16 h-full
              bg-gradient-to-r from-surface-base to-transparent
              z-10 pointer-events-none
            "
          />

          {/* Right edge gradient */}
          <div
            className="
              absolute right-0 top-0
              w-16 h-full
              bg-gradient-to-l from-surface-base to-transparent
              z-10 pointer-events-none
            "
          />

          {/* Auto-scrolling content - duplicated for seamless loop */}
          <div
            className="
              flex gap-4
              w-max
              animate-scroll-horizontal
            "
          >
            {/* First set of products */}
            {products.slice(0, 8).map((product) => (
              <div
                key={`first-${product.id}`}
                className="flex-shrink-0 w-[200px]"
              >
                <ProductCard product={product} buttonVariant="buy-only" />
              </div>
            ))}

            {/* Duplicated set for seamless loop */}
            {products.slice(0, 8).map((product) => (
              <div
                key={`second-${product.id}`}
                className="flex-shrink-0 w-[200px]"
              >
                <ProductCard product={product} buttonVariant="buy-only" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
