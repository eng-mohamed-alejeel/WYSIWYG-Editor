/**
 * Drag Alignment Indicators System
 *
 * Provides visual feedback during drag operations including:
 * - Alignment indicators
 * - Distance measurements
 * - Snap feedback
 * - Visual guides
 */

import { ComponentId } from '@wysiwyg/core';
import { LayoutBounds, DragAlignmentConfig } from '../types';

export interface DragAlignmentIndicator {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number;
  color: string;
  style: 'solid' | 'dashed';
  width: number;
  label?: string;
  distance?: number;
}

export interface DragAlignmentResult {
  showIndicators: boolean;
  indicators: DragAlignmentIndicator[];
  snappedPosition?: {
    x: number;
    y: number;
  };
  distance?: {
    horizontal?: number;
    vertical?: number;
  };
}

export class DragAlignment {
  private config: Required<DragAlignmentConfig>;
  private activeIndicators: Map<ComponentId, DragAlignmentIndicator[]>;

  constructor(config: Partial<DragAlignmentConfig> = {}) {
    this.config = {
      showIndicators: config.showIndicators ?? true,
      indicatorColor: config.indicatorColor ?? '#8b5cf6',
      indicatorStyle: config.indicatorStyle ?? 'dashed',
      indicatorWidth: config.indicatorWidth ?? 2,
      showDistance: config.showDistance ?? true,
      snapThreshold: config.snapThreshold ?? 8,
    };

    this.activeIndicators = new Map();
  }

  /**
   * Calculate drag alignment
   */
  calculateAlignment(
    componentId: ComponentId,
    currentPosition: { x: number; y: number },
    componentBounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>,
    containerBounds: LayoutBounds
  ): DragAlignmentResult {
    if (!this.config.showIndicators) {
      return { showIndicators: false, indicators: [] };
    }

    const indicators: DragAlignmentIndicator[] = [];
    let bestSnapPosition: { x: number; y: number } | undefined;
    let minDistance = this.config.snapThreshold;

    // Calculate horizontal alignments
    const horizontalAlignments = this.calculateHorizontalAlignments(
      currentPosition,
      componentBounds,
      nearbyComponents,
      containerBounds
    );

    for (const alignment of horizontalAlignments) {
      if (alignment.distance && alignment.distance < minDistance) {
        bestSnapPosition = {
          x: alignment.position,
          y: currentPosition.y,
        };
        minDistance = alignment.distance;
      }
      indicators.push(alignment.indicator);
    }

    // Calculate vertical alignments
    const verticalAlignments = this.calculateVerticalAlignments(
      currentPosition,
      componentBounds,
      nearbyComponents,
      containerBounds
    );

    for (const alignment of verticalAlignments) {
      if (alignment.distance && alignment.distance < minDistance) {
        bestSnapPosition = {
          x: bestSnapPosition?.x || currentPosition.x,
          y: alignment.position,
        };
        minDistance = alignment.distance;
      }
      indicators.push(alignment.indicator);
    }

    // Calculate distances
    const distances = this.calculateDistances(currentPosition, componentBounds, nearbyComponents);

    // Store active indicators
    this.activeIndicators.set(componentId, indicators);

    return {
      showIndicators: true,
      indicators,
      snappedPosition: bestSnapPosition,
      distance: this.config.showDistance ? distances : undefined,
    };
  }

