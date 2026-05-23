/**
 * State Management Integration
 *
 * Provides integration layer between the new state management system
 * and existing components. Ensures backward compatibility while
 * enabling gradual migration to the new system.
 */

import React from 'react';
import { ComponentId, ComponentNode, Command } from '@wysiwyg/core';
import {
  useEditorStore,
  useSelectionStore,
  useViewportStore,
  useHistoryStore,
  useAssetsStore,
  useClipboardStore,
} from './index';
import { eventBus } from './events';
import { findComponentById, updateComponentById, deleteComponentById } from './utils';

/**
 * Combined editor state for backward compatibility
 */
export interface EditorState {
  project: any;
  currentPageId: ComponentId | null;
  selection: {
    selectedIds: ComponentId[];
    hoveredId: ComponentId | null;
    focusedId: ComponentId | null;
  };
  history: {
    past: Command[];
    present: Command | null;
    future: Command[];
    maxSize: number;
  };
  isDirty: boolean;
  isPreviewMode: boolean;
  currentBreakpoint: string;
  zoom: number;
  clipboard: ComponentNode[];
}

/**
 * Legacy editor context interface for backward compatibility
 */
export interface EditorContext {
  state: EditorState;
  executeCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  updateSelection: (selection: Partial<any>) => void;
  updateComponent: (id: ComponentId, updates: Partial<ComponentNode>) => void;
  deleteComponent: (id: ComponentId) => void;
  duplicateComponent: (id: ComponentId) => void;
  copyComponent: (id: ComponentId) => void;
  pasteComponents: () => void;
}

/**
 * Hook that provides backward-compatible editor context
 * Bridges the new store system with legacy components
 */
