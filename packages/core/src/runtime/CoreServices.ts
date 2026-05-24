/**
 * Core Services Registration
 *
 * Handles registration of all core runtime services
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
import { EditorState } from '../types/editor';

export class CoreServices {
  private eventBus: EventBus;
  private serviceContainer: ServiceContainer;
  private stateStore: StateStore<EditorState>;
  private historyManager: HistoryManager;
  private commandManager: CommandManager;
  private layoutEngine: LayoutEngine;
  private inspectorManager: InspectorManager;
  private rendererManager: RendererManager;
  private pluginManager: PluginManager;

  constructor(
    eventBus: EventBus,
    serviceContainer: ServiceContainer,
    stateStore: StateStore<EditorState>,
    historyManager: HistoryManager,
    commandManager: CommandManager,
    layoutEngine: LayoutEngine,
    inspectorManager: InspectorManager,
    rendererManager: RendererManager,
    pluginManager: PluginManager
  ) {
    this.eventBus = eventBus;
    this.serviceContainer = serviceContainer;
    this.stateStore = stateStore;
    this.historyManager = historyManager;
    this.commandManager = commandManager;
    this.layoutEngine = layoutEngine;
    this.inspectorManager = inspectorManager;
    this.rendererManager = rendererManager;
    this.pluginManager = pluginManager;
  }

  registerAll(): void {
    this.registerEventBus();
    this.registerStateStore();
    this.registerHistoryManager();
    this.registerCommandManager();
    this.registerPluginManager();
    this.registerLayoutEngine();
    this.registerInspectorManager();
    this.registerRendererManager();
  }

  private registerEventBus(): void {
    this.serviceContainer.register({
      id: 'EventBus',
      factory: () => this.eventBus,
      singleton: true,
    });
  }

  private registerStateStore(): void {
    this.serviceContainer.register({
      id: 'StateStore',
      factory: () => this.stateStore,
      singleton: true,
    });
  }

  private registerHistoryManager(): void {
    this.serviceContainer.register({
      id: 'HistoryManager',
      factory: () => this.historyManager,
      singleton: true,
    });
  }

  private registerCommandManager(): void {
    this.serviceContainer.register({
      id: 'CommandManager',
      factory: () => this.commandManager,
      singleton: true,
    });
  }

  private registerPluginManager(): void {
    this.serviceContainer.register({
      id: 'PluginManager',
      factory: () => this.pluginManager,
      singleton: true,
    });
  }

  private registerLayoutEngine(): void {
    this.serviceContainer.register({
      id: 'LayoutEngine',
      factory: () => this.layoutEngine,
      singleton: true,
    });
  }

  private registerInspectorManager(): void {
    this.serviceContainer.register({
      id: 'InspectorManager',
      factory: () => this.inspectorManager,
      singleton: true,
    });
  }

  private registerRendererManager(): void {
    this.serviceContainer.register({
      id: 'RendererManager',
      factory: () => this.rendererManager,
      singleton: true,
    });
  }
}
