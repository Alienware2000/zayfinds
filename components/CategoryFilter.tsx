"use client";

/**
 * CategoryFilter Component (Tab Bar)
 *
 * A full-width tab bar for selecting product categories.
 * Categories are loaded dynamically from the products data.
 *
 * Design v2.0:
 * - Layered grey surface colors
 * - Active tab with scale + bold contrast
 * - Smooth hover transitions
 * - Refined typography
 */

import { getAllCategories } from "@/lib/products";

/**
 * CategoryFilterValue represents the possible filter states.
 * "all" means no category filter, string is a specific category name.
 */
export type CategoryFilterValue = string | "all";

/**
 * Props for the CategoryFilter component.
 */
interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (next: CategoryFilterValue) => void;
}

/**
 * Get all category tabs (ALL + dynamic categories from data).
 */
function getCategoryTabs(): { value: CategoryFilterValue; label: string }[] {
  const categories = getAllCategories();

  return [
    { value: "all", label: "ALL" },
    ...categories.map((cat) => ({
      value: cat,
      label: cat.toUpperCase(),
    })),
  ];
}

/**
 * CategoryFilter renders a full-width tab bar with dynamic categories.
 */
export default function CategoryFilter({
  value,
  onChange,
}: CategoryFilterProps) {
  const tabs = getCategoryTabs();

  return (
    <div
      id="categories"
      className="
        w-full
        bg-surface-nav
        border-y border-border-default
        overflow-x-auto
        scrollbar-hide
      "
    >
      <div className="flex min-w-max">
        {tabs.map((tab) => {
          const isActive = value === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={`
                px-6 py-4
                text-xs
                font-semibold
                tracking-[0.1em]
                border-r border-border-default
                cursor-pointer
                whitespace-nowrap
                transition-all duration-200
                ${
                  isActive
                    ? /* Active: bright background, dark text, slight scale */
                      "bg-text-primary text-surface-base scale-[1.02] font-bold"
                    : /* Inactive: dark surface, muted text */
                      "bg-surface-elevated text-text-muted hover:bg-surface-raised hover:text-text-secondary"
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
