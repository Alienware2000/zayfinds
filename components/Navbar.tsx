/**
 * Navbar Component
 *
 * A sticky navigation bar that stays at the top of the viewport.
 * Contains the "ZAYFINDS" logo on the left and navigation links on the right.
 *
 * Design v2.0:
 * - Display font for logo
 * - Layered dark surface background
 * - Animated nav links with underline effect
 * - Subtle border separation
 */

import Link from "next/link";

/**
 * Navbar is a server component (no "use client" needed).
 * Uses Next.js Link for proper client-side routing between pages.
 */
export default function Navbar() {
  return (
    <nav
      className="
        sticky top-0 z-50
        w-full
        bg-surface-nav/95
        backdrop-blur-md
        border-b border-border-default
      "
    >
      {/* 
        Inner container: Edge-to-edge with generous padding.
        - px-6 md:px-12 for edge positioning
        - h-16 for consistent navbar height
        - flex with justify-between for logo left, links right
      */}
      <div
        className="
          px-6 md:px-12 lg:px-16
          h-16
          flex items-center justify-between
        "
      >
        {/* 
          Logo: "ZAYFINDS" in display font
          - Uses Syne display font for brand identity
          - Bold weight, wider tracking
          - Off-white text that dims on hover
        */}
        <Link
          href="/"
          className="
            font-display
            text-base md:text-lg
            font-bold
            tracking-[0.15em]
            uppercase
            text-text-primary
            hover:text-text-secondary
            transition-colors duration-200
          "
        >
          ZAYFINDS
        </Link>

        {/* 
          Navigation links: Animated hover effects
          - Uses nav-link class from globals.css
          - Smooth color transition + underline animation
        */}
        <div className="flex items-center gap-8">
          <Link href="/" className="nav-link">
            Home
          </Link>

          <Link href="/products" className="nav-link">
            Products
          </Link>

          <Link href="/products#categories" className="nav-link">
            Categories
          </Link>
        </div>
      </div>
    </nav>
  );
}
