"use client";

/**
 * MobileMenu Component
 *
 * A fullscreen overlay menu for mobile navigation.
 * Features:
 * - Fullscreen overlay with accent color background
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
        bg-[#e63946]
        animate-menuFadeIn
      "
    >
      {/* Header with MENU label and CLOSE button */}
      <div
        className="
          flex items-center justify-between
          px-6 py-5
        "
      >
        {/* MENU label */}
        <span
          className="
            font-display
            text-sm font-bold
            tracking-[0.2em]
            uppercase
            text-black/70
          "
        >
          MENU
        </span>

        {/* Close button */}
        <button
          onClick={onClose}
          className="
            font-mono
            text-sm font-medium
            tracking-wider
            text-black
            hover:text-black/70
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
          gap-2
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
              gap-3
              py-2
            "
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {/* Large link text */}
            <span
              className="
                font-display
                text-5xl sm:text-6xl md:text-7xl
                font-black
                uppercase
                text-black
                tracking-tight
                leading-none
                group-hover:text-white
                transition-colors duration-200
              "
            >
              {item.label}
            </span>

            {/* Small number badge */}
            <span
              className="
                font-mono
                text-xs
                font-medium
                text-black/50
                group-hover:text-white/70
                transition-colors duration-200
              "
            >
              [{item.number}]
            </span>
          </Link>
        ))}
      </nav>

      {/* Footer text */}
      <div className="px-6 pb-8">
        <p className="text-black/40 text-xs font-mono tracking-wider">
          ZAYFINDS — CURATED REP FINDS
        </p>
      </div>
    </div>
  );
}

