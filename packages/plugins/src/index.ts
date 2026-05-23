/**
 * Plugin System
 *
 * Professional plugin architecture for WYSIWYG editor
 * Inspired by VSCode and Figma extension systems
 */

// Core types
export * from './types';

// Event bus
export { createEventBus } from './EventBus';

// Plugin logger
export { createPluginLogger } from './PluginLogger';

// Plugin API
export { PluginAPI } from './PluginAPI';

// Plugin sandbox
export { createPluginSandbox, PluginSandbox } from './PluginSandbox';

// Plugin loader
export { PluginLoader } from './PluginLoader';

// Plugin manager
export { PluginManager } from './PluginManager';

// Convenience exports
export type {
  Plugin,
  PluginManifest,
  PluginContext,
  PluginAPI as PluginAPIInterface,
  PluginEventBus,
  PluginLogger as PluginLoggerInterface,
  PluginManagerConfig,
  PluginLoadResult,
  PluginActivationResult,
  PluginManagerEvent,
  PluginState,
  PluginId,
  PluginVersion,
  PluginMetadata,
  PluginContribution,
  CommandDefinition,
  PanelDefinition,
  ToolbarActionDefinition,
  ThemeDefinition,
  LanguageDefinition,
  PanelProps,
} from './types';
