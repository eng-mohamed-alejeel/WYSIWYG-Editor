/**
 * Selection Store
 *
 * Manages component selection state
 * Optimized for performance with selective subscriptions
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { ComponentId } from '@wysiwyg/core';
import { SelectionStoreState } from './types';
import { eventBus } from './events';
import { middlewareManager } from './middleware';

interface SelectionStore extends SelectionStoreState {
  // Actions
  selectComponent: (id: ComponentId, addToSelection?: boolean) => Promise<void>;
  deselectComponent: (id: ComponentId) => Promise<void>;
  deselectAll: () => Promise<void>;
  setHovered: (id: ComponentId | null) => Promise<void>;
  setFocused: (id: ComponentId | null) => Promise<void>;
  isSelected: (id: ComponentId) => boolean;
  reset: () => void;
  hydrate: (state: Partial<SelectionStoreState>) => void;
  toJSON: () => string;
}

const initialState: SelectionStoreState = {
  selectedIds: [],
  hoveredId: null,
  focusedId: null,
};

export const useSelectionStore = create<SelectionStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    selectComponent: async (id: ComponentId, addToSelection = false) => {
      try {
        const payload = { id, addToSelection };
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'selectComponent',
          payload
        );

        set(
          (state) => {
            const { id: processedId, addToSelection: processedAddToSelection } =
              processedPayload as { id: ComponentId; addToSelection: boolean };

            if (processedAddToSelection) {
              return {
                selectedIds: state.selectedIds.includes(processedId)
                  ? state.selectedIds
                  : [...state.selectedIds, processedId],
              };
            }
            return {
              selectedIds: [processedId],
            };
          },
          false,
          'selectComponent'
        );

        await middlewareManager.executeAfter(get(), 'selectComponent', processedPayload);
        eventBus.emit('component:select', processedPayload);
      } catch (error) {
        console.error('Error selecting component:', error);
        throw error;
      }
    },

    deselectComponent: async (id: ComponentId) => {
      try {
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'deselectComponent',
          id
        );

        set(
          (state) => ({
            selectedIds: state.selectedIds.filter((selectedId) => selectedId !== processedPayload),
          }),
          false,
          'deselectComponent'
        );

        await middlewareManager.executeAfter(get(), 'deselectComponent', processedPayload);
        eventBus.emit('component:deselect', processedPayload);
      } catch (error) {
        console.error('Error deselecting component:', error);
        throw error;
      }
    },

    deselectAll: async () => {
      try {
        await middlewareManager.executeBefore(get(), 'deselectAll', null);

        set(
          (state) => ({
            ...state,
            selectedIds: [],
            focusedId: null,
          }),
          false,
          'deselectAll'
        );

        await middlewareManager.executeAfter(get(), 'deselectAll', null);
        eventBus.emit('selection:clear', null);
      } catch (error) {
        console.error('Error clearing selection:', error);
        throw error;
      }
    },

    setHovered: async (id: ComponentId | null) => {
      try {
        const processedPayload = await middlewareManager.executeBefore(get(), 'setHovered', id);

        set({ hoveredId: processedPayload }, false, 'setHovered');

        await middlewareManager.executeAfter(get(), 'setHovered', processedPayload);
        eventBus.emit('component:hover', processedPayload);
      } catch (error) {
        console.error('Error setting hovered component:', error);
        throw error;
      }
    },

    setFocused: async (id: ComponentId | null) => {
      try {
        const processedPayload = await middlewareManager.executeBefore(get(), 'setFocused', id);

        set({ focusedId: processedPayload }, false, 'setFocused');

        await middlewareManager.executeAfter(get(), 'setFocused', processedPayload);
        eventBus.emit('component:focus', processedPayload);
      } catch (error) {
        console.error('Error setting focused component:', error);
        throw error;
      }
    },

    isSelected: (id: ComponentId): boolean => {
      return get().selectedIds.includes(id);
    },

    reset: () => {
      set(initialState, false, 'reset');
      eventBus.emit('selection:reset', null);
    },

    hydrate: (state: Partial<SelectionStoreState>) => {
      set(
        (currentState) => ({
          ...currentState,
          ...state,
        }),
        false,
        'hydrate'
      );
    },

    toJSON: (): string => {
      const state = get();
      return JSON.stringify({
        selectedIds: state.selectedIds,
        hoveredId: state.hoveredId,
        focusedId: state.focusedId,
      });
    },
  }))
);

// Selectors with shallow equality for optimized re-renders
export const selectionSelectors = {
  selectedIds: (state: SelectionStoreState) => state.selectedIds,
  hoveredId: (state: SelectionStoreState) => state.hoveredId,
  focusedId: (state: SelectionStoreState) => state.focusedId,
  hasSelection: (state: SelectionStoreState) => state.selectedIds.length > 0,
  selectionCount: (state: SelectionStoreState) => state.selectedIds.length,

  // Compound selectors
  selectionState: (state: SelectionStoreState) => ({
    selectedIds: state.selectedIds,
    hoveredId: state.hoveredId,
    focusedId: state.focusedId,
  }),
};

// Custom hooks for common selections
export const useSelectedIds = () => useSelectionStore(selectionSelectors.selectedIds);
export const useHoveredId = () => useSelectionStore(selectionSelectors.hoveredId);
export const useFocusedId = () => useSelectionStore(selectionSelectors.focusedId);
export const useHasSelection = () => useSelectionStore(selectionSelectors.hasSelection);
export const useSelectionCount = () => useSelectionStore(selectionSelectors.selectionCount);
export const useSelectionState = () =>
  useSelectionStore(selectionSelectors.selectionState, shallow);
