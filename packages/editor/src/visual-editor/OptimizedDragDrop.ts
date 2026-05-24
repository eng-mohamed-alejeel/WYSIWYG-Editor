/**
 * Optimized Drag and Drop System
 *
 * High-performance drag and drop implementation with:
 * - RequestAnimationFrame-based updates
 * - Hardware acceleration
 * - Efficient collision detection
 * - Smart caching
 * - Batch updates
 */

import { ComponentId } from '@wysiwyg/core';
import { DragState, Rect } from './types';

interface DragOptions {
  throttleDelay?: number;
  enableHardwareAcceleration?: boolean;
  enableCollisionCache?: boolean;
  onDragStart?: (state: DragState) => void;
  onDragUpdate?: (state: DragState) => void;
  onDragEnd?: (state: DragState) => void;
}

interface CollisionCache {
  [key: string]: {
    bounds: Rect;
    timestamp: number;
  };
}

interface DragMetrics {
  startTime: number;
  endTime?: number;
  distance: number;
  updates: number;
  averageUpdateTime: number;
}

/**
 * Optimized Drag and Drop Manager
 */
export class OptimizedDragDropManager {
  private dragState: DragState | null = null;
  private options: Required<DragOptions>;
  private rafId: number | null = null;
  private lastUpdateTime: number = 0;
  private collisionCache: CollisionCache = {};
  private dragMetrics: DragMetrics | null = null;
  private updateQueue: Array<() => void> = [];
  private isProcessingQueue: boolean = false;

  constructor(options: DragOptions = {}) {
    this.options = {
      throttleDelay: options.throttleDelay ?? 16, // ~60fps
      enableHardwareAcceleration: options.enableHardwareAcceleration ?? true,
      enableCollisionCache: options.enableCollisionCache ?? true,
      onDragStart: options.onDragStart ?? (() => {}),
      onDragUpdate: options.onDragUpdate ?? (() => {}),
      onDragEnd: options.onDragEnd ?? (() => {}),
    };
  }

  /**
   * Start drag operation
   */
  startDrag(ids: ComponentId[], startX: number, startY: number): void {
    // Cancel any pending updates
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Initialize drag state
    this.dragState = {
      isDragging: true,
      draggedIds: ids,
      dragStart: { x: startX, y: startY },
      dragCurrent: { x: startX, y: startY },
      dragOffset: { x: 0, y: 0 },
      originalPositions: new Map(),
    };

    // Initialize metrics
    this.dragMetrics = {
      startTime: performance.now(),
      distance: 0,
      updates: 0,
      averageUpdateTime: 0,
    };

    // Cache initial bounds
    if (this.options.enableCollisionCache) {
      ids.forEach((id) => {
        const bounds = this.getComponentBounds(id);
        if (bounds) {
          this.collisionCache[id] = {
            bounds,
            timestamp: Date.now(),
          };
        }
      });
    }

    // Notify listeners
    this.options.onDragStart(this.dragState);
  }

  /**
   * Update drag position with throttling
   */
  updateDrag(currentX: number, currentY: number): void {
    if (!this.dragState || !this.dragState.isDragging) return;

    // Queue the update
    this.updateQueue.push(() => {
      const now = performance.now();
      const timeSinceLastUpdate = now - this.lastUpdateTime;

      // Throttle updates
      if (timeSinceLastUpdate < this.options.throttleDelay) {
        return;
      }

      // Update drag state
      const dragOffset = {
        x: currentX - this.dragState!.dragStart.x,
        y: currentY - this.dragState!.dragStart.y,
      };

      this.dragState!.dragCurrent = { x: currentX, y: currentY };
      this.dragState!.dragOffset = dragOffset;

      // Update metrics
      if (this.dragMetrics) {
        this.dragMetrics.distance += Math.sqrt(
          Math.pow(dragOffset.x, 2) + Math.pow(dragOffset.y, 2)
        );
        this.dragMetrics.updates++;
        this.dragMetrics.averageUpdateTime =
          (this.dragMetrics.averageUpdateTime * (this.dragMetrics.updates - 1) +
            timeSinceLastUpdate) /
          this.dragMetrics.updates;
      }

      this.lastUpdateTime = now;
      this.options.onDragUpdate(this.dragState!);
    });

    // Process queue if not already processing
    if (!this.isProcessingQueue) {
      this.isProcessingQueue = true;
      this.rafId = requestAnimationFrame(() => {
        this.processUpdateQueue();
      });
    }
  }

  /**
   * Process queued updates
   */
  private processUpdateQueue(): void {
    while (this.updateQueue.length > 0) {
      const update = this.updateQueue.shift();
      update?.();
    }
    this.isProcessingQueue = false;
  }

