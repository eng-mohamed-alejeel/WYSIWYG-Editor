/**
 * Visual Editor Store
 *
 * Manages state for professional visual editing tools
 * Optimized for performance with selective subscriptions
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { ComponentId } from '@wysiwyg/core';
import {
  VisualEditorState,
  VisualEditorConfig,
  DragState,
  ResizeState,
  SnappingState,
  HoverState,
  SelectionBox,
  KeyboardNavigationState,
  AlignmentGuide,
  SmartSpacingIndicator,
  BreadcrumbItem,
  ComponentBounds,
} from './types';
import { eventBus } from '../stores/events';

/**
 * Default configuration following Figma and Webflow patterns
 */
const DEFAULT_CONFIG: VisualEditorConfig = {
  resizeHandles: {
    enabled: true,
    size: 8,
    color: '#0066FF',
    hoverColor: '#0052CC',
  },
  dragHandles: {
    enabled: true,
    size: 12,
    color: '#0066FF',
  },
  alignmentGuides: {
    enabled: true,
    color: '#0066FF',
    strongColor: '#0052CC',
    opacity: 0.8,
  },
  snapping: {
    enabled: true,
    threshold: 5,
    snapToEdges: true,
    snapToCenter: true,
    snapToSpacing: true,
    snapToGuides: true,
    snapToGrid: false,
    gridSize: 8,
  },
  hoverOverlay: {
    enabled: true,
    color: '#0066FF',
    opacity: 0.1,
    transition: 150,
  },
  selectionOutlines: {
    enabled: true,
    color: '#0066FF',
    hoverColor: '#0066FF33',
    focusColor: '#0066FF',
    multiSelectColor: '#0066FF',
    borderWidth: 2,
  },
  breadcrumbs: {
    enabled: true,
    maxDepth: 5,
    showComponentTypes: true,
  },
  smartSpacing: {
    enabled: true,
    showOnHover: true,
    showOnDrag: true,
    color: '#0066FF',
    fontSize: 11,
  },
  multiSelect: {
    enabled: true,
    selectionBoxColor: '#0066FF',
    selectionBoxOpacity: 0.2,
  },
  keyboardNavigation: {
    enabled: true,
    shortcuts: {
      selectAll: 'Ctrl+A',
      delete: 'Delete',
      duplicate: 'Ctrl+D',
      copy: 'Ctrl+C',
      paste: 'Ctrl+V',
      undo: 'Ctrl+Z',
      redo: 'Ctrl+Y',
      navigateUp: 'ArrowUp',
      navigateDown: 'ArrowDown',
      navigateLeft: 'ArrowLeft',
      navigateRight: 'ArrowRight',
      enter: 'Enter',
      escape: 'Escape',
    },
  },
  performance: {
    throttleDelay: 16, // ~60fps
    debounceDelay: 150,
    renderThreshold: 50,
  },
};

/**
 * Initial state
 */
const initialState: VisualEditorState = {
  dragState: {
    isDragging: false,
    draggedIds: [],
    dragStart: { x: 0, y: 0 },
    dragCurrent: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
    originalPositions: new Map(),
  },
  resizeState: {
    isResizing: false,
    resizingId: null,
    handlePosition: null,
    resizeStart: { x: 0, y: 0 },
    resizeCurrent: { x: 0, y: 0 },
    originalSize: { width: 0, height: 0, x: 0, y: 0 },
  },
  snappingState: {
    isActive: false,
    snappedX: null,
    snappedY: null,
    snappedWidth: null,
    snappedHeight: null,
    guides: [],
  },
  hoverState: {
    hoveredId: null,
    hoverPosition: null,
    showOverlay: false,
  },
  selectionBox: {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    isActive: false,
  },
  keyboardNavigation: {
    isEnabled: true,
    focusedId: null,
    navigationMode: 'tree',
    modifiers: {
      shift: false,
      ctrl: false,
      alt: false,
      meta: false,
    },
  },
  config: DEFAULT_CONFIG,
};

