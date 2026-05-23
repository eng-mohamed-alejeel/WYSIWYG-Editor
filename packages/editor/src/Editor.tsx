/**
 * Visual Editor Component
 *
 * Main editor component that provides the visual editing interface.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ComponentNode, ComponentId, Command } from '@wysiwyg/core';
import { EditorState, EditorConfig, SelectionState } from './types';

interface EditorProps {
  initialState?: Partial<EditorState>;
  config?: EditorConfig;
  onStateChange?: (state: EditorState) => void;
  children?: React.ReactNode;
}

const DEFAULT_CONFIG: Required<EditorConfig> = {
  enableAiFeatures: false,
  enableAnalytics: false,
  maxHistorySize: 50,
  autoSaveInterval: 30000,
  defaultBreakpoint: 'desktop',
};

const INITIAL_STATE: EditorState = {
  project: null,
  currentPageId: null,
  selection: {
    selectedIds: [],
    hoveredId: null,
    focusedId: null,
  },
  history: {
    past: [],
    present: null,
    future: [],
    maxSize: 50,
  },
  isDirty: false,
  isPreviewMode: false,
  currentBreakpoint: 'desktop',
  zoom: 1,
  clipboard: [],
};

export const Editor: React.FC<EditorProps> = ({
  initialState,
  config,
  onStateChange,
  children,
}) => {
  const [state, setState] = useState<EditorState>({
    ...INITIAL_STATE,
    ...initialState,
  });

  const configRef = useRef({ ...DEFAULT_CONFIG, ...config });

  // Auto-save effect
  useEffect(() => {
    if (!configRef.current.autoSaveInterval) return;

    const interval = setInterval(() => {
      if (state.isDirty) {
        console.log('Auto-saving project...');
        setState((prev) => ({ ...prev, isDirty: false }));
      }
    }, configRef.current.autoSaveInterval);

    return () => clearInterval(interval);
  }, [state.isDirty]);

  // Execute command
  const executeCommand = useCallback(
    (command: Command) => {
      setState((prevState) => {
        const newPast = [...prevState.history.past, prevState.history.present].filter(Boolean);
        const newFuture: Command[] = [];

        if (newPast.length > configRef.current.maxHistorySize) {
          newPast.shift();
        }

        command.execute();

        const newState = {
          ...prevState,
          history: {
            ...prevState.history,
            past: newPast,
            present: command,
            future: newFuture,
          },
          isDirty: true,
        };

        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

  // Undo
  const undo = useCallback(() => {
    setState((prevState) => {
      if (!prevState.history.present || prevState.history.past.length === 0) {
        return prevState;
      }

      const commandToUndo = prevState.history.present;
      commandToUndo.undo();

      const newPresent = prevState.history.past[prevState.history.past.length - 1];
      const newPast = prevState.history.past.slice(0, -1);
      const newFuture = [commandToUndo, ...prevState.history.future];

      const newState = {
        ...prevState,
        history: {
          ...prevState.history,
          past: newPast,
          present: newPresent,
          future: newFuture,
        },
        isDirty: true,
      };

      onStateChange?.(newState);
      return newState;
    });
  }, [onStateChange]);

  // Redo
  const redo = useCallback(() => {
    setState((prevState) => {
      if (prevState.history.future.length === 0) {
        return prevState;
      }

      const commandToRedo = prevState.history.future[0];
      commandToRedo.execute();

      const newPast = [...prevState.history.past, prevState.history.present].filter(Boolean);
      const newPresent = commandToRedo;
      const newFuture = prevState.history.future.slice(1);

      const newState = {
        ...prevState,
        history: {
          ...prevState.history,
          past: newPast,
          present: newPresent,
          future: newFuture,
        },
        isDirty: true,
      };

      onStateChange?.(newState);
      return newState;
    });
  }, [onStateChange]);

  // Update selection
  const updateSelection = useCallback(
    (updates: Partial<SelectionState>) => {
      setState((prevState) => {
        const newSelection = {
          ...prevState.selection,
          ...updates,
        };

        const newState = {
          ...prevState,
          selection: newSelection,
        };

        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

  // Update component
  const updateComponent = useCallback(
    (id: ComponentId, updates: Partial<ComponentNode>) => {
      setState((prevState) => {
        const updateNode = (nodes: ComponentNode[]): ComponentNode[] => {
          return nodes.map((node) => {
            if (node.id === id) {
              return { ...node, ...updates };
            }
            if (node.children.length > 0) {
              return { ...node, children: updateNode(node.children) };
            }
            return node;
          });
        };

        const newState = {
          ...prevState,
          project: {
            ...prevState.project,
            pages: prevState.project?.pages?.map((page: any) => ({
              ...page,
              components: updateNode(page.components),
            })),
          },
          isDirty: true,
        };

        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

  // Delete component
  const deleteComponent = useCallback(
    (id: ComponentId) => {
      setState((prevState) => {
        const deleteNode = (nodes: ComponentNode[]): ComponentNode[] => {
          return nodes.filter((node) => {
            if (node.id === id) return false;
            if (node.children.length > 0) {
              node.children = deleteNode(node.children);
            }
            return true;
          });
        };

        const newState = {
          ...prevState,
          project: {
            ...prevState.project,
            pages: prevState.project?.pages?.map((page: any) => ({
              ...page,
              components: deleteNode(page.components),
            })),
          },
          selection: {
            ...prevState.selection,
            selectedIds: prevState.selection.selectedIds.filter((selectedId) => selectedId !== id),
          },
          isDirty: true,
        };

        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

  // Duplicate component
  const duplicateComponent = useCallback(
    (id: ComponentId) => {
      setState((prevState) => {
        const findAndDuplicate = (nodes: ComponentNode[]): ComponentNode[] => {
          return nodes.flatMap((node) => {
            if (node.id === id) {
              const duplicated = {
                ...node,
                id: `${id}_copy_${Date.now()}`,
              };
              return [node, duplicated];
            }
            if (node.children.length > 0) {
              return [{ ...node, children: findAndDuplicate(node.children) }];
            }
            return [node];
          });
        };

        const newState = {
          ...prevState,
          project: {
            ...prevState.project,
            pages: prevState.project?.pages?.map((page: any) => ({
              ...page,
              components: findAndDuplicate(page.components),
            })),
          },
          isDirty: true,
        };

        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

  // Copy component
  const copyComponent = useCallback(
    (id: ComponentId) => {
      setState((prevState) => {
        const findNode = (nodes: ComponentNode[]): ComponentNode | null => {
          for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children.length > 0) {
              const found = findNode(node.children);
              if (found) return found;
            }
          }
          return null;
        };

        const nodeToCopy = prevState.project?.pages?.find(
          (page: any) => page.id === prevState.currentPageId
        )?.components;
        const copiedNode = nodeToCopy ? findNode(nodeToCopy) : null;

        if (copiedNode) {
          const newState = {
            ...prevState,
            clipboard: [copiedNode],
          };
          onStateChange?.(newState);
          return newState;
        }

        return prevState;
      });
    },
    [onStateChange]
  );

  // Paste components
  const pasteComponents = useCallback(() => {
    setState((prevState) => {
      if (prevState.clipboard.length === 0) return prevState;

      const newNodes = prevState.clipboard.map((node) => ({
        ...node,
        id: `${node.id}_pasted_${Date.now()}`,
      }));

      const newState = {
        ...prevState,
        project: {
          ...prevState.project,
          pages: prevState.project?.pages?.map((page: any) => {
            if (page.id === prevState.currentPageId) {
              return {
                ...page,
                components: [...page.components, ...newNodes],
              };
            }
            return page;
          }),
        },
        isDirty: true,
      };

      onStateChange?.(newState);
      return newState;
    });
  }, [onStateChange]);

  // Create editor context value
  const contextValue = {
    state,
    config: configRef.current,
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

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};

// Create editor context
const EditorContext = React.createContext<any>(null);

// Custom hook to use editor context
export const useEditor = () => {
  const context = React.useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an Editor provider');
  }
  return context;
};
