"use client";

/**
 * CategoryFilter Component (Tab Bar)
 *
 * A full-width tab bar for selecting product categories.
 *
 * Design v2.0:
 * - Layered grey surface colors
 * - Active tab with scale + bold contrast
 * - Smooth hover transitions
 * - Refined typography
 */

import { Category } from "@/types/product";

/**
 * CategoryFilterValue represents the possible filter states.
 */
export type CategoryFilterValue = Category | "all";

/**
 * Props for the CategoryFilter component.
 */
interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (next: CategoryFilterValue) => void;
}

/**
 * Tab configuration.
 */
interface TabConfig {
  value: CategoryFilterValue;
  label: string;
}

/**
 * All available filter tabs.
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
        bg-surface-nav
        border-y border-border-default
        overflow-x-auto
        scrollbar-hide
      "
    >
      <div className="flex min-w-max">
        {TABS.map((tab) => {
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
