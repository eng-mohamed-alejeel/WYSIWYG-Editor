/**
 * Editor Runtime Core
 *
 * Centralized runtime that orchestrates all editor subsystems
 * following enterprise-grade architecture similar to VSCode/Figma
 */

import {
  RuntimeLifecycle,
  RuntimeOptions,
  RuntimeState,
  EditorContextProviders,
  ServiceDescriptor,
} from './types';
import { EventBus } from './EventBus';
import { ServiceContainer } from './ServiceContainer';
import { StateStore } from './StateStore';
import { HistoryManager } from './HistoryManager';
import { PluginManager } from './PluginManager';
import { CommandManager } from './CommandManager';
import { LayoutEngine } from './LayoutEngine';
import { InspectorManager } from './InspectorManager';
import { RendererManager } from './RendererManager';
import { CoreServices } from './CoreServices';
import { setupEventListeners } from './EventListeners';
import { ComponentOperations } from './ComponentOperations';
import { EditorState, Plugin, Command } from '../types/editor';
import { ComponentNode } from '../types/components';

export class EditorRuntime {
  private state: RuntimeState;
  private options: RuntimeOptions;
  private eventBus: EventBus;
  private serviceContainer: ServiceContainer;
  private stateStore: StateStore<EditorState>;
  private historyManager: HistoryManager;
  private pluginManager: PluginManager;
  private commandManager: CommandManager;
  private layoutEngine: LayoutEngine;
  private inspectorManager: InspectorManager;
  private rendererManager: RendererManager;
  private componentOperations: ComponentOperations;

  constructor(options: RuntimeOptions = {}) {
    this.options = options;

    // Initialize core services
    this.eventBus = new EventBus();
    this.serviceContainer = new ServiceContainer();

    // Initialize state store with default state
    const initialState: EditorState = {
      project: null,
      currentPageId: null,
      selection: {
        selectedIds: [],
        hoveredId: null,
        focusedId: null,
      },
      history: {
        past: [],
        present: null,
        future: [],
        maxSize: options.config?.maxHistorySize ?? 50,
      },
      isDirty: false,
      isPreviewMode: false,
      currentBreakpoint: 'desktop',
      zoom: 1,
      clipboard: [],
    };

    this.stateStore = new StateStore(initialState, this.eventBus);

    // Initialize subsystems
    this.historyManager = new HistoryManager(options.config?.maxHistorySize ?? 50, this.eventBus);

    this.commandManager = new CommandManager(this.eventBus, this.historyManager);
    this.layoutEngine = new LayoutEngine({ panels: [] }, this.eventBus);
    this.inspectorManager = new InspectorManager(this.eventBus);
    this.rendererManager = new RendererManager({ mode: 'edit' }, this.eventBus);
    this.componentOperations = new ComponentOperations(this.eventBus, this.stateStore);

    // Create context providers
    const contextProviders: EditorContextProviders = {
      getEditorState: () => this.stateStore.getState(),
      updateEditorState: (updates) => this.stateStore.setState(updates),
      executeCommand: (command) => this.commandManager.execute(command),
      undo: () => this.commandManager.undo(),
      redo: () => this.commandManager.redo(),
      registerPlugin: (plugin) => this.pluginManager.register(plugin),
      unregisterPlugin: (pluginName) => this.pluginManager.unregister(pluginName),
    };

    this.pluginManager = new PluginManager(this.serviceContainer, this.eventBus, contextProviders);

    // Initialize runtime state
    this.state = {
      lifecycle: RuntimeLifecycle.UNINITIALIZED,
      config: options.config ?? {},
      plugins: new Map(),
      services: this.serviceContainer,
      contextProviders,
    };

    // Register core services
    this.registerCoreServices();

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Initialize the runtime
   */
  async initialize(): Promise<void> {
    if (this.state.lifecycle !== RuntimeLifecycle.UNINITIALIZED) {
      throw new Error('Runtime is already initialized');
    }

    this.state.lifecycle = RuntimeLifecycle.INITIALIZING;

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

      this.state.lifecycle = RuntimeLifecycle.INITIALIZED;

      // Emit initialization event
      this.eventBus.emit('runtime:initialized', { runtime: this });

      // Execute after initialize hook
      if (this.options.hooks?.onAfterInitialize) {
        await this.options.hooks.onAfterInitialize();
      }
    } catch (error) {
      this.state.lifecycle = RuntimeLifecycle.UNINITIALIZED;
      throw error;
    }
  }

  /**
   * Mount the runtime to DOM
   */
  async mount(container: HTMLElement): Promise<void> {
    if (this.state.lifecycle !== RuntimeLifecycle.INITIALIZED) {
      throw new Error('Runtime must be initialized before mounting');
    }

    this.state.lifecycle = RuntimeLifecycle.MOUNTING;

    try {
      // Execute before mount hook
      if (this.options.hooks?.onBeforeMount) {
        await this.options.hooks.onBeforeMount();
      }

      // Initialize layout with default panels
      this.initializeDefaultLayout();

      this.state.lifecycle = RuntimeLifecycle.MOUNTED;

      // Emit mount event
      this.eventBus.emit('runtime:mounted', { container });

      // Execute after mount hook
      if (this.options.hooks?.onAfterMount) {
        await this.options.hooks.onAfterMount();
      }
    } catch (error) {
      this.state.lifecycle = RuntimeLifecycle.INITIALIZED;
      throw error;
    }
  }

