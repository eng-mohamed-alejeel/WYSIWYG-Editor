/**
 * Plugin API
 *
 * Provides the API surface for plugins to interact with the editor
 * Implements all registration and interaction methods
 */

import { ComponentDefinition, InspectorField } from '@wysiwyg/core';
import {
  PluginAPI as PluginAPIInterface,
  PluginContext,
  PluginId,
  CommandDefinition,
  PanelDefinition,
  ToolbarActionDefinition,
  PluginEventBus,
  PluginLogger,
  SelectionState,
  Project,
  ComponentId,
} from './types';

interface RegisteredItems {
  components: Map<string, ComponentDefinition>;
  commands: Map<string, CommandDefinition>;
  panels: Map<string, PanelDefinition>;
  inspectorFields: Map<string, InspectorField>;
  toolbarActions: Map<string, ToolbarActionDefinition>;
}

export class PluginAPI implements PluginAPIInterface {
  private pluginId: PluginId;
  private registeredItems: RegisteredItems;
  private eventBus: PluginEventBus;
  private logger: PluginLogger;
  private editorState: PluginContext['editorState'];

  constructor(
    pluginId: PluginId,
    eventBus: PluginEventBus,
    logger: PluginLogger,
    editorState: PluginContext['editorState']
  ) {
    this.pluginId = pluginId;
    this.eventBus = eventBus;
    this.logger = logger;
    this.editorState = editorState;
    this.registeredItems = {
      components: new Map(),
      commands: new Map(),
      panels: new Map(),
      inspectorFields: new Map(),
      toolbarActions: new Map(),
    };
  }

  /**
   * Register a new component
   */
  registerComponent(definition: ComponentDefinition): void {
    if (this.registeredItems.components.has(definition.type)) {
      this.logger.warn(`Component ${definition.type} is already registered by this plugin`);
      return;
    }

    this.registeredItems.components.set(definition.type, definition);
    this.eventBus.emit('component:register', {
      pluginId: this.pluginId,
      definition,
    });

    this.logger.debug(`Registered component: ${definition.type}`);
  }

  /**
   * Register a new panel
   */
  registerPanel(definition: PanelDefinition): void {
    if (this.registeredItems.panels.has(definition.id)) {
      this.logger.warn(`Panel ${definition.id} is already registered by this plugin`);
      return;
    }

    this.registeredItems.panels.set(definition.id, definition);
    this.eventBus.emit('panel:register', {
      pluginId: this.pluginId,
      definition,
    });

    this.logger.debug(`Registered panel: ${definition.id}`);
  }

  /**
   * Register a new command
   */
  registerCommand(definition: CommandDefinition): void {
    if (this.registeredItems.commands.has(definition.id)) {
      this.logger.warn(`Command ${definition.id} is already registered by this plugin`);
      return;
    }

    this.registeredItems.commands.set(definition.id, definition);
    this.eventBus.emit('command:register', {
      pluginId: this.pluginId,
      definition,
    });

    this.logger.debug(`Registered command: ${definition.id}`);
  }

  /**
   * Register inspector fields
   */
  registerInspectorField(field: InspectorField): void {
    if (this.registeredItems.inspectorFields.has(field.name)) {
      this.logger.warn(`Inspector field ${field.name} is already registered by this plugin`);
      return;
    }

    this.registeredItems.inspectorFields.set(field.name, field);
    this.eventBus.emit('inspectorField:register', {
      pluginId: this.pluginId,
      field,
    });

    this.logger.debug(`Registered inspector field: ${field.name}`);
  }

  /**
   * Register a toolbar action
   */
  registerToolbarAction(definition: ToolbarActionDefinition): void {
    if (this.registeredItems.toolbarActions.has(definition.id)) {
      this.logger.warn(`Toolbar action ${definition.id} is already registered by this plugin`);
      return;
    }

    this.registeredItems.toolbarActions.set(definition.id, definition);
    this.eventBus.emit('toolbarAction:register', {
      pluginId: this.pluginId,
      definition,
    });

    this.logger.debug(`Registered toolbar action: ${definition.id}`);
  }

  /**
   * Execute a command
   */
  async executeCommand(commandId: string, ...args: unknown[]): Promise<void> {
    const command = this.getCommand(commandId);
    if (!command) {
      throw new Error(`Command ${commandId} not found`);
    }

    try {
      await command.handler(...args);
      this.eventBus.emit('command:execute', {
        pluginId: this.pluginId,
        commandId,
        args,
      });
    } catch (error) {
      this.logger.error(`Error executing command ${commandId}:`, error);
      throw error;
    }
  }

  /**
   * Get a command by ID
   */
  getCommand(commandId: string): CommandDefinition | undefined {
    return this.registeredItems.commands.get(commandId);
  }

  /**
   * Show a notification
   */
  showNotification(message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info'): void {
    this.eventBus.emit('notification:show', {
      pluginId: this.pluginId,
      message,
      type,
    });
  }

  /**
   * Show an information message
   */
  async showInformationMessage(message: string, ...actions: string[]): Promise<string | undefined> {
    return this.showMessage(message, 'info', actions);
  }

  /**
   * Show a warning message
   */
  async showWarningMessage(message: string, ...actions: string[]): Promise<string | undefined> {
    return this.showMessage(message, 'warning', actions);
  }

  /**
   * Show an error message
   */
  async showErrorMessage(message: string, ...actions: string[]): Promise<string | undefined> {
    return this.showMessage(message, 'error', actions);
  }

  /**
   * Internal method to show messages
   */
  private async showMessage(
    message: string,
    type: 'info' | 'warning' | 'error',
    actions: string[]
  ): Promise<string | undefined> {
    return new Promise((resolve) => {
      const messageId = `msg-${Date.now()}-${Math.random()}`;

      this.eventBus.emit('message:show', {
        pluginId: this.pluginId,
        messageId,
        message,
        type,
        actions,
      });

      // Set up listener for message response
      const unsubscribe = this.eventBus.on<string>((response: any) => {
        if (response.messageId === messageId) {
          unsubscribe();
          resolve(response.action);
        }
      });
    });
  }

  /**
   * Open a panel
   */
  openPanel(panelId: string): void {
    this.eventBus.emit('panel:open', {
      pluginId: this.pluginId,
      panelId,
    });
  }

  /**
   * Close a panel
   */
  closePanel(panelId: string): void {
    this.eventBus.emit('panel:close', {
      pluginId: this.pluginId,
      panelId,
    });
  }

  /**
   * Get configuration value
   */
  getConfiguration<T = unknown>(key: string): T | undefined {
    this.eventBus.emit('configuration:get', {
      pluginId: this.pluginId,
      key,
    });

    // In a real implementation, this would be async and wait for response
    // For now, we'll emit an event and return undefined
    // The actual value would be provided through a separate event
    return undefined;
  }

  /**
   * Update configuration value
   */
  async updateConfiguration(key: string, value: unknown): Promise<void> {
    this.eventBus.emit('configuration:update', {
      pluginId: this.pluginId,
      key,
      value,
    });
  }

  /**
   * Get all registered items for cleanup
   */
  getRegisteredItems(): RegisteredItems {
    return this.registeredItems;
  }

  /**
   * Clear all registered items
   */
  clearRegisteredItems(): void {
    this.registeredItems = {
      components: new Map(),
      commands: new Map(),
      panels: new Map(),
      inspectorFields: new Map(),
      toolbarActions: new Map(),
    };
  }
}
