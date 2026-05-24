/**
 * Command Manager Implementation
 *
 * Manages command execution and registration
 */

import { Command } from '../types/editor';
import { EventBus } from './EventBus';
import { HistoryManager } from './HistoryManager';

export class CommandManager {
  private commands = new Map<string, Command>();
  private eventBus: EventBus;
  private historyManager: HistoryManager;

  constructor(eventBus: EventBus, historyManager: HistoryManager) {
    this.eventBus = eventBus;
    this.historyManager = historyManager;

    // Listen for command execution requests
    this.eventBus.on('command:execute', this.handleCommandExecution.bind(this));
  }

  register(command: Command): void {
    if (this.commands.has(command.type)) {
      throw new Error(`Command with type "${command.type}" is already registered`);
    }

    this.commands.set(command.type, command);
    this.eventBus.emit('command:registered', { command });
  }

  unregister(commandType: string): void {
    if (!this.commands.has(commandType)) {
      return;
    }

    this.commands.delete(commandType);
    this.eventBus.emit('command:unregistered', { commandType });
  }

  execute(command: Command): void {
    if (!this.commands.has(command.type)) {
      throw new Error(`Unknown command type: "${command.type}"`);
    }

    try {
      // Execute through history manager for undo/redo support
      this.historyManager.execute(command);

      this.eventBus.emit('command:executed', { command });
    } catch (error) {
      console.error(`Error executing command "${command.type}":`, error);
      this.eventBus.emit('command:error', {
        command,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  get(commandType: string): Command | undefined {
    return this.commands.get(commandType);
  }

  getAll(): Command[] {
    return Array.from(this.commands.values());
  }

  has(commandType: string): boolean {
    return this.commands.has(commandType);
  }

  undo(): void {
    this.historyManager.undo();
    this.eventBus.emit('command:undo', {});
  }

  redo(): void {
    this.historyManager.redo();
    this.eventBus.emit('command:redo', {});
  }

  canUndo(): boolean {
    return this.historyManager.canUndo();
  }

  canRedo(): boolean {
    return this.historyManager.canRedo();
  }

  clear(): void {
    this.commands.clear();
    this.historyManager.clear();
    this.eventBus.emit('command:cleared', {});
  }

  private handleCommandExecution(command: Command): void {
    this.execute(command);
  }
}
