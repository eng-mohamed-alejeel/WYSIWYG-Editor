/**
 * Alignment Controls System
 *
 * Provides comprehensive alignment controls for components including:
 * - Horizontal alignment
 * - Vertical alignment
 * - Distribution controls
 * - Snap alignment
 * - Visual alignment guides
 */

import { ComponentId } from '@wysiwyg/core';
import {
  LayoutBounds,
  AlignmentControlsConfig,
  JustifyContent,
  AlignItems,
  SnapPoint,
} from '../types';

export interface AlignmentResult {
  aligned: boolean;
  position?: {
    x: number;
    y: number;
  };
  guides?: AlignmentGuide[];
}

export interface AlignmentGuide {
  type: 'horizontal' | 'vertical';
  position: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
  label?: string;
}

export class AlignmentControls {
  private config: Required<AlignmentControlsConfig>;
  private activeGuides: Map<ComponentId, AlignmentGuide[]>;

  constructor(config: Partial<AlignmentControlsConfig> = {}) {
    this.config = {
      snapEnabled: config.snapEnabled ?? true,
      snapThreshold: config.snapThreshold ?? 8,
      snapPoints: config.snapPoints ?? ['start', 'center', 'end'],
      customSnapPoints: config.customSnapPoints ?? [],
      showGuides: config.showGuides ?? true,
      guideColor: config.guideColor ?? '#3b82f6',
      guideStyle: config.guideStyle ?? 'dashed',
    };

    this.activeGuides = new Map();
  }

  /**
   * Align components horizontally
   */
  alignHorizontally(
    componentIds: ComponentId[],
    alignment: JustifyContent,
    containerBounds: LayoutBounds,
    componentBounds: Map<ComponentId, LayoutBounds>
  ): AlignmentResult {
    const guides: AlignmentGuide[] = [];
    const positions = new Map<ComponentId, { x: number; y: number }>();

    switch (alignment) {
      case 'flex-start':
        componentIds.forEach((id) => {
          const bounds = componentBounds.get(id);
          if (bounds) {
            positions.set(id, { x: containerBounds.x, y: bounds.y });
          }
        });
        guides.push({
          type: 'vertical',
          position: containerBounds.x,
          color: this.config.guideColor,
          style: this.config.guideStyle,
          label: 'Left',
        });
        break;

      case 'flex-end':
        componentIds.forEach((id) => {
          const bounds = componentBounds.get(id);
          if (bounds) {
            positions.set(id, {
              x: containerBounds.x + containerBounds.width - bounds.width,
              y: bounds.y,
            });
          }
        });
        guides.push({
          type: 'vertical',
          position: containerBounds.x + containerBounds.width,
          color: this.config.guideColor,
          style: this.config.guideStyle,
          label: 'Right',
        });
        break;

      case 'center':
        const centerX = containerBounds.x + containerBounds.width / 2;
        componentIds.forEach((id) => {
          const bounds = componentBounds.get(id);
          if (bounds) {
            positions.set(id, {
              x: centerX - bounds.width / 2,
              y: bounds.y,
            });
          }
        });
        guides.push({
          type: 'vertical',
          position: centerX,
          color: this.config.guideColor,
          style: this.config.guideStyle,
          label: 'Center',
        });
        break;

      case 'space-between':
        const totalWidth = componentIds.reduce((sum, id) => {
          const bounds = componentBounds.get(id);
          return sum + (bounds?.width || 0);
        }, 0);
        const availableWidth = containerBounds.width - totalWidth;
        const gap = componentIds.length > 1 ? availableWidth / (componentIds.length - 1) : 0;

        let currentX = containerBounds.x;
        componentIds.forEach((id) => {
          const bounds = componentBounds.get(id);
          if (bounds) {
            positions.set(id, { x: currentX, y: bounds.y });
            currentX += bounds.width + gap;
          }
        });
        break;

      case 'space-around':
        const totalWidthAround = componentIds.reduce((sum, id) => {
          const bounds = componentBounds.get(id);
          return sum + (bounds?.width || 0);
        }, 0);
        const availableWidthAround = containerBounds.width - totalWidthAround;
        const gapAround = availableWidthAround / componentIds.length;

        let currentXAround = containerBounds.x + gapAround / 2;
        componentIds.forEach((id) => {
          const bounds = componentBounds.get(id);
          if (bounds) {
            positions.set(id, { x: currentXAround, y: bounds.y });
            currentXAround += bounds.width + gapAround;
          }
        });
        break;

      case 'space-evenly':
        const totalWidthEvenly = componentIds.reduce((sum, id) => {
          const bounds = componentBounds.get(id);
          return sum + (bounds?.width || 0);
        }, 0);
        const availableWidthEvenly = containerBounds.width - totalWidthEvenly;
        const gapEvenly = availableWidthEvenly / (componentIds.length + 1);

        let currentXEvenly = containerBounds.x + gapEvenly;
        componentIds.forEach((id) => {
          const bounds = componentBounds.get(id);
          if (bounds) {
            positions.set(id, { x: currentXEvenly, y: bounds.y });
            currentXEvenly += bounds.width + gapEvenly;
          }
        });
        break;
    }

    // Store guides for each component
    componentIds.forEach((id) => {
      this.activeGuides.set(id, [...guides]);
    });

    return {
      aligned: true,
      guides,
    };
  }

