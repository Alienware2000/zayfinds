/**
 * ProductCard Component
 *
 * Displays a single product in a card format with image, name, price, and buy button.
 * Used as the building block for the ProductGrid component.
 *
 * Design notes:
 * - Server component (no local state required)
 * - Vertical flex layout with rounded corners and subtle border
 * - Hover effect: lifts up slightly with brighter border
 * - Image placeholder shown when imageUrl is null
 * - External "Buy" link opens in new tab
 */

import { Product } from "@/types/product";

/**
 * Props for the ProductCard component.
 */
interface ProductCardProps {
  /** The product data to display */
  product: Product;
}

/**
 * ProductCard renders a single product as a styled card.
 * It displays the product image (or placeholder), name, price, and a buy button.
 */
export default function ProductCard({ product }: ProductCardProps) {
  /**
   * Determine the display price.
   * If priceRaw is empty or falsy, show fallback text.
   */
  const displayPrice = product.priceRaw || "Price on site";

  /**
   * Check if we have a valid image URL to display.
   * Null, undefined, or empty string means no image.
   */
  const hasImage = product.imageUrl !== null && product.imageUrl !== "";

  return (
    <article
      className="
        flex flex-col
        p-3
        rounded-2xl
        border border-white/10
        bg-neutral-950/60
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:border-white/25
        hover:shadow-lg hover:shadow-black/20
      "
    >
      {/* 
        Image area: Fixed aspect ratio container.
        - aspect-[4/5] creates a portrait-style ratio
        - overflow-hidden clips the image to rounded corners
        - rounded-xl for inner image rounding
      */}
      <div
        className="
          relative
          w-full
          aspect-[4/5]
          overflow-hidden
          rounded-xl
          bg-neutral-900
        "
      >
        {hasImage ? (
          /* 
            Product image: Covers the container.
            - object-cover ensures image fills space without distortion
            - w-full h-full stretches to container bounds
          */
          <img
            src={product.imageUrl!}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          /* 
            Placeholder: Shown when no image URL is provided.
            - Subtle gradient background for visual interest
            - Centered muted text as indicator
          */
          <div
            className="
              w-full h-full
              flex items-center justify-center
              bg-gradient-to-br from-neutral-800 to-neutral-900
            "
          >
            <span className="text-xs text-neutral-600 uppercase tracking-wider">
              No image
            </span>
          </div>
        )}
      </div>

      {/* 
        Text area: Product name and price.
        - mt-3 for spacing from image
        - flex-grow allows this section to expand if needed
      */}
      <div className="mt-3 flex-grow">
        {/* 
          Product name: Truncated to 2 lines max.
          - line-clamp-2 cuts off long names with ellipsis
          - font-medium for slight emphasis
        */}
        <h3
          className="
            text-sm font-medium
            text-white
            line-clamp-2
            leading-snug
          "
        >
          {product.name}
        </h3>

        {/* 
          Price: Displayed in muted gray.
          - mt-1 for small spacing from name
          - text-neutral-400 for muted appearance
        */}
        <p className="mt-1 text-sm text-neutral-400">
          {displayPrice}
        </p>
      </div>

      {/* 
        Button area: External buy link.
        - mt-3 for spacing from text area
        - Opens in new tab with security attributes
      */}
      <a
        href={product.buyUrl}
        target="_blank"
        rel="noreferrer"
        className="
          mt-3
          w-full
          py-2
          text-center
          text-xs font-medium
          uppercase tracking-wide
          text-white
          border border-white/30
          rounded-full
          transition-colors duration-200
          hover:bg-white hover:text-black
        "
      >
        Buy
      </a>
    </article>
  );
}

