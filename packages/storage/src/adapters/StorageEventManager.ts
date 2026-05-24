/**
 * Storage Event Manager
 *
 * Manages storage event listeners and event emission.
 */

import { StorageEvent, StorageEventListener } from '../types';

export class StorageEventManager {
  private eventListeners: StorageEventListener[] = [];

  /**
   * Add an event listener
   */
  addEventListener(listener: StorageEventListener): void {
    this.eventListeners.push(listener);
  }

  /**
   * Remove an event listener
   */
  removeEventListener(listener: StorageEventListener): void {
    this.eventListeners = this.eventListeners.filter((l) => l !== listener);
  }

  /**
   * Emit an event to all listeners
   */
  emitEvent(event: StorageEvent): void {
    this.eventListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in storage event listener:', error);
      }
    });
  }

  /**
   * Clear all event listeners
   */
  clearListeners(): void {
    this.eventListeners = [];
  }
}
