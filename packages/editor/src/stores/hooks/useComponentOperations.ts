/**
 * Component Operations Hook
 *
 * Provides component manipulation operations
 */

import { useCallback } from 'react';
import { ComponentId, ComponentNode, Command } from '@wysiwyg/core';
import { eventBus } from '../events';
import { useEditorCommands } from './useEditorCommands';

export const useComponentOperations = () => {
  const { executeCommand } = useEditorCommands();

  const updateComponent = useCallback(
    async (id: ComponentId, updates: Partial<ComponentNode>) => {
      try {
        const { useEditorStore } = await import('../editorStore');
        const component = useEditorStore.getState().getComponentById(id);

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
            eventBus.emit('component:update', { id, updates });
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
    async (id: ComponentId, selectedIds: ComponentId[]) => {
      try {
        const command: Command = {
          type: 'deleteComponent',
          timestamp: Date.now(),
          description: `Delete component ${id}`,
          execute: () => {
            eventBus.emit('component:delete', { id });
          },
          undo: () => {
            eventBus.emit('component:update', { id });
          },
        };

        await executeCommand(command);

        const { useSelectionStore } = await import('../selectionStore');
        const store = useSelectionStore.getState();
        if (selectedIds.includes(id)) {
          const newSelection = selectedIds.filter((sid: ComponentId) => sid !== id);
          if (newSelection.length === 0) {
            await store.deselectAll();
          } else {
            await store.selectComponent(newSelection[0]);
          }
        }
      } catch (error) {
        console.error('Error deleting component:', error);
        throw error;
      }
    },
    [executeCommand]
  );

  const duplicateComponent = useCallback(
    async (id: ComponentId) => {
      try {
        const { useEditorStore } = await import('../editorStore');
        const component = useEditorStore.getState().getComponentById(id);

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
            eventBus.emit('component:delete', { id });
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

  return {
    updateComponent,
    deleteComponent,
    duplicateComponent,
  };
};
