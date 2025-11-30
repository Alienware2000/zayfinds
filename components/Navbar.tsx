"use client";

/**
 * Navbar Component
 *
 * A responsive navigation bar with:
 * - Desktop: Full navbar with links
 * - Mobile: Hamburger menu button that opens fullscreen overlay
 *
 * Design v2.1:
 * - Display font for logo
 * - Mobile-first responsive design
 * - Fullscreen mobile menu overlay
 */

import Link from "next/link";
import { useState } from "react";
import MobileMenu from "./MobileMenu";

/**
 * Navbar is now a client component to manage mobile menu state.
 * Uses Next.js Link for proper client-side routing between pages.
 */
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
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
          - flex with justify-between for logo left, links/menu right
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
            Desktop Navigation links: Hidden on mobile
            - Uses nav-link class from globals.css
            - Smooth color transition + underline animation
          */}
          <div className="hidden md:flex items-center gap-8">
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

          {/* 
            Mobile Menu Button: Visible only on mobile
            - Styled to match site's dark minimal aesthetic
          */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="
              md:hidden
              flex items-center gap-2
              px-4 py-2
              font-display
              text-xs font-semibold
              tracking-[0.1em]
              uppercase
              text-text-primary
              bg-surface-elevated
              border border-border-default
              rounded-md
              hover:bg-surface-raised
              hover:border-border-strong
              transition-all duration-200
            "
            aria-label="Open menu"
          >
            MENU
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
