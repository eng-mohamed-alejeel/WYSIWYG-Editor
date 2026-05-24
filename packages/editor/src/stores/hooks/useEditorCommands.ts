/**
 * Editor Commands Hook
 *
 * Provides command execution and history management
 */

import { useCallback } from 'react';
import { Command, ComponentId, ComponentNode } from '@wysiwyg/core';
import { eventBus } from '../events';

export const useEditorCommands = () => {
  const executeCommand = useCallback(async (command: Command) => {
    try {
      const { useHistoryStore } = await import('../historyStore');
      await useHistoryStore.getState().push(command, command.description);
      command.execute();
      eventBus.emit('component:update', command);

      const { useEditorStore } = await import('../editorStore');
      useEditorStore.getState().setDirty(true);
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  }, []);

  const undo = useCallback(async () => {
    try {
      const { useHistoryStore } = await import('../historyStore');
      await useHistoryStore.getState().undo();
      eventBus.emit('history:undo', null);

      const { useEditorStore } = await import('../editorStore');
      useEditorStore.getState().setDirty(true);
    } catch (error) {
      console.error('Error undoing:', error);
      throw error;
    }
  }, []);

  const redo = useCallback(async () => {
    try {
      const { useHistoryStore } = await import('../historyStore');
      await useHistoryStore.getState().redo();
      eventBus.emit('history:redo', null);

      const { useEditorStore } = await import('../editorStore');
      useEditorStore.getState().setDirty(true);
    } catch (error) {
      console.error('Error redoing:', error);
      throw error;
    }
  }, []);

  return {
    executeCommand,
    undo,
    redo,
  };
};
