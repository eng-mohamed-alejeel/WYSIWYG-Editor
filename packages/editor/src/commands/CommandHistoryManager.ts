/**
 * Command History Manager
 *
 * Manages command execution history with undo/redo support
 */

import { CommandHistoryEntry, CommandResult } from './types';

class CommandHistoryManager {
  private history: CommandHistoryEntry[] = [];
  private redoStack: CommandHistoryEntry[] = [];
  private maxSize: number = 50;
  private listeners: Set<(history: CommandHistoryEntry[]) => void> = new Set();

  /**
   * Add an entry to history
   */
  add(entry: CommandHistoryEntry): void {
    // Clear redo stack when new command is executed
    this.redoStack = [];

    // Add to history
    this.history.push(entry);

    // Enforce max size
    if (this.history.length > this.maxSize) {
      this.history.shift();
    }

    this.notifyListeners();
  }

  /**
   * Get the last undoable entry
   */
  getLastUndoable(): CommandHistoryEntry | undefined {
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (this.history[i].undoable) {
        return this.history[i];
      }
    }
    return undefined;
  }

  /**
   * Undo the last command
   */
  undo(): CommandHistoryEntry | undefined {
    const entry = this.getLastUndoable();
    if (!entry) {
      return undefined;
    }

    // Remove from history and add to redo stack
    const index = this.history.indexOf(entry);
    this.history.splice(index, 1);
    this.redoStack.push(entry);

    this.notifyListeners();
    return entry;
  }

  /**
   * Redo the last undone command
   */
  redo(): CommandHistoryEntry | undefined {
    const entry = this.redoStack.pop();
    if (!entry) {
      return undefined;
    }

    // Add back to history
    this.history.push(entry);

    this.notifyListeners();
    return entry;
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = [];
    this.redoStack = [];
    this.notifyListeners();
  }

  /**
   * Check if undo is available
   */
  canUndo(): boolean {
    return this.history.some((entry) => entry.undoable);
  }

  /**
   * Check if redo is available
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Get current history state
   */
  getState(): {
    history: CommandHistoryEntry[];
    canUndo: boolean;
    canRedo: boolean;
  } {
    return {
      history: [...this.history],
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    };
  }

  /**
   * Subscribe to history changes
   */
  subscribe(listener: (history: CommandHistoryEntry[]) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of history changes
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener([...this.history]);
      } catch (error) {
        console.error('Error in history listener:', error);
      }
    });
  }

  /**
   * Set maximum history size
   */
  setMaxSize(size: number): void {
    this.maxSize = size;
    // Trim history if needed
    while (this.history.length > this.maxSize) {
      this.history.shift();
    }
  }
}

// Singleton instance
export const commandHistoryManager = new CommandHistoryManager();
