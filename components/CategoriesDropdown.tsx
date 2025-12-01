"use client";

/**
 * CategoriesDropdown Component
 *
 * A dropdown menu that displays all product categories.
 * 
 * Desktop: Compact dropdown panel that appears below the trigger button
 * Mobile: Full-screen overlay with slide-down animation
 *
 * Features:
 * - Lists all 8 categories from NEW_CATEGORIES
 * - Each category links to /products?category={categoryName}
 * - Click-outside detection (desktop)
 * - Escape key support
 * - Body scroll lock (mobile)
 * - Slide-down animation
 */

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { NEW_CATEGORIES } from "@/lib/products";

interface CategoriesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: "desktop" | "mobile";
}

export default function CategoriesDropdown({
  isOpen,
  onClose,
  variant = "desktop",
}: CategoriesDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside (desktop only)
  useEffect(() => {
    if (!isOpen || variant !== "desktop") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, variant]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll (mobile only)
  useEffect(() => {
    if (variant === "mobile" && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, variant]);

  // Handle category selection
  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
    onClose();
  };

  if (!isOpen) return null;

  // Desktop variant: Compact dropdown panel
  if (variant === "desktop") {
    return (
      <div
        ref={dropdownRef}
        className="
          absolute top-full right-0 mt-2
          min-w-[200px] max-w-[280px]
          bg-surface-elevated
          border border-border-default
          rounded-lg
          shadow-lg
          overflow-hidden
          z-50
          animate-slideDown
        "
      >
        <div className="py-2">
          {NEW_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              onClick={onClose}
              className="
                block
                px-4 py-3
                text-sm
                font-medium
                text-text-secondary
                hover:bg-surface-raised
                hover:text-text-primary
                transition-colors duration-150
                uppercase
                tracking-wider
              "
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Mobile variant: Full-screen overlay
  return (
    <div
      className="
        fixed inset-0 z-[110]
        flex flex-col
        bg-surface-base
        animate-slideDown
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between
          px-6 py-5
          border-b border-border-default
        "
      >
        <span
          className="
            font-display
            text-base font-bold
            tracking-[0.15em]
            uppercase
            text-text-primary
          "
        >
          CATEGORIES
        </span>

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

      {/* Category list */}
      <nav
        className="
          flex-1
          flex flex-col
          justify-center
          px-6 pb-20
          gap-2
        "
      >
        {NEW_CATEGORIES.map((category, index) => (
          <Link
            key={category}
            href={`/products?category=${encodeURIComponent(category)}`}
            onClick={() => handleCategoryClick(category)}
            className="
              group
              flex items-center
              py-4
              border-b border-border-subtle
            "
            style={{
              animationDelay: `${index * 30}ms`,
            }}
          >
            <span
              className="
                font-display
                text-3xl sm:text-4xl
                font-bold
                uppercase
                text-text-primary
                tracking-tight
                leading-none
                group-hover:text-text-secondary
                transition-colors duration-200
              "
            >
              {category}
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

