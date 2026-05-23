/**
 * Command Registry
 *
 * Manages command registration and lookup
 */

import { Command, CommandHandler } from './types';

class CommandRegistry {
  private commands: Map<string, Command> = new Map();
  private handlers: Map<string, CommandHandler> = new Map();

  /**
   * Register a command
   */
  register<TPayload = unknown, TResult = unknown>(command: Command<TPayload, TResult>): void {
    if (this.commands.has(command.type)) {
      console.warn(`Command ${command.type} is already registered. Overwriting.`);
    }
    this.commands.set(command.type, command);
  }

  /**
   * Register a command handler
   */
  registerHandler<TPayload = unknown, TResult = unknown>(
    commandType: string,
    handler: CommandHandler<TPayload, TResult>
  ): void {
    if (this.handlers.has(commandType)) {
      console.warn(`Handler for command ${commandType} is already registered. Overwriting.`);
    }
    this.handlers.set(commandType, handler);
  }

  /**
   * Unregister a command
   */
  unregister(commandType: string): void {
    this.commands.delete(commandType);
    this.handlers.delete(commandType);
  }

  /**
   * Get a command by type
   */
  getCommand<TPayload = unknown, TResult = unknown>(
    commandType: string
  ): Command<TPayload, TResult> | undefined {
    return this.commands.get(commandType);
  }

  /**
   * Get a command handler by type
   */
  getHandler<TPayload = unknown, TResult = unknown>(
    commandType: string
  ): CommandHandler<TPayload, TResult> | undefined {
    return this.handlers.get(commandType);
  }

  /**
   * Check if a command is registered
   */
  has(commandType: string): boolean {
    return this.commands.has(commandType) || this.handlers.has(commandType);
  }

  /**
   * Get all registered command types
   */
  getCommandTypes(): string[] {
    return Array.from(new Set([...this.commands.keys(), ...this.handlers.keys()]));
  }

  /**
   * Clear all commands and handlers
   */
  clear(): void {
    this.commands.clear();
    this.handlers.clear();
  }
}

// Singleton instance
export const commandRegistry = new CommandRegistry();
