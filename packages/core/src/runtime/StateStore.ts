/**
 * State Store Implementation
 *
 * Provides centralized state management with subscription support
 */

import { EventBus } from './EventBus';

export type StateListener<T> = (state: T, previousState: T) => void;

export interface StateStoreInterface<T> {
  getState(): T;
  setState(updater: Partial<T> | ((state: T) => Partial<T>)): void;
  subscribe(listener: StateListener<T>): () => void;
  reset(): void;
}

export class StateStore<T> implements StateStoreInterface<T> {
  private state: T;
  private listeners = new Set<StateListener<T>>();
  private eventBus: EventBus;

  constructor(initialState: T, eventBus?: EventBus) {
    this.state = initialState;
    this.eventBus = eventBus ?? new EventBus();
  }

  getState(): T {
    return { ...this.state };
  }

  setState(updater: Partial<T> | ((state: T) => Partial<T>)): void {
    const previousState = { ...this.state };
    const updates = typeof updater === 'function' ? updater(this.state) : updater;

    this.state = { ...this.state, ...updates };

    // Notify listeners
    this.listeners.forEach((listener) => {
      try {
        listener(this.state, previousState);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });

    // Emit state change event
    this.eventBus.emit('state:change', {
      state: this.state,
      previousState,
      updates,
    });
  }

  subscribe(listener: StateListener<T>): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  reset(): void {
    const previousState = { ...this.state };
    this.state = {} as T;

    this.listeners.forEach((listener) => {
      try {
        listener(this.state, previousState);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });

    this.eventBus.emit('state:reset', { previousState });
  }
}
