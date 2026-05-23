/**
 * Clipboard Store
 *
 * Manages clipboard state for copy/paste operations
 * Optimized for performance with selective subscriptions
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { ClipboardStoreState, ClipboardItem } from './types';
import { eventBus } from './events';
import { middlewareManager } from './middleware';

interface ClipboardStore extends ClipboardStoreState {
  // Actions
  copy: (items: ClipboardItem | ClipboardItem[]) => Promise<void>;
  paste: () => ClipboardItem[];
  clear: () => Promise<void>;
  hasItems: () => boolean;
  reset: () => void;
  hydrate: (state: Partial<ClipboardStoreState>) => void;
  toJSON: () => string;
}

const initialState: ClipboardStoreState = {
  items: [],
  lastCopiedAt: null,
};

export const useClipboardStore = create<ClipboardStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    copy: async (items: ClipboardItem | ClipboardItem[]) => {
      try {
        const itemsArray = Array.isArray(items) ? items : [items];
        const payload = {
          items: itemsArray,
          timestamp: Date.now(),
        };

        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'clipboard:copy',
          payload
        );

        set(
          (state) => ({
            items: processedPayload.items as ClipboardItem[],
            lastCopiedAt: processedPayload.timestamp as number,
          }),
          false,
          'copy'
        );

        await middlewareManager.executeAfter(get(), 'clipboard:copy', processedPayload);
        eventBus.emit('clipboard:copy', processedPayload);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        throw error;
      }
    },

    paste: (): ClipboardItem[] => {
      const state = get();
      eventBus.emit('clipboard:paste', state.items);
      return state.items;
    },

    clear: async () => {
      try {
        await middlewareManager.executeBefore(get(), 'clipboard:clear', null);

        set(
          (state) => ({
            ...state,
            items: [],
            lastCopiedAt: null,
          }),
          false,
          'clear'
        );

        await middlewareManager.executeAfter(get(), 'clipboard:clear', null);
        eventBus.emit('clipboard:clear', null);
      } catch (error) {
        console.error('Error clearing clipboard:', error);
        throw error;
      }
    },

    hasItems: (): boolean => {
      return get().items.length > 0;
    },

    reset: () => {
      set(initialState, false, 'reset');
      eventBus.emit('clipboard:reset', null);
    },

    hydrate: (state: Partial<ClipboardStoreState>) => {
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
        items: state.items,
        lastCopiedAt: state.lastCopiedAt,
      });
    },
  }))
);

// Selectors with shallow equality for optimized re-renders
export const clipboardSelectors = {
  items: (state: ClipboardStoreState) => state.items,
  lastCopiedAt: (state: ClipboardStoreState) => state.lastCopiedAt,
  hasItems: (state: ClipboardStoreState) => state.items.length > 0,
  itemCount: (state: ClipboardStoreState) => state.items.length,

  // Type-specific selectors
  components: (state: ClipboardStoreState) =>
    state.items.filter((item) => item.type === 'component'),
  text: (state: ClipboardStoreState) => state.items.filter((item) => item.type === 'text'),
  assets: (state: ClipboardStoreState) => state.items.filter((item) => item.type === 'asset'),

  // Compound selectors
  clipboardState: (state: ClipboardStoreState) => ({
    items: state.items,
    lastCopiedAt: state.lastCopiedAt,
    hasItems: state.items.length > 0,
  }),
};

// Custom hooks for common selections
export const useClipboardItems = () => useClipboardStore(clipboardSelectors.items, shallow);
export const useLastCopiedAt = () => useClipboardStore(clipboardSelectors.lastCopiedAt);
export const useHasClipboardItems = () => useClipboardStore(clipboardSelectors.hasItems);
export const useClipboardItemCount = () => useClipboardStore(clipboardSelectors.itemCount);
export const useClipboardComponents = () =>
  useClipboardStore(clipboardSelectors.components, shallow);
export const useClipboardText = () => useClipboardStore(clipboardSelectors.text, shallow);
export const useClipboardAssets = () => useClipboardStore(clipboardSelectors.assets, shallow);
export const useClipboardState = () =>
  useClipboardStore(clipboardSelectors.clipboardState, shallow);

// Helper hooks for common operations
export const useClipboardActions = () => {
  return {
    copy: useClipboardStore.getState().copy,
    paste: useClipboardStore.getState().paste,
    clear: useClipboardStore.getState().clear,
  };
};
