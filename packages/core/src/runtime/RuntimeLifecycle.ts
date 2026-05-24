/**
 * Runtime Lifecycle Management
 *
 * Handles initialization, mounting, destruction, and reloading of the runtime
 */

import { EventBus } from './EventBus';
import { ServiceContainer } from './ServiceContainer';
import { StateStore } from './StateStore';
import { HistoryManager } from './HistoryManager';
import { PluginManager } from './PluginManager';
import { CommandManager } from './CommandManager';
import { LayoutEngine } from './LayoutEngine';
import { InspectorManager } from './InspectorManager';
import { RendererManager } from './RendererManager';
import { RuntimeLifecycle as Lifecycle, RuntimeOptions, RuntimeState } from './types';
import { EditorState } from '../types/editor';
import { initializeDefaultLayout } from './DefaultLayout';

export class RuntimeLifecycleManager {
  private isInitialized: boolean = false;
  private isMounted: boolean = false;
  private reloadCount: number = 0;
  private lastError: Error | null = null;
  private initializationTime: Date | null = null;
  private mountTime: Date | null = null;
  constructor(
    private eventBus: EventBus,
    private serviceContainer: ServiceContainer,
    private stateStore: StateStore<EditorState>,
    private historyManager: HistoryManager,
    private pluginManager: PluginManager,
    private commandManager: CommandManager,
    private layoutEngine: LayoutEngine,
    private inspectorManager: InspectorManager,
    private rendererManager: RendererManager,
    private state: RuntimeState,
    private options: RuntimeOptions
  ) {}

  /**
   * Get the current state of the runtime
   */
  getState(): {
    isInitialized: boolean;
    isMounted: boolean;
    reloadCount: number;
    lastError: Error | null;
    lifecycle: Lifecycle;
    initializationTime: Date | null;
    mountTime: Date | null;
  } {
    return {
      isInitialized: this.isInitialized,
      isMounted: this.isMounted,
      reloadCount: this.reloadCount,
      lastError: this.lastError,
      lifecycle: this.state.lifecycle,
      initializationTime: this.initializationTime,
      mountTime: this.mountTime,
    };
  }

  /**
   * Get the last error that occurred during runtime operations
   */
  getLastError(): Error | null {
    return this.lastError;
  }

  /**
   * Clear the last error
   */
  clearLastError(): void {
    this.lastError = null;
  }

  /**
   * Check if the runtime is in a valid state for operations
   */
  isOperational(): boolean {
    return this.isInitialized && this.lastError === null;
  }

  /**
   * Get the uptime of the runtime since initialization
   */
  getUptime(): number | null {
    if (!this.initializationTime) {
      return null;
    }
    return Date.now() - this.initializationTime.getTime();
  }

  /**
   * Get the time since the runtime was mounted
   */
  getMountUptime(): number | null {
    if (!this.mountTime) {
      return null;
    }
    return Date.now() - this.mountTime.getTime();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('Runtime is already initialized');
      return;
    }

    if (this.state.lifecycle !== Lifecycle.UNINITIALIZED) {
      throw new Error('Runtime is already initialized');
    }

    this.state.lifecycle = Lifecycle.INITIALIZING;