  /**
   * Align components vertically
   */
  alignVertically(
    componentIds: ComponentId[],
    alignment: AlignItems,
    containerBounds: LayoutBounds,
    componentBounds: Map<ComponentId, LayoutBounds>
  ): AlignmentResult {
    const guides: AlignmentGuide[] = [];
    const positions = new Map<ComponentId, { x: number; y: number }>();

    switch (alignment) {
      case 'flex-start':
        componentIds.forEach((id) => {
          const bounds = componentBounds.get(id);
          if (bounds) {
            positions.set(id, { x: bounds.x, y: containerBounds.y });
          }
        });
        guides.push({
          type: 'horizontal',
          position: containerBounds.y,
          color: this.config.guideColor,
          style: this.config.guideStyle,
          label: 'Top',
        });
        break;

      case 'flex-end':
        componentIds.forEach((id) => {
          const bounds = componentBounds.get(id);
          if (bounds) {
            positions.set(id, {
              x: bounds.x,
              y: containerBounds.y + containerBounds.height - bounds.height,
            });
          }
        });
        guides.push({
          type: 'horizontal',
          position: containerBounds.y + containerBounds.height,
          color: this.config.guideColor,
          style: this.config.guideStyle,
          label: 'Bottom',
        });
        break;

      case 'center':
        const centerY = containerBounds.y + containerBounds.height / 2;
        componentIds.forEach((id) => {
          const bounds = componentBounds.get(id);
          if (bounds) {
            positions.set(id, {
              x: bounds.x,
              y: centerY - bounds.height / 2,
            });
          }
        });
        guides.push({
          type: 'horizontal',
          position: centerY,
          color: this.config.guideColor,
          style: this.config.guideStyle,
          label: 'Center',
        });
        break;

      case 'stretch':
        componentIds.forEach((id) => {
          const bounds = componentBounds.get(id);
          if (bounds) {
            positions.set(id, {
              x: bounds.x,
              y: containerBounds.y,
            });
          }
        });
        guides.push({
          type: 'horizontal',
          position: containerBounds.y,
          color: this.config.guideColor,
          style: this.config.guideStyle,
          label: 'Stretch Top',
        });
        guides.push({
          type: 'horizontal',
          position: containerBounds.y + containerBounds.height,
          color: this.config.guideColor,
          style: this.config.guideStyle,
          label: 'Stretch Bottom',
        });
        break;
    }

    // Store guides for each component
    componentIds.forEach((id) => {
      this.activeGuides.set(id, [...guides]);
    });

    return {
      aligned: true,
      guides,
    };
  }

  /**
   * Calculate snap alignment
   */
  calculateSnapAlignment(
    componentId: ComponentId,
    currentPosition: { x: number; y: number },
    componentBounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>,
    containerBounds: LayoutBounds
  ): AlignmentResult {
    if (!this.config.snapEnabled) {
      return { aligned: false };
    }

    let bestAlignment: AlignmentResult | null = null;
    let minDistance = this.config.snapThreshold;

    // Check snap points
    for (const point of this.config.snapPoints) {
      const alignment = this.checkSnapPoint(
        point,
        currentPosition,
        componentBounds,
        nearbyComponents,
        containerBounds
      );

      if (alignment.aligned && alignment.position) {
        const distance = Math.hypot(
          alignment.position.x - currentPosition.x,
          alignment.position.y - currentPosition.y
        );

        if (distance < minDistance) {
          bestAlignment = alignment;
          minDistance = distance;
        }
      }
    }

    // Check custom snap points
    for (const customPoint of this.config.customSnapPoints) {
      const alignment = this.checkCustomSnapPoint(
        customPoint,
        currentPosition,
        componentBounds,
        containerBounds
      );

      if (alignment.aligned && alignment.position) {
        const distance = Math.hypot(
          alignment.position.x - currentPosition.x,
          alignment.position.y - currentPosition.y
        );

        if (distance < minDistance) {
          bestAlignment = alignment;
          minDistance = distance;
        }
      }
    }

    return bestAlignment || { aligned: false };
  }

