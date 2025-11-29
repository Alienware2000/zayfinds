/**
 * LandingPage Component
 *
 * The marketing landing page for zayfinds.
 * Introduces users to the site and showcases featured categories.
 *
 * Features:
 * - Hero STICKY on left side while scroll columns animate on right (finds.org style)
 * - Featured categories horizontal scroll
 * - CTA button linking to /products
 *
 * Layout (Desktop):
 * ┌──────────────────────────────────────────────────────┐
 * │ Hero (sticky left)  │  Scroll Columns (right)        │
 * │ - Stays in place    │  [Col1↑] [Col2↓] [Col3↑]      │
 * │ - Headline          │  Cards scroll continuously     │
 * │ - CTA Button        │                                │
 * └──────────────────────────────────────────────────────┘
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
        Main content area.
      */}
      <main className="min-h-screen">
        {/* ===========================================
            HERO + SCROLL SECTION (finds.org style)
            Hero stays sticky on left, columns scroll on right
            =========================================== */}
        <section className="relative w-full min-h-[calc(100vh-64px)] lg:min-h-[700px] max-w-7xl mx-auto">
          {/* 
            Desktop layout: Side-by-side with sticky Hero
          */}
          <div className="hidden lg:flex h-[700px]">
            {/* 
              LEFT SIDE: Hero content (STICKY)
              - Fixed position relative to this section
              - Takes ~40% width
              - Vertically centered content
            */}
            <div
              className="
                w-[40%]
                sticky top-20
                h-fit
                flex flex-col justify-center
                py-16
                px-4
              "
            >
              <Hero />
            </div>

            {/* 
              RIGHT SIDE: Vertical scroll columns
              - Takes ~60% width
              - Contains the 3 animated columns
            */}
            <div className="w-[60%] h-full overflow-hidden">
              <VerticalScrollSection products={trendingProducts} />
            </div>
          </div>

          {/* 
            Mobile layout: Stacked vertically
          */}
          <div className="lg:hidden px-4 py-12">
            <Hero />
            <div className="mt-8">
              <VerticalScrollSection products={trendingProducts} />
            </div>
          </div>
        </section>

        {/* ===========================================
            FEATURED CATEGORIES SECTION
            =========================================== */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          {/* 
            Divider: Visual separation before categories.
          */}
          <div className="w-full h-px bg-white/5 mb-12" />

          {/* 
            Featured categories: Horizontal scrollable category cards.
            Allows users to quickly jump to a category they're interested in.
          */}
          <FeaturedCategories />
        </section>

        {/* ===========================================
            CTA SECTION
            =========================================== */}
        <section className="max-w-6xl mx-auto px-4 pb-24">
          {/* 
            Divider: Visual separation before CTA.
          */}
          <div className="w-full h-px bg-white/5 mb-12" />

          {/* 
            CTA Section: Encourages users to explore all products.
            Centered layout with generous vertical padding.
          */}
          <div className="py-16 text-center">
            {/* 
              Section heading: Sets context for the CTA.
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
            */}
            <p className="text-neutral-400 text-base md:text-lg max-w-md mx-auto mb-8">
              Discover curated rep finds from trusted sellers. Updated regularly.
            </p>

            {/* 
              Primary CTA button: Links to the products page.
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
              Product count hint.
            */}
            <p className="mt-6 text-sm text-neutral-600">
              17+ products across 11 categories
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