  /**
   * Calculate horizontal alignments
   */
  private calculateHorizontalAlignments(
    position: { x: number; y: number },
    bounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>,
    containerBounds: LayoutBounds
  ): Array<{ indicator: DragAlignmentIndicator; distance?: number }> {
    const alignments: Array<{ indicator: DragAlignmentIndicator; distance?: number }> = [];

    // Container left edge
    const leftDistance = Math.abs(position.x - containerBounds.x);
    if (leftDistance < this.config.snapThreshold) {
      alignments.push({
        indicator: {
          id: 'container-left',
          type: 'vertical',
          position: containerBounds.x,
          color: this.config.indicatorColor,
          style: this.config.indicatorStyle,
          width: this.config.indicatorWidth,
          label: 'Left',
        },
        distance: leftDistance,
      });
    }

    // Container right edge
    const rightDistance = Math.abs(
      position.x + bounds.width - (containerBounds.x + containerBounds.width)
    );
    if (rightDistance < this.config.snapThreshold) {
      alignments.push({
        indicator: {
          id: 'container-right',
          type: 'vertical',
          position: containerBounds.x + containerBounds.width,
          color: this.config.indicatorColor,
          style: this.config.indicatorStyle,
          width: this.config.indicatorWidth,
          label: 'Right',
        },
        distance: rightDistance,
      });
    }

    // Container center
    const containerCenterX = containerBounds.x + containerBounds.width / 2;
    const componentCenterX = position.x + bounds.width / 2;
    const centerDistance = Math.abs(componentCenterX - containerCenterX);
    if (centerDistance < this.config.snapThreshold) {
      alignments.push({
        indicator: {
          id: 'container-center',
          type: 'vertical',
          position: containerCenterX,
          color: this.config.indicatorColor,
          style: this.config.indicatorStyle,
          width: this.config.indicatorWidth,
          label: 'Center',
        },
        distance: centerDistance,
      });
    }

    // Nearby component alignments
    for (const [id, componentBounds] of nearbyComponents) {
      // Left edge alignment
      const leftEdgeDist = Math.abs(position.x - componentBounds.x);
      if (leftEdgeDist < this.config.snapThreshold) {
        alignments.push({
          indicator: {
            id: `component-${id}-left`,
            type: 'vertical',
            position: componentBounds.x,
            color: this.config.indicatorColor,
            style: this.config.indicatorStyle,
            width: this.config.indicatorWidth,
          },
          distance: leftEdgeDist,
        });
      }

      // Right edge alignment
      const rightEdgeDist = Math.abs(
        position.x + bounds.width - (componentBounds.x + componentBounds.width)
      );
      if (rightEdgeDist < this.config.snapThreshold) {
        alignments.push({
          indicator: {
            id: `component-${id}-right`,
            type: 'vertical',
            position: componentBounds.x + componentBounds.width,
            color: this.config.indicatorColor,
            style: this.config.indicatorStyle,
            width: this.config.indicatorWidth,
          },
          distance: rightEdgeDist,
        });
      }

      // Center alignment
      const otherCenterX = componentBounds.x + componentBounds.width / 2;
      const centerDist = Math.abs(componentCenterX - otherCenterX);
      if (centerDist < this.config.snapThreshold) {
        alignments.push({
          indicator: {
            id: `component-${id}-center`,
            type: 'vertical',
            position: otherCenterX,
            color: this.config.indicatorColor,
            style: this.config.indicatorStyle,
            width: this.config.indicatorWidth,
            label: 'Center',
          },
          distance: centerDist,
        });
      }
    }

    return alignments;
  }

