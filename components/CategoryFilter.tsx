"use client";

/**
 * CategoryFilter Component (FINDS-style Tab Bar)
 *
 * A full-width tab bar for selecting product categories.
 * Redesigned to match FINDS' rectangular tab style.
 *
 * Design notes:
 * - Full-width stripe layout
 * - Rectangular tabs (not pill-shaped)
 * - Active tab: filled background, bold text
 * - Inactive tab: darker background, subtle border
 * - Horizontally scrollable on mobile
 */

import { Category } from "@/types/product";

/**
 * CategoryFilterValue represents the possible filter states.
 * - "all": Show all products (no category filtering)
 * - Category: Show only products matching that category
 */
export type CategoryFilterValue = Category | "all";

/**
 * Props for the CategoryFilter component.
 */
interface CategoryFilterProps {
  /** The currently selected filter value */
  value: CategoryFilterValue;
  /** Callback fired when user selects a different filter */
  onChange: (next: CategoryFilterValue) => void;
}

/**
 * Tab configuration with value and display label.
 */
interface TabConfig {
  value: CategoryFilterValue;
  label: string;
}

/**
 * All available filter tabs in display order.
 * Labels are uppercase for FINDS-style appearance.
 */
const TABS: TabConfig[] = [
  { value: "all", label: "ALL" },
  { value: "shoes", label: "SHOES" },
  { value: "tops", label: "T-SHIRTS" },
  { value: "hoodies", label: "HOODIES" },
  { value: "jackets", label: "JACKETS" },
  { value: "pants", label: "PANTS" },
  { value: "jewelry", label: "JEWELRY" },
  { value: "bags", label: "BAGS" },
  { value: "shorts", label: "SHORTS" },
  { value: "accessories", label: "ACCESSORIES" },
  { value: "electronics", label: "ELECTRONICS" },
  { value: "misc", label: "MISC" },
];

/**
 * CategoryFilter renders a full-width tab bar.
 * Clicking a tab updates the category filter state.
 */
export default function CategoryFilter({
  value,
  onChange,
}: CategoryFilterProps) {
  return (
    <div
      id="categories"
      className="
        w-full
        bg-neutral-950
        border-y border-white/10
        overflow-x-auto
        scrollbar-hide
      "
    >
      {/* 
        Inner flex container for tabs.
        - flex-nowrap prevents wrapping
        - min-w-max ensures tabs don't compress
      */}
      <div className="flex min-w-max">
        {TABS.map((tab) => {
          const isActive = value === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={`
                px-6 py-4
                text-sm font-semibold
                tracking-wider
                border-r border-white/10
                transition-all duration-200
                cursor-pointer
                whitespace-nowrap
                ${
                  isActive
                    ? /* Active state: lighter background, white text */
                      "bg-neutral-800 text-white"
                    : /* Inactive state: dark background, muted text */
                      "bg-neutral-950 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
