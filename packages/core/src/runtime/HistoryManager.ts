/**
 * History Manager Implementation
 *
 * Manages command history for undo/redo functionality
 */

import { Command, HistoryState } from '../types/editor';
import { EventBus } from './EventBus';

export class HistoryManager {
  private state: HistoryState;
  private eventBus: EventBus;
  private maxSize: number;

  constructor(maxSize: number = 50, eventBus?: EventBus) {
    this.maxSize = maxSize;
    this.eventBus = eventBus ?? new EventBus();
    this.state = {
      past: [],
      present: null,
      future: [],
      maxSize,
    };
  }

  execute(command: Command): void {
    // Add current state to past if there's a present command
    if (this.state.present) {
      this.state.past.push(this.state.present);
    }

    // Execute the command
    command.execute();

    // Set as present
    this.state.present = command;

    // Clear future
    this.state.future = [];

    // Enforce max size
    if (this.state.past.length > this.maxSize) {
      this.state.past.shift();
    }

    this.emitChange();
  }

  undo(): void {
    if (!this.canUndo()) {
      return;
    }

    // Move present to future
    if (this.state.present) {
      this.state.future.unshift(this.state.present);
    }

    // Get last from past and make it present
    const previous = this.state.past.pop()!;
    previous.undo();
    this.state.present = previous;

    this.emitChange();
  }

  redo(): void {
    if (!this.canRedo()) {
      return;
    }

    // Move present to past
    if (this.state.present) {
      this.state.past.push(this.state.present);
    }

    // Get first from future and make it present
    const next = this.state.future.shift()!;
    next.execute();
    this.state.present = next;

    this.emitChange();
  }

  canUndo(): boolean {
    return this.state.past.length > 0;
  }

  canRedo(): boolean {
    return this.state.future.length > 0;
  }

  getState(): HistoryState {
    return {
      past: [...this.state.past],
      present: this.state.present,
      future: [...this.state.future],
      maxSize: this.state.maxSize,
    };
  }

  clear(): void {
    this.state = {
      past: [],
      present: null,
      future: [],
      maxSize: this.maxSize,
    };
    this.emitChange();
  }

  private emitChange(): void {
    this.eventBus.emit('history:change', this.getState());
  }
}
