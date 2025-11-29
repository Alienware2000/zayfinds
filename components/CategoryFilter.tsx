"use client";

/**
 * CategoryFilter Component
 *
 * A horizontal scrollable row of filter chips for selecting product categories.
 * Used on the homepage to filter the product grid by category.
 *
 * Design notes:
 * - Client component because it handles user interaction (click events)
 * - Horizontally scrollable on mobile for overflow categories
 * - Pill-shaped chips with distinct active/inactive states
 * - "All" option shows all products (no filtering)
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
 * All available filter options in display order.
 * "all" comes first, followed by categories roughly grouped by type.
 */
const FILTER_OPTIONS: CategoryFilterValue[] = [
  "all",
  "tops",
  "hoodies",
  "jackets",
  "pants",
  "shorts",
  "shoes",
  "bags",
  "jewelry",
  "accessories",
  "electronics",
  "misc",
];

/**
 * Capitalizes the first letter of a string for display.
 * Example: "hoodies" -> "Hoodies", "all" -> "All"
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * CategoryFilter renders a row of clickable filter chips.
 * The active chip is highlighted; clicking a chip calls onChange.
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
        py-4
        overflow-x-auto
        scrollbar-hide
      "
    >
      {/* 
        Inner flex container for chips.
        - flex-nowrap prevents wrapping so horizontal scroll works
        - gap-2 for consistent spacing between chips
        - px-4 for edge padding (matches page container)
      */}
      <div className="flex flex-nowrap gap-2 px-4 md:px-0">
        {FILTER_OPTIONS.map((option) => {
          /* Determine if this chip is the currently active one */
          const isActive = value === option;

          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`
                flex-shrink-0
                px-4 py-2
                rounded-full
                text-sm font-medium
                border
                transition-all duration-200
                cursor-pointer
                ${
                  isActive
                    ? /* Active state: white bg, black text, white border */
                      "bg-white text-black border-white"
                    : /* Inactive state: transparent bg, muted text/border, hover effect */
                      "bg-transparent text-neutral-300 border-white/20 hover:border-white/40"
                }
              `}
            >
              {/* Display capitalized label */}
              {capitalize(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

