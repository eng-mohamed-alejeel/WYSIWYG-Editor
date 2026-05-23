/**
 * Command Dispatcher
 *
 * Central command execution engine with middleware, history, and error handling
 */

import { commandRegistry } from './CommandRegistry';
import { commandMiddlewareManager } from './CommandMiddlewareManager';
import { commandHistoryManager } from './CommandHistoryManager';
import { Command, CommandResult, CommandOptions, CommandHistoryEntry } from './types';

class CommandDispatcher {
  private isExecuting: boolean = false;
  private transactionId: string | null = null;

  /**
   * Execute a command
   */
  async execute<TPayload = unknown, TResult = unknown>(
    commandType: string,
    payload: TPayload,
    options: CommandOptions = {}
  ): Promise<CommandResult<TResult>> {
    // Prevent recursive execution
    if (this.isExecuting) {
      throw new Error('Command execution already in progress');
    }

    this.isExecuting = true;

    try {
      // Get command or handler
      const command = commandRegistry.getCommand<TPayload, TResult>(commandType);
      const handler = commandRegistry.getHandler<TPayload, TResult>(commandType);

      if (!command && !handler) {
        throw new Error(`Command ${commandType} is not registered`);
      }

      // Skip middleware if requested
      let processedPayload = payload;
      if (!options.skipMiddleware) {
        processedPayload = (await commandMiddlewareManager.executeBefore(
          commandType,
          payload
        )) as TPayload;
      }

      // Validate command if validation function exists
      if (command?.validate) {
        const isValid = await command.validate(processedPayload);
        if (!isValid) {
          throw new Error(`Command ${commandType} validation failed`);
        }
      }

      // Execute command or handler
      let result: TResult;
      if (command) {
        result = await command.execute(processedPayload);
      } else if (handler) {
        const handlerResult = await handler(processedPayload);
        if (!handlerResult.success) {
          throw handlerResult.error || new Error('Command execution failed');
        }
        result = handlerResult.data as TResult;
      } else {
        throw new Error('No command or handler available');
      }

      // Create command result
      const commandResult: CommandResult<TResult> = {
        success: true,
        data: result,
        undoable: command?.undo !== undefined,
        timestamp: Date.now(),
      };

      // Execute after middleware
      if (!options.skipMiddleware) {
        await commandMiddlewareManager.executeAfter(commandType, processedPayload, commandResult);
      }

      // Add to history if not skipped and command is undoable
      if (!options.skipHistory && commandResult.undoable) {
        const historyEntry: CommandHistoryEntry = {
          id: this.generateId(),
          command: commandType,
          payload: processedPayload,
          result: commandResult,
          timestamp: commandResult.timestamp,
          undoable: commandResult.undoable,
        };
        commandHistoryManager.add(historyEntry);
      }

      return commandResult;
    } catch (error) {
      const errorResult: CommandResult<TResult> = {
        success: false,
        error: error as Error,
        timestamp: Date.now(),
      };
      return errorResult;
    } finally {
      this.isExecuting = false;
    }
  }

  /**
   * Undo the last command
   */
  async undo(): Promise<CommandResult> {
    const entry = commandHistoryManager.undo();
    if (!entry) {
      return {
        success: false,
        error: new Error('No undoable command available'),
        timestamp: Date.now(),
      };
    }

    try {
      const command = commandRegistry.getCommand(entry.command);
      if (command?.undo) {
        await command.undo(entry.payload, entry.result.data);
      }

      return {
        success: true,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Redo the last undone command
   */
  async redo(): Promise<CommandResult> {
    const entry = commandHistoryManager.redo();
    if (!entry) {
      return {
        success: false,
        error: new Error('No command to redo'),
        timestamp: Date.now(),
      };
    }

    return this.execute(entry.command, entry.payload, { skipHistory: true });
  }

  /**
   * Begin a transaction for batch operations
   */
  beginTransaction(): string {
    if (this.transactionId) {
      console.warn('Transaction already in progress');
      return this.transactionId;
    }

    this.transactionId = this.generateId();
    return this.transactionId;
  }

  /**
   * Commit a transaction
   */
  commitTransaction(): void {
    this.transactionId = null;
  }

  /**
   * Rollback a transaction
   */
  rollbackTransaction(): void {
    // In a real implementation, this would undo all commands in the transaction
    this.transactionId = null;
  }

  /**
   * Check if a transaction is in progress
   */
  isInTransaction(): boolean {
    return this.transactionId !== null;
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const commandDispatcher = new CommandDispatcher();
