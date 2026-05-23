/**
 * Command Middleware Manager
 *
 * Manages command middleware execution with priority-based ordering
 */

import { CommandMiddleware, CommandResult } from './types';

class CommandMiddlewareManager {
  private middlewares: Map<string, CommandMiddleware> = new Map();

  /**
   * Register a middleware
   */
  register(middleware: CommandMiddleware): void {
    this.middlewares.set(middleware.name, middleware);
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
  private getAll(): CommandMiddleware[] {
    return Array.from(this.middlewares.values()).sort((a, b) => b.priority - a.priority);
  }

  /**
   * Execute before hooks
   */
  async executeBefore(command: string, payload: unknown): Promise<unknown> {
    const middlewares = this.getAll();
    let result = payload;

    for (const middleware of middlewares) {
      if (middleware.before) {
        try {
          result = await middleware.before(command, result);
        } catch (error) {
          if (middleware.onError) {
            middleware.onError(error as Error, command, result);
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
  async executeAfter(command: string, payload: unknown, result: CommandResult): Promise<void> {
    const middlewares = this.getAll();

    for (const middleware of middlewares) {
      if (middleware.after) {
        try {
          await middleware.after(command, payload, result);
        } catch (error) {
          if (middleware.onError) {
            middleware.onError(error as Error, command, payload);
          }
          throw error;
        }
      }
    }
  }
}

// Singleton instance
export const commandMiddlewareManager = new CommandMiddlewareManager();
