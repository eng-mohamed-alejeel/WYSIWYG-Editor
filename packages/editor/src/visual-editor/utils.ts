/**
 * Visual Editor Utilities
 *
 * Helper functions for alignment guides, snapping, and smart spacing
 */

import { Rect } from './types';

/**
 * Calculate distance between two points
 */
export function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Check if a point is within a rectangle
 */
export function isPointInRect(point: { x: number; y: number }, rect: Rect): boolean {
  return (
    point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom
  );
}

/**
 * Check if two rectangles intersect
 */
export function rectsIntersect(rect1: Rect, rect2: Rect): boolean {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

/**
 * Calculate the intersection of two rectangles
 */
export function getRectIntersection(rect1: Rect, rect2: Rect): Rect | null {
  if (!rectsIntersect(rect1, rect2)) return null;

  const intersection = {
    left: Math.max(rect1.left, rect2.left),
    top: Math.max(rect1.top, rect2.top),
    right: Math.min(rect1.right, rect2.right),
    bottom: Math.min(rect1.bottom, rect2.bottom),
    width: Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left),
    height: Math.min(rect1.bottom, rect2.top) - Math.max(rect1.top, rect2.top),
    x: Math.max(rect1.left, rect2.left),
    y: Math.max(rect1.top, rect2.top),
  };

  return {
    ...intersection,
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
  };
}

/**
 * Get the center point of a rectangle
 */
export function getRectCenter(rect: Rect): { x: number; y: number } {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

/**
 * Get the edges of a rectangle
 */
export function getRectEdges(rect: Rect): {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
} {
  return {
    left: rect.left,
    right: rect.right,
    top: rect.top,
    bottom: rect.bottom,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
}

// Alignment guides and smart spacing functions are now exported from guides.ts
export {
  calculateHorizontalGuides,
  calculateVerticalGuides,
  calculateAlignmentGuides,
  snapToGuides,
  calculateSmartSpacing,
} from './guides';

/**
 * Get the bounding rectangle of multiple rectangles
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

/**
 * Check if a rectangle is completely inside another
 */
export function isRectInside(inner: Rect, outer: Rect): boolean {
  return (
    inner.left >= outer.left &&
    inner.right <= outer.right &&
    inner.top >= outer.top &&
    inner.bottom <= outer.bottom
  );
}

/**
 * Get the closest edge of a rectangle to a point
 */
export function getClosestEdge(
  point: { x: number; y: number },
  rect: Rect
): 'left' | 'right' | 'top' | 'bottom' {
  const distances = {
    left: Math.abs(point.x - rect.left),
    right: Math.abs(point.x - rect.right),
    top: Math.abs(point.y - rect.top),
    bottom: Math.abs(point.y - rect.bottom),
  };

  let minEdge: 'left' | 'right' | 'top' | 'bottom' = 'left';
  let minDistance = distances.left;

  for (const [edge, distance] of Object.entries(distances)) {
    if (distance < minDistance) {
      minDistance = distance;
      minEdge = edge as 'left' | 'right' | 'top' | 'bottom';
    }
  }

  return minEdge;
}

/**
 * Convert a rectangle to CSS position and size
 */
export function rectToCSS(rect: Rect): {
  left: string;
  top: string;
  width: string;
  height: string;
} {
  return {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  };
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Round a value to the nearest multiple of step
 */
export function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}
