/**
 * WYSIWYG Editor History Package
 * 
 * This package implements an undo/redo system using the Command Pattern.
 * It provides a robust history management system for tracking and reverting changes.
 */

import { Command, HistoryState } from '@wysiwyg/core';
import { DEFAULT_HISTORY_SETTINGS } from '@wysiwyg/shared';

/**
 * History Manager Class
 * 
 * Manages the undo/redo stack and executes commands.
 * Uses the Command Pattern for encapsulating operations.
 */
export class HistoryManager {
  private state: HistoryState;
  private listeners: Set<(state: HistoryState) => void> = new Set();
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor(maxSize: number = DEFAULT_HISTORY_SETTINGS.maxSize) {
    this.state = {
      past: [],
      present: null,
      future: [],
      maxSize
    };
  }

  /**
   * Execute a command and add it to history
   */
  execute(command: Command): void {
    try {
      // Execute the command
      command.execute();

      // Clear future stack when executing new command
      this.state.future = [];

      // Add current present to past if exists
      if (this.state.present) {
        this.state.past.push(this.state.present);

        // Maintain max size
        if (this.state.past.length > this.state.maxSize) {
          this.state.past.shift();
        }
      }

      // Set new present
      this.state.present = command;

      // Notify listeners
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to execute command:', error);
      throw error;
    }
  }

  /**
   * Execute command with debouncing
   * Useful for batch operations
   */
  executeDebounced(command: Command, delay: number = DEFAULT_HISTORY_SETTINGS.debounceTime): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.execute(command);
      this.debounceTimer = null;
    }, delay);
  }

  /**
   * Undo the last command
   */
  undo(): boolean {
    if (!this.canUndo()) {
      return false;
    }

    try {
      const command = this.state.past.pop()!;

      // Undo the current present command
      if (this.state.present) {
        this.state.present.undo();
      }

      // Move present to future
      this.state.future.unshift(this.state.present!);

      // Set new present
      this.state.present = command;

      // Notify listeners
      this.notifyListeners();

      return true;
    } catch (error) {
      console.error('Failed to undo command:', error);
      return false;
    }
  }

  /**
   * Redo the last undone command
   */
  redo(): boolean {
    if (!this.canRedo()) {
      return false;
    }

    try {
      const command = this.state.future.shift()!;

      // Add current present to past
      if (this.state.present) {
        this.state.past.push(this.state.present);
      }

      // Execute the command
      command.execute();

      // Set new present
      this.state.present = command;

      // Notify listeners
      this.notifyListeners();

      return true;
    } catch (error) {
      console.error('Failed to redo command:', error);
      return false;
    }
  }

  /**
   * Check if undo is possible
   */
  canUndo(): boolean {
    return this.state.past.length > 0;
  }

  /**
   * Check if redo is possible
   */
  canRedo(): boolean {
    return this.state.future.length > 0;
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.state = {
      past: [],
      present: null,
      future: [],
      maxSize: this.state.maxSize
    };
    this.notifyListeners();
  }

  /**
   * Get current history state
   */
  getState(): HistoryState {
    return { ...this.state };
  }

  /**
   * Subscribe to history changes
   */
  subscribe(listener: (state: HistoryState) => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      listener(this.getState());
    });
  }

  /**
   * Get command history as array
   */
  getHistory(): Command[] {
    return [...this.state.past, ...(this.state.present ? [this.state.present] : []), ...this.state.future];
  }

  /**
   * Jump to a specific point in history
   */
  jumpTo(index: number): boolean {
    const history = this.getHistory();
    if (index < 0 || index >= history.length) {
      return false;
    }

    const targetCommand = history[index];
    const currentIndex = this.state.past.length;

    if (index < currentIndex) {
      // Undo to reach target
      while (this.state.past.length > index) {
        this.undo();
      }
    } else if (index > currentIndex) {
      // Redo to reach target
      while (this.state.future.length > 0 && this.state.past.length < index) {
        this.redo();
      }
    }

    return true;
  }

  /**
   * Group multiple commands into a single history entry
   */
  groupCommands(commands: Command[], groupDescription: string): Command {
    const groupCommand: Command = {
      type: 'group',
      execute: () => {
        commands.forEach(cmd => cmd.execute());
      },
      undo: () => {
        [...commands].reverse().forEach(cmd => cmd.undo());
      },
      description: groupDescription,
      timestamp: Date.now()
    };

    return groupCommand;
  }

  /**
   * Create a batch operation that will be executed as a single command
   */
  createBatch(commands: Command[], description: string): Command {
    return this.groupCommands(commands, description);
  }

  /**
   * Start a batch operation
   * Returns a function that should be called to end the batch
   */
  startBatch(description: string): {
    addCommand: (command: Command) => void;
    end: () => void;
  } {
    const commands: Command[] = [];

    return {
      addCommand: (command: Command) => {
        commands.push(command);
      },
      end: () => {
        if (commands.length > 0) {
          const batchCommand = this.groupCommands(commands, description);
          this.execute(batchCommand);
        }
      }
    };
  }

  /**
   * Get the number of commands in history
   */
  getHistorySize(): number {
    return this.state.past.length + 
           (this.state.present ? 1 : 0) + 
           this.state.future.length;
  }

  /**
   * Get the current position in history
   */
  getCurrentPosition(): number {
    return this.state.past.length;
  }

  /**
   * Export history state
   */
  exportState(): HistoryState {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Import history state
   */
  importState(state: HistoryState): void {
    this.state = {
      ...state,
      past: JSON.parse(JSON.stringify(state.past)),
      future: JSON.parse(JSON.stringify(state.future)),
      present: state.present ? JSON.parse(JSON.stringify(state.present)) : null
    };
    this.notifyListeners();
  }
}

