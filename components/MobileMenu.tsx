"use client";

/**
 * MobileMenu Component
 *
 * A fullscreen overlay menu for mobile navigation.
 * Styled to match the dark, minimal zayfinds aesthetic.
 * 
 * Features:
 * - Fullscreen dark overlay matching site theme
 * - Large, bold navigation links with numbers
 * - Smooth open/close animations
 * - Closes when a link is clicked
 */

import Link from "next/link";
import { useEffect } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Navigation items with numbers for visual interest
 */
const NAV_ITEMS = [
  { href: "/", label: "Home", number: "01" },
  { href: "/products", label: "Products", number: "02" },
  { href: "/products#categories", label: "Categories", number: "03" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  /**
   * Prevent body scroll when menu is open
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /**
   * Close menu on escape key
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex flex-col
        bg-surface-base
        animate-menuFadeIn
      "
    >
      {/* Header with logo and close button */}
      <div
        className="
          flex items-center justify-between
          px-6 py-5
          border-b border-border-default
        "
      >
        {/* Logo */}
        <span
          className="
            font-display
            text-base font-bold
            tracking-[0.15em]
            uppercase
            text-text-primary
          "
        >
          ZAYFINDS
        </span>

        {/* Close button */}
        <button
          onClick={onClose}
          className="
            font-mono
            text-sm font-medium
            tracking-wider
            text-text-muted
            hover:text-text-primary
            transition-colors duration-200
          "
        >
          [ CLOSE ]
        </button>
      </div>

      {/* Navigation links */}
      <nav
        className="
          flex-1
          flex flex-col
          justify-center
          px-6 pb-20
          gap-4
        "
      >
        {NAV_ITEMS.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="
              group
              flex items-baseline
              gap-4
              py-3
              border-b border-border-subtle
            "
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {/* Small number badge */}
            <span
              className="
                font-mono
                text-xs
                font-medium
                text-text-subtle
                group-hover:text-text-muted
                transition-colors duration-200
                w-8
              "
            >
              {item.number}
            </span>

            {/* Large link text */}
            <span
              className="
                font-display
                text-4xl sm:text-5xl
                font-bold
                uppercase
                text-text-primary
                tracking-tight
                leading-none
                group-hover:text-text-secondary
                transition-colors duration-200
              "
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 pb-8 border-t border-border-default pt-6">
        <p className="text-text-subtle text-xs font-mono tracking-wider uppercase">
          Curated rep finds — no gatekeeping
        </p>
      </div>
    </div>
  );
}
