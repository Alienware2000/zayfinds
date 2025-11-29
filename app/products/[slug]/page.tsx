/**
 * Product Detail Page
 *
 * Displays a single product with full details.
 * Server component that fetches product by slug.
 *
 * Layout:
 * - Desktop: Two-column (details left, image right)
 * - Mobile: Stacked (image top, details below)
 *
 * Route: /products/[slug]
 */

import { notFound } from "next/navigation";
import Link from "next/link";

/* Component imports */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* Data imports */
import { getProductBySlug, getProductSlug, getRelatedProducts } from "@/lib/products";

/* Component imports for related products */
import ProductCard from "@/components/ProductCard";

/**
 * Page props with dynamic route parameter.
 */
interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Capitalize first letter of each word.
 */
function titleCase(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Get platform name from buy URL (placeholder logic).
 */
function getPlatformName(url: string): string {
  if (url.includes("taobao")) return "TAOBAO";
  if (url.includes("weidian")) return "WEIDIAN";
  if (url.includes("1688")) return "1688";
  return "SELLER";
}

/**
 * ProductDetailPage displays a single product with full details.
 */
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  /* Fetch product by slug */
  const product = getProductBySlug(slug);

  /* Handle not found */
  if (!product) {
    notFound();
  }

  const platformName = getPlatformName(product.buyUrl);
  const productSlug = getProductSlug(product);
  const hasImage = product.imageUrl !== null && product.imageUrl !== "";

  /* Get related products for "You may also like" section */
  const relatedProducts = getRelatedProducts(product, 6);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-surface-base">
        {/* ===========================================
            MAIN CONTENT CONTAINER
            =========================================== */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-12">
          {/* ===========================================
              BREADCRUMB
              =========================================== */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-meta text-text-muted">
              <li>
                <Link
                  href="/"
                  className="hover:text-text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="text-text-subtle">/</li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-text-primary transition-colors"
                >
                  Products
                </Link>
              </li>
              <li className="text-text-subtle">/</li>
              <li>
                <Link
                  href={`/products?category=${product.category}`}
                  className="hover:text-text-primary transition-colors"
                >
                  {titleCase(product.category)}
                </Link>
              </li>
              <li className="text-text-subtle">/</li>
              <li className="text-text-secondary truncate max-w-[200px]">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* ===========================================
              TWO-COLUMN LAYOUT (Desktop) / STACKED (Mobile)
              =========================================== */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* ===========================================
                LEFT COLUMN: Product Details
                On mobile: appears second (order-2)
                On desktop: appears first (lg:order-1)
                =========================================== */}
            <div className="flex-1 order-2 lg:order-1">
              {/* Category badge */}
              <div className="mb-4">
                <span
                  className="
                    inline-block
                    px-3 py-1.5
                    text-[10px] font-semibold
                    tracking-widest uppercase
                    text-text-muted
                    bg-surface-elevated
                    border border-border-default
                    rounded
                  "
                >
                  {product.category}
                </span>
              </div>

              {/* Product name - display font */}
              <h1 className="heading-hero mb-6">
                {product.name}
              </h1>

              {/* Price section */}
              <div className="mb-8">
                <span className="text-meta text-text-muted mb-1 block">
                  Price
                </span>
                <span className="text-2xl md:text-3xl font-bold text-text-primary">
                  {product.priceRaw || "Price on site"}
                </span>
              </div>

              {/* Description placeholder */}
              <div className="mb-8">
                <span className="text-meta text-text-muted mb-2 block">
                  Description
                </span>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-md">
                  Premium quality replica. This item has been hand-picked for its
                  exceptional craftsmanship and attention to detail. Click through
                  to view more photos and sizing information from the seller.
                </p>
              </div>

              {/* ===========================================
                  Action Buttons
                  
                  Uses the button system from globals.css:
                  - Primary (.btn-primary): BUY button, high visibility
                  - Secondary (.btn-secondary): Quality Check, outline style
                  =========================================== */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {/* 
                  Primary CTA: "Buy on [Platform]"
                  - Opens external seller URL in new tab
                  - Uses btn-primary + btn-lg for emphasis
                  - Additional hover scale for prominence
                */}
                <a
                  href={product.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    btn-primary btn-lg
                    hover:scale-[1.03]
                    hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]
                  "
                >
                  Buy on {platformName}
                </a>

                {/* 
                  Secondary CTA: "Quality Check"
                  - Scrolls to quality check section on same page
                  - Also links to dedicated quality page
                  - Uses btn-secondary + btn-lg
                */}
                <a
                  href="#quality-check"
                  className="btn-secondary btn-lg"
                >
                  Quality Check Details
                </a>
              </div>

              {/* Metadata rows */}
              <div className="border-t border-border-default pt-6 space-y-4">
                {/* Category row */}
                <div className="flex items-center justify-between">
                  <span className="text-meta text-text-muted">Category</span>
                  <span className="text-sm text-text-primary">
                    {titleCase(product.category)}
                  </span>
                </div>

                {/* Price estimate row */}
                {product.price !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-meta text-text-muted">Estimated USD</span>
                    <span className="text-sm text-text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Product ID row */}
                <div className="flex items-center justify-between">
                  <span className="text-meta text-text-muted">Product ID</span>
                  <span className="text-sm text-text-muted font-mono">
                    {product.id}
                  </span>
                </div>
              </div>
            </div>

            {/* ===========================================
                RIGHT COLUMN: Product Image
                On mobile: appears first (order-1)
                On desktop: appears second (lg:order-2)
                =========================================== */}
            <div className="w-full lg:w-[45%] order-1 lg:order-2">
              <div
                className="
                  relative
                  aspect-[4/5]
                  w-full
                  bg-surface-elevated
                  border border-border-default
                  rounded-2xl
                  overflow-hidden
                  shadow-[0_0_60px_rgba(0,0,0,0.5)]
                "
              >
                {hasImage ? (
                  <img
                    src={product.imageUrl!}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="
                      w-full h-full
                      flex flex-col items-center justify-center
                      bg-gradient-to-br from-surface-raised to-surface-elevated
                    "
                  >
                    <svg
                      className="w-16 h-16 text-text-subtle mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-meta text-text-subtle">No Image</span>
                    <span className="text-[10px] text-text-subtle mt-1">
                      View on seller site
                    </span>
                  </div>
                )}

                {/* Inner shadow overlay */}
                <div
                  className="
                    absolute inset-0
                    pointer-events-none
                    shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]
                  "
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===========================================
            QUALITY CHECK SECTION
            
            Detailed information about the product quality,
            sourcing, sizing, and shipping notes.
            Anchor target for the "Quality Check Details" button.
            =========================================== */}
        <section
          id="quality-check"
          className="border-t border-white/10 mt-12 md:mt-16 scroll-mt-20"
        >
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-10 md:py-14">
            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
              <h2
                className="
                  text-lg md:text-xl
                  font-bold
                  text-white
                "
              >
                Quality Check
              </h2>
              <Link
                href={`/quality/${productSlug}`}
                className="
                  text-xs
                  text-neutral-500
                  hover:text-white
                  transition-colors
                  tracking-wider uppercase
                "
              >
                View Full Report →
              </Link>
            </div>

            {/* Quality info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Sourcing */}
              <div className="bg-neutral-950/50 border border-white/5 rounded-xl p-5 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center">
                    <span className="text-xs text-neutral-400">01</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Sourcing
                  </h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  This item is sourced from verified sellers with positive review history.
                  Quality may vary by batch — always check seller reviews before ordering.
                </p>
              </div>

              {/* Fit & Sizing */}
              <div className="bg-neutral-950/50 border border-white/5 rounded-xl p-5 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center">
                    <span className="text-xs text-neutral-400">02</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Fit & Sizing
                  </h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Asian sizing tends to run smaller. We recommend sizing up 1-2 sizes
                  from your usual fit. Check the seller&apos;s size chart for exact measurements.
                </p>
              </div>

              {/* Shipping */}
              <div className="bg-neutral-950/50 border border-white/5 rounded-xl p-5 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center">
                    <span className="text-xs text-neutral-400">03</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Shipping
                  </h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Items typically ship from China within 3-7 days. Total delivery time
                  is usually 2-4 weeks depending on your shipping method and location.
                </p>
              </div>

              {/* Seller Notes */}
              <div className="bg-neutral-950/50 border border-white/5 rounded-xl p-5 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center">
                    <span className="text-xs text-neutral-400">04</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Seller Notes
                  </h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Always use a reputable agent for purchases. Check the seller&apos;s
                  return policy before ordering. QC photos are recommended before shipping.
                </p>
              </div>
            </div>

            {/* View full report CTA */}
            <div className="mt-8 text-center">
              <Link
                href={`/quality/${productSlug}`}
                className="btn-secondary"
              >
                View Full Quality Report
              </Link>
            </div>
          </div>
        </section>

        {/* ===========================================
            YOU MAY ALSO LIKE SECTION
            
            Horizontal strip of related products.
            Uses "details-only" button variant to show
            "View Details" instead of BUY buttons.
            =========================================== */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-white/10 mt-12 md:mt-16">
            {/* Full-width header bar */}
            <div className="w-full bg-neutral-950/50 py-4 mb-0">
              <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
                <h2
                  className="
                    text-xs md:text-sm
                    font-bold
                    tracking-widest uppercase
                    text-white
                  "
                >
                  You May Also Like
                </h2>
              </div>
            </div>

            {/* Horizontal scroll container */}
            <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-10">
              <div className="overflow-x-auto scrollbar-hide -mx-6 md:-mx-12 lg:-mx-16 px-6 md:px-12 lg:px-16">
                <div className="flex gap-3 md:gap-4 pb-4">
                  {relatedProducts.map((relatedProduct) => (
                    <div
                      key={relatedProduct.id}
                      className="flex-shrink-0 w-[160px] md:w-[180px] lg:w-[200px]"
                    >
                      {/* 
                        Use "details-only" variant for recommendations.
                        This shows "View Details" button instead of BUY,
                        encouraging users to explore within zayfinds.
                      */}
                      <ProductCard
                        product={relatedProduct}
                        buttonVariant="details-only"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

