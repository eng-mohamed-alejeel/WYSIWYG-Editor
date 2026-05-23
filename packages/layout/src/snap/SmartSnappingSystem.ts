/**
 * Smart Snapping System
 *
 * Provides intelligent snapping behavior for components during drag and resize operations
 * including edge snapping, center snapping, spacing snapping, and custom snap points
 */

import { ComponentId, ComponentNode } from '@wysiwyg/core';
import {
  LayoutBounds,
  LayoutMeasurement,
  SmartSnappingConfig,
  SnapPoint,
  SnapResult,
} from '../types';

export interface SnapResult {
  shouldSnap: boolean;
  snappedPosition?: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  snapLine?: {
    type: 'horizontal' | 'vertical';
    position: number;
    color: string;
  };
  distance?: number;
}

export class SmartSnappingSystem {
  private config: Required<SmartSnappingConfig>;
  private snapPoints: Map<ComponentId, SnapPoint[]>;
  private customSnapLines: SnapLine[];

  constructor(config: Partial<SmartSnappingConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      threshold: config.threshold ?? 8,
      snapToEdges: config.snapToEdges ?? true,
      snapToCenter: config.snapToCenter ?? true,
      snapToSpacing: config.snapToSpacing ?? true,
      snapToGrid: config.snapToGrid ?? true,
      gridSize: config.gridSize ?? 10,
      snapToComponents: config.snapToComponents ?? true,
      snapToGuides: config.snapToGuides ?? true,
    };