/**
 * Component bounds cache
 */
let componentBoundsCache: Map<ComponentId, ComponentBounds> = new Map();

interface VisualEditorStore extends VisualEditorState {
  // Actions
  startDrag: (ids: ComponentId[], startX: number, startY: number) => void;
  updateDrag: (currentX: number, currentY: number) => void;
  endDrag: () => void;

  startResize: (id: ComponentId, handlePosition: string, startX: number, startY: number) => void;
  updateResize: (currentX: number, currentY: number) => void;
  endResize: () => void;

  updateSnapping: (state: Partial<SnappingState>) => void;

  setHovered: (id: ComponentId | null, position?: { x: number; y: number }) => void;
  showHoverOverlay: (show: boolean) => void;

  startSelectionBox: (startX: number, startY: number) => void;
  updateSelectionBox: (currentX: number, currentY: number) => void;
  endSelectionBox: () => void;

  updateKeyboardModifiers: (modifiers: Partial<KeyboardNavigationState['modifiers']>) => void;
  setKeyboardNavigationMode: (mode: 'tree' | 'spatial') => void;

  updateConfig: (config: Partial<VisualEditorConfig>) => void;
  reset: () => void;

  // Bounds management
  updateComponentBounds: (
    id: ComponentId,
    bounds: DOMRect,
    parentId?: ComponentId | null,
    depth?: number
  ) => void;
  getComponentBounds: (id: ComponentId) => DOMRect | null;
  getAllBounds: () => ComponentBounds[];
  clearBoundsCache: () => void;
}

