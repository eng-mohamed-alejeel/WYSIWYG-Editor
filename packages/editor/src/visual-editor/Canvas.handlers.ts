/**
 * Canvas Event Handlers
 */

import { useCallback } from 'react';
import { useVisualEditorStore } from './visualEditorStore';
import { ComponentId } from '@wysiwyg/core';
import { calculateAlignmentGuides, clamp } from './utils';
import { ViewportState } from './Canvas.types';
import {
  DragState,
  ResizeState,
  SelectionBox,
  HoverState,
  KeyboardNavigationState,
  VisualEditorConfig,
  ComponentBounds,
  Rect,
} from './types';

/**
 * Mouse down handler for selection and drag
 */
export function useMouseDownHandler(
  _viewport: ViewportState,
  setViewport: React.Dispatch<React.SetStateAction<ViewportState>>,
  keyboardNavigation: KeyboardNavigationState,
  editorState: { selection: { selectedIds: string[] } },
  updateSelection: (selection: { selectedIds: string[] }) => void
) {
  return useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const componentId = target
        .closest('[data-component-id]')
        ?.getAttribute('data-component-id') as ComponentId | null;

      // Middle mouse button or space + click for panning
      const mouseEvent = e as React.MouseEvent & { code?: string };
      if (e.button === 1 || (e.button === 0 && mouseEvent.code === 'Space')) {
        setViewport((prev) => ({
          ...prev,
          isPanning: true,
          panStart: { x: e.clientX - prev.pan.x, y: e.clientY - prev.pan.y },
        }));
        return;
      }

      // Multi-select with Ctrl/Cmd
      if (componentId !== null && keyboardNavigation.modifiers.ctrl === true) {
        const selectedIds = editorState.selection.selectedIds;
        const newSelection = selectedIds.includes(componentId)
          ? selectedIds.filter((id: string) => id !== componentId)
          : [...selectedIds, componentId];

        updateSelection({ selectedIds: newSelection });
        return;
      }

      // Single selection
      if (componentId !== null) {
        updateSelection({ selectedIds: [componentId] });

        const bounds = useVisualEditorStore.getState().getComponentBounds(componentId);
        if (bounds) {
          useVisualEditorStore.getState().startDrag([componentId], e.clientX, e.clientY);
        }
      } else if (!e.defaultPrevented) {
        // Start selection box
        useVisualEditorStore.getState().startSelectionBox(e.clientX, e.clientY);
      }
    },
    [setViewport, keyboardNavigation.modifiers, editorState.selection.selectedIds, updateSelection]
  );
}

/**
 * Mouse move handler for drag, resize, and pan
 */
export function useMouseMoveHandler(
  viewport: ViewportState,
  setViewport: React.Dispatch<React.SetStateAction<ViewportState>>,
  dragState: DragState,
  resizeState: ResizeState,
  selectionBox: SelectionBox,
  hoverState: HoverState,
  config: VisualEditorConfig,
  updateSelection: (selection: { selectedIds: string[] }) => void
) {
  return useCallback(
    (e: React.MouseEvent) => {
      // Panning
      if (viewport.isPanning) {
        setViewport((prev) => ({
          ...prev,
          pan: {
            x: e.clientX - prev.panStart.x,
            y: e.clientY - prev.panStart.y,
          },
        }));
        return;
      }

      // Dragging
      if (dragState.isDragging === true) {
        useVisualEditorStore.getState().updateDrag(e.clientX, e.clientY);

        // Calculate alignment guides
        const { getComponentBounds, getAllBounds } = useVisualEditorStore.getState();
        const allBounds = getAllBounds();

        dragState.draggedIds.forEach((id: string) => {
          const bounds = getComponentBounds(id);
          if (bounds) {
            const otherBounds = allBounds
              .filter((b: ComponentBounds) => b.id !== id)
              .map((b: ComponentBounds) => b.bounds);

            const guides = calculateAlignmentGuides(bounds, otherBounds, config.snapping.threshold);

            useVisualEditorStore.getState().updateSnapping({ guides });
          }
        });

        return;
      }

      // Resizing
      if (resizeState.isResizing === true) {
        useVisualEditorStore.getState().updateResize(e.clientX, e.clientY);
        return;
      }

      // Selection box
      if (selectionBox.isActive === true) {
        useVisualEditorStore.getState().updateSelectionBox(e.clientX, e.clientY);

        // Calculate selection
        const selectionRect = {
          left: Math.min(selectionBox.start.x, e.clientX),
          top: Math.min(selectionBox.start.y, e.clientY),
          right: Math.max(selectionBox.start.x, e.clientX),
          bottom: Math.max(selectionBox.start.y, e.clientY),
          width: Math.abs(e.clientX - selectionBox.start.x),
          height: Math.abs(e.clientY - selectionBox.start.y),
          x: Math.min(selectionBox.start.x, e.clientX),
          y: Math.min(selectionBox.start.y, e.clientY),
        } as Rect;

        const { getAllBounds } = useVisualEditorStore.getState();
        const selectedIds = getAllBounds()
          .filter((b: ComponentBounds) => {
            const bounds = b.bounds;
            return (
              bounds.left >= selectionRect.left &&
              bounds.right <= selectionRect.right &&
              bounds.top >= selectionRect.top &&
              bounds.bottom <= selectionRect.bottom
            );
          })
          .map((b: ComponentBounds) => b.id);

        updateSelection({ selectedIds });
        return;
      }

      // Hover detection
      const target = e.target as HTMLElement;
      const componentId = target
        .closest('[data-component-id]')
        ?.getAttribute('data-component-id') as ComponentId | null;

      if (componentId !== null && componentId !== hoverState.hoveredId) {
        useVisualEditorStore.getState().setHovered(componentId, { x: e.clientX, y: e.clientY });
      }
    },
    [
      setViewport,
      viewport.isPanning,
      dragState,
      resizeState,
      selectionBox,
      hoverState,
      config,
      updateSelection,
    ]
  );
}

