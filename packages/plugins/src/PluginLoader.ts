/**
 * Plugin Loader
 *
 * Handles plugin loading, initialization, and lifecycle management
 * Supports lazy loading and dependency resolution
 */

import {
  Plugin,
  PluginId,
  PluginManifest,
  PluginLoadResult,
  PluginContext,
  PluginState,
} from './types';
import { createEventBus } from './EventBus';
import { createPluginLogger } from './PluginLogger';
import { PluginAPI } from './PluginAPI';
import { createPluginSandbox } from './PluginSandbox';

interface PluginInstance {
  plugin: Plugin;
  manifest: PluginManifest;
  state: PluginState;
  context: PluginContext;
  api: PluginAPI;
  sandbox?: any;
  loadPromise?: Promise<void>;
}

interface LoaderConfig {
  enableIsolation?: boolean;
  enableLazyLoading?: boolean;
  activationTimeout?: number;
}

export class PluginLoader {
  private plugins: Map<PluginId, PluginInstance>;
  private config: Required<LoaderConfig>;
  private editorState: PluginContext['editorState'];

  constructor(editorState: PluginContext['editorState'], config: LoaderConfig = {}) {
    this.editorState = editorState;
    this.plugins = new Map();
    this.config = {
      enableIsolation: config.enableIsolation ?? true,
      enableLazyLoading: config.enableLazyLoading ?? true,
      activationTimeout: config.activationTimeout ?? 10000,
    };
  }

  /**
   * Load a plugin from a manifest
   */
  async loadPlugin(manifest: PluginManifest): Promise<PluginLoadResult> {
    const pluginId = manifest.id;

    // Check if plugin is already loaded
    if (this.plugins.has(pluginId)) {
      return {
        pluginId,
        success: false,
        error: new Error(`Plugin ${pluginId} is already loaded`),
      };
    }

    try {
      // Create plugin instance
      const eventBus = createEventBus();
      const logger = createPluginLogger(pluginId);
      const api = new PluginAPI(pluginId, eventBus, logger, this.editorState);

      // Create sandbox if isolation is enabled
      let sandbox;
      if (this.config.enableIsolation) {
        sandbox = createPluginSandbox({
          pluginId,
          enableStrictMode: true,
          timeout: this.config.activationTimeout,
        });
      }

      // Load plugin module
      const plugin = await this.loadPluginModule(manifest);

      // Create plugin context
      const context: PluginContext = {
        metadata: manifest,
        state: 'loaded',
        eventBus,
        api,
        editorState: this.editorState,
        logger,
      };

      // Store plugin instance
      this.plugins.set(pluginId, {
        plugin,
        manifest,
        state: 'loaded',
        context,
        api,
        sandbox,
      });

      // Call onLoad if present
      if (plugin.onLoad) {
        await this.withTimeout(
          plugin.onLoad(context),
          this.config.activationTimeout,
          `Plugin ${pluginId} onLoad timeout`
        );
      }

      // Update state
      this.updatePluginState(pluginId, 'loaded');

      return { pluginId, success: true };
    } catch (error) {
      const pluginError = error instanceof Error ? error : new Error(String(error));
      console.error(`Failed to load plugin ${pluginId}:`, pluginError);

      // Clean up if load failed
      this.plugins.delete(pluginId);

      return {
        pluginId,
        success: false,
        error: pluginError,
      };
    }
  }

  /**
   * Load plugin module from manifest
   */
  private async loadPluginModule(manifest: PluginManifest): Promise<Plugin> {
    // If lazy loading is enabled and plugin is marked as lazy, return a placeholder
    if (this.config.enableLazyLoading && manifest.lazy) {
      return this.createLazyPlugin(manifest);
    }

    // Load plugin module dynamically
    try {
      const module = await import(manifest.main);
      return module.default || module;
    } catch (error) {
      throw new Error(`Failed to load plugin module from ${manifest.main}: ${error}`);
    }
  }

  /**
   * Create a lazy plugin wrapper
   */
  private createLazyPlugin(manifest: PluginManifest): Plugin {
    let loadedPlugin: Plugin | null = null;
    let loadPromise: Promise<void> | null = null;

    const ensureLoaded = async () => {
      if (loadedPlugin) return loadedPlugin;

      if (!loadPromise) {
        loadPromise = (async () => {
          const module = await import(manifest.main);
          loadedPlugin = module.default || module;
        })();
      }

      await loadPromise;
      return loadedPlugin!;
    };

    return {
      get metadata() {
        return manifest;
      },

      async onLoad(context) {
        const plugin = await ensureLoaded();
        if (plugin.onLoad) {
          await plugin.onLoad(context);
        }
      },

      async onUnload(context) {
        const plugin = await ensureLoaded();
        if (plugin.onUnload) {
          await plugin.onUnload(context);
        }
      },

      async onEditorReady(context) {
        const plugin = await ensureLoaded();
        if (plugin.onEditorReady) {
          await plugin.onEditorReady(context);
        }
      },

      async onSelectionChange(context, selection) {
        const plugin = await ensureLoaded();
        if (plugin.onSelectionChange) {
          await plugin.onSelectionChange(context, selection);
        }
      },

      async activate(context) {
        const plugin = await ensureLoaded();
        if (plugin.activate) {
          await plugin.activate(context);
        }
      },

      async deactivate(context) {
        const plugin = await ensureLoaded();
        if (plugin.deactivate) {
          await plugin.deactivate(context);
        }
      },
    };
  }

