/**
 * Resize Handles System
 *
 * Provides resize handle functionality for components including:
 * - Corner handles
 * - Edge handles
 * - Custom handles
 * - Aspect ratio maintenance
 * - Grid snapping
 * - Minimum/maximum size constraints
 */

import { ComponentId } from '@wysiwyg/core';
import {
  LayoutBounds,
  ResizeHandleConfig,
  ResizeHandlePosition,
  LayoutConstraints,
} from '../types';

export interface ResizeHandle {
  id: string;
  position: ResizeHandlePosition;
  bounds: LayoutBounds;
  cursor: string;
  visible: boolean;
}

export interface ResizeResult {
  success: boolean;
  newBounds?: LayoutBounds;
  handle?: ResizeHandlePosition;
  snapped?: boolean;
  warnings?: string[];
}

export class ResizeHandles {
  private config: Required<ResizeHandleConfig>;
  private activeHandles: Map<ComponentId, ResizeHandle[]>;
  private handleSize: number = 8;
  private handleOffset: number = 4;

  constructor(config: Partial<ResizeHandleConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      handles: config.handles ?? 'all',
      customHandles: config.customHandles ?? [],
      minimumSize: config.minimumSize ?? { width: 20, height: 20 },
      maximumSize: config.maximumSize,
      maintainAspectRatio: config.maintainAspectRatio ?? false,
      snapToGrid: config.snapToGrid ?? false,
      gridSize: config.gridSize ?? 10,
    };