    this.snapPoints = new Map();
    this.customSnapLines = [];
  }

  /**
   * Calculate snap position during drag
   */
  calculateSnapPosition(
    componentId: ComponentId,
    currentPosition: { x: number; y: number },
    componentBounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>,
    containerBounds: LayoutBounds
  ): SnapResult {
    if (!this.config.enabled) {
      return { shouldSnap: false };
    }

    let bestSnap: SnapResult | null = null;
    let minDistance = this.config.threshold;

    // Check edge snapping
    if (this.config.snapToEdges) {
      const edgeSnap = this.calculateEdgeSnap(
        currentPosition,
        componentBounds,
        nearbyComponents,
        containerBounds
      );

      if (edgeSnap.shouldSnap && edgeSnap.distance && edgeSnap.distance < minDistance) {
        bestSnap = edgeSnap;
        minDistance = edgeSnap.distance;
      }
    }

    // Check center snapping
    if (this.config.snapToCenter) {
      const centerSnap = this.calculateCenterSnap(
        currentPosition,
        componentBounds,
        nearbyComponents
      );

      if (centerSnap.shouldSnap && centerSnap.distance && centerSnap.distance < minDistance) {
        bestSnap = centerSnap;
        minDistance = centerSnap.distance;
      }
    }

    // Check grid snapping
    if (this.config.snapToGrid) {
      const gridSnap = this.calculateGridSnap(currentPosition);

      if (gridSnap.shouldSnap && gridSnap.distance && gridSnap.distance < minDistance) {
        bestSnap = gridSnap;
        minDistance = gridSnap.distance;
      }
    }

    // Check component snapping
    if (this.config.snapToComponents) {
      const componentSnap = this.calculateComponentSnap(
        currentPosition,
        componentBounds,
        nearbyComponents
      );

      if (
        componentSnap.shouldSnap &&
        componentSnap.distance &&
        componentSnap.distance < minDistance
      ) {
        bestSnap = componentSnap;
        minDistance = componentSnap.distance;
      }
    }

    // Check guide snapping
    if (this.config.snapToGuides) {
      const guideSnap = this.calculateGuideSnap(currentPosition);

      if (guideSnap.shouldSnap && guideSnap.distance && guideSnap.distance < minDistance) {
        bestSnap = guideSnap;
        minDistance = guideSnap.distance;
      }
    }

    return bestSnap || { shouldSnap: false };
  }

  /**
   * Calculate snap size during resize
   */
  calculateSnapSize(
    componentId: ComponentId,
    currentSize: { width: number; height: number },
    componentBounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>,
    containerBounds: LayoutBounds
  ): SnapResult {
    if (!this.config.enabled) {
      return { shouldSnap: false };
    }

    let bestSnap: SnapResult | null = null;
    let minDistance = this.config.threshold;

    // Check width snapping
    if (this.config.snapToEdges) {
      const widthSnap = this.calculateWidthSnap(
        currentSize.width,
        componentBounds,
        nearbyComponents,
        containerBounds
      );

      if (widthSnap.shouldSnap && widthSnap.distance && widthSnap.distance < minDistance) {
        bestSnap = widthSnap;
        minDistance = widthSnap.distance;
      }
    }

    // Check height snapping
    if (this.config.snapToEdges) {
      const heightSnap = this.calculateHeightSnap(
        currentSize.height,
        componentBounds,
        nearbyComponents,
        containerBounds
      );

      if (heightSnap.shouldSnap && heightSnap.distance && heightSnap.distance < minDistance) {
        bestSnap = heightSnap;
        minDistance = heightSnap.distance;
      }
    }

    // Check grid snapping
    if (this.config.snapToGrid) {
      const gridSnap = this.calculateGridSizeSnap(currentSize);

      if (gridSnap.shouldSnap && gridSnap.distance && gridSnap.distance < minDistance) {
        bestSnap = gridSnap;
        minDistance = gridSnap.distance;
      }
    }

    return bestSnap || { shouldSnap: false };
  }

  /**
   * Calculate edge snap
   */
  private calculateEdgeSnap(
    position: { x: number; y: number },
    bounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>,
    containerBounds: LayoutBounds
  ): SnapResult {
    let bestSnap: SnapResult | null = null;
    let minDistance = this.config.threshold;

    // Check container edges
    const containerEdges = [
      { type: 'vertical' as const, position: containerBounds.x, color: '#ff0000' }, // Left
      {
        type: 'vertical' as const,
        position: containerBounds.x + containerBounds.width,
        color: '#ff0000',
      }, // Right
      { type: 'horizontal' as const, position: containerBounds.y, color: '#ff0000' }, // Top
      {
        type: 'horizontal' as const,
        position: containerBounds.y + containerBounds.height,
        color: '#ff0000',
      }, // Bottom
    ];

    for (const edge of containerEdges) {
      const distance =
        edge.type === 'vertical'
          ? Math.abs(position.x - edge.position)
          : Math.abs(position.y - edge.position);

      if (distance < minDistance) {
        bestSnap = {
          shouldSnap: true,
          snappedPosition:
            edge.type === 'vertical'
              ? { x: edge.position, y: position.y }
              : { x: position.x, y: edge.position },
          snapLine: edge,
          distance,
        };
        minDistance = distance;
      }
    }

    // Check nearby component edges
    for (const [id, componentBounds] of nearbyComponents) {
      const edges = [
        { type: 'vertical' as const, position: componentBounds.x, color: '#00ff00' },
        {
          type: 'vertical' as const,
          position: componentBounds.x + componentBounds.width,
          color: '#00ff00',
        },
        { type: 'horizontal' as const, position: componentBounds.y, color: '#00ff00' },
        {
          type: 'horizontal' as const,
          position: componentBounds.y + componentBounds.height,
          color: '#00ff00',
        },
      ];

      for (const edge of edges) {
        const distance =
          edge.type === 'vertical'
            ? Math.abs(position.x - edge.position)
            : Math.abs(position.y - edge.position);

        if (distance < minDistance) {
          bestSnap = {
            shouldSnap: true,
            snappedPosition:
              edge.type === 'vertical'
                ? { x: edge.position, y: position.y }
                : { x: position.x, y: edge.position },
            snapLine: edge,
            distance,
          };
          minDistance = distance;
        }
      }
    }

    return bestSnap || { shouldSnap: false };
  }

  /**
   * Calculate center snap
   */
  private calculateCenterSnap(
    position: { x: number; y: number },
    bounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>
  ): SnapResult {
    let bestSnap: SnapResult | null = null;
    let minDistance = this.config.threshold;

    const componentCenter = {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2,
    };

    for (const [id, componentBounds] of nearbyComponents) {
      const otherCenter = {
        x: componentBounds.x + componentBounds.width / 2,
        y: componentBounds.y + componentBounds.height / 2,
      };

      // Check horizontal center alignment
      const hDistance = Math.abs(componentCenter.x - otherCenter.x);
      if (hDistance < minDistance) {
        bestSnap = {
          shouldSnap: true,
          snappedPosition: {
            x: otherCenter.x - bounds.width / 2,
            y: position.y,
          },
          snapLine: {
            type: 'vertical',
            position: otherCenter.x,
            color: '#00ffff',
          },
          distance: hDistance,
        };
        minDistance = hDistance;
      }

      // Check vertical center alignment
      const vDistance = Math.abs(componentCenter.y - otherCenter.y);
      if (vDistance < minDistance) {
        bestSnap = {
          shouldSnap: true,
          snappedPosition: {
            x: position.x,
            y: otherCenter.y - bounds.height / 2,
          },
          snapLine: {
            type: 'horizontal',
            position: otherCenter.y,
            color: '#00ffff',
          },
          distance: vDistance,
        };
        minDistance = vDistance;
      }
    }

    return bestSnap || { shouldSnap: false };
  }

  /**
   * Calculate grid snap
   */
  private calculateGridSnap(position: { x: number; y: number }): SnapResult {
    if (!this.config.snapToGrid) {
      return { shouldSnap: false };
    }

    const gridSize = this.config.gridSize;
    const snappedX = Math.round(position.x / gridSize) * gridSize;
    const snappedY = Math.round(position.y / gridSize) * gridSize;

    const distanceX = Math.abs(position.x - snappedX);
    const distanceY = Math.abs(position.y - snappedY);
    const distance = Math.max(distanceX, distanceY);

    if (distance < this.config.threshold) {
      return {
        shouldSnap: true,
        snappedPosition: { x: snappedX, y: snappedY },
        snapLine: {
          type: 'vertical',
          position: snappedX,
          color: '#0000ff',
        },
        distance,
      };
    }

    return { shouldSnap: false };
  }

  /**
   * Calculate component snap
   */
  private calculateComponentSnap(
    position: { x: number; y: number },
    bounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>
  ): SnapResult {
    let bestSnap: SnapResult | null = null;
    let minDistance = this.config.threshold;

    for (const [id, componentBounds] of nearbyComponents) {
      // Check if components should align
      const snapPoints = this.snapPoints.get(id);
      if (!snapPoints) continue;

      for (const point of snapPoints) {
        let targetX: number;
        let targetY: number;

        switch (point) {
          case 'start':
            targetX = componentBounds.x;
            targetY = componentBounds.y;
            break;
          case 'center':
            targetX = componentBounds.x + componentBounds.width / 2;
            targetY = componentBounds.y + componentBounds.height / 2;
            break;
          case 'end':
            targetX = componentBounds.x + componentBounds.width;
            targetY = componentBounds.y + componentBounds.height;
            break;
          default:
            continue;
        }

        const distanceX = Math.abs(position.x - targetX);
        const distanceY = Math.abs(position.y - targetY);
        const distance = Math.max(distanceX, distanceY);

        if (distance < minDistance) {
          bestSnap = {
            shouldSnap: true,
            snappedPosition: { x: targetX, y: targetY },
            snapLine: {
              type: 'vertical',
              position: targetX,
              color: '#ff00ff',
            },
            distance,
          };
          minDistance = distance;
        }
      }
    }

    return bestSnap || { shouldSnap: false };
  }

  /**
   * Calculate guide snap
   */
  private calculateGuideSnap(position: { x: number; y: number }): SnapResult {
    let bestSnap: SnapResult | null = null;
    let minDistance = this.config.threshold;

    for (const guide of this.customSnapLines) {
      const distance =
        guide.type === 'vertical'
          ? Math.abs(position.x - guide.position)
          : Math.abs(position.y - guide.position);

      if (distance < minDistance) {
        bestSnap = {
          shouldSnap: true,
          snappedPosition:
            guide.type === 'vertical'
              ? { x: guide.position, y: position.y }
              : { x: position.x, y: guide.position },
          snapLine: guide,
          distance,
        };
        minDistance = distance;
      }
    }

    return bestSnap || { shouldSnap: false };
  }

  /**
   * Calculate width snap
   */
  private calculateWidthSnap(
    width: number,
    bounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>,
    containerBounds: LayoutBounds
  ): SnapResult {
    let bestSnap: SnapResult | null = null;
    let minDistance = this.config.threshold;

    // Check container width
    const containerDistance = Math.abs(width - containerBounds.width);
    if (containerDistance < minDistance) {
      bestSnap = {
        shouldSnap: true,
        snappedPosition: { x: bounds.x, y: bounds.y, width: containerBounds.width },
        distance: containerDistance,
      };
      minDistance = containerDistance;
    }

    // Check nearby component widths
    for (const [id, componentBounds] of nearbyComponents) {
      const distance = Math.abs(width - componentBounds.width);
      if (distance < minDistance) {
        bestSnap = {
          shouldSnap: true,
          snappedPosition: { x: bounds.x, y: bounds.y, width: componentBounds.width },
          distance,
        };
        minDistance = distance;
      }
    }

    return bestSnap || { shouldSnap: false };
  }

  /**
   * Calculate height snap
   */
  private calculateHeightSnap(
    height: number,
    bounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>,
    containerBounds: LayoutBounds
  ): SnapResult {
    let bestSnap: SnapResult | null = null;
    let minDistance = this.config.threshold;

    // Check container height
    const containerDistance = Math.abs(height - containerBounds.height);
    if (containerDistance < minDistance) {
      bestSnap = {
        shouldSnap: true,
        snappedPosition: { x: bounds.x, y: bounds.y, height: containerBounds.height },
        distance: containerDistance,
      };
      minDistance = containerDistance;
    }

    // Check nearby component heights
    for (const [id, componentBounds] of nearbyComponents) {
      const distance = Math.abs(height - componentBounds.height);
      if (distance < minDistance) {
        bestSnap = {
          shouldSnap: true,
          snappedPosition: { x: bounds.x, y: bounds.y, height: componentBounds.height },
          distance,
        };
        minDistance = distance;
      }
    }

    return bestSnap || { shouldSnap: false };
  }

  /**
   * Calculate grid size snap
   */
  private calculateGridSizeSnap(size: { width: number; height: number }): SnapResult {
    if (!this.config.snapToGrid) {
      return { shouldSnap: false };
    }

    const gridSize = this.config.gridSize;
    const snappedWidth = Math.round(size.width / gridSize) * gridSize;
    const snappedHeight = Math.round(size.height / gridSize) * gridSize;

    const distanceWidth = Math.abs(size.width - snappedWidth);
    const distanceHeight = Math.abs(size.height - snappedHeight);
    const distance = Math.max(distanceWidth, distanceHeight);

    if (distance < this.config.threshold) {
      return {
        shouldSnap: true,
        snappedPosition: {
          x: 0,
          y: 0,
          width: snappedWidth,
          height: snappedHeight,
        },
        distance,
      };
    }

    return { shouldSnap: false };
  }

  /**
   * Add snap points for a component
   */
  addSnapPoints(componentId: ComponentId, points: SnapPoint[]): void {
    this.snapPoints.set(componentId, points);
  }

  /**
   * Remove snap points for a component
   */
  removeSnapPoints(componentId: ComponentId): void {
    this.snapPoints.delete(componentId);
  }

  /**
   * Add a custom snap line
   */
  addSnapLine(line: SnapLine): void {
    this.customSnapLines.push(line);
  }

  /**
   * Remove custom snap lines
   */
  clearSnapLines(): void {
    this.customSnapLines = [];
  }

  /**
   * Update snapping configuration
   */
  updateConfig(config: Partial<SmartSnappingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<SmartSnappingConfig> {
    return { ...this.config };
  }
}

interface SnapLine {
  type: 'horizontal' | 'vertical';
  position: number;
  color: string;
}
