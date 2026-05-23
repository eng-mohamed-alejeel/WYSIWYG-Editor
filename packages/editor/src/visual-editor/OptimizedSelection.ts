/**
 * Optimized Selection System
 *
 * High-performance selection implementation with:
 * - Efficient selection tracking
 * - Batch updates
 * - Spatial indexing
 * - Smart rendering
 * - Debounced updates
 */

import { ComponentId } from '@wysiwyg/core';
import { SelectionBox, ComponentBounds } from './types';

interface SelectionOptions {
  debounceDelay?: number;
  enableSpatialIndex?: boolean;
  enableBatchUpdates?: boolean;
  maxSelectionSize?: number;
  onSelectionChange?: (selectedIds: ComponentId[]) => void;
  onHoverChange?: (hoveredId: ComponentId | null) => void;
}

interface SpatialIndex {
  [key: string]: {
    bounds: DOMRect;
    componentId: ComponentId;
  };
}

interface SelectionMetrics {
  selectionCount: number;
  lastUpdateTime: number;
  averageUpdateTime: number;
  updateCount: number;
}

/**
 * Optimized Selection Manager
 */
export class OptimizedSelectionManager {
  private selectedIds: Set<ComponentId> = new Set();
  private hoveredId: ComponentId | null = null;
  private focusedId: ComponentId | null = null;
  private options: Required<SelectionOptions>;
  private spatialIndex: SpatialIndex = {};
  private debounceTimer: NodeJS.Timeout | null = null;
  private selectionMetrics: SelectionMetrics = {
    selectionCount: 0,
    lastUpdateTime: 0,
    averageUpdateTime: 0,
    updateCount: 0,
  };
  private updateQueue: Set<ComponentId> = new Set();
  private isProcessingQueue: boolean = false;

  constructor(options: SelectionOptions = {}) {
    this.options = {
      debounceDelay: options.debounceDelay ?? 150,
      enableSpatialIndex: options.enableSpatialIndex ?? true,
      enableBatchUpdates: options.enableBatchUpdates ?? true,
      maxSelectionSize: options.maxSelectionSize ?? 1000,
      onSelectionChange: options.onSelectionChange ?? (() => {}),
      onHoverChange: options.onHoverChange ?? (() => {}),
    };

    // Initialize spatial index
    if (this.options.enableSpatialIndex) {
      this.buildSpatialIndex();
    }
  }

  /**
   * Build spatial index for efficient selection
   */
  private buildSpatialIndex(): void {
    this.spatialIndex = {};
    const components = document.querySelectorAll('[data-component-id]');

    components.forEach((component) => {
      const id = component.getAttribute('data-component-id');
      if (!id) return;

      const bounds = component.getBoundingClientRect();
      const indexKey = this.getSpatialIndexKey(bounds);

      this.spatialIndex[indexKey] = {
        bounds,
        componentId: id,
      };
    });
  }

  /**
   * Get spatial index key for bounds
   */
  private getSpatialIndexKey(bounds: DOMRect): string {
    const gridSize = 50; // 50px grid cells
    const x = Math.floor(bounds.left / gridSize);
    const y = Math.floor(bounds.top / gridSize);
    return `${x}:${y}`;
  }

  /**
   * Select component(s)
   */
  select(ids: ComponentId | ComponentId[], addToSelection = false): void {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    // Check max selection size
    if (this.selectedIds.size + idsArray.length > this.options.maxSelectionSize) {
      console.warn(`Selection exceeds maximum size of ${this.options.maxSelectionSize}`);
      return;
    }

    // Queue updates if batch mode is enabled
    if (this.options.enableBatchUpdates) {
      idsArray.forEach((id) => this.updateQueue.add(id));
      this.processUpdateQueue();
      return;
    }

    // Update selection immediately
    if (addToSelection) {
      idsArray.forEach((id) => this.selectedIds.add(id));
    } else {
      this.selectedIds = new Set(idsArray);
    }

    this.notifySelectionChange();
  }

  /**
   * Deselect component(s)
   */
  deselect(ids: ComponentId | ComponentId[]): void {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    if (this.options.enableBatchUpdates) {
      idsArray.forEach((id) => this.updateQueue.add(id));
      this.processUpdateQueue();
      return;
    }

    idsArray.forEach((id) => this.selectedIds.delete(id));
    this.notifySelectionChange();
  }

  /**
   * Deselect all components
   */
  deselectAll(): void {
    this.selectedIds.clear();
    this.notifySelectionChange();
  }

  /**
   * Set hovered component
   */
  setHovered(id: ComponentId | null): void {
    if (this.hoveredId === id) return;

    this.hoveredId = id;
    this.options.onHoverChange(id);
  }

  /**
   * Set focused component
   */
  setFocused(id: ComponentId | null): void {
    this.focusedId = id;
  }

  /**
   * Check if component is selected
   */
  isSelected(id: ComponentId): boolean {
    return this.selectedIds.has(id);
  }

  /**
   * Get all selected IDs
   */
  getSelectedIds(): ComponentId[] {
    return Array.from(this.selectedIds);
  }