    this.activeHandles = new Map();
  }

  /**
   * Generate resize handles for a component
   */
  generateHandles(
    componentId: ComponentId,
    bounds: LayoutBounds,
    constraints?: LayoutConstraints
  ): ResizeHandle[] {
    if (!this.config.enabled) {
      return [];
    }

    const handles: ResizeHandle[] = [];

    switch (this.config.handles) {
      case 'all':
        handles.push(...this.generateAllHandles(componentId, bounds));
        break;
      case 'corners':
        handles.push(...this.generateCornerHandles(componentId, bounds));
        break;
      case 'edges':
        handles.push(...this.generateEdgeHandles(componentId, bounds));
        break;
      case 'custom':
        handles.push(...this.generateCustomHandles(componentId, bounds));
        break;
    }

    this.activeHandles.set(componentId, handles);
    return handles;
  }

  /**
   * Generate all handles (corners + edges)
   */
  private generateAllHandles(componentId: ComponentId, bounds: LayoutBounds): ResizeHandle[] {
    return [
      ...this.generateCornerHandles(componentId, bounds),
      ...this.generateEdgeHandles(componentId, bounds),
    ];
  }

  /**
   * Generate corner handles
   */
  private generateCornerHandles(componentId: ComponentId, bounds: LayoutBounds): ResizeHandle[] {
    const positions: ResizeHandlePosition[] = [
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
    ];

    return positions.map((position) => ({
      id: `${componentId}-${position}`,
      position,
      bounds: this.calculateHandleBounds(position, bounds),
      cursor: this.getCursorForPosition(position),
      visible: true,
    }));
  }

  /**
   * Generate edge handles
   */
  private generateEdgeHandles(componentId: ComponentId, bounds: LayoutBounds): ResizeHandle[] {
    const positions: ResizeHandlePosition[] = ['top', 'right', 'bottom', 'left'];

    return positions.map((position) => ({
      id: `${componentId}-${position}`,
      position,
      bounds: this.calculateHandleBounds(position, bounds),
      cursor: this.getCursorForPosition(position),
      visible: true,
    }));
  }

  /**
   * Generate custom handles
   */
  private generateCustomHandles(componentId: ComponentId, bounds: LayoutBounds): ResizeHandle[] {
    return this.config.customHandles.map((position) => ({
      id: `${componentId}-${position}`,
      position,
      bounds: this.calculateHandleBounds(position, bounds),
      cursor: this.getCursorForPosition(position),
      visible: true,
    }));
  }

  /**
   * Calculate handle bounds
   */
  private calculateHandleBounds(
    position: ResizeHandlePosition,
    componentBounds: LayoutBounds
  ): LayoutBounds {
    const { x, y, width, height } = componentBounds;
    const size = this.handleSize;
    const offset = this.handleOffset;

    switch (position) {
      case 'top-left':
        return {
          x: x - offset,
          y: y - offset,
          width: size,
          height: size,
        };
      case 'top':
        return {
          x: x + width / 2 - size / 2,
          y: y - offset,
          width: size,
          height: size,
        };
      case 'top-right':
        return {
          x: x + width - size + offset,
          y: y - offset,
          width: size,
          height: size,
        };
      case 'right':
        return {
          x: x + width - size + offset,
          y: y + height / 2 - size / 2,
          width: size,
          height: size,
        };
      case 'bottom-right':
        return {
          x: x + width - size + offset,
          y: y + height - size + offset,
          width: size,
          height: size,
        };
      case 'bottom':
        return {
          x: x + width / 2 - size / 2,
          y: y + height - size + offset,
          width: size,
          height: size,
        };
      case 'bottom-left':
        return {
          x: x - offset,
          y: y + height - size + offset,
          width: size,
          height: size,
        };
      case 'left':
        return {
          x: x - offset,
          y: y + height / 2 - size / 2,
          width: size,
          height: size,
        };
    }
  }

  /**
   * Get cursor for handle position
   */
  private getCursorForPosition(position: ResizeHandlePosition): string {
    const cursors: Record<ResizeHandlePosition, string> = {
      'top-left': 'nwse-resize',
      top: 'ns-resize',
      'top-right': 'nesw-resize',
      right: 'ew-resize',
      'bottom-right': 'nwse-resize',
      bottom: 'ns-resize',
      'bottom-left': 'nesw-resize',
      left: 'ew-resize',
    };
    return cursors[position];
  }

  /**
   * Handle resize operation
   */
  handleResize(
    componentId: ComponentId,
    handle: ResizeHandlePosition,
    originalBounds: LayoutBounds,
    deltaX: number,
    deltaY: number,
    constraints?: LayoutConstraints
  ): ResizeResult {
    if (!this.config.enabled) {
      return { success: false };
    }

    let newBounds = { ...originalBounds };
    const warnings: string[] = [];

    // Calculate new bounds based on handle position
    switch (handle) {
      case 'top-left':
        newBounds.x += deltaX;
        newBounds.y += deltaY;
        newBounds.width -= deltaX;
        newBounds.height -= deltaY;
        break;
      case 'top':
        newBounds.y += deltaY;
        newBounds.height -= deltaY;
        break;
      case 'top-right':
        newBounds.y += deltaY;
        newBounds.width += deltaX;
        newBounds.height -= deltaY;
        break;
      case 'right':
        newBounds.width += deltaX;
        break;
      case 'bottom-right':
        newBounds.width += deltaX;
        newBounds.height += deltaY;
        break;
      case 'bottom':
        newBounds.height += deltaY;
        break;
      case 'bottom-left':
        newBounds.x += deltaX;
        newBounds.width -= deltaX;
        newBounds.height += deltaY;
        break;
      case 'left':
        newBounds.x += deltaX;
        newBounds.width -= deltaX;
        break;
    }

    // Maintain aspect ratio if enabled
    if (this.config.maintainAspectRatio && constraints?.aspectRatio) {
      const aspectRatio = constraints.aspectRatio;
      const currentAspectRatio = newBounds.width / newBounds.height;

      if (Math.abs(currentAspectRatio - aspectRatio) > 0.01) {
        // Adjust width or height to maintain aspect ratio
        if (['top', 'bottom'].includes(handle)) {
          newBounds.width = newBounds.height * aspectRatio;
        } else {
          newBounds.height = newBounds.width / aspectRatio;
        }
      }
    }

    // Apply minimum size constraints
    if (newBounds.width < this.config.minimumSize.width) {
      newBounds.width = this.config.minimumSize.width;
      warnings.push(`Minimum width of ${this.config.minimumSize.width}px reached`);
    }
    if (newBounds.height < this.config.minimumSize.height) {
      newBounds.height = this.config.minimumSize.height;
      warnings.push(`Minimum height of ${this.config.minimumSize.height}px reached`);
    }

    // Apply maximum size constraints
    if (this.config.maximumSize) {
      if (newBounds.width > this.config.maximumSize.width) {
        newBounds.width = this.config.maximumSize.width;
        warnings.push(`Maximum width of ${this.config.maximumSize.width}px reached`);
      }
      if (newBounds.height > this.config.maximumSize.height) {
        newBounds.height = this.config.maximumSize.height;
        warnings.push(`Maximum height of ${this.config.maximumSize.height}px reached`);
      }
    }

    // Apply constraint-based limits
    if (constraints) {
      if (constraints.minWidth && newBounds.width < constraints.minWidth) {
        newBounds.width = constraints.minWidth;
        warnings.push(`Minimum width constraint of ${constraints.minWidth}px reached`);
      }
      if (constraints.maxWidth && newBounds.width > constraints.maxWidth) {
        newBounds.width = constraints.maxWidth;
        warnings.push(`Maximum width constraint of ${constraints.maxWidth}px reached`);
      }
      if (constraints.minHeight && newBounds.height < constraints.minHeight) {
        newBounds.height = constraints.minHeight;
        warnings.push(`Minimum height constraint of ${constraints.minHeight}px reached`);
      }
      if (constraints.maxHeight && newBounds.height > constraints.maxHeight) {
        newBounds.height = constraints.maxHeight;
        warnings.push(`Maximum height constraint of ${constraints.maxHeight}px reached`);
      }
    }

    // Snap to grid if enabled
    let snapped = false;
    if (this.config.snapToGrid) {
      const snappedBounds = this.snapToGrid(newBounds);
      if (
        snappedBounds.x !== newBounds.x ||
        snappedBounds.y !== newBounds.y ||
        snappedBounds.width !== newBounds.width ||
        snappedBounds.height !== newBounds.height
      ) {
        newBounds = snappedBounds;
        snapped = true;
      }
    }

    return {
      success: true,
      newBounds,
      handle,
      snapped,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Snap bounds to grid
   */
  private snapToGrid(bounds: LayoutBounds): LayoutBounds {
    const gridSize = this.config.gridSize;

    return {
      x: Math.round(bounds.x / gridSize) * gridSize,
      y: Math.round(bounds.y / gridSize) * gridSize,
      width: Math.round(bounds.width / gridSize) * gridSize,
      height: Math.round(bounds.height / gridSize) * gridSize,
    };
  }

  /**
   * Get active handles for a component
   */
  getActiveHandles(componentId: ComponentId): ResizeHandle[] {
    return this.activeHandles.get(componentId) || [];
  }

  /**
   * Clear handles for a component
   */
  clearHandles(componentId: ComponentId): void {
    this.activeHandles.delete(componentId);
  }

  /**
   * Clear all handles
   */
  clearAllHandles(): void {
    this.activeHandles.clear();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ResizeHandleConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<ResizeHandleConfig> {
    return { ...this.config };
  }
}
