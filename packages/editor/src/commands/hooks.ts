/**
 * Command Bus React Hooks
 *
 * React hooks for integrating with the command bus system
 */

import { useCallback, useEffect, useState } from 'react';
import {
  commandDispatcher,
  commandHistoryManager,
  keyboardShortcutsManager,
  CommandResult,
  CommandHistoryEntry,
  KeyboardShortcut,
} from './index';

/**
 * Hook for executing commands
 */
export function useCommand() {
  const execute = useCallback(
    async <TPayload = unknown, TResult = unknown>(
      commandType: string,
      payload: TPayload
    ): Promise<CommandResult<TResult>> => {
      return commandDispatcher.execute(commandType, payload);
    },
    []
  );

  const undo = useCallback(async () => {
    return commandDispatcher.undo();
  }, []);

  const redo = useCallback(async () => {
    return commandDispatcher.redo();
  }, []);

  return { execute, undo, redo };
}

/**
 * Hook for command history state
 */
export function useCommandHistory() {
  const [history, setHistory] = useState<CommandHistoryEntry[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const unsubscribe = commandHistoryManager.subscribe((newHistory) => {
      setHistory(newHistory);
      setCanUndo(commandHistoryManager.canUndo());
      setCanRedo(commandHistoryManager.canRedo());
    });

    // Initialize state
    setHistory(commandHistoryManager.getState().history);
    setCanUndo(commandHistoryManager.canUndo());
    setCanRedo(commandHistoryManager.canRedo());

    return unsubscribe;
  }, []);

  return { history, canUndo, canRedo };
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcuts() {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);

  useEffect(() => {
    // Initialize with all shortcuts
    setShortcuts(keyboardShortcutsManager.getAll());

    // Subscribe to shortcut changes
    const unsubscribe = keyboardShortcutsManager.subscribe((shortcut) => {
      setShortcuts(keyboardShortcutsManager.getAll());
    });

    return unsubscribe;
  }, []);

  const handleKeyboardEvent = useCallback((event: KeyboardEvent): KeyboardShortcut | undefined => {
    return keyboardShortcutsManager.handle(event);
  }, []);

  return { shortcuts, handleKeyboardEvent };
}

/**
 * Hook for registering keyboard shortcuts
 */
export function useRegisterKeyboardShortcut(shortcut: KeyboardShortcut) {
  useEffect(() => {
    keyboardShortcutsManager.register(shortcut);

    return () => {
      keyboardShortcutsManager.unregister(shortcut.command);
    };
  }, [shortcut]);
}

/**
 * Hook for command execution with loading state
 */
export function useCommandWithLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async <TPayload = unknown, TResult = unknown>(
      commandType: string,
      payload: TPayload
    ): Promise<CommandResult<TResult>> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await commandDispatcher.execute(commandType, payload);
        if (!result.success) {
          setError(result.error || null);
        }
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        return {
          success: false,
          error,
          timestamp: Date.now(),
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { execute, isLoading, error };
}

/**
 * Hook for transaction management
 */
export function useTransaction() {
  const [isInTransaction, setIsInTransaction] = useState(false);

  const beginTransaction = useCallback(() => {
    const transactionId = commandDispatcher.beginTransaction();
    setIsInTransaction(true);
    return transactionId;
  }, []);

  const commitTransaction = useCallback(() => {
    commandDispatcher.commitTransaction();
    setIsInTransaction(false);
  }, []);

  const rollbackTransaction = useCallback(() => {
    commandDispatcher.rollbackTransaction();
    setIsInTransaction(false);
  }, []);

  return {
    isInTransaction,
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
  };
}
