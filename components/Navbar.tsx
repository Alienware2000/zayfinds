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
 */

/**
 * Navbar is a server component (no "use client" needed).
 * Links are simple anchor tags pointing to section IDs on the page.
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
          Logo: "zayfinds" text
          - Uppercase tracking (letter-spacing) for modern feel
          - Font semibold for weight without being too heavy
          - White text for contrast
        */}
        <span className="text-sm font-semibold tracking-widest uppercase text-white">
          zayfinds
        </span>

        {/* 
          Navigation links: Anchor links to page sections
          - Flex row with gap for spacing
          - Muted text that brightens on hover
          - Smooth transition for hover effect
        */}
        <div className="flex items-center gap-6">
          <a
            href="#products"
            className="
              text-sm text-white/60
              hover:text-white
              transition-colors duration-200
            "
          >
            Products
          </a>
          <a
            href="#categories"
            className="
              text-sm text-white/60
              hover:text-white
              transition-colors duration-200
            "
          >
            Categories
          </a>
        </div>
      </div>
    </nav>
  );
}