/**
 * Mouse up handler
 */
export function useMouseUpHandler(
  viewport: ViewportState,
  setViewport: React.Dispatch<React.SetStateAction<ViewportState>>,
  dragState: DragState,
  resizeState: ResizeState,
  selectionBox: SelectionBox
) {
  return useCallback(() => {
    if (viewport.isPanning === true) {
      setViewport((prev) => ({ ...prev, isPanning: false }));
    }

    if (dragState.isDragging === true) {
      useVisualEditorStore.getState().endDrag();
    }

    if (resizeState.isResizing === true) {
      useVisualEditorStore.getState().endResize();
    }

    if (selectionBox.isActive === true) {
      useVisualEditorStore.getState().endSelectionBox();
    }
  }, [setViewport, viewport.isPanning, dragState, resizeState, selectionBox]);
}

/**
 * Keyboard handler
 */
export function useKeyboardHandler(
  keyboardNavigation: KeyboardNavigationState,
  editorState: { selection: { selectedIds: string[] } },
  updateSelection: (selection: { selectedIds: string[] }) => void,
  setViewport: React.Dispatch<React.SetStateAction<ViewportState>>
) {
  return useCallback(
    (e: KeyboardEvent) => {
      const { modifiers } = keyboardNavigation;
      const selectedIds = editorState.selection.selectedIds;

      // Update modifier keys
      useVisualEditorStore.getState().updateKeyboardModifiers({
        shift: e.shiftKey,
        ctrl: e.ctrlKey || e.metaKey,
        alt: e.altKey,
        meta: e.metaKey,
      });

      // Keyboard navigation
      if (selectedIds.length > 0) {
        const { getComponentBounds } = useVisualEditorStore.getState();

        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            selectedIds.forEach((id: string) => {
              const bounds = getComponentBounds(id);
              if (bounds) {
                // Update component position (would need to integrate with component store)
              }
            });
            break;
          case 'ArrowDown':
            e.preventDefault();
            selectedIds.forEach((id: string) => {
              const bounds = getComponentBounds(id);
              if (bounds) {
                // Update component position
              }
            });
            break;
          case 'ArrowLeft':
            e.preventDefault();
            selectedIds.forEach((id: string) => {
              const bounds = getComponentBounds(id);
              if (bounds) {
                // Update component position
              }
            });
            break;
          case 'ArrowRight':
            e.preventDefault();
            selectedIds.forEach((id: string) => {
              const bounds = getComponentBounds(id);
              if (bounds) {
                // Update component position
              }
            });
            break;
          case 'Delete':
          case 'Backspace':
            if (modifiers.ctrl === false) {
              e.preventDefault();
              // Delete selected components
            }
            break;
          case 'Escape':
            e.preventDefault();
            updateSelection({ selectedIds: [] });
            break;
        }
      }

      // Zoom shortcuts
      if ((modifiers.ctrl === true || modifiers.meta === true) && modifiers.alt === false) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            setViewport((prev) => ({
              ...prev,
              zoom: clamp(prev.zoom + 0.1, 0.1, 5),
            }));
            break;
          case '-':
            e.preventDefault();
            setViewport((prev) => ({
              ...prev,
              zoom: clamp(prev.zoom - 0.1, 0.1, 5),
            }));
            break;
          case '0':
            e.preventDefault();
            setViewport({
              zoom: 1,
              pan: { x: 0, y: 0 },
              isPanning: false,
              panStart: { x: 0, y: 0 },
            });
            break;
        }
      }
    },
    [setViewport, keyboardNavigation, editorState.selection.selectedIds, updateSelection]
  );
}

/**
 * Wheel handler for zoom
 */
export function useWheelHandler(
  _keyboardNavigation: KeyboardNavigationState,
  setViewport: React.Dispatch<React.SetStateAction<ViewportState>>
) {
  return useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = -Math.sign(e.deltaY) * 0.1;
        setViewport((prev) => ({
          ...prev,
          zoom: clamp(prev.zoom + delta, 0.1, 5),
        }));
      } else if ((e as WheelEvent & { code?: string }).code === 'Space') {
        e.preventDefault();
        setViewport((prev) => ({
          ...prev,
          pan: {
            x: prev.pan.x - e.deltaX,
            y: prev.pan.y - e.deltaY,
          },
        }));
      }
    },
    [setViewport]
  );
}
