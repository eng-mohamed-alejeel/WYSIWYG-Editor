/**
 * Visual Editor Types
 *
 * Type definitions for the professional visual editing system
 * Following Figma and Webflow UX patterns
 */

import { ComponentId } from '@wysiwyg/core';

/**
 * Rectangle interface for geometric calculations
 */
export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  x: number;
  y: number;
  toJSON(): object;
}

/**
 * Handle positions for resize operations
 */
export type HandlePosition = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';

/**
 * Resize handle configuration
 */
export interface ResizeHandle {
  position: HandlePosition;
  cursor: string;
  size: number;
  color: string;
}

/**
 * Drag state
 */
export interface DragState {
  isDragging: boolean;
  draggedIds: ComponentId[];
  dragStart: { x: number; y: number };
  dragCurrent: { x: number; y: number };
  dragOffset: { x: number; y: number };
  originalPositions: Map<ComponentId, { x: number; y: number; width: number; height: number }>;
}

/**
 * Resize state
 */
export interface ResizeState {
  isResizing: boolean;
  resizingId: ComponentId | null;
  handlePosition: HandlePosition | null;
  resizeStart: { x: number; y: number };
  resizeCurrent: { x: number; y: number };
  originalSize: { width: number; height: number; x: number; y: number };
}

/**
 * Alignment guide
 */
export interface AlignmentGuide {
  type: 'horizontal' | 'vertical';
  position: number;
  start: number;
  end: number;
  color: string;
  strength: 'strong' | 'weak';
}

/**
 * Snapping configuration
 */
export interface SnappingConfig {
  enabled: boolean;
  threshold: number;
  snapToEdges: boolean;
  snapToCenter: boolean;
  snapToSpacing: boolean;
  snapToGuides: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

/**
 * Snapping state
 */
export interface SnappingState {
  isActive: boolean;
  snappedX: number | null;
  snappedY: number | null;
  snappedWidth: number | null;
  snappedHeight: number | null;
  guides: AlignmentGuide[];
}

/**
 * Smart spacing indicator
 */
export interface SmartSpacingIndicator {
  position: { x: number; y: number };
  value: number;
  unit: string;
  type: 'margin' | 'padding' | 'gap';
  direction: 'horizontal' | 'vertical';
}

/**
 * Selection box for multi-select
 */
export interface SelectionBox {
  start: { x: number; y: number };
  end: { x: number; y: number };
  isActive: boolean;
}

/**
 * Hover state
 */
export interface HoverState {
  hoveredId: ComponentId | null;
  hoverPosition: { x: number; y: number } | null;
  showOverlay: boolean;
  isHovering: boolean;
}

/**
 * Selection outline configuration
 */
export interface SelectionOutline {
  id: ComponentId;
  bounds: Rect;
  isSelected: boolean;
  isHovered: boolean;
  isFocused: boolean;
  zIndex: number;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  id: ComponentId;
  name: string;
  type: string;
  depth: number;
}

/**
 * Keyboard navigation state
 */
export interface KeyboardNavigationState {
  isEnabled: boolean;
  focusedId: ComponentId | null;
  navigationMode: 'tree' | 'spatial';
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  };
}

/**
 * Visual editor configuration
 */
export interface VisualEditorConfig {
  // Resize handles
  resizeHandles: {
    enabled: boolean;
    size: number;
    color: string;
    hoverColor: string;
  };

  // Drag handles
  dragHandles: {
    enabled: boolean;
    size: number;
    color: string;
  };

  // Alignment guides
  alignmentGuides: {
    enabled: boolean;
    color: string;
    strongColor: string;
    opacity: number;
  };

  // Snapping
  snapping: SnappingConfig;

  // Hover overlay
  hoverOverlay: {
    enabled: boolean;
    color: string;
    opacity: number;
    transition: number;
  };

  // Selection outlines
  selectionOutlines: {
    enabled: boolean;
    color: string;
    hoverColor: string;
    focusColor: string;
    multiSelectColor: string;
    borderWidth: number;
  };

  // Breadcrumbs
  breadcrumbs: {
    enabled: boolean;
    maxDepth: number;
    showComponentTypes: boolean;
  };

  // Smart spacing
  smartSpacing: {
    enabled: boolean;
    showOnHover: boolean;
    showOnDrag: boolean;
    color: string;
    fontSize: number;
  };

  // Multi-select
  multiSelect: {
    enabled: boolean;
    selectionBoxColor: string;
    selectionBoxOpacity: number;
  };

  // Keyboard navigation
  keyboardNavigation: {
    enabled: boolean;
    shortcuts: Record<string, string>;
  };

  // Performance
  performance: {
    throttleDelay: number;
    debounceDelay: number;
    renderThreshold: number;
  };
}

/**
 * Visual editor state
 */
export interface VisualEditorState {
  dragState: DragState;
  resizeState: ResizeState;
  snappingState: SnappingState;
  hoverState: HoverState;
  selectionBox: SelectionBox;
  keyboardNavigation: KeyboardNavigationState;
  config: VisualEditorConfig;
}

/**
 * Component bounds cache
 */
export interface ComponentBounds {
  id: ComponentId;
  bounds: Rect;
  parentId: ComponentId | null;
  depth: number;
  isVisible: boolean;
}

/**
 * Visual editor context
 */
export interface VisualEditorContext {
  state: VisualEditorState;
  getComponentBounds: (id: ComponentId) => Rect | null;
  getAllBounds: () => ComponentBounds[];
  updateComponentBounds: (id: ComponentId, bounds: Rect) => void;
  findSnapTargets: (bounds: Rect) => AlignmentGuide[];
  calculateSmartSpacing: (id: ComponentId) => SmartSpacingIndicator[];
  getBreadcrumbs: (id: ComponentId) => BreadcrumbItem[];
}

/**
 * Visual editor event types
 */
export type VisualEditorEventType =
  | 'visual:drag:start'
  | 'visual:drag:update'
  | 'visual:drag:end'
  | 'visual:resize:start'
  | 'visual:resize:update'
  | 'visual:resize:end'
  | 'visual:hover'
  | 'visual:selection-box:start'
  | 'visual:selection-box:update'
  | 'visual:selection-box:end'
  | 'visual:reset';

/**
 * Visual editor event payload types
 */
export interface VisualEditorEventPayloads {
  'visual:drag:start': { ids: ComponentId[]; startX: number; startY: number };
  'visual:drag:update': {
    currentX: number;
    currentY: number;
    dragOffset: { x: number; y: number };
  };
  'visual:drag:end': null;
  'visual:resize:start': {
    id: ComponentId;
    handlePosition: HandlePosition;
    startX: number;
    startY: number;
  };
  'visual:resize:update': { currentX: number; currentY: number };
  'visual:resize:end': null;
  'visual:hover': { id: ComponentId | null; position?: { x: number; y: number } };
  'visual:selection-box:start': { startX: number; startY: number };
  'visual:selection-box:update': { currentX: number; currentY: number };
  'visual:selection-box:end': null;
  'visual:reset': null;
}
