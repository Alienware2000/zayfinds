/**
 * Hero Component
 *
 * The main introductory section displayed at the top of the homepage.
 * Contains a label, headline, subtext, and a call-to-action button.
 *
 * Design notes:
 * - Full-width section with generous vertical padding
 * - Mobile: stacked vertically, left-aligned text
 * - Desktop: same layout, larger typography
 * - Subtle fade-in animation on load
 * - Strong CTA button with hover glow effect
 *
 * Phase 5-A Polish:
 * - Increased vertical spacing
 * - Larger headline with extra-bold weight
 * - Fade-in animation
 * - Stronger, larger CTA button
 */

import Link from "next/link";

/**
 * Hero is a server component (no "use client" needed).
 * It displays static content with a Link to the products page.
 */
export default function Hero() {
  return (
    <section
      className="
        w-full
        py-16 md:py-24 lg:py-28
        px-4
      "
    >
      {/* 
        Content container: Left-aligned on all screen sizes.
        - max-w-6xl matches the navbar container width
        - mx-auto centers the container
        - animate-fadeIn for subtle entrance animation
      */}
      <div className="max-w-6xl mx-auto animate-fadeIn">
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
          - Extra-large text that scales up on larger screens
          - Extra-bold weight for maximum impact
          - White text for contrast
          - Tight leading for compact appearance
        */}
        <h1
          className="
            mt-4
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl
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
          - Slightly larger text on desktop
        */}
        <p
          className="
            mt-6
            text-base md:text-lg lg:text-xl
            text-neutral-400
            max-w-lg
            leading-relaxed
          "
        >
          Browse hand-picked pieces and tap through to buy directly from sellers.
        </p>

        {/* 
          Primary CTA button: Links to the products page.
          - Larger padding for stronger presence
          - Solid white background for high visibility
          - Black text for contrast
          - Rounded corners
          - Hover: scale up slightly with subtle glow
          - Smooth transition for all effects
        */}
        <Link
          href="/products"
          className="
            inline-block
            mt-8
            px-8 py-4
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
      </div>
    </section>
  );
}