export const useVisualEditorStore = create<VisualEditorStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    startDrag: (ids: ComponentId[], startX: number, startY: number) => {
      const originalPositions = new Map();
      ids.forEach((id) => {
        const bounds = getComponentBounds(id);
        if (bounds) {
          originalPositions.set(id, {
            x: bounds.left,
            y: bounds.top,
            width: bounds.width,
            height: bounds.height,
          });
        }
      });

      set(
        (state) => ({
          dragState: {
            ...state.dragState,
            isDragging: true,
            draggedIds: ids,
            dragStart: { x: startX, y: startY },
            dragCurrent: { x: startX, y: startY },
            dragOffset: { x: 0, y: 0 },
            originalPositions,
          },
          snappingState: {
            ...state.snappingState,
            isActive: true,
          },
        }),
        false,
        'startDrag'
      );

      eventBus.emit('visual:drag:start', { ids, startX, startY });
    },

    updateDrag: (currentX: number, currentY: number) => {
      const { dragState } = get();
      if (!dragState.isDragging) return;

      const dragOffset = {
        x: currentX - dragState.dragStart.x,
        y: currentY - dragState.dragStart.y,
      };

      set(
        (state) => ({
          dragState: {
            ...state.dragState,
            dragCurrent: { x: currentX, y: currentY },
            dragOffset,
          },
        }),
        false,
        'updateDrag'
      );

      eventBus.emit('visual:drag:update', { currentX, currentY, dragOffset });
    },

    endDrag: () => {
      set(
        (state) => ({
          dragState: {
            ...state.dragState,
            isDragging: false,
            draggedIds: [],
            dragOffset: { x: 0, y: 0 },
            originalPositions: new Map(),
          },
          snappingState: {
            ...state.snappingState,
            isActive: false,
            snappedX: null,
            snappedY: null,
            guides: [],
          },
        }),
        false,
        'endDrag'
      );

      eventBus.emit('visual:drag:end', null);
    },

    startResize: (id: ComponentId, handlePosition: string, startX: number, startY: number) => {
      const bounds = getComponentBounds(id);
      if (!bounds) return;

      set(
        (state) => ({
          resizeState: {
            ...state.resizeState,
            isResizing: true,
            resizingId: id,
            handlePosition: handlePosition as any,
            resizeStart: { x: startX, y: startY },
            resizeCurrent: { x: startX, y: startY },
            originalSize: {
              width: bounds.width,
              height: bounds.height,
              x: bounds.left,
              y: bounds.top,
            },
          },
          snappingState: {
            ...state.snappingState,
            isActive: true,
          },
        }),
        false,
        'startResize'
      );

      eventBus.emit('visual:resize:start', { id, handlePosition, startX, startY });
    },

    updateResize: (currentX: number, currentY: number) => {
      const { resizeState } = get();
      if (!resizeState.isResizing) return;

      set(
        (state) => ({
          resizeState: {
            ...state.resizeState,
            resizeCurrent: { x: currentX, y: currentY },
          },
        }),
        false,
        'updateResize'
      );

      eventBus.emit('visual:resize:update', { currentX, currentY });
    },

    endResize: () => {
      set(
        (state) => ({
          resizeState: {
            ...state.resizeState,
            isResizing: false,
            resizingId: null,
            handlePosition: null,
            originalSize: { width: 0, height: 0, x: 0, y: 0 },
          },
          snappingState: {
            ...state.snappingState,
            isActive: false,
            snappedWidth: null,
            snappedHeight: null,
            guides: [],
          },
        }),
        false,
        'endResize'
      );

      eventBus.emit('visual:resize:end', null);
    },

    updateSnapping: (updates: Partial<SnappingState>) => {
      set(
        (state) => ({
          snappingState: {
            ...state.snappingState,
            ...updates,
          },
        }),
        false,
        'updateSnapping'
      );
    },

    setHovered: (id: ComponentId | null, position?: { x: number; y: number }) => {
      set(
        (state) => ({
          hoverState: {
            ...state.hoverState,
            hoveredId: id,
            hoverPosition: position || null,
          },
        }),
        false,
        'setHovered'
      );

      eventBus.emit('visual:hover', { id, position });
    },

    showHoverOverlay: (show: boolean) => {
      set(
        (state) => ({
          hoverState: {
            ...state.hoverState,
            showOverlay: show,
          },
        }),
        false,
        'showHoverOverlay'
      );
    },

    startSelectionBox: (startX: number, startY: number) => {
      set(
        (state) => ({
          selectionBox: {
            ...state.selectionBox,
            start: { x: startX, y: startY },
            end: { x: startX, y: startY },
            isActive: true,
          },
        }),
        false,
        'startSelectionBox'
      );

      eventBus.emit('visual:selection-box:start', { startX, startY });
    },

    updateSelectionBox: (currentX: number, currentY: number) => {
      set(
        (state) => ({
          selectionBox: {
            ...state.selectionBox,
            end: { x: currentX, y: currentY },
          },
        }),
        false,
        'updateSelectionBox'
      );

      eventBus.emit('visual:selection-box:update', { currentX, currentY });
    },

    endSelectionBox: () => {
      set(
        (state) => ({
          selectionBox: {
            ...state.selectionBox,
            isActive: false,
          },
        }),
        false,
        'endSelectionBox'
      );

      eventBus.emit('visual:selection-box:end', null);
    },

    updateKeyboardModifiers: (modifiers: Partial<KeyboardNavigationState['modifiers']>) => {
      set(
        (state) => ({
          keyboardNavigation: {
            ...state.keyboardNavigation,
            modifiers: {
              ...state.keyboardNavigation.modifiers,
              ...modifiers,
            },
          },
        }),
        false,
        'updateKeyboardModifiers'
      );
    },

    setKeyboardNavigationMode: (mode: 'tree' | 'spatial') => {
      set(
        (state) => ({
          keyboardNavigation: {
            ...state.keyboardNavigation,
            navigationMode: mode,
          },
        }),
        false,
        'setKeyboardNavigationMode'
      );
    },

    updateConfig: (config: Partial<VisualEditorConfig>) => {
      set(
        (state) => ({
          config: {
            ...state.config,
            ...config,
            // Deep merge nested objects
            resizeHandles: { ...state.config.resizeHandles, ...config.resizeHandles },
            dragHandles: { ...state.config.dragHandles, ...config.dragHandles },
            alignmentGuides: { ...state.config.alignmentGuides, ...config.alignmentGuides },
            snapping: { ...state.config.snapping, ...config.snapping },
            hoverOverlay: { ...state.config.hoverOverlay, ...config.hoverOverlay },
            selectionOutlines: { ...state.config.selectionOutlines, ...config.selectionOutlines },
            breadcrumbs: { ...state.config.breadcrumbs, ...config.breadcrumbs },
            smartSpacing: { ...state.config.smartSpacing, ...config.smartSpacing },
            multiSelect: { ...state.config.multiSelect, ...config.multiSelect },
            keyboardNavigation: {
              ...state.config.keyboardNavigation,
              ...config.keyboardNavigation,
            },
            performance: { ...state.config.performance, ...config.performance },
          },
        }),
        false,
        'updateConfig'
      );
    },

    reset: () => {
      set(initialState, false, 'reset');
      clearBoundsCache();
      eventBus.emit('visual:reset', null);
    },

    updateComponentBounds: (
      id: ComponentId,
      bounds: DOMRect,
      parentId?: ComponentId | null,
      depth?: number
    ) => {
      componentBoundsCache.set(id, {
        id,
        bounds,
        parentId: parentId || null,
        depth: depth || 0,
        isVisible: bounds.width > 0 && bounds.height > 0,
      });
    },

    getComponentBounds: (id: ComponentId) => {
      const cached = componentBoundsCache.get(id);
      return cached ? cached.bounds : null;
    },

    getAllBounds: () => {
      return Array.from(componentBoundsCache.values());
    },

    clearBoundsCache: () => {
      componentBoundsCache.clear();
    },
  }))
);

