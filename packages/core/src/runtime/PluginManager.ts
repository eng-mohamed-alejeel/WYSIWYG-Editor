/**
 * Plugin Manager Implementation
 *
 * Manages plugin lifecycle and registration
 */

import { Plugin, PluginContext, SelectionState } from '../types/editor';
import { ComponentDefinition } from '../types/components';
import { Command } from '../types/editor';
import { Project } from '../types/project';
import { EventBus } from './EventBus';
import { ServiceContainerInterface } from './types';

export class PluginManager {
  private plugins = new Map<string, Plugin>();
  private eventBus: EventBus;
  private contextProviders: Record<string, unknown>;

  constructor(
    _serviceContainer: ServiceContainerInterface,
    eventBus: EventBus,
    contextProviders: Record<string, unknown>
  ) {
    this.eventBus = eventBus;
    this.contextProviders = contextProviders;
  }

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`);
    }

    // Create plugin context
    const context = this.createPluginContext();

    try {
      // Initialize plugin
      plugin.initialize(context);

      // Register plugin components
      if (plugin.components) {
        plugin.components.forEach((component) => {
          this.eventBus.emit('plugin:component:register', {
            plugin: plugin.name,
            component,
          });
        });
      }

      // Register plugin commands
      if (plugin.commands) {
        plugin.commands.forEach((command) => {
          this.eventBus.emit('plugin:command:register', {
            plugin: plugin.name,
            command,
          });
        });
      }

      this.plugins.set(plugin.name, plugin);
      this.eventBus.emit('plugin:registered', { plugin });
    } catch (error) {
      console.error(`Failed to initialize plugin "${plugin.name}":`, error);
      throw error;
    }
  }

  unregister(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      return;
    }

    try {
      // Call destroy if available
      if (plugin.destroy) {
        plugin.destroy();
      }

      // Remove plugin components
      if (plugin.components) {
        plugin.components.forEach((component: ComponentDefinition) => {
          this.eventBus.emit('plugin:component:unregister', {
            plugin: pluginName,
            componentId: component.type,
          });
        });
      }

      // Remove plugin commands
      if (plugin.commands) {
        plugin.commands.forEach((command) => {
          this.eventBus.emit('plugin:command:unregister', {
            plugin: pluginName,
            commandType: command.type,
          });
        });
      }

      this.plugins.delete(pluginName);
      this.eventBus.emit('plugin:unregistered', { pluginName });
    } catch (error) {
      console.error(`Failed to unregister plugin "${pluginName}":`, error);
      throw error;
    }
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  has(name: string): boolean {
    return this.plugins.has(name);
  }

  destroy(): void {
    this.plugins.forEach((plugin, name) => {
      try {
        if (plugin.destroy) {
          plugin.destroy();
        }
      } catch (error) {
        console.error(`Error destroying plugin "${name}":`, error);
      }
    });
    this.plugins.clear();
  }

  private createPluginContext(): PluginContext {
    return {
      registerComponent: (definition: ComponentDefinition) => {
        this.eventBus.emit('component:register', definition);
      },
      registerCommand: (command: Command) => {
        this.eventBus.emit('command:register', command);
      },
      getProject: (): Project | null => {
        const getProject = this.contextProviders['getProject'] as
          | (() => Project | null)
          | undefined;
        return getProject?.() ?? null;
      },
      updateProject: (project: Project) => {
        const updateProject = this.contextProviders['updateProject'] as
          | ((project: Project) => void)
          | undefined;
        updateProject?.(project);
      },
      getSelection: (): SelectionState => {
        const getSelection = this.contextProviders['getSelection'] as
          | (() => SelectionState)
          | undefined;
        return (
          getSelection?.() ?? {
            selectedIds: [],
            hoveredId: null,
            focusedId: null,
          }
        );
      },
      updateSelection: (selection: SelectionState) => {
        const updateSelection = this.contextProviders['updateSelection'] as
          | ((selection: SelectionState) => void)
          | undefined;
        updateSelection?.(selection);
      },
      executeCommand: (command: Command) => {
        this.eventBus.emit('command:execute', command);
      },
      undo: () => {
        this.eventBus.emit('history:undo', {});
      },
      redo: () => {
        this.eventBus.emit('history:redo', {});
      },
    };
  }
}
