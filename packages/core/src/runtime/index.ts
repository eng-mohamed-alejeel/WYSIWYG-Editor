/**
 * Editor Runtime Module
 *
 * Centralized runtime architecture for orchestrating all editor subsystems
 */

export { EditorRuntime } from './EditorRuntime';
export { ServiceContainer } from './ServiceContainer';
export { EventBus } from './EventBus';
export { StateStore } from './StateStore';
export { HistoryManager } from './HistoryManager';
export { PluginManager } from './PluginManager';
export { CommandManager } from './CommandManager';
export { LayoutEngine } from './LayoutEngine';
export { InspectorManager } from './InspectorManager';
export { RendererManager } from './RendererManager';

export type {
  RuntimeLifecycle,
  RuntimeConfig,
  RuntimeOptions,
  RuntimeState,
  RuntimeHooks,
  EditorContextProviders,
  ServiceIdentifier,
  ServiceDescriptor,
  ServiceContainerInterface,
} from './types';

export type { EventBusInterface, EventHandler } from './EventBus';

export type { StateStoreInterface, StateListener } from './StateStore';

export type { LayoutPanel, LayoutConfig } from './LayoutEngine';

export type {
  InspectorSection,
  InspectorField as InspectorFieldConfig,
  InspectorConfig,
} from './InspectorManager';

export type { RendererConfig } from './RendererManager';
