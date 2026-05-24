/**
 * Interaction Actions
 *
 * Actions for handling various user interactions in the visual editor
 */
import { ComponentId } from '@wysiwyg/core';
import {
  SnappingState,
  KeyboardNavigationState,
  VisualEditorConfig,
  VisualEditorState,
} from '../types';
import { eventBus } from '../../stores/events';

export function createInteractionActions(
  set: (
    partial:
      | VisualEditorState
      | Partial<VisualEditorState>
      | ((state: VisualEditorState) => VisualEditorState | Partial<VisualEditorState>),
    replace?: boolean | undefined
  ) => void
) {
  return {
    updateSnapping: (updates: Partial<SnappingState>) => {
      set(
        (state: VisualEditorState) => ({
          snappingState: {
            ...state.snappingState,
            ...updates,
          },
        }),
        false
      );
    },

    setHovered: (id: ComponentId | null, position?: { x: number; y: number }) => {
      set(
        (state: VisualEditorState) => ({
          hoverState: {
            ...state.hoverState,
            hoveredId: id,
            hoverPosition: position ?? null,
          },
        }),
        false
      );

      eventBus.emit('visual:hover', { id, position });
    },

    showHoverOverlay: (show: boolean) => {
      set(
        (state: VisualEditorState) => ({
          hoverState: {
            ...state.hoverState,
            showOverlay: show,
          },
        }),
        false
      );
    },

    startSelectionBox: (startX: number, startY: number) => {
      set(
        (state: VisualEditorState) => ({
          selectionBox: {
            ...state.selectionBox,
            start: { x: startX, y: startY },
            end: { x: startX, y: startY },
            isActive: true,
          },
        }),
        false
      );

      eventBus.emit('visual:selection-box:start', { startX, startY });
    },

    updateSelectionBox: (currentX: number, currentY: number) => {
      set(
        (state: VisualEditorState) => ({
          selectionBox: {
            ...state.selectionBox,
            end: { x: currentX, y: currentY },
          },
        }),
        false
      );

      eventBus.emit('visual:selection-box:update', { currentX, currentY });
    },

    endSelectionBox: () => {
      set(
        (state: VisualEditorState) => ({
          selectionBox: {
            ...state.selectionBox,
            isActive: false,
          },
        }),
        false
      );

      eventBus.emit('visual:selection-box:end', null);
    },

    updateKeyboardModifiers: (modifiers: Partial<KeyboardNavigationState['modifiers']>) => {
      set(
        (state: VisualEditorState) => ({
          keyboardNavigation: {
            ...state.keyboardNavigation,
            modifiers: {
              ...state.keyboardNavigation.modifiers,
              ...modifiers,
            },
          },
        }),
        false
      );
    },

    setKeyboardNavigationMode: (mode: 'tree' | 'spatial') => {
      set(
        (state: VisualEditorState) => ({
          keyboardNavigation: {
            ...state.keyboardNavigation,
            navigationMode: mode,
          },
        }),
        false
      );
    },

    updateConfig: (config: Partial<VisualEditorConfig>) => {
      set(
        (state: VisualEditorState) => ({
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
        false
      );
    },
  };
}