export const useLegacyEditorContext = (): EditorContext => {
  // Get state from individual stores
  const project = useEditorStore((state) => state.project);
  const currentPageId = useEditorStore((state) => state.currentPageId);
  const isDirty = useEditorStore((state) => state.isDirty);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

  const selection = useSelectionStore((state) => ({
    selectedIds: state.selectedIds,
    hoveredId: state.hoveredId,
    focusedId: state.focusedId,
  }));

  const breakpoint = useViewportStore((state) => state.breakpoint);
  const zoom = useViewportStore((state) => state.zoom);

  const history = useHistoryStore((state) => ({
    past: state.past as Command[],
    present: state.present as Command | null,
    future: state.future as Command[],
    maxSize: state.maxSize,
  }));

  const clipboard = useClipboardStore((state) =>
    state.items
      .filter((item) => item.type === 'component')
      .map((item) => item.data as ComponentNode)
  );

  // Get actions from stores
  const selectComponent = useSelectionStore((state) => state.selectComponent);
  const deselectAll = useSelectionStore((state) => state.deselectAll);

  const setBreakpoint = useViewportStore((state) => state.setBreakpoint);
  const setZoom = useViewportStore((state) => state.setZoom);

  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);
  const push = useHistoryStore((state) => state.push);

  const copy = useClipboardStore((state) => state.copy);
  const paste = useClipboardStore((state) => state.paste);

  const setDirty = useEditorStore((state) => state.setDirty);
  const getComponentById = useEditorStore((state) => state.getComponentById);

  // Legacy action implementations
  const executeCommand = async (command: Command) => {
    try {
      await push(command, command.description);
      command.execute();
      eventBus.emit('command:execute', command);
      setDirty(true);
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  };

  const updateSelection = async (updates: Partial<any>) => {
    if (updates.selectedIds) {
      if (updates.selectedIds.length === 0) {
        await deselectAll();
      } else {
        for (const id of updates.selectedIds) {
          await selectComponent(id, true);
        }
      }
    }
    if (updates.hoveredId !== undefined) {
      // Handle hovered state
    }
    if (updates.focusedId !== undefined) {
      // Handle focused state
    }
  };

  const updateComponent = async (id: ComponentId, updates: Partial<ComponentNode>) => {
    try {
      const component = getComponentById(id);
      if (!component) {
        throw new Error(`Component ${id} not found`);
      }

      // Create and execute update command
      const command: Command = {
        type: 'updateComponent',
        timestamp: Date.now(),
        description: `Update component ${id}`,
        execute: () => {
          // In a real implementation, this would update the component
          eventBus.emit('component:update', { id, updates });
        },
        undo: () => {
          // In a real implementation, this would revert the update
          eventBus.emit('component:revert', { id });
        },
      };

      await executeCommand(command);
    } catch (error) {
      console.error('Error updating component:', error);
      throw error;
    }
  };

  const deleteComponent = async (id: ComponentId) => {
    try {
      const command: Command = {
        type: 'deleteComponent',
        timestamp: Date.now(),
        description: `Delete component ${id}`,
        execute: () => {
          eventBus.emit('component:delete', { id });
        },
        undo: () => {
          eventBus.emit('component:restore', { id });
        },
      };

      await executeCommand(command);

      // Remove from selection if selected
      if (selection.selectedIds.includes(id)) {
        await updateSelection({
          selectedIds: selection.selectedIds.filter((sid) => sid !== id),
        });
      }
    } catch (error) {
      console.error('Error deleting component:', error);
      throw error;
    }
  };

  const duplicateComponent = async (id: ComponentId) => {
    try {
      const component = getComponentById(id);
      if (!component) {
        throw new Error(`Component ${id} not found`);
      }

      const command: Command = {
        type: 'duplicateComponent',
        timestamp: Date.now(),
        description: `Duplicate component ${id}`,
        execute: () => {
          eventBus.emit('component:duplicate', { id, component });
        },
        undo: () => {
          eventBus.emit('component:removeDuplicate', { id });
        },
      };

      await executeCommand(command);
    } catch (error) {
      console.error('Error duplicating component:', error);
      throw error;
    }
  };

  const copyComponent = async (id: ComponentId) => {
    try {
      const component = getComponentById(id);
      if (!component) {
        throw new Error(`Component ${id} not found`);
      }

      await copy([
        {
          id: `clipboard_${Date.now()}`,
          type: 'component',
          data: component,
        },
      ]);
    } catch (error) {
      console.error('Error copying component:', error);
      throw error;
    }
  };

  const pasteComponents = async () => {
    try {
      const items = paste();
      if (items.length === 0) {
        return;
      }

      const command: Command = {
        type: 'pasteComponents',
        timestamp: Date.now(),
        description: 'Paste components',
        execute: () => {
          eventBus.emit('component:paste', { items });
        },
        undo: () => {
          eventBus.emit('component:removePasted', { items });
        },
      };

      await executeCommand(command);
    } catch (error) {
      console.error('Error pasting components:', error);
      throw error;
    }
  };

  // Combine state
  const state: EditorState = {
    project,
    currentPageId,
    selection,
    history,
    isDirty,
    isPreviewMode,
    currentBreakpoint: breakpoint,
    zoom,
    clipboard,
  };

  return {
    state,
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

/**
 * Hook for subscribing to store changes
 * Useful for debugging and monitoring
 */
export const useStoreSubscription = () => {
  React.useEffect(() => {
    const unsubscribes = [
      useEditorStore.subscribe(
        (state) => state,
        (state, prevState) => {
          console.log('Editor store changed:', { state, prevState });
        }
      ),
      useSelectionStore.subscribe(
        (state) => state,
        (state, prevState) => {
          console.log('Selection store changed:', { state, prevState });
        }
      ),
      useViewportStore.subscribe(
        (state) => state,
        (state, prevState) => {
          console.log('Viewport store changed:', { state, prevState });
        }
      ),
      useHistoryStore.subscribe(
        (state) => state,
        (state, prevState) => {
          console.log('History store changed:', { state, prevState });
        }
      ),
      useAssetsStore.subscribe(
        (state) => state,
        (state, prevState) => {
          console.log('Assets store changed:', { state, prevState });
        }
      ),
      useClipboardStore.subscribe(
        (state) => state,
        (state, prevState) => {
          console.log('Clipboard store changed:', { state, prevState });
        }
      ),
    ];

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, []);
};

/**
 * Hook for persisting state to storage
 * Supports localStorage, sessionStorage, or custom storage
 */
export const usePersistState = (key: string = 'editor-state', storage: Storage = localStorage) => {
  React.useEffect(() => {
    // Load state from storage on mount
    try {
      const savedState = storage.getItem(key);
      if (savedState) {
        const parsed = JSON.parse(savedState);

        // Hydrate stores
        if (parsed.editor) {
          useEditorStore.getState().hydrate(parsed.editor);
        }
        if (parsed.selection) {
          useSelectionStore.getState().hydrate(parsed.selection);
        }
        if (parsed.viewport) {
          useViewportStore.getState().hydrate(parsed.viewport);
        }
        if (parsed.history) {
          useHistoryStore.getState().hydrate(parsed.history);
        }
        if (parsed.assets) {
          useAssetsStore.getState().hydrate(parsed.assets);
        }
        if (parsed.clipboard) {
          useClipboardStore.getState().hydrate(parsed.clipboard);
        }
      }
    } catch (error) {
      console.error('Error loading state from storage:', error);
    }
  }, [key, storage]);

  React.useEffect(() => {
    // Save state to storage on changes
    const handleStateChange = () => {
      try {
        const state = {
          editor: JSON.parse(useEditorStore.getState().toJSON()),
          selection: JSON.parse(useSelectionStore.getState().toJSON()),
          viewport: JSON.parse(useViewportStore.getState().toJSON()),
          history: JSON.parse(useHistoryStore.getState().toJSON()),
          assets: JSON.parse(useAssetsStore.getState().toJSON()),
          clipboard: JSON.parse(useClipboardStore.getState().toJSON()),
        };
        storage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error('Error saving state to storage:', error);
      }
    };

    const unsubscribes = [
      useEditorStore.subscribe(handleStateChange),
      useSelectionStore.subscribe(handleStateChange),
      useViewportStore.subscribe(handleStateChange),
      useHistoryStore.subscribe(handleStateChange),
      useAssetsStore.subscribe(handleStateChange),
      useClipboardStore.subscribe(handleStateChange),
    ];

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [key, storage]);
};

/**
 * Hook for debugging state changes
 * Only active in development mode
 */
export const useDebugState = () => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  React.useEffect(() => {
    // Expose stores to window for debugging
    (window as any).__EDITOR_STORES__ = {
      editor: useEditorStore,
      selection: useSelectionStore,
      viewport: useViewportStore,
      history: useHistoryStore,
      assets: useAssetsStore,
      clipboard: useClipboardStore,
      eventBus,
    };

    console.log('Editor stores exposed to window.__EDITOR_STORES__');
  }, []);
};
