/**
 * History Store
 *
 * Manages undo/redo history with transaction support
 * Optimized for performance with selective subscriptions
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { HistoryStoreState, TransactionState, Operation, TransactionResult } from './types';
import { eventBus } from './events';
import { middlewareManager } from './middleware';

interface HistoryStore extends HistoryStoreState {
  // Transaction state
  transaction: TransactionState | null;

  // Actions
  push: (state: unknown, description?: string) => Promise<void>;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  clear: () => Promise<void>;
  beginTransaction: (description?: string) => void;
  commitTransaction: () => Promise<TransactionResult>;
  rollbackTransaction: () => void;
  isInTransaction: () => boolean;
  reset: () => void;
  hydrate: (state: Partial<HistoryStoreState>) => void;
  toJSON: () => string;
}

const initialState: HistoryStoreState = {
  past: [],
  present: null,
  future: [],
  maxSize: 50,
  canUndo: false,
  canRedo: false,
};

export const useHistoryStore = create<HistoryStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    transaction: null,

    push: async (state: unknown, description?: string) => {
      try {
        const payload = { state, description };
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'history:push',
          payload
        );

        set(
          (state) => {
            const { state: newState, description: newDescription } = processedPayload as {
              state: unknown;
              description?: string;
            };

            const newPast = [...state.past, state.present].filter(Boolean);

            // Enforce max size
            if (newPast.length > state.maxSize) {
              newPast.shift();
            }

            return {
              past: newPast,
              present: { state: newState, description: newDescription },
              future: [],
              canUndo: newPast.length > 0,
              canRedo: false,
            };
          },
          false,
          'history:push'
        );

        await middlewareManager.executeAfter(get(), 'history:push', processedPayload);
        eventBus.emit('history:push', processedPayload);
      } catch (error) {
        console.error('Error pushing to history:', error);
        throw error;
      }
    },

    undo: async () => {
      const state = get();
      if (!state.canUndo || state.transaction?.isActive) return;

      try {
        await middlewareManager.executeBefore(get(), 'history:undo', null);

        set(
          (state) => {
            const newPresent = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, -1);
            const newFuture = [state.present, ...state.future].filter(Boolean);

            return {
              past: newPast,
              present: newPresent,
              future: newFuture,
              canUndo: newPast.length > 0,
              canRedo: newFuture.length > 0,
            };
          },
          false,
          'history:undo'
        );

        await middlewareManager.executeAfter(get(), 'history:undo', null);
        eventBus.emit('history:undo', null);
      } catch (error) {
        console.error('Error undoing:', error);
        throw error;
      }
    },

    redo: async () => {
      const state = get();
      if (!state.canRedo || state.transaction?.isActive) return;

      try {
        await middlewareManager.executeBefore(get(), 'history:redo', null);

        set(
          (state) => {
            const newPresent = state.future[0];
            const newPast = [...state.past, state.present].filter(Boolean);
            const newFuture = state.future.slice(1);

            return {
              past: newPast,
              present: newPresent,
              future: newFuture,
              canUndo: newPast.length > 0,
              canRedo: newFuture.length > 0,
            };
          },
          false,
          'history:redo'
        );

        await middlewareManager.executeAfter(get(), 'history:redo', null);
        eventBus.emit('history:redo', null);
      } catch (error) {
        console.error('Error redoing:', error);
        throw error;
      }
    },

    clear: async () => {
      try {
        await middlewareManager.executeBefore(get(), 'history:clear', null);

        set(
          (state) => ({
            ...state,
            past: [],
            present: null,
            future: [],
            canUndo: false,
            canRedo: false,
          }),
          false,
          'history:clear'
        );

        await middlewareManager.executeAfter(get(), 'history:clear', null);
        eventBus.emit('history:clear', null);
      } catch (error) {
        console.error('Error clearing history:', error);
        throw error;
      }
    },

    beginTransaction: (description?: string) => {
      const state = get();
      if (state.transaction?.isActive) {
        console.warn('Transaction already in progress');
        return;
      }

      const transaction: TransactionState = {
        isActive: true,
        operations: [],
        startTime: Date.now(),
        description,
      };

      set({ transaction }, false, 'beginTransaction');
      eventBus.emit('transaction:start', transaction);
    },

    commitTransaction: async (): Promise<TransactionResult> => {
      const state = get();
      if (!state.transaction?.isActive) {
        return {
          success: false,
          operations: [],
          error: new Error('No active transaction'),
        };
      }

      try {
        await middlewareManager.executeBefore(get(), 'transaction:commit', state.transaction);

        const result: TransactionResult = {
          success: true,
          operations: state.transaction.operations,
        };

        set({ transaction: null }, false, 'commitTransaction');

        await middlewareManager.executeAfter(get(), 'transaction:commit', result);
        eventBus.emit('transaction:commit', result);

        return result;
      } catch (error) {
        const result: TransactionResult = {
          success: false,
          operations: state.transaction.operations,
          error: error as Error,
        };

        set({ transaction: null }, false, 'commitTransaction');
        eventBus.emit('transaction:error', result);

        return result;
      }
    },

    rollbackTransaction: () => {
      const state = get();
      if (!state.transaction?.isActive) {
        console.warn('No active transaction to rollback');
        return;
      }

      const result: TransactionResult = {
        success: true,
        operations: state.transaction.operations,
      };

      set({ transaction: null }, false, 'rollbackTransaction');
      eventBus.emit('transaction:rollback', result);
    },

    isInTransaction: (): boolean => {
      return get().transaction?.isActive ?? false;
    },

    reset: () => {
      set({ ...initialState, transaction: null }, false, 'reset');
      eventBus.emit('history:reset', null);
    },

    hydrate: (state: Partial<HistoryStoreState>) => {
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
        past: state.past,
        present: state.present,
        future: state.future,
        maxSize: state.maxSize,
      });
    },
  }))
);

// Selectors with shallow equality for optimized re-renders
export const historySelectors = {
  canUndo: (state: HistoryStoreState) => state.canUndo,
  canRedo: (state: HistoryStoreState) => state.canRedo,
  pastCount: (state: HistoryStoreState) => state.past.length,
  futureCount: (state: HistoryStoreState) => state.future.length,
  present: (state: HistoryStoreState) => state.present,
  isInTransaction: (state: HistoryStoreState) => state.transaction?.isActive ?? false,

  // Compound selectors
  historyState: (state: HistoryStoreState) => ({
    canUndo: state.canUndo,
    canRedo: state.canRedo,
    pastCount: state.past.length,
    futureCount: state.future.length,
  }),
};

// Custom hooks for common selections
export const useCanUndo = () => useHistoryStore(historySelectors.canUndo);
export const useCanRedo = () => useHistoryStore(historySelectors.canRedo);
export const usePastCount = () => useHistoryStore(historySelectors.pastCount);
export const useFutureCount = () => useHistoryStore(historySelectors.futureCount);
export const usePresent = () => useHistoryStore(historySelectors.present);
export const useIsInTransaction = () => useHistoryStore(historySelectors.isInTransaction);
export const useHistoryState = () => useHistoryStore(historySelectors.historyState, shallow);

// Transaction helper hook
export const useTransaction = () => {
  const isInTransaction = useIsInTransaction();

  return {
    isInTransaction,
    beginTransaction: useHistoryStore.getState().beginTransaction,
    commitTransaction: useHistoryStore.getState().commitTransaction,
    rollbackTransaction: useHistoryStore.getState().rollbackTransaction,
  };
};
