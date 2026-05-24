/**
 * Default configuration following Figma and Webflow patterns
 */
import { VisualEditorConfig } from '../types';

export const DEFAULT_CONFIG: VisualEditorConfig = {
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
