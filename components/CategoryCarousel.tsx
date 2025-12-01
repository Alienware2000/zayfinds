"use client";

/**
 * CategoryCarousel Component
 *
 * A horizontal auto-scrolling carousel of category cards for the landing page.
 * Uses dynamic categories from lib/products.ts.
 *
 * Design v2.0:
 * - Display font for section heading
 * - Layered grey surface colors
 * - Gradient fade at edges
 * - Refined card styling with micro-interactions
 */

import Link from "next/link";
import { getAllCategories } from "@/lib/products";
import { useRef, useEffect } from "react";

/**
 * Emoji icons for common category types.
 * Falls back to 📦 for unknown categories.
 */
const CATEGORY_ICONS: Record<string, string> = {
  shoes: "👟",
  jackets: "🧥",
  hoodies: "🧥",
  pants: "👖",
  shorts: "🩳",
  bags: "👜",
  jewelry: "💎",
  accessories: "🧢",
  electronics: "🎧",
  shirts: "👕",
  tops: "👕",
  hats: "🎩",
  belts: "🔗",
  socks: "🧦",
  glasses: "🕶️",
  wallets: "💼",
  backpacks: "🎒",
  travel: "✈️",
  underwear: "🩲",
  blanks: "⬜",
  beanies: "🧢",
  gloves: "🧤",
  scarf: "🧣",
};

/**
 * Get icon for a category (case-insensitive match).
 */
function getCategoryIcon(category: string): string {
  const normalized = category.toLowerCase();
  
  // Check for exact match
  if (CATEGORY_ICONS[normalized]) {
    return CATEGORY_ICONS[normalized];
  }
  
  // Check for partial match
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return icon;
    }
  }
  
  return "📦"; // Default icon
}

/**
 * CategoryCarousel renders an auto-scrolling carousel with dynamic categories.
 */
export default function CategoryCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Get categories from the data source
  const categories = getAllCategories();
  
  // Take first 12 categories for the carousel (duplicate for seamless loop)
  const displayCategories = categories.slice(0, 12);
  const duplicatedCategories = [...displayCategories, ...displayCategories];

  // Handle seamless scroll wrapping
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Use refs for reliable state tracking (not closures)
    const isAdjustingRef = { current: false };
    let rafId: number | null = null;
    let lastScrollLeft = 0;

    // Initialize scroll position to the middle (start of duplicated content)
    const initializeScroll = () => {
      if (container.scrollWidth > 0) {
        const halfWidth = container.scrollWidth / 2;
        container.scrollLeft = halfWidth;
        lastScrollLeft = halfWidth;
      } else {
        requestAnimationFrame(initializeScroll);
      }
    };

    // Wait for next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(initializeScroll);
    });

    const handleScroll = () => {
      // Skip if we're currently adjusting (prevents infinite loops)
      if (isAdjustingRef.current) return;

      // Throttle scroll handler with requestAnimationFrame
      if (rafId !== null) return;
      
      rafId = requestAnimationFrame(() => {
        rafId = null;
        
        const scrollWidth = container.scrollWidth;
        const scrollLeft = container.scrollLeft;
        const clientWidth = container.clientWidth;
        const halfWidth = scrollWidth / 2;
        
        // Calculate a safe wrap distance (approximately one card width + gap)
        // This ensures we wrap before the user sees the edge
        const wrapDistance = 300; // Approximate card width + gap
        
        // Detect scroll direction
        const scrollingRight = scrollLeft > lastScrollLeft;
        const scrollingLeft = scrollLeft < lastScrollLeft;
        lastScrollLeft = scrollLeft;
        
        // Wrap when approaching the right boundary (scrolling right)
        // Wrap BEFORE reaching halfWidth so it's invisible
        if (scrollingRight && scrollLeft >= halfWidth - wrapDistance) {
          isAdjustingRef.current = true;
          // Jump back by half width (seamless because content is duplicated)
          const newScrollLeft = scrollLeft - halfWidth;
          container.scrollLeft = newScrollLeft;
          lastScrollLeft = newScrollLeft;
          // Reset flag after browser processes the scroll change
          requestAnimationFrame(() => {
            isAdjustingRef.current = false;
          });
        }
        // Wrap when approaching the left boundary (scrolling left)
        // Wrap BEFORE reaching 0 so it's invisible
        else if (scrollingLeft && scrollLeft <= wrapDistance) {
          isAdjustingRef.current = true;
          // Jump forward by half width
          const newScrollLeft = scrollLeft + halfWidth;
          container.scrollLeft = newScrollLeft;
          lastScrollLeft = newScrollLeft;
          requestAnimationFrame(() => {
            isAdjustingRef.current = false;
          });
        }
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

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
      <div 
        ref={scrollContainerRef}
        className="relative w-full overflow-x-auto overflow-y-hidden group scrollbar-hide"
      >
        {/* Left edge gradient - hidden on mobile */}
        <div
          className="
            hidden md:block
            absolute left-0 top-0
            w-20 md:w-32 lg:w-40
            h-full
            bg-gradient-to-r from-surface-base to-transparent
            z-10
            pointer-events-none
          "
        />

        {/* Right edge gradient - hidden on mobile */}
        <div
          className="
            hidden md:block
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
              key={`${category}-${index}`}
              href={`/products?category=${encodeURIComponent(category)}`}
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
                  {category.toUpperCase()}
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
                  {getCategoryIcon(category)}
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
