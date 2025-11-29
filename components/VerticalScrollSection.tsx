/**
 * VerticalScrollSection Component
 *
 * A showcase section that displays products in animated vertical columns
 * on desktop, or a horizontal scroll row on mobile/tablet.
 *
 * Desktop (≥lg/1024px):
 * - 3 vertical columns with animated scrolling
 * - Left column: scrolls up
 * - Center column: scrolls down
 * - Right column: scrolls up (slower for parallax effect)
 * - Fixed height container with overflow hidden
 *
 * Mobile/Tablet (<lg):
 * - Single horizontal scrollable row
 * - No vertical animation
 * - Touch-friendly drag scrolling
 *
 * This creates a visually dynamic section inspired by finds.org
 * without requiring user scroll interaction.
 */

import { Product } from "@/types/product";
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
    <section className="w-full py-10 md:py-12">
      {/* 
        Section header: Label for the trending products area.
        Consistent styling with other sections.
      */}
      <h2
        className="
          text-xs font-bold
          tracking-widest uppercase
          text-neutral-500
          mb-6
        "
      >
        Trending Products
      </h2>

      {/* ===========================================
          DESKTOP LAYOUT (lg and above)
          3 animated vertical columns
          =========================================== */}
      <div
        className="
          hidden lg:grid
          lg:grid-cols-3
          gap-4
          h-[600px]
          overflow-hidden
          rounded-2xl
          border border-white/5
          bg-neutral-950/30
          p-4
        "
      >
        {/* 
          Left column: Scrolls upward at normal speed.
          Creates upward motion on the left side.
        */}
        <VerticalScrollColumn
          products={leftProducts}
          direction="up"
          speed="normal"
        />

        {/* 
          Center column: Scrolls downward.
          Creates contrast with the outer columns.
        */}
        <VerticalScrollColumn
          products={centerProducts}
          direction="down"
          speed="normal"
        />

        {/* 
          Right column: Scrolls upward at slower speed.
          Creates parallax effect with the left column.
        */}
        <VerticalScrollColumn
          products={rightProducts}
          direction="up"
          speed="slow"
        />
      </div>

      {/* ===========================================
          MOBILE/TABLET LAYOUT (below lg)
          Single horizontal scrollable row
          =========================================== */}
      <div
        className="
          lg:hidden
          overflow-x-auto
          scrollbar-hide
          -mx-4 px-4
        "
      >
        {/* 
          Horizontal flex container for cards.
          - flex-nowrap prevents wrapping
          - gap-4 for spacing between cards
          - snap-x for smooth scroll snapping
        */}
        <div className="flex flex-nowrap gap-4 snap-x snap-mandatory pb-4">
          {products.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="
                flex-shrink-0
                snap-start
                w-[280px]
              "
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

