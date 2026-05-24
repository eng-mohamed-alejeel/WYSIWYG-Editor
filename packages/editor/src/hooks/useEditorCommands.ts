/**
 * Editor Commands Hooks
 *
 * Custom hooks for managing editor commands and state updates
 */

import { useState, useCallback } from 'react';
import { ComponentNode, ComponentId, Command } from '@wysiwyg/core';
import { EditorState, EditorConfig, SelectionState } from '../types';

interface UseEditorCommandsProps {
  initialState: Partial<EditorState>;
  config: Required<EditorConfig>;
  onStateChange?: (state: EditorState) => void;
}

export const useEditorCommands = ({
  initialState,
  config,
  onStateChange,
}: UseEditorCommandsProps) => {
  const [state, setState] = useState<EditorState>({
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
      maxSize: config.maxHistorySize,
    },
    isDirty: false,
    isPreviewMode: false,
    currentBreakpoint: config.defaultBreakpoint,
    zoom: 1,
    clipboard: [],
    ...initialState,
  });

  const executeCommand = useCallback(
    (command: Command) => {
      setState((prevState) => {
        const newPast: Command[] = prevState.history.present
          ? [...prevState.history.past, prevState.history.present]
          : prevState.history.past;
        const newFuture: Command[] = [];

        if (newPast.length > config.maxHistorySize) {
          newPast.shift();
        }

        command.execute();

        const newState: EditorState = {
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
    [config.maxHistorySize, onStateChange]
  );

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

      const newState: EditorState = {
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

  const redo = useCallback(() => {
    setState((prevState) => {
      if (prevState.history.future.length === 0) {
        return prevState;
      }

      const commandToRedo = prevState.history.future[0];
      commandToRedo.execute();

      const newPast: Command[] = prevState.history.present
        ? [...prevState.history.past, prevState.history.present]
        : prevState.history.past;
      const newPresent = commandToRedo;
      const newFuture = prevState.history.future.slice(1);

      const newState: EditorState = {
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

  const updateSelection = useCallback(
    (updates: Partial<SelectionState>) => {
      setState((prevState) => {
        const newSelection = {
          ...prevState.selection,
          ...updates,
        };

        const newState: EditorState = {
          ...prevState,
          selection: newSelection,
        };

        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

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

        const newState: EditorState = {
          ...prevState,
          project: prevState.project
            ? {
                ...prevState.project,
                pages: prevState.project.pages?.map((page) => ({
                  ...page,
                  components: updateNode(page.components),
                })),
              }
            : prevState.project,
          isDirty: true,
        };

        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

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

        const newState: EditorState = {
          ...prevState,
          project: prevState.project
            ? {
                ...prevState.project,
                pages: prevState.project.pages?.map((page) => ({
                  ...page,
                  components: deleteNode(page.components),
                })),
              }
            : prevState.project,
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

  const duplicateComponent = useCallback(
    (id: ComponentId) => {
      setState((prevState) => {
        const findAndDuplicate = (nodes: ComponentNode[]): ComponentNode[] => {
          return nodes.flatMap((node) => {
            if (node.id === id) {
              const duplicated: ComponentNode = {
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

        const newState: EditorState = {
          ...prevState,
          project: prevState.project
            ? {
                ...prevState.project,
                pages: prevState.project.pages?.map((page) => ({
                  ...page,
                  components: findAndDuplicate(page.components),
                })),
              }
            : prevState.project,
          isDirty: true,
        };

        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

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
          (page) => page.id === prevState.currentPageId
        )?.components;
        const copiedNode = nodeToCopy ? findNode(nodeToCopy) : null;

        if (copiedNode) {
          const newState: EditorState = {
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

  const pasteComponents = useCallback(() => {
    setState((prevState) => {
      if (prevState.clipboard.length === 0) return prevState;

      const newNodes = prevState.clipboard.map((node) => ({
        ...node,
        id: `${node.id}_pasted_${Date.now()}`,
      }));

      const newState: EditorState = {
        ...prevState,
        project: prevState.project
          ? {
              ...prevState.project,
              pages: prevState.project.pages?.map((page) => {
                if (page.id === prevState.currentPageId) {
                  return {
                    ...page,
                    components: [...page.components, ...newNodes],
                  };
                }
                return page;
              }),
            }
          : prevState.project,
        isDirty: true,
      };

      onStateChange?.(newState);
      return newState;
    });
  }, [onStateChange]);

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