  /**
   * Get hovered ID
   */
  getHoveredId(): ComponentId | null {
    return this.hoveredId;
  }

  /**
   * Get focused ID
   */
  getFocusedId(): ComponentId | null {
    return this.focusedId;
  }

  /**
   * Get selection metrics
   */
  getMetrics(): SelectionMetrics {
    return { ...this.selectionMetrics };
  }

  /**
   * Process queued updates
   */
  private processUpdateQueue(): void {
    if (this.isProcessingQueue || this.updateQueue.size === 0) return;

    this.isProcessingQueue = true;

    // Clear previous debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new debounce timer
    this.debounceTimer = setTimeout(() => {
      const now = performance.now();
      const timeSinceLastUpdate = now - this.selectionMetrics.lastUpdateTime;

      // Update metrics
      this.selectionMetrics.updateCount++;
      this.selectionMetrics.averageUpdateTime =
        (this.selectionMetrics.averageUpdateTime * (this.selectionMetrics.updateCount - 1) +
          timeSinceLastUpdate) /
        this.selectionMetrics.updateCount;
      this.selectionMetrics.lastUpdateTime = now;

      // Process queued updates
      this.updateQueue.forEach((id) => {
        if (this.selectedIds.has(id)) {
          this.selectedIds.delete(id);
        } else {
          this.selectedIds.add(id);
        }
      });

      this.updateQueue.clear();
      this.isProcessingQueue = false;
      this.notifySelectionChange();
    }, this.options.debounceDelay);
  }

  /**
   * Notify listeners of selection change
   */
  private notifySelectionChange(): void {
    this.selectionMetrics.selectionCount = this.selectedIds.size;
    this.options.onSelectionChange(this.getSelectedIds());
  }

  /**
   * Select components within a selection box
   */
  selectInBox(selectionBox: SelectionBox): void {
    if (!this.options.enableSpatialIndex) {
      console.warn('Spatial indexing is disabled. Box selection may be slow.');
      return;
    }

    const selectedIds: ComponentId[] = [];
    const boxBounds = new DOMRect(
      Math.min(selectionBox.start.x, selectionBox.end.x),
      Math.min(selectionBox.start.y, selectionBox.end.y),
      Math.abs(selectionBox.end.x - selectionBox.start.x),
      Math.abs(selectionBox.end.y - selectionBox.start.y)
    );

    // Use spatial index for efficient lookup
    Object.values(this.spatialIndex).forEach((entry) => {
      if (this.isInBox(entry.bounds, boxBounds)) {
        selectedIds.push(entry.componentId);
      }
    });

    this.select(selectedIds, true);
  }

  /**
   * Check if bounds are within a box
   */
  private isInBox(bounds: DOMRect, box: DOMRect): boolean {
    return (
      bounds.left >= box.left &&
      bounds.top >= box.top &&
      bounds.right <= box.right &&
      bounds.bottom <= box.bottom
    );
  }

  /**
   * Clear selection and reset state
   */
  clear(): void {
    this.selectedIds.clear();
    this.hoveredId = null;
    this.focusedId = null;
    this.updateQueue.clear();
    this.isProcessingQueue = false;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    this.selectionMetrics = {
      selectionCount: 0,
      lastUpdateTime: 0,
      averageUpdateTime: 0,
      updateCount: 0,
    };

    this.notifySelectionChange();
  }

  /**
   * Rebuild spatial index
   */
  rebuildIndex(): void {
    if (this.options.enableSpatialIndex) {
      this.buildSpatialIndex();
    }
  }
}

/**
 * Create global selection manager instance
 */
let globalSelectionManager: OptimizedSelectionManager | null = null;

export function getGlobalSelectionManager(options?: SelectionOptions): OptimizedSelectionManager {
  if (!globalSelectionManager) {
    globalSelectionManager = new OptimizedSelectionManager(options);
  }
  return globalSelectionManager;
}

export function resetGlobalSelectionManager(): void {
  globalSelectionManager = null;
}

/**
 * Hook for using optimized selection
 */
export function useOptimizedSelection(options?: SelectionOptions) {
  const manager = getGlobalSelectionManager(options);

  return {
    select: (ids: ComponentId | ComponentId[], addToSelection?: boolean) =>
      manager.select(ids, addToSelection),
    deselect: (ids: ComponentId | ComponentId[]) => manager.deselect(ids),
    deselectAll: () => manager.deselectAll(),
    setHovered: (id: ComponentId | null) => manager.setHovered(id),
    setFocused: (id: ComponentId | null) => manager.setFocused(id),
    isSelected: (id: ComponentId) => manager.isSelected(id),
    getSelectedIds: () => manager.getSelectedIds(),
    getHoveredId: () => manager.getHoveredId(),
    getFocusedId: () => manager.getFocusedId(),
    getMetrics: () => manager.getMetrics(),
    selectInBox: (selectionBox: SelectionBox) => manager.selectInBox(selectionBox),
    clear: () => manager.clear(),
    rebuildIndex: () => manager.rebuildIndex(),
  };
}
