/**
 * Editor Context Hook
 *
 * Provides access to editor state and actions
 */

import { ComponentNode, Command } from '@wysiwyg/core';
import { EditorState } from '../../types';
import { useEditorCommands } from './useEditorCommands';
import { useComponentOperations } from './useComponentOperations';
import { useClipboardOperations } from './useClipboardOperations';
import { useSelectionOperations } from './useSelectionOperations';
import { DEFAULT_CONFIG } from '../config/editorConfig';

export const useEditorContext = () => {
  // Get state from stores
  const project = useEditorStore((state: EditorStoreState) => state.project);
  const currentPageId = useEditorStore((state: EditorStoreState) => state.currentPageId);
  const isDirty = useEditorStore((state: EditorStoreState) => state.isDirty);
  const isPreviewMode = useEditorStore((state: EditorStoreState) => state.isPreviewMode);

  const { selectedIds, hoveredId, focusedId } = useSelectionStore((state: SelectionStoreState) => ({
    selectedIds: state.selectedIds,
    hoveredId: state.hoveredId,
    focusedId: state.focusedId,
  }));

  const { breakpoint, zoom } = useViewportStore((state: ViewportStoreState) => ({
    breakpoint: state.breakpoint,
    zoom: state.zoom,
  }));

  const { past, present, future, maxSize } = useHistoryStore((state: HistoryStoreState) => ({
    past: state.past,
    present: state.present,
    future: state.future,
    maxSize: state.maxSize,
  }));

  const items = useClipboardStore((state: ClipboardStoreState) => state.items);
  const clipboard = items
    .filter((item: ClipboardItem) => item.type === 'component')
    .map((item: ClipboardItem) => item.data as ComponentNode);

  // Get actions from custom hooks
  const { executeCommand, undo, redo } = useEditorCommands();
  const { updateComponent, deleteComponent, duplicateComponent } = useComponentOperations();
  const { copyComponent, pasteComponents } = useClipboardOperations();
  const { updateSelection } = useSelectionOperations();

  // Combine state
  const state: EditorState = {
    project,
    currentPageId,
    selection: {
      selectedIds,
      hoveredId,
      focusedId,
    },
    history: {
      past: past as Command[],
      present: present as Command | null,
      future: future as Command[],
      maxSize,
    },
    isDirty,
    isPreviewMode,
    currentBreakpoint: breakpoint,
    zoom,
    clipboard,
  };

  return {
    state,
    config: DEFAULT_CONFIG,
    executeCommand,
    undo,
    redo,
    updateSelection,
    updateComponent,
    deleteComponent,
    duplicateComponent,
    copyComponent,
    pasteComponents,
  };
};
