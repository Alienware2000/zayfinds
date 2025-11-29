/**
 * FeaturedCategories Component
 *
 * A horizontal scrollable row of category cards for the landing page.
 * Each card links to the /products page with that category pre-selected.
 *
 * Design notes:
 * - Server component (no local state required)
 * - Horizontally scrollable on mobile with smooth scroll
 * - Large clickable cards with category names and icons
 * - Links to /products?category=X
 *
 * Phase 5-A Polish:
 * - Larger card size
 * - Improved hover effects with scale and glow
 * - Better typography hierarchy
 * - More generous spacing
 */

import Link from "next/link";
import { Category } from "@/types/product";

/**
 * Featured category data with display labels and optional styling.
 * Each category links to the products page filtered by that category.
 */
interface FeaturedCategory {
  /** The category value (matches Category type) */
  value: Category;
  /** Display label for the card */
  label: string;
  /** Optional emoji or icon for visual interest */
  icon?: string;
}

/**
 * List of featured categories to display on the landing page.
 * Ordered by popularity/importance for the rep fashion audience.
 */
const FEATURED_CATEGORIES: FeaturedCategory[] = [
  { value: "shoes", label: "Shoes", icon: "👟" },
  { value: "hoodies", label: "Hoodies", icon: "🧥" },
  { value: "jackets", label: "Jackets", icon: "🧱" },
  { value: "tops", label: "Tops", icon: "👕" },
  { value: "pants", label: "Pants", icon: "👖" },
  { value: "bags", label: "Bags", icon: "👜" },
  { value: "jewelry", label: "Jewelry", icon: "💎" },
  { value: "accessories", label: "Accessories", icon: "🧢" },
];

/**
 * FeaturedCategories renders a horizontal scrollable row of category cards.
 * Used on the landing page to showcase available categories.
 */
export default function FeaturedCategories() {
  return (
    <section className="w-full py-10 md:py-12">
      {/* 
        Section label: Bold uppercase text above the cards.
        - Stronger weight for better hierarchy
        - Muted color for visual balance
      */}
      <h2
        className="
          text-xs font-bold
          tracking-widest uppercase
          text-neutral-500
          mb-6
        "
      >
        Featured Categories
      </h2>

      {/* 
        Scrollable container for category cards.
        - overflow-x-auto enables horizontal scrolling on mobile
        - scrollbar-hide hides the scrollbar (custom utility)
        - Negative margin + padding trick for edge-to-edge scroll on mobile
      */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {/* 
          Inner flex container for cards.
          - flex-nowrap prevents wrapping so horizontal scroll works
          - gap-4 for generous spacing between cards
          - snap-x for smooth scroll snapping on mobile
        */}
        <div className="flex flex-nowrap gap-4 snap-x snap-mandatory md:snap-none">
          {FEATURED_CATEGORIES.map((category, index) => (
            <Link
              key={category.value}
              href={`/products?category=${category.value}`}
              className="
                flex-shrink-0
                snap-start
                w-36 h-28 md:w-40 md:h-32
                flex flex-col items-center justify-center
                gap-2
                rounded-2xl
                border border-white/10
                bg-neutral-900/60
                backdrop-blur-sm
                transition-all duration-300 ease-out
                hover:border-white/40
                hover:bg-neutral-800/80
                hover:-translate-y-1
                hover:scale-[1.02]
                hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)]
              "
              style={{
                /* Staggered animation delay for visual interest */
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* 
                Category icon: Emoji for visual interest.
                - Larger size for better visibility
                - Slight bounce on hover via parent transform
              */}
              {category.icon && (
                <span className="text-3xl md:text-4xl">
                  {category.icon}
                </span>
              )}

              {/* 
                Category label: Name of the category.
                - Medium text, semibold weight
                - White text for contrast
              */}
              <span className="text-sm md:text-base font-semibold text-white">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