  /**
   * Destroy the runtime
   */
  async destroy(): Promise<void> {
    if (this.state.lifecycle === RuntimeLifecycle.DESTROYED) {
      return;
    }

    this.state.lifecycle = RuntimeLifecycle.DESTROYING;

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
    this.state.lifecycle = RuntimeLifecycle.DESTROYED;

    // Emit destroy event
    this.eventBus.emit('runtime:destroyed', {});

    // Execute after destroy hook
    if (this.options.hooks?.onAfterDestroy) {
      await this.options.hooks.onAfterDestroy();
    }
  }

  /**
   * Reload the runtime
   */
  async reload(): Promise<void> {
    if (this.state.lifecycle === RuntimeLifecycle.RELOADING) {
      return;
    }

    this.state.lifecycle = RuntimeLifecycle.RELOADING;

    try {
      // Execute before reload hook
      if (this.options.hooks?.onBeforeReload) {
        await this.options.hooks.onBeforeReload();
      }

      // Save current state
      const currentState = this.stateStore.getState();
      const plugins = Array.from(this.state.plugins.values());

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

      this.state.lifecycle = RuntimeLifecycle.INITIALIZED;

      // Emit reload event
      this.eventBus.emit('runtime:reloaded', { state: currentState });

      // Execute after reload hook
      if (this.options.hooks?.onAfterReload) {
        await this.options.hooks.onAfterReload();
      }
    } catch (error) {
      this.state.lifecycle = RuntimeLifecycle.INITIALIZED;
      throw error;
    }
  }

  /**
   * Get the current lifecycle state
   */
  getLifecycle(): RuntimeLifecycle {
    return this.state.lifecycle;
  }

  /**
   * Get the event bus
   */
  getEventBus(): EventBus {
    return this.eventBus;
  }

  /**
   * Get the service container
   */
  getServiceContainer(): ServiceContainer {
    return this.serviceContainer;
  }

  /**
   * Get the state store
   */
  getStateStore(): StateStore<EditorState> {
    return this.stateStore;
  }

  /**
   * Get the plugin manager
   */
  getPluginManager(): PluginManager {
    return this.pluginManager;
  }

  /**
   * Get the command manager
   */
  getCommandManager(): CommandManager {
    return this.commandManager;
  }

  /**
   * Get the layout engine
   */
  getLayoutEngine(): LayoutEngine {
    return this.layoutEngine;
  }

  /**
   * Get the inspector manager
   */
  getInspectorManager(): InspectorManager {
    return this.inspectorManager;
  }

  /**
   * Get the renderer manager
   */
  getRendererManager(): RendererManager {
    return this.rendererManager;
  }

  /**
   * Register a service
   */
  registerService<T>(descriptor: ServiceDescriptor<T>): void {
    this.serviceContainer.register(descriptor);
  }

  /**
   * Get a service
   */
  getService<T>(id: string | symbol): T {
    return this.serviceContainer.get(id);
  }

  /**
   * Register a plugin
   */
  registerPlugin(plugin: Plugin): void {
    this.pluginManager.register(plugin);
    this.state.plugins.set(plugin.name, plugin);
  }

  /**
   * Unregister a plugin
   */
  unregisterPlugin(pluginName: string): void {
    this.pluginManager.unregister(pluginName);
    this.state.plugins.delete(pluginName);
  }

  /**
   * Execute a command
   */
  executeCommand(command: Command): void {
    this.commandManager.execute(command);
  }

  /**
   * Select a component
   */
  selectComponent(componentId: string): void {
    this.componentOperations.selectComponent(componentId);
  }

  /**
   * Update a component
   */
  updateComponent(componentId: string, updates: Partial<ComponentNode>): void {
    this.componentOperations.updateComponent(componentId, updates);
  }

  private registerCoreServices(): void {
    const coreServices = new CoreServices(
      this.eventBus,
      this.serviceContainer,
      this.stateStore,
      this.historyManager,
      this.commandManager,
      this.layoutEngine,
      this.inspectorManager,
      this.rendererManager,
      this.pluginManager
    );
    coreServices.registerAll();
  }

  private setupEventListeners(): void {
    setupEventListeners(this.eventBus, this.inspectorManager, this.options);
  }

  private initializeDefaultLayout(): void {
    // Initialize default layout panels
    this.layoutEngine.registerPanel({
      id: 'main',
      title: 'Main',
      position: 'center',
      size: 800,
      resizable: true,
      type: 'sidebar',
    });

    this.layoutEngine.registerPanel({
      id: 'inspector',
      title: 'Inspector',
      position: 'right',
      size: 300,
      resizable: true,
      type: 'sidebar',
    });

    this.layoutEngine.registerPanel({
      id: 'layers',
      title: 'Layers',
      position: 'left',
      size: 250,
      resizable: true,
      type: 'sidebar',
    });
  }
}