  /**
   * Check snap point alignment
   */
  private checkSnapPoint(
    point: SnapPoint,
    currentPosition: { x: number; y: number },
    componentBounds: LayoutBounds,
    nearbyComponents: Map<ComponentId, LayoutBounds>,
    containerBounds: LayoutBounds
  ): AlignmentResult {
    const guides: AlignmentGuide[] = [];
    let targetX: number | undefined;
    let targetY: number | undefined;

    switch (point) {
      case 'start':
        targetX = containerBounds.x;
        targetY = containerBounds.y;
        break;

      case 'center':
        targetX = containerBounds.x + containerBounds.width / 2;
        targetY = containerBounds.y + containerBounds.height / 2;
        break;

      case 'end':
        targetX = containerBounds.x + containerBounds.width;
        targetY = containerBounds.y + containerBounds.height;
        break;

      case 'between':
        // Calculate midpoint between nearby components
        const midX = this.calculateMidpoint(
          Array.from(nearbyComponents.values()).map((b) => b.x + b.width / 2)
        );
        const midY = this.calculateMidpoint(
          Array.from(nearbyComponents.values()).map((b) => b.y + b.height / 2)
        );
        targetX = midX;
        targetY = midY;
        break;

      case 'around':
        // Calculate average position of nearby components
        const avgX = this.calculateAverage(
          Array.from(nearbyComponents.values()).map((b) => b.x + b.width / 2)
        );
        const avgY = this.calculateAverage(
          Array.from(nearbyComponents.values()).map((b) => b.y + b.height / 2)
        );
        targetX = avgX;
        targetY = avgY;
        break;

      case 'evenly':
        // Calculate evenly distributed position
        const evenX = this.calculateEvenlyDistributed(
          currentPosition.x,
          containerBounds.x,
          containerBounds.x + containerBounds.width,
          nearbyComponents.size + 1
        );
        const evenY = this.calculateEvenlyDistributed(
          currentPosition.y,
          containerBounds.y,
          containerBounds.y + containerBounds.height,
          nearbyComponents.size + 1
        );
        targetX = evenX;
        targetY = evenY;
        break;
    }

    if (targetX !== undefined) {
      guides.push({
        type: 'vertical',
        position: targetX,
        color: this.config.guideColor,
        style: this.config.guideStyle,
        label: point,
      });
    }

    if (targetY !== undefined) {
      guides.push({
        type: 'horizontal',
        position: targetY,
        color: this.config.guideColor,
        style: this.config.guideStyle,
        label: point,
      });
    }

    const distance = Math.hypot(
      (targetX ?? currentPosition.x) - currentPosition.x,
      (targetY ?? currentPosition.y) - currentPosition.y
    );

    return {
      aligned: distance < this.config.snapThreshold,
      position:
        targetX !== undefined || targetY !== undefined
          ? { x: targetX ?? currentPosition.x, y: targetY ?? currentPosition.y }
          : undefined,
      guides: distance < this.config.snapThreshold ? guides : [],
    };
  }

  /**
   * Check custom snap point alignment
   */
  private checkCustomSnapPoint(
    customPoint: number,
    currentPosition: { x: number; y: number },
    componentBounds: LayoutBounds,
    containerBounds: LayoutBounds
  ): AlignmentResult {
    const guides: AlignmentGuide[] = [];
    const targetX = containerBounds.x + customPoint;
    const targetY = containerBounds.y + customPoint;

    const distanceX = Math.abs(targetX - currentPosition.x);
    const distanceY = Math.abs(targetY - currentPosition.y);

    if (distanceX < this.config.snapThreshold) {
      guides.push({
        type: 'vertical',
        position: targetX,
        color: this.config.guideColor,
        style: this.config.guideStyle,
      });
    }

    if (distanceY < this.config.snapThreshold) {
      guides.push({
        type: 'horizontal',
        position: targetY,
        color: this.config.guideColor,
        style: this.config.guideStyle,
      });
    }

    return {
      aligned: distanceX < this.config.snapThreshold || distanceY < this.config.snapThreshold,
      position: {
        x: distanceX < this.config.snapThreshold ? targetX : currentPosition.x,
        y: distanceY < this.config.snapThreshold ? targetY : currentPosition.y,
      },
      guides,
    };
  }

  /**
   * Get active guides for a component
   */
  getActiveGuides(componentId: ComponentId): AlignmentGuide[] {
    return this.activeGuides.get(componentId) || [];
  }

  /**
   * Clear active guides for a component
   */
  clearGuides(componentId?: ComponentId): void {
    if (componentId) {
      this.activeGuides.delete(componentId);
    } else {
      this.activeGuides.clear();
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AlignmentControlsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<AlignmentControlsConfig> {
    return { ...this.config };
  }

  /**
   * Helper methods
   */

  private calculateMidpoint(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }

  private calculateAverage(values: number[]): number {
    return this.calculateMidpoint(values);
  }

  private calculateEvenlyDistributed(
    value: number,
    start: number,
    end: number,
    segments: number
  ): number {
    const segmentSize = (end - start) / segments;
    const segment = Math.round((value - start) / segmentSize);
    return start + segment * segmentSize;
  }
}
