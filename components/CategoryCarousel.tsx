"use client";

/**
 * CategoryCarousel Component
 *
 * A horizontal auto-scrolling carousel of category cards.
 * Inspired by finds.org's featured categories section.
 *
 * Features:
 * - Auto-scroll animation (infinite horizontal loop)
 * - Edge fade gradient effect (cards fade in/out at boundaries)
 * - Large cards with category label at top and icon/placeholder image
 * - Pause on hover for better UX
 * - Each card links to /products?category=X
 *
 * Design:
 * - Full-width edge-to-edge layout
 * - Proportionate dark cards (like finds.org)
 * - Category name at top in uppercase
 * - Large icon/placeholder in center
 * - Smooth gradient fade at edges
 */

import Link from "next/link";
import { Category } from "@/types/product";

/**
 * Category data with display labels and icons.
 */
interface CategoryItem {
  /** The category value (matches Category type) */
  value: Category;
  /** Display label for the card (uppercase) */
  label: string;
  /** Emoji icon for visual interest */
  icon: string;
}

/**
 * List of categories to display in the carousel.
 * Ordered by popularity/importance.
 */
const CATEGORIES: CategoryItem[] = [
  { value: "shoes", label: "SHOES", icon: "👟" },
  { value: "tops", label: "T-SHIRTS", icon: "👕" },
  { value: "hoodies", label: "HOODIES", icon: "🧥" },
  { value: "jewelry", label: "JEWELRY", icon: "💎" },
  { value: "pants", label: "PANTS", icon: "👖" },
  { value: "jackets", label: "JACKETS", icon: "🧥" },
  { value: "bags", label: "BAGS", icon: "👜" },
  { value: "shorts", label: "SHORTS", icon: "🩳" },
  { value: "accessories", label: "ACCESSORIES", icon: "🧢" },
  { value: "electronics", label: "ELECTRONICS", icon: "🎧" },
  { value: "misc", label: "MISC", icon: "📦" },
];

/**
 * CategoryCarousel renders a horizontal auto-scrolling carousel of category cards.
 * Full-width with gradient fade effects at edges.
 */
export default function CategoryCarousel() {
  /* Duplicate categories for seamless infinite scroll */
  const duplicatedCategories = [...CATEGORIES, ...CATEGORIES];

  return (
    <section className="w-full py-8 md:py-16">
      {/* 
        Section header with title and "ALL PRODUCTS" button.
        Constrained to max-w-6xl for readability.
      */}
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between mb-8 md:mb-12">
        <h2
          className="
            text-2xl md:text-3xl lg:text-4xl
            font-black
            text-white
            tracking-tight
            uppercase
          "
        >
          Featured Categories
        </h2>

        {/* 
          All Products button: Styled like finds.org.
        */}
        <Link
          href="/products"
          className="
            hidden md:inline-block
            px-6 py-3
            text-sm font-bold
            tracking-wider uppercase
            text-black
            bg-white
            rounded-full
            border-2 border-white
            transition-all duration-300
            hover:bg-transparent
            hover:text-white
          "
        >
          All Products
        </Link>
      </div>

      {/* 
        Full-width carousel container.
        - No horizontal padding (edge-to-edge)
        - Relative for gradient overlays
      */}
      <div className="relative w-full overflow-hidden group">
        {/* 
          LEFT EDGE GRADIENT: Fade from black to transparent.
          Creates smooth visual boundary.
        */}
        <div
          className="
            absolute left-0 top-0
            w-20 md:w-32 lg:w-40
            h-full
            bg-gradient-to-r from-black to-transparent
            z-10
            pointer-events-none
          "
        />

        {/* 
          RIGHT EDGE GRADIENT: Fade from transparent to black.
          Creates smooth visual boundary.
        */}
        <div
          className="
            absolute right-0 top-0
            w-20 md:w-32 lg:w-40
            h-full
            bg-gradient-to-l from-black to-transparent
            z-10
            pointer-events-none
          "
        />

        {/* 
          Auto-scrolling inner container.
          - Uses CSS animation for smooth infinite scroll
          - Animation pauses on hover
          - Duplicated content for seamless loop
          - w-max ensures percentage translation works
        */}
        <div
          className="
            flex gap-4
            w-max
            animate-scroll-horizontal
            group-hover:[animation-play-state:paused]
          "
        >
          {duplicatedCategories.map((category, index) => (
            <Link
              key={`${category.value}-${index}`}
              href={`/products?category=${category.value}`}
              className="
                flex-shrink-0
                w-[180px] md:w-[240px] lg:w-[280px]
                h-[220px] md:h-[280px] lg:h-[320px]
                flex flex-col
                bg-neutral-900
                border border-white/10
                rounded-2xl
                overflow-hidden
                transition-all duration-300
                hover:border-white/30
                hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]
              "
            >
              {/* 
                Category label: At top of card, uppercase.
              */}
              <div className="px-4 pt-4 md:px-5 md:pt-5">
                <span
                  className="
                    text-sm md:text-base lg:text-lg
                    font-bold
                    tracking-wider
                    text-white
                  "
                >
                  {category.label}
                </span>
              </div>

              {/* 
                Icon area: Large centered icon/placeholder.
                Takes up remaining space.
              */}
              <div
                className="
                  flex-1
                  flex items-center justify-center
                  px-4 pb-4
                  md:px-5 md:pb-5
                "
              >
                <span className="text-5xl md:text-6xl lg:text-7xl opacity-80">
                  {category.icon}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 
        Mobile "All Products" button (shown below carousel).
      */}
      <div className="md:hidden mt-8 text-center">
        <Link
          href="/products"
          className="
            inline-block
            px-6 py-3
            text-sm font-bold
            tracking-wider uppercase
            text-black
            bg-white
            rounded-full
            border-2 border-white
            transition-all duration-300
            active:bg-transparent
            active:text-white
          "
        >
          All Products
        </Link>
      </div>
    </section>
  );
}
