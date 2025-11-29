"use client";

/**
 * CategoryCarousel Component
 *
 * A horizontal auto-scrolling carousel of category cards.
 *
 * Design v2.0:
 * - Display font for section heading
 * - Layered grey surface colors
 * - Gradient fade at edges
 * - Refined card styling with micro-interactions
 */

import Link from "next/link";
import { Category } from "@/types/product";

/**
 * Category data with display labels and icons.
 */
interface CategoryItem {
  value: Category;
  label: string;
  icon: string;
}

/**
 * List of categories to display.
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
 * CategoryCarousel renders an auto-scrolling carousel.
 */
export default function CategoryCarousel() {
  const duplicatedCategories = [...CATEGORIES, ...CATEGORIES];

  return (
    <section className="w-full py-8 md:py-16">
      {/* Section header with display font */}
      <div className="px-6 md:px-12 lg:px-16 flex items-center justify-between mb-8 md:mb-12">
        <h2 className="heading-section">
          Featured Categories
        </h2>

        {/* Desktop CTA button */}
        <Link href="/products" className="hidden md:inline-block btn-primary">
          All Products
        </Link>
      </div>

      {/* Full-width carousel container */}
      <div className="relative w-full overflow-hidden group">
        {/* Left edge gradient */}
        <div
          className="
            absolute left-0 top-0
            w-20 md:w-32 lg:w-40
            h-full
            bg-gradient-to-r from-surface-base to-transparent
            z-10
            pointer-events-none
          "
        />

        {/* Right edge gradient */}
        <div
          className="
            absolute right-0 top-0
            w-20 md:w-32 lg:w-40
            h-full
            bg-gradient-to-l from-surface-base to-transparent
            z-10
            pointer-events-none
          "
        />

        {/* Auto-scrolling content */}
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
                bg-surface-elevated
                border border-border-default
                rounded-2xl
                overflow-hidden
                transition-all duration-300
                hover:border-border-strong
                hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]
                hover:-translate-y-1
              "
            >
              {/* Category label */}
              <div className="px-4 pt-4 md:px-5 md:pt-5">
                <span
                  className="
                    text-sm md:text-base lg:text-lg
                    font-bold
                    tracking-wider
                    text-text-primary
                  "
                >
                  {category.label}
                </span>
              </div>

              {/* Icon area */}
              <div
                className="
                  flex-1
                  flex items-center justify-center
                  px-4 pb-4
                  md:px-5 md:pb-5
                "
              >
                <span className="text-5xl md:text-6xl lg:text-7xl opacity-70">
                  {category.icon}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile CTA button */}
      <div className="md:hidden mt-8 text-center">
        <Link href="/products" className="btn-primary">
          All Products
        </Link>
      </div>
    </section>
  );
}