/**
 * Create a command factory for common operations
 */
export class CommandFactory {
  /**
   * Create a command that updates a value
   */
  static createUpdateCommand<T>(
    target: any,
    path: string,
    newValue: T,
    description?: string
  ): Command {
    const oldValue = this.getPathValue(target, path);

    return {
      type: 'update',
      execute: () => {
        this.setPathValue(target, path, newValue);
      },
      undo: () => {
        this.setPathValue(target, path, oldValue);
      },
      description: description || `Update ${path}`,
      timestamp: Date.now()
    };
  }

  /**
   * Create a command that adds an item to an array
   */
  static createAddCommand<T>(
    target: T[],
    item: T,
    index?: number,
    description?: string
  ): Command {
    const addIndex = index ?? target.length;

    return {
      type: 'add',
      execute: () => {
        target.splice(addIndex, 0, item);
      },
      undo: () => {
        target.splice(addIndex, 1);
      },
      description: description || 'Add item',
      timestamp: Date.now()
    };
  }

  /**
   * Create a command that removes an item from an array
   */
  static createRemoveCommand<T>(
    target: T[],
    index: number,
    description?: string
  ): Command {
    const removedItem = target[index];

    return {
      type: 'remove',
      execute: () => {
        target.splice(index, 1);
      },
      undo: () => {
        target.splice(index, 0, removedItem);
      },
      description: description || 'Remove item',
      timestamp: Date.now()
    };
  }

  /**
   * Create a command that moves an item in an array
   */
  static createMoveCommand<T>(
    target: T[],
    fromIndex: number,
    toIndex: number,
    description?: string
  ): Command {
    return {
      type: 'move',
      execute: () => {
        const [item] = target.splice(fromIndex, 1);
        target.splice(toIndex, 0, item);
      },
      undo: () => {
        const [item] = target.splice(toIndex, 1);
        target.splice(fromIndex, 0, item);
      },
      description: description || 'Move item',
      timestamp: Date.now()
    };
  }

  /**
   * Create a command that replaces an item in an array
   */
  static createReplaceCommand<T>(
    target: T[],
    index: number,
    newItem: T,
    description?: string
  ): Command {
    const oldItem = target[index];

    return {
      type: 'replace',
      execute: () => {
        target[index] = newItem;
      },
      undo: () => {
        target[index] = oldItem;
      },
      description: description || 'Replace item',
      timestamp: Date.now()
    };
  }

  private static getPathValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private static setPathValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }
}