    try {
      // Execute before initialize hook
      if (this.options.hooks?.onBeforeInitialize) {
        await this.options.hooks.onBeforeInitialize();
      }

      // Register initial services
      if (this.options.initialServices) {
        this.options.initialServices.forEach((service) => {
          this.serviceContainer.register(service);
        });
      }

      // Register initial plugins
      if (this.options.initialPlugins) {
        for (const plugin of this.options.initialPlugins) {
          this.pluginManager.register(plugin);
          this.state.plugins.set(plugin.name, plugin);
        }
      }

      this.state.lifecycle = Lifecycle.INITIALIZED;
      this.isInitialized = true;
      this.initializationTime = new Date();

      // Emit initialization event
      this.eventBus.emit('runtime:initialized', {
        reloadCount: this.reloadCount,
        initializationTime: this.initializationTime,
      });

      // Execute after initialize hook
      if (this.options.hooks?.onAfterInitialize) {
        await this.options.hooks.onAfterInitialize();
      }
    } catch (error) {
      this.lastError = error instanceof Error ? error : new Error(String(error));
      this.state.lifecycle = Lifecycle.UNINITIALIZED;
      this.isInitialized = false;
      throw error;
    }
  }

  async mount(container: HTMLElement): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Runtime must be initialized before mounting');
    }

    if (this.isMounted) {
      console.warn('Runtime is already mounted');
      return;
    }

    if (this.state.lifecycle !== Lifecycle.INITIALIZED) {
      throw new Error('Runtime must be initialized before mounting');
    }

    this.state.lifecycle = Lifecycle.MOUNTING;

    try {
      // Execute before mount hook
      if (this.options.hooks?.onBeforeMount) {
        await this.options.hooks.onBeforeMount();
      }

      // Initialize layout with default panels
      initializeDefaultLayout(this.layoutEngine);

      this.state.lifecycle = Lifecycle.MOUNTED;
      this.isMounted = true;
      this.mountTime = new Date();

      // Emit mount event
      this.eventBus.emit('runtime:mounted', {
        container,
        reloadCount: this.reloadCount,
        mountTime: this.mountTime,
      });

      // Execute after mount hook
      if (this.options.hooks?.onAfterMount) {
        await this.options.hooks.onAfterMount();
      }
    } catch (error) {
      this.lastError = error instanceof Error ? error : new Error(String(error));
      this.state.lifecycle = Lifecycle.INITIALIZED;
      throw error;
    }
  }

  async destroy(): Promise<void> {
    if (this.state.lifecycle === Lifecycle.DESTROYED) {
      console.warn('Runtime is already destroyed');
      return;
    }

    this.state.lifecycle = Lifecycle.DESTROYING;

    // Execute before destroy hook
    if (this.options.hooks?.onBeforeDestroy) {
      await this.options.hooks.onBeforeDestroy();
    }

    // Destroy all subsystems
    this.pluginManager.destroy();
    this.commandManager.clear();
    this.historyManager.clear();
    this.layoutEngine.reset();
    this.inspectorManager.clear();
    this.rendererManager.clearCache();
    this.serviceContainer.dispose();
    this.eventBus.clear();

    this.state.plugins.clear();
    this.state.lifecycle = Lifecycle.DESTROYED;
    this.isInitialized = false;
    this.isMounted = false;
    this.initializationTime = null;
    this.mountTime = null;

    // Emit destroy event
    this.eventBus.emit('runtime:destroyed', { reloadCount: this.reloadCount });

    // Execute after destroy hook
    if (this.options.hooks?.onAfterDestroy) {
      await this.options.hooks.onAfterDestroy();
    }
  }

  async reload(): Promise<void> {
    if (this.state.lifecycle === Lifecycle.RELOADING) {
      console.warn('Runtime is already reloading');
      return;
    }

    if (!this.isInitialized) {
      throw new Error('Runtime must be initialized before reloading');
    }

    this.state.lifecycle = Lifecycle.RELOADING;
    this.reloadCount++;

    try {
      // Execute before reload hook
      if (this.options.hooks?.onBeforeReload) {
        await this.options.hooks.onBeforeReload();
      }

      // Save current state
      const currentState = this.stateStore.getState();
      const plugins = Array.from(this.state.plugins.values());

      // Save mounted state before destroying
      const wasMounted = this.isMounted;

      // Destroy current instance
      await this.destroy();

      // Reinitialize with saved state
      await this.initialize();

      // Restore plugins
      for (const plugin of plugins) {
        this.pluginManager.register(plugin);
        this.state.plugins.set(plugin.name, plugin);
      }

      // Restore state
      this.stateStore.setState(currentState);

      this.state.lifecycle = Lifecycle.INITIALIZED;
      this.initializationTime = new Date();

      // Restore mounted state if it was mounted before
      if (wasMounted) {
        this.isMounted = true;
        this.mountTime = new Date();
      }

      // Emit reload event
      this.eventBus.emit('runtime:reloaded', {
        state: currentState,
        reloadCount: this.reloadCount,
        initializationTime: this.initializationTime,
        mountTime: this.mountTime,
      });

      // Execute after reload hook
      if (this.options.hooks?.onAfterReload) {
        await this.options.hooks.onAfterReload();
      }
    } catch (error) {
      this.lastError = error instanceof Error ? error : new Error(String(error));
      this.state.lifecycle = Lifecycle.INITIALIZED;
      throw error;
    }
  }
}
