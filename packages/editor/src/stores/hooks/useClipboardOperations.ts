/**
 * Clipboard Operations Hook
 *
 * Provides clipboard manipulation operations
 */

import { useCallback } from 'react';
import { ComponentId, Command } from '@wysiwyg/core';
import { eventBus } from '../events';
import { useEditorCommands } from './useEditorCommands';

export const useClipboardOperations = () => {
  const { executeCommand } = useEditorCommands();

  const copyComponent = useCallback(async (id: ComponentId) => {
    try {
      const { useEditorStore } = await import('../editorStore');
      const component = useEditorStore.getState().getComponentById(id);

      if (!component) {
        throw new Error(`Component ${id} not found`);
      }

      const { useClipboardStore } = await import('../clipboardStore');
      await useClipboardStore.getState().copy([
        {
          id: `clipboard_${Date.now()}_${Math.random()}`,
          type: 'component' as const,
          data: component,
        },
      ]);

      eventBus.emit('clipboard:copy', { id });
    } catch (error) {
      console.error('Error copying component:', error);
      throw error;
    }
  }, []);

  const pasteComponents = useCallback(async () => {
    try {
      const { paste } = await import('../clipboardStore');
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

  return {
    copyComponent,
    pasteComponents,
  };
};
