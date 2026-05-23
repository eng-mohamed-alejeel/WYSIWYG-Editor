/**
 * Command Bus Integration
 *
 * Integrates the command bus with existing editor stores
 */

import { commandDispatcher, commandMiddlewareManager, commandHistoryManager } from './index';
import { eventBus } from '../stores/events';
import { CommandResult, CommandMiddleware } from './types';

/**
 * Initialize command bus integration with editor stores
 */
export function initializeCommandBusIntegration(): void {
  // Register event middleware to emit events for all commands
  const eventMiddleware: CommandMiddleware = {
    name: 'event-emitter',
    priority: 90,
    after: (command, payload, result) => {
      // Emit command completion event
      eventBus.emit(`command:${command}:complete`, {
        payload,
        result,
        timestamp: Date.now(),
      });

      // Emit success/failure events
      if (result.success) {
        eventBus.emit(`command:${command}:success`, {
          payload,
          result,
          timestamp: Date.now(),
        });
      } else {
        eventBus.emit(`command:${command}:error`, {
          payload,
          error: result.error,
          timestamp: Date.now(),
        });
      }
    },
    onError: (error, command, payload) => {
      eventBus.emit(`command:${command}:error`, {
        payload,
        error,
        timestamp: Date.now(),
      });
    },
  };

  commandMiddlewareManager.register(eventMiddleware);

  // Subscribe to command history changes and emit events
  commandHistoryManager.subscribe((history) => {
    eventBus.emit('command:history:update', {
      history,
      canUndo: commandHistoryManager.canUndo(),
      canRedo: commandHistoryManager.canRedo(),
      timestamp: Date.now(),
    });
  });

  // Subscribe to undo/redo events from history store
  eventBus.on('history:undo', async () => {
    await commandDispatcher.undo();
  });

  eventBus.on('history:redo', async () => {
    await commandDispatcher.redo();
  });
}

/**
 * Create a command handler that updates a store
 */
export function createStoreCommandHandler<TPayload, TResult>(
  storeName: string,
  action: string,
  handler: (payload: TPayload) => Promise<TResult> | TResult
) {
  return async (payload: TPayload): Promise<CommandResult<TResult>> => {
    try {
      // Emit event before execution
      eventBus.emit(`${storeName}:${action}:start`, payload);

      // Execute the handler
      const result = await handler(payload);

      // Emit event after execution
      eventBus.emit(`${storeName}:${action}:complete`, {
        payload,
        result,
        timestamp: Date.now(),
      });

      return {
        success: true,
        data: result,
        timestamp: Date.now(),
      };
    } catch (error) {
      // Emit error event
      eventBus.emit(`${storeName}:${action}:error`, {
        payload,
        error,
        timestamp: Date.now(),
      });

      return {
        success: false,
        error: error as Error,
        timestamp: Date.now(),
      };
    }
  };
}

/**
 * Create a command middleware that syncs with a store
 */
export function createStoreSyncMiddleware(
  storeName: string,
  syncActions: string[]
): CommandMiddleware {
  return {
    name: `${storeName}-sync`,
    priority: 80,
    after: (command, payload, result) => {
      if (syncActions.includes(command)) {
        eventBus.emit(`${storeName}:sync`, {
          command,
          payload,
          result,
          timestamp: Date.now(),
        });
      }
    },
  };
}
