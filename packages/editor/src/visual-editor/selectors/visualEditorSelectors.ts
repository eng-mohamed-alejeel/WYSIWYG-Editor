/**
 * Visual Editor Selectors
 *
 * Provides optimized selectors with shallow equality for efficient re-renders
 */
import { VisualEditorState } from '../types';

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