  /**
   * Activate a plugin
   */
  async activatePlugin(pluginId: PluginId): Promise<void> {
    const instance = this.plugins.get(pluginId);
    if (!instance) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (instance.state === 'active') {
      return;
    }

    try {
      this.updatePluginState(pluginId, 'activating');

      // Resolve dependencies first
      if (instance.manifest.dependencies) {
        for (const depId of instance.manifest.dependencies) {
          const dep = this.plugins.get(depId);
          if (!dep) {
            throw new Error(`Dependency ${depId} not found`);
          }
          if (dep.state !== 'active') {
            await this.activatePlugin(depId);
          }
        }
      }

      // Call activate if present
      if (instance.plugin.activate) {
        await this.withTimeout(
          instance.plugin.activate(instance.context),
          this.config.activationTimeout,
          `Plugin ${pluginId} activation timeout`
        );
      }

      this.updatePluginState(pluginId, 'active');
    } catch (error) {
      this.updatePluginState(pluginId, 'error');
      throw error;
    }
  }

  /**
   * Deactivate a plugin
   */
  async deactivatePlugin(pluginId: PluginId): Promise<void> {
    const instance = this.plugins.get(pluginId);
    if (!instance) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (instance.state !== 'active') {
      return;
    }

    try {
      this.updatePluginState(pluginId, 'deactivating');

      // Call deactivate if present
      if (instance.plugin.deactivate) {
        await instance.plugin.deactivate(instance.context);
      }

      this.updatePluginState(pluginId, 'loaded');
    } catch (error) {
      this.updatePluginState(pluginId, 'error');
      throw error;
    }
  }

  /**
   * Unload a plugin
   */
  async unloadPlugin(pluginId: PluginId): Promise<void> {
    const instance = this.plugins.get(pluginId);
    if (!instance) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    try {
      // Deactivate if active
      if (instance.state === 'active') {
        await this.deactivatePlugin(pluginId);
      }

      // Call onUnload if present
      if (instance.plugin.onUnload) {
        await instance.plugin.onUnload(instance.context);
      }

      // Clean up sandbox
      if (instance.sandbox) {
        instance.sandbox.destroy();
      }

      // Clear registered items
      instance.api.clearRegisteredItems();

      // Remove plugin
      this.plugins.delete(pluginId);
    } catch (error) {
      console.error(`Error unloading plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Get a plugin instance
   */
  getPlugin(pluginId: PluginId): PluginInstance | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * Get all loaded plugins
   */
  getAllPlugins(): PluginInstance[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugins by state
   */
  getPluginsByState(state: PluginState): PluginInstance[] {
    return Array.from(this.plugins.values()).filter((p) => p.state === state);
  }

  /**
   * Update plugin state
   */
  private updatePluginState(pluginId: PluginId, state: PluginState): void {
    const instance = this.plugins.get(pluginId);
    if (instance) {
      instance.state = state;
      instance.context.state = state;
    }
  }

  /**
   * Execute a function with timeout
   */
  private async withTimeout<T>(
    promise: Promise<T>,
    timeout: number,
    errorMessage: string
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), timeout)),
    ]);
  }

  /**
   * Handle editor ready event
   */
  async onEditorReady(): Promise<void> {
    const plugins = this.getAllPlugins();
    await Promise.all(
      plugins.map(async (instance) => {
        if (instance.plugin.onEditorReady) {
          try {
            await instance.plugin.onEditorReady(instance.context);
          } catch (error) {
            console.error(`Error in onEditorReady for plugin ${instance.manifest.id}:`, error);
          }
        }
      })
    );
  }

  /**
   * Handle selection change event
   */
  async onSelectionChange(selection: any): Promise<void> {
    const plugins = this.getPluginsByState('active');
    await Promise.all(
      plugins.map(async (instance) => {
        if (instance.plugin.onSelectionChange) {
          try {
            await instance.plugin.onSelectionChange(instance.context, selection);
          } catch (error) {
            console.error(`Error in onSelectionChange for plugin ${instance.manifest.id}:`, error);
          }
        }
      })
    );
  }
}
