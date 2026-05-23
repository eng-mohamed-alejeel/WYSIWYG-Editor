/**
 * Store Middleware System
 *
 * Provides middleware architecture for state management
 * Supports logging, persistence, analytics, and custom middleware
 */

import { MiddlewareConfig } from './types';
import { eventBus } from './events';

/**
 * Base middleware interface
 */
export interface StoreMiddleware {
  name: string;
  priority: number;
  before?: (state: unknown, action: string, payload: unknown) => unknown | Promise<unknown>;
  after?: (state: unknown, action: string, payload: unknown) => void | Promise<void>;
  onError?: (error: Error, action: string, payload: unknown) => void;
}

/**
 * Middleware manager for handling store middleware
 */
class MiddlewareManager {
  private middlewares: Map<string, StoreMiddleware> = new Map();

  /**
   * Register a middleware
   */
  register(config: MiddlewareConfig): void {
    const middleware: StoreMiddleware = {
      name: config.name,
      priority: config.priority ?? 0,
      before: config.before,
      after: config.after,
      onError: config.onError,
    };

    this.middlewares.set(config.name, middleware);
  }

  /**
   * Unregister a middleware
   */
  unregister(name: string): void {
    this.middlewares.delete(name);
  }

  /**
   * Get all middlewares sorted by priority
   */
  getAll(): StoreMiddleware[] {
    return Array.from(this.middlewares.values()).sort((a, b) => b.priority - a.priority);
  }

  /**
   * Execute before hooks
   */
  async executeBefore(state: unknown, action: string, payload: unknown): Promise<unknown> {
    const middlewares = this.getAll();
    let result = payload;

    for (const middleware of middlewares) {
      if (middleware.before) {
        try {
          result = await middleware.before(state, action, result);
        } catch (error) {
          if (middleware.onError) {
            middleware.onError(error as Error, action, result);
          }
          throw error;
        }
      }
    }

    return result;
  }

  /**
   * Execute after hooks
   */
  async executeAfter(state: unknown, action: string, payload: unknown): Promise<void> {
    const middlewares = this.getAll();

    for (const middleware of middlewares) {
      if (middleware.after) {
        try {
          await middleware.after(state, action, payload);
        } catch (error) {
          if (middleware.onError) {
            middleware.onError(error as Error, action, payload);
          }
          throw error;
        }
      }
    }
  }
}

// Singleton instance
export const middlewareManager = new MiddlewareManager();

/**
 * Logging middleware
 */
export const loggingMiddleware: MiddlewareConfig = {
  name: 'logging',
  priority: 100,
  before: (state, action, payload) => {
    console.log(`[Action] ${action}`, payload);
    return payload;
  },
  after: (state, action) => {
    console.log(`[State Updated] ${action}`);
  },
  onError: (error, action) => {
    console.error(`[Error] ${action}:`, error);
  },
};

/**
 * Event emission middleware
 */
export const eventMiddleware: MiddlewareConfig = {
  name: 'events',
  priority: 90,
  after: (state, action, payload) => {
    // Convert action to event type
    const eventType = action.replace(/([A-Z])/g, '_$1').toLowerCase() as any;
    eventBus.emit(eventType, payload);
  },
};

/**
 * Analytics middleware
 */
export const analyticsMiddleware: MiddlewareConfig = {
  name: 'analytics',
  priority: 80,
  after: (state, action, payload) => {
    // Track important actions
    const trackableActions = [
      'component:delete',
      'component:update',
      'page:change',
      'asset:upload',
    ];

    if (trackableActions.includes(action)) {
      // Emit analytics event
      eventBus.emit('analytics:track', {
        action,
        payload,
        timestamp: Date.now(),
      });
    }
  },
};

/**
 * Performance monitoring middleware
 */
export const performanceMiddleware: MiddlewareConfig = {
  name: 'performance',
  priority: 70,
  before: () => {
    performance.mark(`${Date.now()}-action-start`);
  },
  after: (state, action) => {
    performance.mark(`${Date.now()}-action-end`);
    performance.measure(
      `action-${action}`,
      `${Date.now()}-action-start`,
      `${Date.now()}-action-end`
    );
  },
};

/**
 * CRDT sync middleware for collaboration
 */
export const crdtSyncMiddleware: MiddlewareConfig = {
  name: 'crdt-sync',
  priority: 60,
  after: (state, action, payload) => {
    // Emit CRDT operation for remote sync
    eventBus.emit('crdt:operation', {
      type: action,
      payload,
      timestamp: Date.now(),
    });
  },
};
