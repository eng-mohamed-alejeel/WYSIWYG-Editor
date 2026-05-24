/**
 * Selection Operations Hook
 *
 * Provides selection manipulation operations
 */

import { useCallback } from 'react';
import { SelectionState } from '../../types';

export const useSelectionOperations = () => {
  const updateSelection = useCallback(async (updates: Partial<SelectionState>) => {
    const { useSelectionStore } = await import('../selectionStore');
    const store = useSelectionStore.getState();

    if (updates.selectedIds !== undefined) {
      if (updates.selectedIds.length === 0) {
        await store.deselectAll();
      } else {
        for (const id of updates.selectedIds) {
          await store.selectComponent(id, true);
        }
      }
    }

    if (updates.hoveredId !== undefined) {
      await store.setHovered(updates.hoveredId);
    }

    if (updates.focusedId !== undefined) {
      await store.setFocused(updates.focusedId);
    }
  }, []);

  return {
    updateSelection,
  };
};
