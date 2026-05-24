/**
 * Alignment Guides Utilities
 *
 * Helper functions for alignment guides and smart spacing
 */

import { Rect } from './types';
import { getRectEdges } from './utils';

/**
 * Calculate horizontal alignment guides
 */
export function calculateHorizontalGuides(
  targetRect: Rect,
  otherRects: Rect[],
  threshold: number
): Array<{
  type: 'vertical';
  position: number;
  start: number;
  end: number;
  strength: 'strong' | 'weak';
}> {
  const guides: Array<{
    type: 'vertical';
    position: number;
    start: number;
    end: number;
    strength: 'strong' | 'weak';
  }> = [];
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
  targetRect: Rect,
  otherRects: Rect[],
  threshold: number
): Array<{
  type: 'horizontal';
  position: number;
  start: number;
  end: number;
  strength: 'strong' | 'weak';
}> {
  const guides: Array<{
    type: 'horizontal';
    position: number;
    start: number;
    end: number;
    strength: 'strong' | 'weak';
  }> = [];
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
  targetRect: Rect,
  otherRects: Rect[],
  threshold: number
): Array<{
  type: 'horizontal' | 'vertical';
  position: number;
  start: number;
  end: number;
  strength: 'strong' | 'weak';
}> {
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
  targetRect: Rect,
  otherRects: Rect[],
  threshold: number
): Array<{
  position: { x: number; y: number };
  value: number;
  unit: string;
  type: 'margin' | 'padding' | 'gap';
  direction: 'horizontal' | 'vertical';
}> {
  const indicators: Array<{
    position: { x: number; y: number };
    value: number;
    unit: string;
    type: 'margin' | 'padding' | 'gap';
    direction: 'horizontal' | 'vertical';
  }> = [];
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
