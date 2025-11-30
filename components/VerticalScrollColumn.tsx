/**
 * VerticalScrollColumn Component
 *
 * A reusable animated column that displays products in a vertical list
 * with continuous scrolling animation. Used in the 3-column desktop layout.
 *
 * Features:
 * - Infinite vertical scroll animation (loops seamlessly)
 * - Configurable direction (up or down)
 * - Configurable speed (slow, normal, fast)
 * - Content is duplicated to create seamless loop effect
 * - Animation pauses on hover for better UX
 *
 * How the seamless loop works:
 * 1. Products list is rendered twice (original + duplicate)
 * 2. Animation moves container by 50% (the length of one set)
 * 3. When animation completes, it resets invisibly to the start
 * 4. The duplicate ensures there's always content visible during transition
 */

import { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

/**
 * Props for the VerticalScrollColumn component.
 */
interface VerticalScrollColumnProps {
  /** Array of products to display in this column */
  products: Product[];
  /** Scroll direction: "up" scrolls content upward, "down" scrolls downward */
  direction: "up" | "down";
  /** Animation speed variant */
  speed?: "slow" | "normal" | "fast";
}

/**
 * Maps speed prop to the corresponding CSS animation class.
 */
function getAnimationClass(direction: "up" | "down", speed: "slow" | "normal" | "fast"): string {
  const baseClass = direction === "up" ? "animate-scroll-up" : "animate-scroll-down";
  
  if (speed === "slow") {
    return `${baseClass}-slow`;
  } else if (speed === "fast") {
    return `${baseClass}-fast`;
  }
  
  return baseClass;
}

/**
 * VerticalScrollColumn renders a vertically scrolling list of product cards.
 * The list is duplicated to create a seamless infinite scroll effect.
 */
export default function VerticalScrollColumn({
  products,
  direction,
  speed = "normal",
}: VerticalScrollColumnProps) {
  /* Get the appropriate animation class based on direction and speed */
  const animationClass = getAnimationClass(direction, speed);

  return (
    <div className="h-full overflow-hidden">
      {/* 
        Animated container: Holds both the original and duplicated product lists.
        - The animation class moves this container vertically
        - When hovering, animation pauses (defined in globals.css)
        - flex-col for vertical stacking
        - gap-4 for consistent spacing between cards
      */}
      <div className={`flex flex-col gap-4 ${animationClass}`}>
        {/* 
          First set of products (original).
          These are the "real" products that will be visible initially.
        */}
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}

        {/* 
          Second set of products (duplicate for seamless loop).
          These create continuity when the animation loops back.
          Key prefix 'dup-' ensures unique keys in React.
        */}
        {products.map((product) => (
          <div key={`dup-${product.id}`} className="flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