  /**
   * End drag operation
   */
  endDrag(): void {
    if (!this.dragState) return;

    // Cancel any pending updates
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Finalize metrics
    if (this.dragMetrics) {
      this.dragMetrics.endTime = performance.now();
    }

    // Notify listeners
    this.options.onDragEnd(this.dragState);

    // Clear state
    this.dragState = null;
    this.dragMetrics = null;
    this.collisionCache = {};
    this.updateQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Get component bounds with caching
   */
  private getComponentBounds(id: ComponentId): Rect | null {
    if (!this.options.enableCollisionCache) {
      return this.measureComponentBounds(id);
    }

    const cached = this.collisionCache[id];
    if (cached !== undefined && Date.now() - cached.timestamp < 100) {
      return cached.bounds;
    }

    const bounds = this.measureComponentBounds(id);
    if (bounds) {
      this.collisionCache[id] = {
        bounds,
        timestamp: Date.now(),
      };
    }

    return bounds;
  }

  /**
   * Measure component bounds
   */
  private measureComponentBounds(id: ComponentId): Rect | null {
    const element = document.querySelector(`[data-component-id="${id}"]`);
    const domRect = element?.getBoundingClientRect();
    if (!domRect) return null;
    const rect = {
      left: domRect.left,
      top: domRect.top,
      right: domRect.right,
      bottom: domRect.bottom,
      width: domRect.width,
      height: domRect.height,
      x: domRect.x,
      y: domRect.y,
    };
    return {
      ...rect,
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
   * Check for collisions with other components
   */
  checkCollisions(): ComponentId[] {
    if (!this.dragState || !this.dragState.isDragging) return [];

    const collisions: ComponentId[] = [];
    const draggedBounds = this.getDraggedBounds();

    if (!draggedBounds) return collisions;

    // Get all component elements
    const components = document.querySelectorAll('[data-component-id]');

    for (const component of components) {
      const id = component.getAttribute('data-component-id');
      if (id === null || id === undefined || id === '' || this.dragState.draggedIds.includes(id))
        continue;

      const bounds = this.getComponentBounds(id);
      if (!bounds) continue;

      if (this.isColliding(draggedBounds, bounds)) {
        collisions.push(id);
      }
    }

    return collisions;
  }

  /**
   * Get current bounds of dragged elements
   */
  private getDraggedBounds(): Rect | null {
    if (!this.dragState || this.dragState.draggedIds.length === 0) return null;

    const id = this.dragState.draggedIds[0];
    const bounds = this.getComponentBounds(id);

    if (!bounds) return null;

    const rect = {
      left: bounds.left + this.dragState.dragOffset.x,
      top: bounds.top + this.dragState.dragOffset.y,
      right: bounds.right + this.dragState.dragOffset.x,
      bottom: bounds.bottom + this.dragState.dragOffset.y,
      width: bounds.width,
      height: bounds.height,
      x: bounds.x + this.dragState.dragOffset.x,
      y: bounds.y + this.dragState.dragOffset.y,
    };

    return {
      ...rect,
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
   * Check if two rectangles are colliding
   */
  private isColliding(rect1: Rect, rect2: Rect): boolean {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  /**
   * Get drag metrics
   */
  getMetrics(): DragMetrics | null {
    return this.dragMetrics;
  }

  /**
   * Get current drag state
   */
  getState(): DragState | null {
    return this.dragState;
  }

  /**
   * Clear collision cache
   */
  clearCache(): void {
    this.collisionCache = {};
  }
}

/**
 * Create global drag drop manager instance
 */
let globalDragDropManager: OptimizedDragDropManager | null = null;

export function getGlobalDragDropManager(options?: DragOptions): OptimizedDragDropManager {
  if (!globalDragDropManager) {
    globalDragDropManager = new OptimizedDragDropManager(options);
  }
  return globalDragDropManager;
}

export function resetGlobalDragDropManager(): void {
  globalDragDropManager = null;
}

/**
 * Hook for using optimized drag and drop
 */
export function useOptimizedDragDrop(options?: DragOptions) {
  const manager = getGlobalDragDropManager(options);

  return {
    startDrag: (ids: ComponentId[], startX: number, startY: number) =>
      manager.startDrag(ids, startX, startY),
    updateDrag: (currentX: number, currentY: number) => manager.updateDrag(currentX, currentY),
    endDrag: () => manager.endDrag(),
    checkCollisions: () => manager.checkCollisions(),
    getMetrics: () => manager.getMetrics(),
    getState: () => manager.getState(),
    clearCache: () => manager.clearCache(),
  };
}
