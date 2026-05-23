/**
 * Plugin Manager
 * 
 * Central orchestrator for the plugin system
 * Manages plugin lifecycle, dependencies, and provides the main API
 */

import {
  PluginId,
  PluginManifest,
  Plugin,
  PluginManagerConfig,
  PluginLoadResult,
  PluginActivationResult,
  PluginManagerEvent,
  PluginContext,
  PluginState,
  SelectionState,
  Project,
  ComponentId,
} from './types';
import { PluginLoader } from './PluginLoader';
import { createEventBus } from './EventBus';

export class PluginManager {
  private loader: PluginLoader;
  private eventBus: ReturnType<typeof createEventBus>;
  private config: Required<PluginManagerConfig>;
  private editorState: PluginContext['editorState'];

  constructor(
    editorState: PluginContext['editorState'],
    config: PluginManagerConfig = {}
  ) {
    this.editorState = editorState;
    this.config = {
      pluginsDir: config.pluginsDir || '/plugins',
      enableLazyLoading: config.enableLazyLoading ?? true,
      enableIsolation: config.enableIsolation ?? true,
      enableHotReload: config.enableHotReload ?? false,
      maxPlugins: config.maxPlugins || 50,
      activationTimeout: config.activationTimeout || 10000,
    };

    this.eventBus = createEventBus();
    this.loader = new PluginLoader(editorState, {
      enableIsolation: this.config.enableIsolation,
      enableLazyLoading: this.config.enableLazyLoading,
      activationTimeout: this.config.activationTimeout,
    });

    // Set up hot reload if enabled
    if (this.config.enableHotReload) {
      this.setupHotReload();
    }
  }

  /**
   * Load a plugin from a manifest
   */
  async loadPlugin(manifest: PluginManifest): Promise<PluginLoadResult> {
    this.emitEvent('plugin:loading', { pluginId: manifest.id });

    // Check max plugins limit
    const currentCount = this.loader.getAllPlugins().length;
    if (currentCount >= this.config.maxPlugins) {
      return {
        pluginId: manifest.id,
        success: false,
        error: new Error(`Maximum number of plugins (${this.config.maxPlugins}) reached`),
      };
    }

    // Validate manifest
    const validationError = this.validateManifest(manifest);
    if (validationError) {
      return {
        pluginId: manifest.id,
        success: false,
        error: validationError,
      };
    }

    // Load the plugin
    const result = await this.loader.loadPlugin(manifest);

    if (result.success) {
      this.emitEvent('plugin:loaded', { pluginId: manifest.id });
    } else {
      this.emitEvent('plugin:error', {
        pluginId: manifest.id,
        error: result.error,
      });
    }

    return result;
  }

  /**
   * Load multiple plugins
   */
  async loadPlugins(manifests: PluginManifest[]): Promise<PluginLoadResult[]> {
    return Promise.all(manifests.map((m) => this.loadPlugin(m)));
  }

  /**
   * Activate a plugin
   */
  async activatePlugin(pluginId: PluginId): Promise<PluginActivationResult> {
    this.emitEvent('plugin:activating', { pluginId });

    try {
      await this.loader.activatePlugin(pluginId);
      this.emitEvent('plugin:activated', { pluginId });
      return { pluginId, success: true };
    } catch (error) {
      const pluginError = error instanceof Error ? error : new Error(String(error));
      this.emitEvent('plugin:error', {
        pluginId,
        error: pluginError,
      });
      return { pluginId, success: false, error: pluginError };
    }
  }

