/**
 * State Changes Hook
 *
 * Handles state change notifications and subscriptions
 */

import { useEffect } from 'react';
import { EditorState, Command } from '../../types';
import { ComponentNode } from '@wysiwyg/core';

export const useStateChanges = (onStateChange?: (state: EditorState) => void) => {
  useEffect(() => {
    if (!onStateChange) return () => {};

    const handleStateChange = () => {
      // Collect state from all stores
      Promise.all([
        import('../editorStore').then((m) => m.useEditorStore.getState()),
        import('../selectionStore').then((m) => m.useSelectionStore.getState()),
        import('../viewportStore').then((m) => m.useViewportStore.getState()),
        import('../historyStore').then((m) => m.useHistoryStore.getState()),
        import('../clipboardStore').then((m) => m.useClipboardStore.getState()),
      ]).then(([editorState, selectionState, viewportState, historyState, clipboardState]) => {
        const combinedState: EditorState = {
          project: editorState.project,
          currentPageId: editorState.currentPageId,
          selection: {
            selectedIds: selectionState.selectedIds,
            hoveredId: selectionState.hoveredId,
            focusedId: selectionState.focusedId,
          },
          history: {
            past: historyState.past as Command[],
            present: historyState.present as Command | null,
            future: historyState.future as Command[],
            maxSize: historyState.maxSize,
          },
          isDirty: editorState.isDirty,
          isPreviewMode: editorState.isPreviewMode,
          currentBreakpoint: viewportState.breakpoint,
          zoom: viewportState.zoom,
          clipboard: clipboardState.items
            .filter((item) => item.type === 'component')
            .map((item) => item.data as ComponentNode),
        };

        onStateChange(combinedState);
      });
    };

    // Subscribe to store changes
    const unsubscribes = Promise.all([
      import('../editorStore').then((m) => m.useEditorStore.subscribe(handleStateChange)),
      import('../selectionStore').then((m) => m.useSelectionStore.subscribe(handleStateChange)),
      import('../viewportStore').then((m) => m.useViewportStore.subscribe(handleStateChange)),
      import('../historyStore').then((m) => m.useHistoryStore.subscribe(handleStateChange)),
      import('../clipboardStore').then((m) => m.useClipboardStore.subscribe(handleStateChange)),
    ]);

    return () => {
      unsubscribes.then((unsubs) => {
        unsubs.forEach((unsub) => unsub());
      });
    };
  }, [onStateChange]);
};
