/**
 * Editor Events System
 *
 * Provides event-driven communication between stores and components
 * Supports local and remote events for collaboration
 */

import { EditorEvent, EditorEventType, EventListener } from './types';

type EventMap = Record<EditorEventType, Set<EventListener>>;
type WildcardListener = (event: EditorEvent) => void;

class EditorEventBus {
  private listeners: Partial<EventMap> = {};
  private wildcardListeners: Set<WildcardListener> = new Set();
  private eventHistory: EditorEvent[] = [];
  private maxHistorySize = 100;

  /**
   * Subscribe to a specific event type
   */
  on<T = unknown>(eventType: EditorEventType, listener: EventListener<T>): () => void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = new Set();
    }
    this.listeners[eventType]!.add(listener as EventListener);

    // Return unsubscribe function
    return () => {
      this.listeners[eventType]?.delete(listener as EventListener);
    };
  }

  /**
   * Subscribe to all events
   */
  onAny(listener: WildcardListener): () => void {
    this.wildcardListeners.add(listener);
    return () => {
      this.wildcardListeners.delete(listener);
    };
  }

  /**
   * Emit an event
   */
  emit<T = unknown>(
    eventType: EditorEventType,
    payload: T,
    source: 'local' | 'remote' = 'local',
    userId?: string
  ): void {
    const event: EditorEvent<T> = {
      type: eventType,
      payload,
      timestamp: Date.now(),
      source,
      userId,
    };

    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Notify type-specific listeners
    this.listeners[eventType]?.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error);
      }
    });

    // Notify wildcard listeners
    this.wildcardListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in wildcard event listener:', error);
      }
    });
  }

  /**
   * Remove all listeners for an event type
   */
  off(eventType: EditorEventType): void {
    this.listeners[eventType]?.clear();
  }

  /**
   * Remove all listeners
   */
  clear(): void {
    Object.keys(this.listeners).forEach((key) => {
      this.listeners[key as EditorEventType]?.clear();
    });
    this.wildcardListeners.clear();
    this.eventHistory = [];
  }

  /**
   * Get event history
   */
  getHistory(eventType?: EditorEventType, limit?: number): EditorEvent[] {
    let events = eventType
      ? this.eventHistory.filter((e) => e.type === eventType)
      : [...this.eventHistory];

    if (limit) {
      events = events.slice(-limit);
    }

    return events;
  }

  /**
   * Check if there are listeners for an event type
   */
  hasListeners(eventType: EditorEventType): boolean {
    return (this.listeners[eventType]?.size ?? 0) > 0;
  }
}

// Singleton instance
export const eventBus = new EditorEventBus();

// Export event types for convenience
export type { EditorEvent, EditorEventType, EventListener };
