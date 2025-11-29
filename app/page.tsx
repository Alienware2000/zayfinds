/**
 * LandingPage Component
 *
 * The marketing landing page for zayfinds.
 * Introduces users to the site and showcases featured categories.
 *
 * Features:
 * - Server component (no client state needed)
 * - Hero section with main headline
 * - Animated vertical scroll product showcase (desktop)
 * - Featured categories horizontal scroll
 * - CTA button linking to /products
 *
 * Phase 5-A Polish:
 * - Clear sectioned layout with generous spacing
 * - Strong visual hierarchy
 * - Premium, modern aesthetic
 *
 * Phase 5-B Addition:
 * - 3-column vertical scroll section (finds.org inspired)
 * - Horizontal scroll fallback on mobile
 *
 * Route: /
 */

import Link from "next/link";

/* Component imports */
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VerticalScrollSection from "@/components/VerticalScrollSection";
import FeaturedCategories from "@/components/FeaturedCategories";

/* Data imports */
import { mockProducts } from "@/data/productsMock";

/**
 * LandingPage is the entry point for zayfinds.
 * It introduces the site and encourages users to browse products.
 */
export default function LandingPage() {
  /* 
    Get first 12 products for the vertical scroll section.
    This provides enough products to fill 3 columns with 4 each.
  */
  const trendingProducts = mockProducts.slice(0, 12);

  return (
    <>
      {/* 
        Navbar: Sticky header with logo and navigation links.
        Rendered outside <main> so it spans full width.
      */}
      <Navbar />

      {/* 
        Main content area: Centered container with max-width.
        - max-w-6xl: constrains content width on large screens
        - mx-auto: horizontally centers the container
        - px-4: horizontal padding for mobile
        - pb-24: generous bottom padding
        - min-h-screen: ensures full viewport height
      */}
      <main className="max-w-6xl mx-auto px-4 pb-24 min-h-screen">
        {/* 
          Hero section: Main headline and introduction.
          Sets the tone for the zayfinds brand.
          Contains its own vertical padding.
        */}
        <Hero />

        {/* 
          Divider: Visual separation between Hero and Trending Products.
          Subtle line for sectioning without being heavy.
        */}
        <div className="w-full h-px bg-white/5 my-4" />

        {/* 
          Vertical Scroll Section: Animated product showcase.
          - Desktop: 3 columns with alternating scroll directions
          - Mobile: Horizontal scrollable row
          Displays trending/featured products in an engaging way.
        */}
        <VerticalScrollSection products={trendingProducts} />

        {/* 
          Divider: Visual separation between Trending and Categories.
        */}
        <div className="w-full h-px bg-white/5 my-4" />

        {/* 
          Featured categories: Horizontal scrollable category cards.
          Allows users to quickly jump to a category they're interested in.
          Contains its own vertical padding.
        */}
        <FeaturedCategories />

        {/* 
          Divider: Visual separation between Categories and CTA.
        */}
        <div className="w-full h-px bg-white/5 my-4" />

        {/* 
          CTA Section: Encourages users to explore all products.
          Centered layout with generous vertical padding.
        */}
        <section className="py-16 md:py-20 text-center">
          {/* 
            Section heading: Sets context for the CTA.
            Large, bold text for emphasis.
          */}
          <h2
            className="
              text-2xl md:text-3xl lg:text-4xl
              font-bold
              text-white
              mb-4
            "
          >
            Ready to explore?
          </h2>

          {/* 
            Supporting text: Reinforces the value proposition.
            Muted color, max-width for readability.
          */}
          <p className="text-neutral-400 text-base md:text-lg max-w-md mx-auto mb-8">
            Discover curated rep finds from trusted sellers. Updated regularly.
          </p>

          {/* 
            Primary CTA button: Links to the products page.
            - Large padding for strong presence
            - Solid white background for high visibility
            - Black text for contrast
            - Rounded corners
            - Hover: scale up with glow effect
          */}
          <Link
            href="/products"
            className="
              inline-block
              px-10 py-5
              text-lg font-bold
              text-black
              bg-white
              rounded-xl
              transition-all duration-300
              hover:scale-105
              hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]
            "
          >
            View all products
          </Link>

          {/* 
            Product count hint: Shows users there's content waiting.
            Small, muted text.
          */}
          <p className="mt-6 text-sm text-neutral-600">
            17+ products across 11 categories
          </p>
        </section>
      </main>
    </>
  );
}
