/**
 * Quality Check Page
 *
 * Displays a detailed quality report for a product.
 * Server component that fetches product by slug.
 *
 * Design:
 * - "Techy" report aesthetic with grid lines
 * - Numbered sections (01, 02, 03...)
 * - Clean dividers and structured layout
 *
 * Route: /quality/[slug]
 */

import { notFound } from "next/navigation";
import Link from "next/link";

/* Component imports */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* Data imports */
import { getProductBySlug, getProductSlug } from "@/lib/products";

/**
 * Page props with dynamic route parameter.
 */
interface QualityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Get platform name from buy URL.
 */
function getPlatformName(url: string): string {
  if (url.includes("taobao")) return "TAOBAO";
  if (url.includes("weidian")) return "WEIDIAN";
  if (url.includes("1688")) return "1688";
  return "SELLER";
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
 * QualityCheckPage displays a detailed quality report for a product.
 */
export default async function QualityCheckPage({ params }: QualityPageProps) {
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

  /* Placeholder images for gallery (repeat single image or show placeholders) */
  const galleryImages = hasImage
    ? [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl]
    : [null, null, null, null];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black relative">
        {/* ===========================================
            BACKGROUND GRID PATTERN (Techy feel)
            =========================================== */}
        <div
          className="
            absolute inset-0
            pointer-events-none
            opacity-[0.03]
          "
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* ===========================================
            MAIN CONTENT CONTAINER
            =========================================== */}
        <div className="relative max-w-5xl mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-12">
          {/* ===========================================
              PAGE HEADER
              =========================================== */}
          <header className="mb-12 md:mb-16">
            {/* Quality check label */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="
                  text-[10px] font-bold
                  tracking-[0.3em] uppercase
                  text-neutral-500
                "
              >
                Quality Check
              </span>
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] font-mono text-neutral-600">
                QC-{product.id.replace("prod_", "")}
              </span>
            </div>

            {/* Product name */}
            <h1
              className="
                text-2xl sm:text-3xl md:text-4xl
                font-extrabold
                tracking-tight
                text-white
                leading-[1.1]
                mb-3
              "
            >
              {product.name}
            </h1>

            {/* Category + Price row */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-neutral-500">
                {titleCase(product.category)}
              </span>
              <span className="text-neutral-700">•</span>
              <span className="text-white font-medium">
                {product.priceRaw || "Price on site"}
              </span>
            </div>
          </header>

          {/* ===========================================
              SECTION 01: OVERVIEW
              =========================================== */}
          <section className="mb-12 md:mb-16">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-6">
              <span
                className="
                  text-[11px] font-mono
                  text-neutral-600
                "
              >
                01
              </span>
              <span
                className="
                  text-[10px] font-bold
                  tracking-[0.2em] uppercase
                  text-neutral-400
                "
              >
                Overview
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Overview content */}
            <div className="pl-8 md:pl-12">
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl">
                This quality check report provides an assessment of the{" "}
                <span className="text-white">{product.name}</span>. The item has
                been reviewed for material quality, stitching, accuracy to retail,
                and overall construction. Below you'll find detailed photos and
                specifications to help inform your purchase decision.
              </p>
            </div>
          </section>

          {/* ===========================================
              SECTION 02: PHOTOS / GALLERY
              =========================================== */}
          <section className="mb-12 md:mb-16">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-6">
              <span
                className="
                  text-[11px] font-mono
                  text-neutral-600
                "
              >
                02
              </span>
              <span
                className="
                  text-[10px] font-bold
                  tracking-[0.2em] uppercase
                  text-neutral-400
                "
              >
                Photos
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Gallery: Horizontal scroll */}
            <div className="pl-8 md:pl-12">
              <div className="overflow-x-auto scrollbar-hide -mr-6 md:-mr-12 lg:-mr-16">
                <div className="flex gap-4 pb-4 pr-6 md:pr-12 lg:pr-16">
                  {galleryImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="
                        flex-shrink-0
                        w-[200px] md:w-[260px] lg:w-[300px]
                        aspect-[4/5]
                        bg-neutral-950
                        border border-white/10
                        rounded-lg
                        overflow-hidden
                        relative
                      "
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${product.name} - Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="
                            w-full h-full
                            flex flex-col items-center justify-center
                            bg-gradient-to-br from-neutral-900 to-neutral-950
                          "
                        >
                          <span
                            className="
                              text-[10px] font-semibold
                              tracking-widest uppercase
                              text-neutral-600
                            "
                          >
                            No Image
                          </span>
                        </div>
                      )}

                      {/* Photo number badge */}
                      <div
                        className="
                          absolute top-3 left-3
                          px-2 py-1
                          text-[9px] font-mono
                          text-neutral-500
                          bg-black/80
                          backdrop-blur-sm
                          rounded
                        "
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ===========================================
              SECTION 03: DETAILS
              =========================================== */}
          <section className="mb-12 md:mb-16">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-6">
              <span
                className="
                  text-[11px] font-mono
                  text-neutral-600
                "
              >
                03
              </span>
              <span
                className="
                  text-[10px] font-bold
                  tracking-[0.2em] uppercase
                  text-neutral-400
                "
              >
                Details
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Details grid */}
            <div className="pl-8 md:pl-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Material */}
                <div>
                  <span
                    className="
                      block
                      text-[10px] font-bold
                      tracking-[0.2em] uppercase
                      text-neutral-500
                      mb-2
                    "
                  >
                    Material
                  </span>
                  <p className="text-neutral-300 text-sm">
                    Premium quality fabric blend. Check seller listing for exact
                    material composition.
                  </p>
                </div>

                {/* Fit */}
                <div>
                  <span
                    className="
                      block
                      text-[10px] font-bold
                      tracking-[0.2em] uppercase
                      text-neutral-500
                      mb-2
                    "
                  >
                    Fit
                  </span>
                  <p className="text-neutral-300 text-sm">
                    Varies by size. Reference seller's size chart for accurate
                    measurements.
                  </p>
                </div>

                {/* Sizing */}
                <div>
                  <span
                    className="
                      block
                      text-[10px] font-bold
                      tracking-[0.2em] uppercase
                      text-neutral-500
                      mb-2
                    "
                  >
                    Sizing
                  </span>
                  <p className="text-neutral-300 text-sm">
                    Asian sizing may run smaller. Consider sizing up 1-2 sizes
                    from your usual fit.
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <span
                    className="
                      block
                      text-[10px] font-bold
                      tracking-[0.2em] uppercase
                      text-neutral-500
                      mb-2
                    "
                  >
                    Notes
                  </span>
                  <p className="text-neutral-300 text-sm">
                    Item ships from China. Typical delivery is 2-4 weeks
                    depending on shipping method selected.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ===========================================
              SECTION 04: SPECS
              =========================================== */}
          <section className="mb-12 md:mb-16">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-6">
              <span
                className="
                  text-[11px] font-mono
                  text-neutral-600
                "
              >
                04
              </span>
              <span
                className="
                  text-[10px] font-bold
                  tracking-[0.2em] uppercase
                  text-neutral-400
                "
              >
                Specifications
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Specs table */}
            <div className="pl-8 md:pl-12">
              <div className="border border-white/10 rounded-lg overflow-hidden">
                {[
                  { label: "Product ID", value: product.id },
                  { label: "Category", value: titleCase(product.category) },
                  {
                    label: "Price",
                    value: product.priceRaw || "Price on site",
                  },
                  {
                    label: "Estimated USD",
                    value: product.price ? `$${product.price.toFixed(2)}` : "N/A",
                  },
                  { label: "Platform", value: platformName },
                  { label: "Status", value: "Available" },
                ].map((row, index) => (
                  <div
                    key={row.label}
                    className={`
                      flex items-center justify-between
                      px-4 py-3
                      ${index !== 0 ? "border-t border-white/5" : ""}
                    `}
                  >
                    <span
                      className="
                        text-[10px] font-bold
                        tracking-[0.15em] uppercase
                        text-neutral-500
                      "
                    >
                      {row.label}
                    </span>
                    <span className="text-sm text-white font-mono">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===========================================
              ACTIONS
              =========================================== */}
          <section className="mb-12">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-6">
              <span
                className="
                  text-[11px] font-mono
                  text-neutral-600
                "
              >
                05
              </span>
              <span
                className="
                  text-[10px] font-bold
                  tracking-[0.2em] uppercase
                  text-neutral-400
                "
              >
                Actions
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* ===========================================
                Action Buttons
                
                Uses the button system from globals.css:
                - Secondary (.btn-secondary): Back to Product
                - Primary (.btn-primary): Buy button
                =========================================== */}
            <div className="pl-8 md:pl-12">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 
                  Secondary CTA: "Back to Product"
                  - Internal navigation back to product detail
                  - Uses btn-secondary (outline style)
                */}
                <Link
                  href={`/products/${productSlug}`}
                  className="btn-secondary"
                >
                  ← Back to Product
                </Link>

                {/* 
                  Primary CTA: "Buy on [Platform]"
                  - Opens external seller URL in new tab
                  - Uses btn-primary (solid white)
                  - Additional hover effects for prominence
                */}
                <a
                  href={product.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    btn-primary
                    hover:scale-[1.03]
                    hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]
                  "
                >
                  Buy on {platformName}
                </a>
              </div>
            </div>
          </section>

          {/* ===========================================
              FOOTER NOTE
              =========================================== */}
          <div className="border-t border-white/10 pt-8 mt-16">
            <p className="text-[11px] text-neutral-600 leading-relaxed max-w-2xl">
              This quality check is provided for informational purposes only.
              zayfinds does not sell or ship products directly. All purchases are
              made through third-party sellers. Please verify product details with
              the seller before purchasing.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