  /**
   * Calculate vertical alignments
   */
  private calculateVerticalAlignments(
    position: { x: number; y: number },
    bounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>,
    containerBounds: LayoutBounds
  ): Array<{ indicator: DragAlignmentIndicator; distance?: number }> {
    const alignments: Array<{ indicator: DragAlignmentIndicator; distance?: number }> = [];

    // Container top edge
    const topDistance = Math.abs(position.y - containerBounds.y);
    if (topDistance < this.config.snapThreshold) {
      alignments.push({
        indicator: {
          id: 'container-top',
          type: 'horizontal',
          position: containerBounds.y,
          color: this.config.indicatorColor,
          style: this.config.indicatorStyle,
          width: this.config.indicatorWidth,
          label: 'Top',
        },
        distance: topDistance,
      });
    }

    // Container bottom edge
    const bottomDistance = Math.abs(
      position.y + bounds.height - (containerBounds.y + containerBounds.height)
    );
    if (bottomDistance < this.config.snapThreshold) {
      alignments.push({
        indicator: {
          id: 'container-bottom',
          type: 'horizontal',
          position: containerBounds.y + containerBounds.height,
          color: this.config.indicatorColor,
          style: this.config.indicatorStyle,
          width: this.config.indicatorWidth,
          label: 'Bottom',
        },
        distance: bottomDistance,
      });
    }

    // Container center
    const containerCenterY = containerBounds.y + containerBounds.height / 2;
    const componentCenterY = position.y + bounds.height / 2;
    const centerDistance = Math.abs(componentCenterY - containerCenterY);
    if (centerDistance < this.config.snapThreshold) {
      alignments.push({
        indicator: {
          id: 'container-center',
          type: 'horizontal',
          position: containerCenterY,
          color: this.config.indicatorColor,
          style: this.config.indicatorStyle,
          width: this.config.indicatorWidth,
          label: 'Center',
        },
        distance: centerDistance,
      });
    }

    // Nearby component alignments
    for (const [id, componentBounds] of nearbyComponents) {
      // Top edge alignment
      const topEdgeDist = Math.abs(position.y - componentBounds.y);
      if (topEdgeDist < this.config.snapThreshold) {
        alignments.push({
          indicator: {
            id: `component-${id}-top`,
            type: 'horizontal',
            position: componentBounds.y,
            color: this.config.indicatorColor,
            style: this.config.indicatorStyle,
            width: this.config.indicatorWidth,
          },
          distance: topEdgeDist,
        });
      }

      // Bottom edge alignment
      const bottomEdgeDist = Math.abs(
        position.y + bounds.height - (componentBounds.y + componentBounds.height)
      );
      if (bottomEdgeDist < this.config.snapThreshold) {
        alignments.push({
          indicator: {
            id: `component-${id}-bottom`,
            type: 'horizontal',
            position: componentBounds.y + componentBounds.height,
            color: this.config.indicatorColor,
            style: this.config.indicatorStyle,
            width: this.config.indicatorWidth,
          },
          distance: bottomEdgeDist,
        });
      }

      // Center alignment
      const otherCenterY = componentBounds.y + componentBounds.height / 2;
      const centerDist = Math.abs(componentCenterY - otherCenterY);
      if (centerDist < this.config.snapThreshold) {
        alignments.push({
          indicator: {
            id: `component-${id}-center`,
            type: 'horizontal',
            position: otherCenterY,
            color: this.config.indicatorColor,
            style: this.config.indicatorStyle,
            width: this.config.indicatorWidth,
            label: 'Center',
          },
          distance: centerDist,
        });
      }
    }

    return alignments;
  }

  /**
   * Calculate distances between components
   */
  private calculateDistances(
    position: { x: number; y: number },
    bounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>
  ): { horizontal?: number; vertical?: number } {
    let minHorizontalDistance: number | undefined;
    let minVerticalDistance: number | undefined;

    for (const componentBounds of nearbyComponents.values()) {
      // Calculate horizontal distance
      const hDist = Math.abs(position.x - (componentBounds.x + componentBounds.width));
      if (minHorizontalDistance === undefined || hDist < minHorizontalDistance) {
        minHorizontalDistance = hDist;
      }

      // Calculate vertical distance
      const vDist = Math.abs(position.y - (componentBounds.y + componentBounds.height));
      if (minVerticalDistance === undefined || vDist < minVerticalDistance) {
        minVerticalDistance = vDist;
      }
    }

    return {
      horizontal: minHorizontalDistance,
      vertical: minVerticalDistance,
    };
  }

  /**
   * Get active indicators for a component
   */
  getActiveIndicators(componentId: ComponentId): DragAlignmentIndicator[] {
    return this.activeIndicators.get(componentId) || [];
  }

  /**
   * Clear indicators for a component
   */
  clearIndicators(componentId: ComponentId): void {
    this.activeIndicators.delete(componentId);
  }

  /**
   * Clear all indicators
   */
  clearAllIndicators(): void {
    this.activeIndicators.clear();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<DragAlignmentConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<DragAlignmentConfig> {
    return { ...this.config };
  }
}
