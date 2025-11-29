/**
 * Hero Component
 *
 * The main introductory section displayed at the top of the homepage.
 * Contains a label, headline, subtext, and a call-to-action button.
 *
 * Design notes:
 * - Full-width section with generous vertical padding
 * - Mobile: stacked vertically, left-aligned text
 * - Desktop: same layout, just larger typography
 * - Primary CTA button links to the products section
 */

/**
 * Hero is a server component (no "use client" needed).
 * It displays static content with a simple anchor link.
 */
export default function Hero() {
  return (
    <section
      className="
        w-full
        py-10 md:py-12
        px-4
      "
    >
      {/* 
        Content container: Left-aligned on all screen sizes.
        - max-w-6xl matches the navbar container width
        - mx-auto centers the container
      */}
      <div className="max-w-6xl mx-auto">
        {/* 
          Small label above the heading.
          - Uppercase for stylistic emphasis
          - Light gray (muted) for visual hierarchy
          - Small text with letter spacing
        */}
        <span
          className="
            text-xs font-medium
            tracking-widest uppercase
            text-neutral-400
          "
        >
          Curated Rep Finds
        </span>

        {/* 
          Main headline: The core message of zayfinds.
          - Large text that scales up on larger screens
          - Bold weight for impact
          - White text for contrast
          - Top margin for spacing from label
        */}
        <h1
          className="
            mt-3
            text-3xl sm:text-4xl md:text-5xl
            font-bold
            leading-tight
            text-white
          "
        >
          We do not gate keep over here
        </h1>

        {/* 
          Subtext: Explains what zayfinds is about.
          - Muted text (neutral-400) for hierarchy
          - Max width for readable line length
          - Top margin for spacing from headline
        */}
        <p
          className="
            mt-4
            text-base md:text-lg
            text-neutral-400
            max-w-md
          "
        >
          Browse hand-picked pieces and tap through to buy directly from sellers.
        </p>

        {/* 
          Primary CTA button: Links to the products section.
          - Rounded rectangle shape
          - White border with white text (outline style)
          - Hover: fills with white, text turns black
          - Smooth transition for hover effect
        */}
        <a
          href="#products"
          className="
            inline-block
            mt-6
            px-6 py-3
            text-sm font-medium
            text-white
            border border-white
            rounded-md
            hover:bg-white hover:text-black
            transition-colors duration-200
          "
        >
          Browse products
        </a>
      </div>
    </section>
  );
}
