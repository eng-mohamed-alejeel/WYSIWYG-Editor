/**
 * Visual Editor Utilities
 *
 * Helper functions for alignment guides, snapping, and smart spacing
 */

import { DOMRect } from './types';

/**
 * Calculate distance between two points
 */
export function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Check if a point is within a rectangle
 */
export function isPointInRect(point: { x: number; y: number }, rect: DOMRect): boolean {
  return (
    point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom
  );
}

/**
 * Check if two rectangles intersect
 */
export function rectsIntersect(rect1: DOMRect, rect2: DOMRect): boolean {
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
export function getRectIntersection(rect1: DOMRect, rect2: DOMRect): DOMRect | null {
  if (!rectsIntersect(rect1, rect2)) return null;

  return {
    left: Math.max(rect1.left, rect2.left),
    top: Math.max(rect1.top, rect2.top),
    right: Math.min(rect1.right, rect2.right),
    bottom: Math.min(rect1.bottom, rect2.bottom),
    width: Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left),
    height: Math.min(rect1.bottom, rect2.top) - Math.max(rect1.top, rect2.top),
    x: Math.max(rect1.left, rect2.left),
    y: Math.max(rect1.top, rect2.top),
  };
}

/**
 * Get the center point of a rectangle
 */
export function getRectCenter(rect: DOMRect): { x: number; y: number } {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

/**
 * Get the edges of a rectangle
 */
export function getRectEdges(rect: DOMRect) {
  return {
    left: rect.left,
    right: rect.right,
    top: rect.top,
    bottom: rect.bottom,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
}

/**
 * Calculate horizontal alignment guides
 */
export function calculateHorizontalGuides(
  targetRect: DOMRect,
  otherRects: DOMRect[],
  threshold: number
) {
  const guides = [];
  const targetEdges = getRectEdges(targetRect);

  otherRects.forEach((rect) => {
    const edges = getRectEdges(rect);

    // Left edge alignment
    if (Math.abs(targetEdges.left - edges.left) < threshold) {
      guides.push({
        type: 'vertical' as const,
        position: edges.left,
        start: Math.min(targetEdges.top, edges.top),
        end: Math.max(targetEdges.bottom, edges.bottom),
        strength: 'strong' as const,
      });
    }

    // Right edge alignment
    if (Math.abs(targetEdges.right - edges.right) < threshold) {
      guides.push({
        type: 'vertical' as const,
        position: edges.right,
        start: Math.min(targetEdges.top, edges.top),
        end: Math.max(targetEdges.bottom, edges.bottom),
        strength: 'strong' as const,
      });
    }

    // Center alignment
    if (Math.abs(targetEdges.centerX - edges.centerX) < threshold) {
      guides.push({
        type: 'vertical' as const,
        position: edges.centerX,
        start: Math.min(targetEdges.top, edges.top),
        end: Math.max(targetEdges.bottom, edges.bottom),
        strength: 'strong' as const,
      });
    }

    // Left to right alignment
    if (Math.abs(targetEdges.left - edges.right) < threshold) {
      guides.push({
        type: 'vertical' as const,
        position: edges.right,
        start: Math.min(targetEdges.top, edges.top),
        end: Math.max(targetEdges.bottom, edges.bottom),
        strength: 'weak' as const,
      });
    }

    // Right to left alignment
    if (Math.abs(targetEdges.right - edges.left) < threshold) {
      guides.push({
        type: 'vertical' as const,
        position: edges.left,
        start: Math.min(targetEdges.top, edges.top),
        end: Math.max(targetEdges.bottom, edges.bottom),
        strength: 'weak' as const,
      });
    }
  });

  return guides;
}

/**
 * Calculate vertical alignment guides
 */
export function calculateVerticalGuides(
  targetRect: DOMRect,
  otherRects: DOMRect[],
  threshold: number
) {
  const guides = [];
  const targetEdges = getRectEdges(targetRect);

  otherRects.forEach((rect) => {
    const edges = getRectEdges(rect);

    // Top edge alignment
    if (Math.abs(targetEdges.top - edges.top) < threshold) {
      guides.push({
        type: 'horizontal' as const,
        position: edges.top,
        start: Math.min(targetEdges.left, edges.left),
        end: Math.max(targetEdges.right, edges.right),
        strength: 'strong' as const,
      });
    }

    // Bottom edge alignment
    if (Math.abs(targetEdges.bottom - edges.bottom) < threshold) {
      guides.push({
        type: 'horizontal' as const,
        position: edges.bottom,
        start: Math.min(targetEdges.left, edges.left),
        end: Math.max(targetEdges.right, edges.right),
        strength: 'strong' as const,
      });
    }

    // Center alignment
    if (Math.abs(targetEdges.centerY - edges.centerY) < threshold) {
      guides.push({
        type: 'horizontal' as const,
        position: edges.centerY,
        start: Math.min(targetEdges.left, edges.left),
        end: Math.max(targetEdges.right, edges.right),
        strength: 'strong' as const,
      });
    }

    // Top to bottom alignment
    if (Math.abs(targetEdges.top - edges.bottom) < threshold) {
      guides.push({
        type: 'horizontal' as const,
        position: edges.bottom,
        start: Math.min(targetEdges.left, edges.left),
        end: Math.max(targetEdges.right, edges.right),
        strength: 'weak' as const,
      });
    }

    // Bottom to top alignment
    if (Math.abs(targetEdges.bottom - edges.top) < threshold) {
      guides.push({
        type: 'horizontal' as const,
        position: edges.top,
        start: Math.min(targetEdges.left, edges.left),
        end: Math.max(targetEdges.right, edges.right),
        strength: 'weak' as const,
      });
    }
  });

  return guides;
}

/**
 * Calculate all alignment guides for a target rectangle
 */
export function calculateAlignmentGuides(
  targetRect: DOMRect,
  otherRects: DOMRect[],
  threshold: number
) {
  return [
    ...calculateHorizontalGuides(targetRect, otherRects, threshold),
    ...calculateVerticalGuides(targetRect, otherRects, threshold),
  ];
}

/**
 * Snap a value to the nearest guide
 */
export function snapToGuides(
  value: number,
  guides: Array<{ position: number; strength: string }>,
  threshold: number
): { snapped: boolean; value: number; guide?: (typeof guides)[0] } {
  for (const guide of guides) {
    if (Math.abs(value - guide.position) < threshold) {
      return { snapped: true, value: guide.position, guide };
    }
  }
  return { snapped: false, value };
}

/**
 * Calculate smart spacing indicators
 */
export function calculateSmartSpacing(
  targetRect: DOMRect,
  otherRects: DOMRect[],
  threshold: number
) {
  const indicators = [];
  const targetEdges = getRectEdges(targetRect);

  otherRects.forEach((rect) => {
    const edges = getRectEdges(rect);

    // Horizontal spacing (left)
    if (Math.abs(targetEdges.left - edges.right) < threshold) {
      const spacing = targetEdges.left - edges.right;
      if (spacing > 0) {
        indicators.push({
          position: {
            x: edges.right + spacing / 2,
            y: (targetEdges.top + edges.top) / 2,
          },
          value: Math.round(spacing),
          unit: 'px',
          type: 'margin' as const,
          direction: 'horizontal' as const,
        });
      }
    }

    // Horizontal spacing (right)
    if (Math.abs(edges.left - targetEdges.right) < threshold) {
      const spacing = edges.left - targetEdges.right;
      if (spacing > 0) {
        indicators.push({
          position: {
            x: targetEdges.right + spacing / 2,
            y: (targetEdges.top + edges.top) / 2,
          },
          value: Math.round(spacing),
          unit: 'px',
          type: 'margin' as const,
          direction: 'horizontal' as const,
        });
      }
    }

    // Vertical spacing (top)
    if (Math.abs(targetEdges.top - edges.bottom) < threshold) {
      const spacing = targetEdges.top - edges.bottom;
      if (spacing > 0) {
        indicators.push({
          position: {
            x: (targetEdges.left + edges.left) / 2,
            y: edges.bottom + spacing / 2,
          },
          value: Math.round(spacing),
          unit: 'px',
          type: 'margin' as const,
          direction: 'vertical' as const,
        });
      }
    }

    // Vertical spacing (bottom)
    if (Math.abs(edges.top - targetEdges.bottom) < threshold) {
      const spacing = edges.top - targetEdges.bottom;
      if (spacing > 0) {
        indicators.push({
          position: {
            x: (targetEdges.left + edges.left) / 2,
            y: targetEdges.bottom + spacing / 2,
          },
          value: Math.round(spacing),
          unit: 'px',
          type: 'margin' as const,
          direction: 'vertical' as const,
        });
      }
    }
  });

  return indicators;
}

/**
 * Get the bounding rectangle of multiple rectangles
 */
export function getCombinedBounds(rects: DOMRect[]): DOMRect {
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
    }),
    { ...rects[0] }
  );
}

/**
 * Check if a rectangle is completely inside another
 */
export function isRectInside(inner: DOMRect, outer: DOMRect): boolean {
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
  rect: DOMRect
): 'left' | 'right' | 'top' | 'bottom' {
  const distances = {
    left: Math.abs(point.x - rect.left),
    right: Math.abs(point.x - rect.right),
    top: Math.abs(point.y - rect.top),
    bottom: Math.abs(point.y - rect.bottom),
  };

  return Object.entries(distances).reduce((a, b) =>
    distances[a[0] as keyof typeof distances] < distances[b[0] as keyof typeof distances]
      ? a[0]
      : b[0]
  ) as 'left' | 'right' | 'top' | 'bottom';
}

/**
 * Convert a rectangle to CSS position and size
 */
export function rectToCSS(rect: DOMRect) {
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
