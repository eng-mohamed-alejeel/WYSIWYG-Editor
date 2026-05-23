/**
 * Plugin Event Bus
 *
 * Internal event system for plugin communication
 * Supports event isolation and lazy subscription
 */

import { PluginEventBus } from './types';

type EventListener = (...args: unknown[]) => void;
type EventMap = Record<string, Set<EventListener>>;

class PluginEventBusImpl implements PluginEventBus {
  private listeners: EventMap = {};
  private onceListeners: Map<EventListener, Set<string>> = new Map();
  private eventHistory: Map<string, Array<{ timestamp: number; data: unknown }>> = new Map();
  private maxHistorySize = 100;

  /**
   * Subscribe to an event
   */
  on<T = unknown>(event: string, listener: (data: T) => void): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event].add(listener as EventListener);

    // Return unsubscribe function
    return () => this.off(event, listener as EventListener);
  }

  /**
   * Subscribe to an event once
   */
  once<T = unknown>(event: string, listener: (data: T) => void): () => void {
    const wrappedListener = ((data: T) => {
      listener(data);
      this.off(event, wrappedListener as EventListener);
    }) as EventListener;

    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event].add(wrappedListener);

    // Track once listeners
    if (!this.onceListeners.has(wrappedListener)) {
      this.onceListeners.set(wrappedListener, new Set());
    }
    this.onceListeners.get(wrappedListener)!.add(event);

    // Return unsubscribe function
    return () => this.off(event, wrappedListener);
  }

  /**
   * Emit an event
   */
  emit<T = unknown>(event: string, data: T): void {
    // Add to history
    if (!this.eventHistory.has(event)) {
      this.eventHistory.set(event, []);
    }
    const history = this.eventHistory.get(event)!;
    history.push({ timestamp: Date.now(), data });
    if (history.length > this.maxHistorySize) {
      history.shift();
    }

    // Notify listeners
    const listeners = this.listeners[event];
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, listener: EventListener): void {
    const listeners = this.listeners[event];
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        delete this.listeners[event];
      }
    }
  }

  /**
   * Remove all listeners for an event or all events
   */
  removeAllListeners(event?: string): void {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }

  /**
   * Get event history
   */
  getHistory(event: string, limit?: number): Array<{ timestamp: number; data: unknown }> {
    const history = this.eventHistory.get(event) || [];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Clear event history
   */
  clearHistory(event?: string): void {
    if (event) {
      this.eventHistory.delete(event);
    } else {
      this.eventHistory.clear();
    }
  }
}

// Create singleton instance
export const createEventBus = (): PluginEventBus => new PluginEventBusImpl();
