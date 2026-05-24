/**
 * Resize Actions
 *
 * Actions for handling resize operations in the visual editor
 */
import { ComponentId } from '@wysiwyg/core';
import { eventBus } from '../../stores/events';
import { getComponentBounds } from '../utils/componentBounds';
import { VisualEditorState, HandlePosition } from '../types';

export function createResizeActions(
  set: (
    partial:
      | VisualEditorState
      | Partial<VisualEditorState>
      | ((state: VisualEditorState) => VisualEditorState | Partial<VisualEditorState>),
    replace?: boolean | undefined
  ) => void,
  get: () => VisualEditorState
) {
  return {
    startResize: (
      id: ComponentId,
      handlePosition: HandlePosition,
      startX: number,
      startY: number
    ) => {
      const bounds = getComponentBounds(id);
      if (bounds === null) return;

      set(
        (state: VisualEditorState) => ({
          resizeState: {
            ...state.resizeState,
            isResizing: true,
            resizingId: id,
            handlePosition: handlePosition,
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
        false
      );

      eventBus.emit('visual:resize:start', { id, handlePosition, startX, startY });
    },

    updateResize: (currentX: number, currentY: number) => {
      const { resizeState } = get();
      if (resizeState.isResizing === false) return;

      set(
        (state: VisualEditorState) => ({
          resizeState: {
            ...state.resizeState,
            resizeCurrent: { x: currentX, y: currentY },
          },
        }),
        false
      );

      eventBus.emit('visual:resize:update', { currentX, currentY });
    },

    endResize: () => {
      set(
        (state: VisualEditorState) => ({
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
        false
      );

      eventBus.emit('visual:resize:end', null);
    },
  };
}
