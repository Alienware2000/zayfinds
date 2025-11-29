/**
 * Hero Component
 *
 * The main introductory section displayed on the homepage.
 * Contains a label, headline, subtext, and call-to-action buttons.
 *
 * Design v2.0:
 * - Display font (Syne) for headline
 * - Layered grey color system
 * - Refined button system with micro-interactions
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
        - Uses text-meta style from globals.css
        - Muted grey for visual hierarchy
      */}
      <span className="text-meta text-text-muted">
        Curated Rep Finds
      </span>

      {/* 
        Main headline: Display font for brand impact
        - Uses Syne display font
        - Extra-bold weight for maximum impact
        - Primary text color (off-white)
        - Tight line height for compact appearance
      */}
      <h1 className="heading-hero mt-4">
        We do not gate keep over here
      </h1>

      {/* 
        Subtext: Explains what zayfinds is about.
        - Secondary text color for hierarchy
        - Comfortable reading width
      */}
      <p
        className="
          mt-6
          text-base md:text-lg
          text-text-secondary
          max-w-md
          leading-relaxed
        "
      >
        Browse hand-picked pieces and tap through to buy directly from sellers.
      </p>

      {/* 
        CTA buttons container
        - Primary: Browse products (high visibility)
        - Secondary: View categories (outline style)
        
        See app/globals.css for button system definitions.
      */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        {/* Primary CTA */}
        <Link href="/products" className="btn-primary btn-lg">
          Browse products
        </Link>

        {/* Secondary CTA */}
        <a href="#featured-categories" className="btn-secondary btn-lg">
          View categories
        </a>
      </div>

      {/* Scroll hint (mobile only) */}
      <p className="mt-12 text-xs text-text-subtle lg:hidden">
        ↓ Scroll to explore
      </p>
    </div>
  );
}
