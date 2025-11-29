/**
 * Navbar Component
 *
 * A sticky navigation bar that stays at the top of the viewport.
 * Contains the "zayfinds" text logo on the left and navigation links on the right.
 *
 * Design notes:
 * - Sticky positioning so it remains visible on scroll
 * - Semi-transparent black background with backdrop blur (glassy effect)
 * - Subtle bottom border for separation from content
 * - Max-width container for consistent alignment with page content
 * - Uses Next.js Link for client-side navigation
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
        bg-black/80 backdrop-blur-md
        border-b border-white/10
      "
    >
      {/* 
        Inner container: Constrains content width and centers it.
        - max-w-6xl for consistent page width
        - mx-auto for horizontal centering
        - px-4 for horizontal padding
        - h-16 for consistent navbar height
        - flex with justify-between for logo left, links right
      */}
      <div
        className="
          max-w-6xl mx-auto px-4
          h-16
          flex items-center justify-between
        "
      >
        {/* 
          Logo: "zayfinds" text wrapped in Link to home.
          - Clicking logo returns to landing page
          - Uppercase tracking (letter-spacing) for modern feel
          - Font semibold for weight without being too heavy
          - White text for contrast
        */}
        <Link 
          href="/"
          className="text-sm font-semibold tracking-widest uppercase text-white hover:text-white/80 transition-colors duration-200"
        >
          zayfinds
        </Link>

        {/* 
          Navigation links: Route links to pages
          - Flex row with gap for spacing
          - Muted text that brightens on hover
          - Smooth transition for hover effect
        */}
        <div className="flex items-center gap-6">
          {/* 
            Home link: Routes back to landing page
            Allows users to return to the main intro/marketing page
          */}
          <Link
            href="/"
            className="
              text-sm text-white/60
              hover:text-white
              transition-colors duration-200
            "
          >
            Home
          </Link>

          {/* 
            Products link: Routes to /products page
            Main browsing experience with filters and grid
          */}
          <Link
            href="/products"
            className="
              text-sm text-white/60
              hover:text-white
              transition-colors duration-200
            "
          >
            Products
          </Link>

          {/* 
            Categories link: Routes to /products page with categories section
            Scrolls to the category filter chips on the products page
          */}
          <Link
            href="/products#categories"
            className="
              text-sm text-white/60
              hover:text-white
              transition-colors duration-200
            "
          >
            Categories
          </Link>
        </div>
      </div>
    </nav>
  );
}
