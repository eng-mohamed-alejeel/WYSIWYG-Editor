/**
 * Auto-save Hook
 *
 * Handles automatic saving functionality
 */

import { useEffect } from 'react';
import { eventBus } from '../events';
import { EditorConfig } from '../../types';

export const useAutoSave = (config?: EditorConfig) => {
  useEffect(() => {
    if (!config?.autoSaveInterval) return () => {};

    const interval = setInterval(() => {
      import('../editorStore').then(({ useEditorStore }) => {
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
};