  /**
   * Deactivate a plugin
   */
  async deactivatePlugin(pluginId: PluginId): Promise<void> {
    this.emitEvent('plugin:deactivating', { pluginId });

    try {
      await this.loader.deactivatePlugin(pluginId);
      this.emitEvent('plugin:deactivated', { pluginId });
    } catch (error) {
      console.error(`Error deactivating plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Unload a plugin
   */
  async unloadPlugin(pluginId: PluginId): Promise<void> {
    this.emitEvent('plugin:unloading', { pluginId });

    try {
      await this.loader.unloadPlugin(pluginId);
      this.emitEvent('plugin:unloaded', { pluginId });
    } catch (error) {
      console.error(`Error unloading plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Get a plugin by ID
   */
  getPlugin(pluginId: PluginId): Plugin | undefined {
    const instance = this.loader.getPlugin(pluginId);
    return instance?.plugin;
  }

  /**
   * Get all loaded plugins
   */
  getAllPlugins(): Plugin[] {
    return this.loader.getAllPlugins().map((i) => i.plugin);
  }

  /**
   * Get plugins by state
   */
  getPluginsByState(state: PluginState): Plugin[] {
    return this.loader.getPluginsByState(state).map((i) => i.plugin);
  }

  /**
   * Get plugin context
   */
  getPluginContext(pluginId: PluginId): PluginContext | undefined {
    return this.loader.getPlugin(pluginId)?.context;
  }

  /**
   * Validate plugin manifest
   */
  private validateManifest(manifest: PluginManifest): Error | null {
    if (!manifest.id) {
      return new Error('Plugin manifest missing required field: id');
    }
    if (!manifest.name) {
      return new Error('Plugin manifest missing required field: name');
    }
    if (!manifest.version) {
      return new Error('Plugin manifest missing required field: version');
    }
    if (!manifest.main) {
      return new Error('Plugin manifest missing required field: main');
    }

    // Validate semantic versioning
    if (!/^\d+\.\d+\.\d+/.test(manifest.version)) {
      return new Error('Plugin version must follow semantic versioning (e.g., 1.0.0)');
    }

    // Validate dependencies
    if (manifest.dependencies) {
      for (const depId of manifest.dependencies) {
        if (typeof depId !== 'string' || !depId.trim()) {
          return new Error(`Invalid dependency ID: ${depId}`);
        }
      }
    }

    return null;
  }

  /**
   * Emit a plugin manager event
   */
  private emitEvent(event: PluginManagerEvent, data: any): void {
    this.eventBus.emit(event, data);
  }

  /**
   * Subscribe to plugin manager events
   */
  on(event: PluginManagerEvent, listener: (data: any) => void): () => void {
    return this.eventBus.on(event, listener);
  }

  /**
   * Handle editor ready event
   */
  async onEditorReady(): Promise<void> {
    await this.loader.onEditorReady();
  }

  /**
   * Handle selection change event
   */
  async onSelectionChange(selection: SelectionState): Promise<void> {
    await this.loader.onSelectionChange(selection);
  }

  /**
   * Setup hot reload for development
   */
  private setupHotReload(): void {
    // In a real implementation, this would watch for file changes
    // and reload plugins when their files change
    console.warn('Hot reload is enabled but not yet implemented');
  }

  /**
   * Get all registered components from all plugins
   */
  getRegisteredComponents(): Map<string, any> {
    const components = new Map();
    this.loader.getAllPlugins().forEach((instance) => {
      const registered = instance.api.getRegisteredItems().components;
      registered.forEach((def, type) => {
        components.set(type, def);
      });
    });
    return components;
  }

  /**
   * Get all registered commands from all plugins
   */
  getRegisteredCommands(): Map<string, any> {
    const commands = new Map();
    this.loader.getAllPlugins().forEach((instance) => {
      const registered = instance.api.getRegisteredItems().commands;
      registered.forEach((def, id) => {
        commands.set(id, def);
      });
    });
    return commands;
  }

  /**
   * Get all registered panels from all plugins
   */
  getRegisteredPanels(): Map<string, any> {
    const panels = new Map();
    this.loader.getAllPlugins().forEach((instance) => {
      const registered = instance.api.getRegisteredItems().panels;
      registered.forEach((def, id) => {
        panels.set(id, def);
      });
    });
    return panels;
  }

  /**
   * Get all registered inspector fields from all plugins
   */
  getRegisteredInspectorFields(): Map<string, any> {
    const fields = new Map();
    this.loader.getAllPlugins().forEach((instance) => {
      const registered = instance.api.getRegisteredItems().inspectorFields;
      registered.forEach((def, name) => {
        fields.set(name, def);
      });
    });
    return fields;
  }

  /**
   * Get all registered toolbar actions from all plugins
   */
  getRegisteredToolbarActions(): Map<string, any> {
    const actions = new Map();
    this.loader.getAllPlugins().forEach((instance) => {
      const registered = instance.api.getRegisteredItems().toolbarActions;
      registered.forEach((def, id) => {
        actions.set(id, def);
      });
    });
    return actions;
  }

  /**
   * Shutdown the plugin manager
   */
  async shutdown(): Promise<void> {
    const plugins = this.loader.getAllPlugins();
    await Promise.all(
      plugins.map((instance) => this.unloadPlugin(instance.manifest.id))
    );
    this.eventBus.removeAllListeners();
  }
}
