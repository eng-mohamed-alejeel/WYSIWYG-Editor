/**
 * Initial state for the visual editor
 */
import { VisualEditorState } from '../types';
import { DEFAULT_CONFIG } from './defaultConfig';

export const initialState: VisualEditorState = {
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
    isHovering: false,
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
