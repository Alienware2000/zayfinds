/**
 * ProductCard Component
 *
 * Displays a single product in a card format with image, name, price, and action buttons.
 * Used as the building block for the ProductGrid component and related products section.
 *
 * Design v2.0:
 * - Layered grey surface colors
 * - Micro-interactions: scale, lift, border glow
 * - Image zoom on hover
 * - Refined button styling
 *
 * Button variants:
 * - "full" (default): Shows both BUY (external) and View Details (internal) buttons
 * - "buy-only": Shows only the BUY button (external link)
 * - "details-only": Shows only "View Details" button (internal link to product page)
 */

import Link from "next/link";
import { Product } from "@/types/product";
import { getProductSlug } from "@/lib/products";

/**
 * Button variant determines which CTAs are shown on the card.
 */
type ButtonVariant = "full" | "buy-only" | "details-only";

/**
 * Props for the ProductCard component.
 */
interface ProductCardProps {
  /** The product data to display */
  product: Product;
  /** Optional badge text to display in top-left corner */
  badge?: string;
  /**
   * Which buttons to show:
   * - "full": BUY + View Details (default, for main grid)
   * - "buy-only": Only BUY button
   * - "details-only": Only View Details (for recommendations)
   */
  buttonVariant?: ButtonVariant;
}

/**
 * ProductCard renders a single product as a styled card.
 */
export default function ProductCard({
  product,
  badge,
  buttonVariant = "full",
}: ProductCardProps) {
  const displayPrice = product.priceRaw || "Price on site";
  const hasImage = product.imageUrl !== null && product.imageUrl !== "";
  const productSlug = getProductSlug(product);

  return (
    <article
      className="
        group
        flex flex-col
        p-2 md:p-3
        rounded-xl
        bg-surface-elevated
        border border-border-default
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:border-border-strong
        hover:shadow-lg hover:shadow-black/40
      "
    >
      {/* 
        Image area: Clickable with hover zoom effect
      */}
      <Link
        href={`/products/${productSlug}`}
        className="
          relative
          w-full
          aspect-[4/5]
          overflow-hidden
          rounded-lg
          bg-surface-raised
          block
        "
      >
        {/* Optional badge */}
        {badge && (
          <div
            className="
              absolute top-2 left-2
              px-2 py-1
              text-[10px] font-bold
              uppercase tracking-wider
              bg-text-primary text-surface-base
              rounded
              z-10
            "
          >
            {badge}
          </div>
        )}

        {hasImage ? (
          <img
            src={product.imageUrl!}
            alt={product.name}
            className="
              w-full h-full object-cover
              transition-transform duration-500 ease-out
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              w-full h-full
              flex items-center justify-center
              bg-gradient-to-br from-surface-raised to-surface-elevated
            "
          >
            <span className="text-xs text-text-subtle uppercase tracking-wider">
              No image
            </span>
          </div>
        )}
      </Link>

      {/* Text area: Clickable name and price */}
      <Link href={`/products/${productSlug}`} className="mt-3 flex-grow block">
        <h3
          className="
            text-xs md:text-sm font-medium
            text-text-primary
            line-clamp-2
            leading-snug
            group-hover:text-text-secondary
            transition-colors duration-200
          "
        >
          {product.name}
        </h3>

        <p className="mt-1 text-xs md:text-sm text-text-muted">
          {displayPrice}
        </p>
      </Link>

      {/* Button area */}
      <div className="mt-3 space-y-2">
        {/* FULL VARIANT */}
        {buttonVariant === "full" && (
          <>
            <a
              href={product.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-sm btn-full"
            >
              Buy
            </a>
            <Link
              href={`/products/${productSlug}`}
              className="btn-secondary btn-sm btn-full"
            >
              View Details
            </Link>
          </>
        )}

        {/* BUY-ONLY VARIANT */}
        {buttonVariant === "buy-only" && (
          <a
            href={product.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-sm btn-full"
          >
            Buy
          </a>
        )}

        {/* DETAILS-ONLY VARIANT */}
        {buttonVariant === "details-only" && (
          <Link
            href={`/products/${productSlug}`}
            className="btn-secondary btn-sm btn-full"
          >
            View Details
          </Link>
        )}
      </div>
    </article>
  );
}
