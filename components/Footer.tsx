/**
 * Footer Component
 *
 * A simple, minimal footer for the site.
 *
 * Design v2.0:
 * - Darker surface for visual separation
 * - Layered grey text colors
 * - Optional noise texture
 */

export default function Footer() {
  return (
    <footer
      className="
        w-full
        border-t border-border-default
        bg-surface-nav
        py-10 md:py-14
        noise-overlay
      "
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center relative">
        {/* Site name in display font */}
        <p
          className="
            font-display
            text-sm
            font-bold
            tracking-[0.2em]
            uppercase
            text-text-muted
            mb-4
          "
        >
          ZAYFINDS
        </p>

        {/* Description */}
        <p className="text-sm text-text-muted mb-3">
          Curated rep finds — links redirect to external sellers.
        </p>

        {/* Copyright */}
        <p className="text-xs text-text-subtle">
          © 2025 zayfinds
        </p>
      </div>
    </footer>
  );
}
