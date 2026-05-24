/**
 * Drag Actions
 *
 * Actions for handling drag operations in the visual editor
 */
import { ComponentId } from '@wysiwyg/core';
import { eventBus } from '../../stores/events';
import { getComponentBounds } from '../utils/componentBounds';
import { VisualEditorState } from '../types';

export function createDragActions(
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
    startDrag: (ids: ComponentId[], startX: number, startY: number) => {
      const originalPositions = new Map<
        ComponentId,
        { x: number; y: number; width: number; height: number }
      >();
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
        (state: VisualEditorState) => ({
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
        false
      );

      eventBus.emit('visual:drag:start', { ids, startX, startY });
    },

    updateDrag: (currentX: number, currentY: number) => {
      const { dragState } = get();
      if (dragState.isDragging === false) return;

      const dragOffset = {
        x: currentX - dragState.dragStart.x,
        y: currentY - dragState.dragStart.y,
      };

      set(
        (state: VisualEditorState) => ({
          dragState: {
            ...state.dragState,
            dragCurrent: { x: currentX, y: currentY },
            dragOffset,
          },
        }),
        false
      );

      eventBus.emit('visual:drag:update', { currentX, currentY, dragOffset });
    },

    endDrag: () => {
      set(
        (state: VisualEditorState) => ({
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
        false
      );

      eventBus.emit('visual:drag:end', null);
    },
  };
}
