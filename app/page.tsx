/**
 * LandingPage Component
 *
 * The marketing landing page for zayfinds.
 * Uses data from lib/products.ts as the single source of truth.
 *
 * Design v2.0:
 * - Layered grey surfaces
 * - Display font for headings
 * - Subtle gradients and dividers
 * - Refined CTA buttons
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

/* Data imports - single source of truth */
import { getAllProducts, getAllCategories, TOTAL_PRODUCT_COUNT } from "@/lib/products";

/**
 * LandingPage is the entry point for zayfinds.
 */
export default function LandingPage() {
  // Get first 12 products for the trending section
  const trendingProducts = getAllProducts().slice(0, 12);
  
  // Get category count for the CTA section
  const categoryCount = getAllCategories().length;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface-base">
        {/* ===========================================
            HERO + SCROLL SECTION
            =========================================== */}
        <section className="w-full max-w-7xl mx-auto px-4">
          {/* Desktop layout */}
          <div className="hidden lg:flex min-h-[600px] py-12 gap-8 relative z-[1]">
            <div className="w-[40%] flex flex-col justify-center">
              <Hero />
            </div>
            <div className="w-[60%] h-[600px] overflow-hidden">
              <VerticalScrollSection products={trendingProducts} />
            </div>
          </div>

          {/* Mobile layout */}
          <div className="lg:hidden py-12 relative z-[1]">
            <Hero />
            <div className="mt-8">
              <VerticalScrollSection products={trendingProducts} />
            </div>
          </div>
        </section>

        {/* ===========================================
            CATEGORY CAROUSEL SECTION
            =========================================== */}
        <section
          id="featured-categories"
          className="w-full mt-8 md:mt-16 scroll-mt-20"
        >
          {/* Section divider */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="section-divider mb-8" />
          </div>

          <CategoryCarousel />
        </section>

        {/* ===========================================
            CTA SECTION
            =========================================== */}
        <section className="max-w-6xl mx-auto px-4 pb-24">
          {/* Section divider */}
          <div className="section-divider mb-12 relative z-[1]" />

          {/* CTA content with subtle background */}
          <div className="py-16 text-center section-gradient rounded-2xl relative z-[1]">
            {/* Heading in display font */}
            <h2 className="heading-section mb-4">
              Ready to explore?
            </h2>

            <p className="text-text-secondary text-base md:text-lg max-w-md mx-auto mb-10">
              Discover curated rep finds from trusted sellers. Updated regularly.
            </p>

            {/* Primary CTA */}
            <Link href="/products" className="btn-primary btn-lg">
              View all products
            </Link>

            {/* Product count - dynamic from data */}
            <p className="mt-8 text-sm text-text-subtle">
              {TOTAL_PRODUCT_COUNT.toLocaleString()}+ products across {categoryCount} categories
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
