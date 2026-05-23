/**
 * Editor Provider
 *
 * Provides the editor state management context to the application
 * Bridges the new Zustand-based stores with React components
 */

import React, { useEffect, useCallback } from 'react';
import { ComponentId, ComponentNode, Command } from '@wysiwyg/core';
import { EditorState, EditorConfig, SelectionState } from '../types';
import { eventBus } from './events';
import { middlewareManager } from './middleware';
import {
  loggingMiddleware,
  eventMiddleware,
  analyticsMiddleware,
  performanceMiddleware,
  crdtSyncMiddleware,
} from './middleware';

interface EditorProviderProps {
  initialState?: Partial<EditorState>;
  config?: EditorConfig;
  onStateChange?: (state: EditorState) => void;
  children: React.ReactNode;
}

const DEFAULT_CONFIG: Required<EditorConfig> = {
  enableAiFeatures: false,
  enableAnalytics: false,
  maxHistorySize: 50,
  autoSaveInterval: 30000,
  defaultBreakpoint: 'desktop',
};

/**
 * Editor Provider Component
 *
 * Initializes the state management system and provides
 * integration with existing components
 */
export const EditorProvider: React.FC<EditorProviderProps> = ({
  initialState,
  config,
  onStateChange,
  children,
}) => {
  // Initialize middleware
  useEffect(() => {
    middlewareManager.register(loggingMiddleware);
    middlewareManager.register(eventMiddleware);
    middlewareManager.register(performanceMiddleware);
    middlewareManager.register(crdtSyncMiddleware);

    if (config?.enableAnalytics) {
      middlewareManager.register(analyticsMiddleware);
    }

    return () => {
      middlewareManager.unregister('logging');
      middlewareManager.unregister('events');
      middlewareManager.unregister('performance');
      middlewareManager.unregister('crdt-sync');
      if (config?.enableAnalytics) {
        middlewareManager.unregister('analytics');
      }
    };
  }, [config?.enableAnalytics]);

  // Initialize state from props
  useEffect(() => {
    if (initialState) {
      // Hydrate stores with initial state
      if (initialState.project) {
        // Import and hydrate editor store
        import('./editorStore').then(({ useEditorStore }) => {
          useEditorStore.getState().setProject(initialState.project);
        });
      }

      if (initialState.currentPageId) {
        import('./editorStore').then(({ useEditorStore }) => {
          useEditorStore.getState().setCurrentPage(initialState.currentPageId);
        });
      }

      if (initialState.selection) {
        import('./selectionStore').then(({ useSelectionStore }) => {
          const { selectedIds, hoveredId, focusedId } = initialState.selection;
          if (selectedIds.length > 0) {
            useSelectionStore.getState().selectComponent(selectedIds[0]);
          }
          if (hoveredId) {
            useSelectionStore.getState().setHovered(hoveredId);
          }
          if (focusedId) {
            useSelectionStore.getState().setFocused(focusedId);
          }
        });
      }

      if (initialState.currentBreakpoint) {
        import('./viewportStore').then(({ useViewportStore }) => {
          useViewportStore.getState().setBreakpoint(initialState.currentBreakpoint as any);
        });
      }

      if (initialState.zoom) {
        import('./viewportStore').then(({ useViewportStore }) => {
          useViewportStore.getState().setZoom(initialState.zoom);
        });
      }

      if (initialState.clipboard) {
        import('./clipboardStore').then(({ useClipboardStore }) => {
          useClipboardStore.getState().copy(
            initialState.clipboard!.map((item) => ({
              id: `clipboard_${Date.now()}_${Math.random()}`,
              type: 'component' as const,
              data: item,
            }))
          );
        });
      }
    }
  }, [initialState]);

  // Handle state changes
  useEffect(() => {
    const handleStateChange = () => {
      if (!onStateChange) return;

      // Collect state from all stores
      Promise.all([
        import('./editorStore').then((m) => m.useEditorStore.getState()),
        import('./selectionStore').then((m) => m.useSelectionStore.getState()),
        import('./viewportStore').then((m) => m.useViewportStore.getState()),
        import('./historyStore').then((m) => m.useHistoryStore.getState()),
        import('./clipboardStore').then((m) => m.useClipboardStore.getState()),
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
      import('./editorStore').then((m) => m.useEditorStore.subscribe(handleStateChange)),
      import('./selectionStore').then((m) => m.useSelectionStore.subscribe(handleStateChange)),
      import('./viewportStore').then((m) => m.useViewportStore.subscribe(handleStateChange)),
      import('./historyStore').then((m) => m.useHistoryStore.subscribe(handleStateChange)),
      import('./clipboardStore').then((m) => m.useClipboardStore.subscribe(handleStateChange)),
    ]);

    return () => {
      unsubscribes.then((unsubs) => {
        unsubs.forEach((unsub) => unsub());
      });
    };
  }, [onStateChange]);

  // Auto-save functionality
  useEffect(() => {
    if (!config?.autoSaveInterval) return;

    const interval = setInterval(() => {
      import('./editorStore').then(({ useEditorStore }) => {
        const { isDirty } = useEditorStore.getState();
        if (isDirty) {
          console.log('Auto-saving project...');
          useEditorStore.getState().setDirty(false);
          eventBus.emit('autosave', null);
        }
      });
    }, config.autoSaveInterval);

    return () => clearInterval(interval);
  }, [config?.autoSaveInterval]);

  return <>{children}</>;
};

/**
 * Hook to access editor context
 * Provides backward-compatible API
 */
export const useEditorContext = () => {
  const project = useEditorStore((state) => state.project);
  const currentPageId = useEditorStore((state) => state.currentPageId);
  const isDirty = useEditorStore((state) => state.isDirty);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

  const { selectedIds, hoveredId, focusedId } = useSelectionStore((state) => ({
    selectedIds: state.selectedIds,
    hoveredId: state.hoveredId,
    focusedId: state.focusedId,
  }));

  const { breakpoint, zoom } = useViewportStore((state) => ({
    breakpoint: state.breakpoint,
    zoom: state.zoom,
  }));

  const { past, present, future, maxSize } = useHistoryStore((state) => ({
    past: state.past,
    present: state.present,
    future: state.future,
    maxSize: state.maxSize,
  }));

  const items = useClipboardStore((state) => state.items);
  const clipboard = items
    .filter((item) => item.type === 'component')
    .map((item) => item.data as ComponentNode);

  // Actions
  const executeCommand = useCallback(async (command: Command) => {
    try {
      const { push } = await import('./historyStore');
      await push(command, command.description);
      command.execute();
      eventBus.emit('command:execute', command);

      const { setDirty } = await import('./editorStore');
      setDirty(true);
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  }, []);

  const undo = useCallback(async () => {
    try {
      const { undo: historyUndo } = await import('./historyStore');
      await historyUndo();
      eventBus.emit('command:undo', null);

      const { setDirty } = await import('./editorStore');
      setDirty(true);
    } catch (error) {
      console.error('Error undoing:', error);
      throw error;
    }
  }, []);

  const redo = useCallback(async () => {
    try {
      const { redo: historyRedo } = await import('./historyStore');
      await historyRedo();
      eventBus.emit('command:redo', null);

      const { setDirty } = await import('./editorStore');
      setDirty(true);
    } catch (error) {
      console.error('Error redoing:', error);
      throw error;
    }
  }, []);

  const updateSelection = useCallback(async (updates: Partial<SelectionState>) => {
    const { selectComponent, deselectAll, setHovered, setFocused } =
      await import('./selectionStore');

    if (updates.selectedIds !== undefined) {
      if (updates.selectedIds.length === 0) {
        await deselectAll();
      } else {
        for (const id of updates.selectedIds) {
          await selectComponent(id, true);
        }
      }
    }

    if (updates.hoveredId !== undefined) {
      await setHovered(updates.hoveredId);
    }

    if (updates.focusedId !== undefined) {
      await setFocused(updates.focusedId);
    }
  }, []);

  const updateComponent = useCallback(
    async (id: ComponentId, updates: Partial<ComponentNode>) => {
      try {
        const { getComponentById, setProject } = await import('./editorStore');
        const component = getComponentById(id);

        if (!component) {
          throw new Error(`Component ${id} not found`);
        }

        const command: Command = {
          type: 'updateComponent',
          timestamp: Date.now(),
          description: `Update component ${id}`,
          execute: () => {
            eventBus.emit('component:update', { id, updates });
          },
          undo: () => {
            eventBus.emit('component:revert', { id });
          },
        };

        await executeCommand(command);
      } catch (error) {
        console.error('Error updating component:', error);
        throw error;
      }
    },
    [executeCommand]
  );

  const deleteComponent = useCallback(
    async (id: ComponentId) => {
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

        const { selectComponent, deselectAll } = await import('./selectionStore');
        if (selectedIds.includes(id)) {
          const newSelection = selectedIds.filter((sid) => sid !== id);
          if (newSelection.length === 0) {
            await deselectAll();
          } else {
            await selectComponent(newSelection[0]);
          }
        }
      } catch (error) {
        console.error('Error deleting component:', error);
        throw error;
      }
    },
    [executeCommand, selectedIds]
  );

  const duplicateComponent = useCallback(
    async (id: ComponentId) => {
      try {
        const { getComponentById } = await import('./editorStore');
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
    },
    [executeCommand]
  );

  const copyComponent = useCallback(async (id: ComponentId) => {
    try {
      const { getComponentById } = await import('./editorStore');
      const component = getComponentById(id);

      if (!component) {
        throw new Error(`Component ${id} not found`);
      }

      const { copy } = await import('./clipboardStore');
      await copy([
        {
          id: `clipboard_${Date.now()}_${Math.random()}`,
          type: 'component' as const,
          data: component,
        },
      ]);

      eventBus.emit('component:copy', { id });
    } catch (error) {
      console.error('Error copying component:', error);
      throw error;
    }
  }, []);

  const pasteComponents = useCallback(async () => {
    try {
      const { paste } = await import('./clipboardStore');
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
  }, [executeCommand]);

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

/**
 * Hook to access editor state and actions
 * Convenience wrapper around useEditorContext
 */
export const useEditor = () => {
  const context = useEditorContext();

  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }

  return context;
};

/**
 * Hook to access editor state only
 * Does not include actions
 */
export const useEditorState = () => {
  return useEditorContext().state;
};

/**
 * Hook to access editor actions only
 * Does not include state
 */
export const useEditorActions = () => {
  const context = useEditorContext();
  const { state, config, ...actions } = context;
  return actions;
};
