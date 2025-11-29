/**
 * Footer Component
 *
 * A simple, minimal footer for the site.
 * Displays site description and copyright notice.
 *
 * Design:
 * - Subtle top border for separation
 * - Muted text colors
 * - Centered content
 * - No icons or social links (MVP)
 */

export default function Footer() {
  return (
    <footer
      className="
        w-full
        border-t border-white/10
        bg-neutral-950
        py-8 md:py-12
      "
    >
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* 
          Site description: Brief explanation of what zayfinds does.
        */}
        <p className="text-sm text-neutral-500 mb-2">
          zayfinds — curated rep finds. Links redirect to external sellers.
        </p>

        {/* 
          Copyright notice.
        */}
        <p className="text-xs text-neutral-600">
          © 2025 zayfinds
        </p>
      </div>
    </footer>
  );
}

