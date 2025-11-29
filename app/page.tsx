/**
 * LandingPage Component
 *
 * The marketing landing page for zayfinds.
 * Introduces users to the site and showcases featured categories.
 *
 * Features:
 * - Hero + Scroll columns side-by-side on desktop
 * - Both scroll naturally with the page
 * - Cards inside columns animate automatically (infinite scroll effect)
 * - Featured categories horizontal scroll
 * - CTA button linking to /products
 *
 * Layout (Desktop):
 * ┌──────────────────────────────────────────────────────┐
 * │ Hero (left ~40%)    │  Scroll Columns (right ~60%)   │
 * │ - Headline          │  [Col1↑] [Col2↓] [Col3↑]      │
 * │ - CTA Button        │  Cards animate continuously    │
 * │                     │                                │
 * │ (Both scroll with the page together)                 │
 * └──────────────────────────────────────────────────────┘
 *
 * Route: /
 */

import Link from "next/link";

/* Component imports */
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VerticalScrollSection from "@/components/VerticalScrollSection";
import CategoryCarousel from "@/components/CategoryCarousel";
import Footer from "@/components/Footer";

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
            HERO + SCROLL SECTION
            Both scroll together with the page
            =========================================== */}
        <section className="w-full max-w-7xl mx-auto px-4">
          {/* 
            Desktop layout: Side-by-side, both scroll with page
          */}
          <div className="hidden lg:flex min-h-[600px] py-12 gap-8">
            {/* 
              LEFT SIDE: Hero content
              - Takes ~40% width
              - Vertically centered content
              - Scrolls with the page (NOT sticky)
            */}
            <div
              className="
                w-[40%]
                flex flex-col justify-center
              "
            >
              <Hero />
            </div>

            {/* 
              RIGHT SIDE: Vertical scroll columns
              - Takes ~60% width
              - Contains the 3 animated columns
              - Cards animate automatically
              - Scrolls with the page
            */}
            <div className="w-[60%] h-[600px] overflow-hidden">
              <VerticalScrollSection products={trendingProducts} />
            </div>
          </div>

          {/* 
            Mobile layout: Stacked vertically
          */}
          <div className="lg:hidden py-12">
            <Hero />
            <div className="mt-8">
              <VerticalScrollSection products={trendingProducts} />
            </div>
          </div>
        </section>

        {/* ===========================================
            CATEGORY CAROUSEL SECTION
            Full-width for edge-to-edge carousel effect
            =========================================== */}
        <section className="w-full mt-8 md:mt-16">
          {/* 
            Divider: Visual separation before categories.
            Constrained to max-w-6xl for consistency.
          */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="w-full h-px bg-white/5 mb-8" />
          </div>

          {/* 
            Category carousel: Full-width horizontal auto-scroll.
            Edge-to-edge with gradient fade at boundaries.
          */}
          <CategoryCarousel />
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

      {/* 
        Footer: Site description and copyright.
      */}
      <Footer />
    </>
  );
}