// Helper function to get bounds from cache
function getComponentBounds(id: ComponentId): DOMRect | null {
  const cached = componentBoundsCache.get(id);
  return cached ? cached.bounds : null;
}

// Selectors with shallow equality for optimized re-renders
export const visualEditorSelectors = {
  dragState: (state: VisualEditorState) => state.dragState,
  resizeState: (state: VisualEditorState) => state.resizeState,
  snappingState: (state: VisualEditorState) => state.snappingState,
  hoverState: (state: VisualEditorState) => state.hoverState,
  selectionBox: (state: VisualEditorState) => state.selectionBox,
  keyboardNavigation: (state: VisualEditorState) => state.keyboardNavigation,
  config: (state: VisualEditorState) => state.config,

  // Compound selectors
  isActive: (state: VisualEditorState) =>
    state.dragState.isDragging || state.resizeState.isResizing || state.selectionBox.isActive,

  hasHover: (state: VisualEditorState) => state.hoverState.hoveredId !== null,
};

// Custom hooks for common selections
export const useDragState = () => useVisualEditorStore(visualEditorSelectors.dragState);
export const useResizeState = () => useVisualEditorStore(visualEditorSelectors.resizeState);
export const useSnappingState = () => useVisualEditorStore(visualEditorSelectors.snappingState);
export const useHoverState = () => useVisualEditorStore(visualEditorSelectors.hoverState);
export const useSelectionBox = () => useVisualEditorStore(visualEditorSelectors.selectionBox);
export const useKeyboardNavigation = () =>
  useVisualEditorStore(visualEditorSelectors.keyboardNavigation);
export const useVisualEditorConfig = () => useVisualEditorStore(visualEditorSelectors.config);
export const useIsVisualEditorActive = () => useVisualEditorStore(visualEditorSelectors.isActive);
export const useHasHover = () => useVisualEditorStore(visualEditorSelectors.hasHover);
