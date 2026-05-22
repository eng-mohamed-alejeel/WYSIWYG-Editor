// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ComponentNode, ComponentId, Command } from '@wysiwyg/core';

export interface HistoryState {
  past: Command[];
  present: Command | null;
  future: Command[];
}

export class HistoryManager {
  private state: HistoryState;
  private maxSize: number;
  private listeners: Set<(state: HistoryState) => void>;

  constructor(maxSize: number = 50) {
    this.state = {
      past: [],
      present: null,
      future: []
    };
    this.maxSize = maxSize;
    this.listeners = new Set();
  }

  // Subscribe to history changes
  subscribe(listener: (state: HistoryState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Execute a command
  execute(command: Command) {
    const newPast = [...this.state.past, this.state.present].filter(Boolean);

    if (newPast.length > this.maxSize) {
      newPast.shift();
    }

    command.execute();

    this.state = {
      past: newPast,
      present: command,
      future: []
    };

    this.notify();
  }

  // Undo last command
  undo() {
    if (!this.state.present || this.state.past.length === 0) {
      return false;
    }

    const commandToUndo = this.state.present;
    commandToUndo.undo();

    const newPresent = this.state.past[this.state.past.length - 1];
    const newPast = this.state.past.slice(0, -1);
    const newFuture = [commandToUndo, ...this.state.future];

    this.state = {
      past: newPast,
      present: newPresent,
      future: newFuture
    };

    this.notify();
    return true;
  }

  // Redo next command
  redo() {
    if (this.state.future.length === 0) {
      return false;
    }

    const commandToRedo = this.state.future[0];
    commandToRedo.execute();

    const newPast = [...this.state.past, this.state.present].filter(Boolean);
    const newPresent = commandToRedo;
    const newFuture = this.state.future.slice(1);

    this.state = {
      past: newPast,
      present: newPresent,
      future: newFuture
    };

    this.notify();
    return true;
  }

  // Check if can undo
  canUndo(): boolean {
    return this.state.past.length > 0;
  }

  // Check if can redo
  canRedo(): boolean {
    return this.state.future.length > 0;
  }

  // Clear history
  clear() {
    this.state = {
      past: [],
      present: null,
      future: []
    };
    this.notify();
  }

  // Get current state
  getState(): HistoryState {
    return { ...this.state };
  }
}

export default HistoryManager;
