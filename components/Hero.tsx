/**
 * Hero Component
 *
 * The main introductory section displayed on the homepage.
 * Contains a label, headline, subtext, and a call-to-action button.
 *
 * Design notes:
 * - Designed to sit in a side-by-side layout with scroll columns
 * - Left-aligned text
 * - Subtle fade-in animation on load
 * - Strong CTA button with hover glow effect
 *
 * Layout context:
 * - On desktop: Sits on the left side (~40-45% width) next to scroll columns
 * - On mobile: Full width, stacked above scroll section
 */

import Link from "next/link";

/**
 * Hero is a server component (no "use client" needed).
 * It displays static content with a Link to the products page.
 */
export default function Hero() {
  return (
    <div className="w-full animate-fadeIn">
      {/* 
        Small label above the heading.
        - Uppercase for stylistic emphasis
        - Light gray (muted) for visual hierarchy
        - Small text with letter spacing
      */}
      <span
        className="
          text-xs font-semibold
          tracking-widest uppercase
          text-neutral-500
        "
      >
        Curated Rep Finds
      </span>

      {/* 
        Main headline: The core message of zayfinds.
        - Large text that scales appropriately
        - Extra-bold weight for maximum impact
        - White text for contrast
        - Tight leading for compact appearance
        - Slightly smaller on desktop to fit side-by-side layout
      */}
      <h1
        className="
          mt-4
          text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl
          font-extrabold
          leading-[1.1]
          text-white
          tracking-tight
        "
      >
        We do not gate keep over here
      </h1>

      {/* 
        Subtext: Explains what zayfinds is about.
        - Muted text (neutral-400) for hierarchy
        - Max width for readable line length
      */}
      <p
        className="
          mt-5
          text-base md:text-lg
          text-neutral-400
          max-w-md
          leading-relaxed
        "
      >
        Browse hand-picked pieces and tap through to buy directly from sellers.
      </p>

      {/* 
        CTA buttons container: Primary and secondary actions.
        - Flex row on larger screens, stacked on mobile
        - Gap for spacing between buttons
      */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        {/* 
          Primary CTA button: Links to the products page.
          - Solid white background for high visibility
          - Black text for contrast
          - Rounded corners
          - Hover: scale up slightly with subtle glow
        */}
        <Link
          href="/products"
          className="
            inline-flex items-center justify-center
            px-7 py-3.5
            text-base font-semibold
            text-black
            bg-white
            rounded-lg
            transition-all duration-300
            hover:scale-105
            hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]
          "
        >
          Browse products
        </Link>

        {/* 
          Secondary CTA: Subtle outline button.
          - Transparent background
          - White border
          - Links to categories section
        */}
        <Link
          href="/products#categories"
          className="
            inline-flex items-center justify-center
            px-7 py-3.5
            text-base font-semibold
            text-white
            border border-white/30
            rounded-lg
            transition-all duration-300
            hover:border-white/60
            hover:bg-white/5
          "
        >
          View categories
        </Link>
      </div>

      {/* 
        Scroll hint: Indicates more content below (mobile only).
        Small muted text with arrow.
      */}
      <p className="mt-10 text-xs text-neutral-600 lg:hidden">
        ↓ Scroll to explore
      </p>
    </div>
  );
}
