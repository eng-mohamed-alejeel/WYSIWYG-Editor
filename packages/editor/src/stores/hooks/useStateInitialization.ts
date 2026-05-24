/**
 * State Initialization Hook
 *
 * Handles initialization of editor state from props
 */

import { useEffect } from 'react';
import { EditorState } from '../../types';

export const useStateInitialization = (initialState?: Partial<EditorState>) => {
  useEffect(() => {
    if (!initialState) return;

    // Hydrate editor store
    if (initialState.project) {
      void import('../editorStore').then(({ useEditorStore }) => {
        void useEditorStore.getState().setProject(initialState.project ?? null);
      });
    }

    if (initialState.currentPageId) {
      void import('../editorStore').then(({ useEditorStore }) => {
        void useEditorStore.getState().setCurrentPage(initialState.currentPageId ?? null);
      });
    }

    // Hydrate selection store
    if (initialState.selection) {
      void import('../selectionStore').then(({ useSelectionStore }) => {
        const { selectedIds, hoveredId, focusedId } = initialState.selection;
        if (selectedIds.length > 0) {
          void useSelectionStore.getState().selectComponent(selectedIds[0]);
        }
        if (hoveredId) {
          void useSelectionStore.getState().setHovered(hoveredId);
        }
        if (focusedId) {
          void useSelectionStore.getState().setFocused(focusedId);
        }
      });
    }

    // Hydrate viewport store
    if (initialState.currentBreakpoint) {
      void import('../viewportStore').then(({ useViewportStore }) => {
        void useViewportStore.getState().setBreakpoint(initialState.currentBreakpoint);
      });
    }

    if (initialState.zoom) {
      void import('../viewportStore').then(({ useViewportStore }) => {
        void useViewportStore.getState().setZoom(initialState.zoom);
      });
    }

    // Hydrate clipboard store
    if (initialState.clipboard) {
      void import('../clipboardStore').then(({ useClipboardStore }) => {
        void useClipboardStore.getState().copy(
          initialState.clipboard!.map((item) => ({
            id: `clipboard_${Date.now()}_${Math.random()}`,
            type: 'component' as const,
            data: item,
          }))
        );
      });
    }
  }, [initialState]);
};
