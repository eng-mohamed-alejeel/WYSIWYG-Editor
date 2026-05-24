/**
 * Event Bus Implementation
 *
 * Provides pub/sub mechanism for loose coupling between subsystems
 */

export type EventHandler<T = unknown> = (data: T) => void;

export interface EventBusInterface {
  on<T = unknown>(event: string, handler: EventHandler<T>): () => void;
  off<T = unknown>(event: string, handler: EventHandler<T>): void;
  emit<T = unknown>(event: string, data: T): void;
  once<T = unknown>(event: string, handler: EventHandler<T>): () => void;
  clear(): void;
}

export class EventBus implements EventBusInterface {
  private handlers = new Map<string, Set<EventHandler>>();

  on<T = unknown>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set<EventHandler<unknown>>());
    }
    this.handlers.get(event)!.add(handler as EventHandler<unknown>);

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  off<T = unknown>(event: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler as EventHandler<unknown>);
      if (handlers.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  emit<T = unknown>(event: string, data: T): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  once<T = unknown>(event: string, handler: EventHandler<T>): () => void {
    const onceHandler: EventHandler<T> = (data) => {
      handler(data);
      this.off(event, onceHandler);
    };
    return this.on(event, onceHandler);
  }

  clear(): void {
    this.handlers.clear();
  }
}
