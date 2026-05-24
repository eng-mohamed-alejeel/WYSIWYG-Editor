/**
 * Canvas Utility Functions
 */

import { Rect } from './types';

/**
 * Throttle utility function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Get combined bounds utility
 */
export function getCombinedBounds(rects: Rect[]): Rect {
  if (rects.length === 0) {
    return {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 }),
    };
  }

  return rects.reduce(
    (combined, rect) => ({
      left: Math.min(combined.left, rect.left),
      top: Math.min(combined.top, rect.top),
      right: Math.max(combined.right, rect.right),
      bottom: Math.max(combined.bottom, rect.bottom),
      width: Math.max(combined.right, rect.right) - Math.min(combined.left, rect.left),
      height: Math.max(combined.bottom, rect.bottom) - Math.min(combined.top, rect.top),
      x: Math.min(combined.left, rect.left),
      y: Math.min(combined.top, rect.top),
      toJSON: function () {
        return {
          left: this.left,
          top: this.top,
          right: this.right,
          bottom: this.bottom,
          width: this.width,
          height: this.height,
          x: this.x,
          y: this.y,
        };
      },
    }),
    { ...rects[0] }
  );
}
