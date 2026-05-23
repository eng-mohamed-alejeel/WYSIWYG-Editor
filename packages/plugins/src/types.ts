/**
 * Plugin System Types
 *
 * Comprehensive type definitions for the plugin architecture
 * Inspired by VSCode and Figma extension systems
 */

import {
  ComponentId,
  ComponentNode,
  ComponentDefinition,
  InspectorField,
  Command,
  Project,
  SelectionState,
} from '@wysiwyg/core';
import { ReactNode } from 'react';

/**
 * Unique identifier for plugins
 */
export type PluginId = string;

/**
 * Plugin version following semantic versioning
 */
export type PluginVersion = string;

/**
 * Plugin lifecycle states
 */
export type PluginState =
  | 'unloaded' // Plugin not loaded
  | 'loading' // Plugin is being loaded
  | 'loaded' // Plugin loaded but not activated
  | 'activating' // Plugin is being activated
  | 'active' // Plugin is active and running
  | 'deactivating' // Plugin is being deactivated
  | 'error'; // Plugin encountered an error

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  id: PluginId;
  name: string;
  version: PluginVersion;
  displayName?: string;
  description?: string;
  author?: string;
  license?: string;
  homepage?: string;
  repository?: string;
  keywords?: string[];
  categories?: string[];
  icon?: string;
  preview?: string;
  minimumEditorVersion?: string;
  maximumEditorVersion?: string;
  engines?: {
    [key: string]: string;
  };
  contributes?: PluginContribution;
}

/**
 * Plugin contribution points
 */
export interface PluginContribution {
  components?: ComponentDefinition[];
  commands?: CommandDefinition[];
  panels?: PanelDefinition[];
  inspectorFields?: InspectorField[];
  toolbarActions?: ToolbarActionDefinition[];
  themes?: ThemeDefinition[];
  languages?: LanguageDefinition[];
}

/**
 * Plugin manifest
 */
export interface PluginManifest extends PluginMetadata {
  main: string;
  lazy?: boolean;
  activationEvents?: ActivationEvent[];
  dependencies?: PluginId[];
  peerDependencies?: PluginId[];
}

/**
 * Plugin activation events
 */
export type ActivationEvent =
  | 'onStartup'
  | 'onEditorReady'
  | 'onProjectOpen'
  | 'onCommand:*'
  | `onLanguage:${string}`
  | `onView:${string}`;

/**
 * Command definition
 */
export interface CommandDefinition {
  id: string;
  title: string;
  category?: string;
  icon?: string;
  keybinding?: string;
  when?: string;
  handler: CommandHandler;
  enablement?: string;
}

/**
 * Command handler function
 */
export type CommandHandler = (...args: unknown[]) => void | Promise<void>;

/**
 * Panel definition
 */
export interface PanelDefinition {
  id: string;
  title: string;
  icon?: string;
  position: 'left' | 'right' | 'bottom' | 'top';
  order?: number;
  component: React.ComponentType<PanelProps>;
  when?: string;
}

/**
 * Panel props
 */
export interface PanelProps {
  isActive: boolean;
  onClose?: () => void;
}

/**
 * Toolbar action definition
 */
export interface ToolbarActionDefinition {
  id: string;
  title: string;
  icon?: string;
  position?: 'left' | 'right';
  order?: number;
  component?: React.ComponentType;
  handler?: CommandHandler;
  when?: string;
  separator?: boolean;
}

/**
 * Theme definition
 */
export interface ThemeDefinition {
  id: string;
  label: string;
  colors: Record<string, string>;
  uiTheme?: 'vs' | 'vs-dark' | 'hc-black';
}

/**
 * Language definition
 */
export interface LanguageDefinition {
  id: string;
  extensions?: string[];
  aliases?: string[];
  configuration?: LanguageConfiguration;
}

/**
 * Language configuration
 */
export interface LanguageConfiguration {
  comments?: CommentRule;
  brackets?: [string, string][];
  autoClosingPairs?: AutoClosingPair[];
  surroundingPairs?: AutoClosingPair[];
}

/**
 * Comment rule
 */
export interface CommentRule {
  lineComment?: string;
  blockComment?: [string, string];
}

/**
 * Auto closing pair
 */
export interface AutoClosingPair {
  open: string;
  close: string;
  notIn?: string[];
}

/**
 * Plugin context provided to plugins
 */
export interface PluginContext {
  /**
   * Plugin metadata
   */
  readonly metadata: PluginMetadata;

  /**
   * Current plugin state
   */
  readonly state: PluginState;

  /**
   * Event bus for plugin communication
   */
  readonly eventBus: PluginEventBus;

  /**
   * API registration methods
   */
  api: PluginAPI;

  /**
   * Editor state access (read-only)
   */
  readonly editorState: {
    getProject: () => Project | null;
    getSelection: () => SelectionState;
    getCurrentPageId: () => ComponentId | null;
  };

  /**
   * Logger instance for the plugin
   */
  readonly logger: PluginLogger;
}

/**
 * Plugin API
 */
export interface PluginAPI {
  /**
   * Register a new component
   */
  registerComponent: (definition: ComponentDefinition) => void;

  /**
   * Register a new panel
   */
  registerPanel: (definition: PanelDefinition) => void;

  /**
   * Register a new command
   */
  registerCommand: (definition: CommandDefinition) => void;

  /**
   * Register inspector fields
   */
  registerInspectorField: (field: InspectorField) => void;

  /**
   * Register a toolbar action
   */
  registerToolbarAction: (definition: ToolbarActionDefinition) => void;

  /**
   * Execute a command
   */
  executeCommand: (commandId: string, ...args: unknown[]) => Promise<void>;

  /**
   * Get a command by ID
   */
  getCommand: (commandId: string) => CommandDefinition | undefined;

  /**
   * Show a notification
   */
  showNotification: (message: string, type?: 'info' | 'warning' | 'error' | 'success') => void;

  /**
   * Show an information message
   */
  showInformationMessage: (message: string, ...actions: string[]) => Promise<string | undefined>;

  /**
   * Show a warning message
   */
  showWarningMessage: (message: string, ...actions: string[]) => Promise<string | undefined>;

  /**
   * Show an error message
   */
  showErrorMessage: (message: string, ...actions: string[]) => Promise<string | undefined>;

  /**
   * Open a panel
   */
  openPanel: (panelId: string) => void;

  /**
   * Close a panel
   */
  closePanel: (panelId: string) => void;

  /**
   * Get configuration value
   */
  getConfiguration: <T = unknown>(key: string) => T | undefined;

  /**
   * Update configuration value
   */
  updateConfiguration: (key: string, value: unknown) => Promise<void>;
}

/**
 * Plugin event bus
 */
export interface PluginEventBus {
  /**
   * Subscribe to an event
   */
  on: <T = unknown>(event: string, listener: (data: T) => void) => () => void;

  /**
   * Subscribe to an event once
   */
  once: <T = unknown>(event: string, listener: (data: T) => void) => () => void;

  /**
   * Emit an event
   */
  emit: <T = unknown>(event: string, data: T) => void;

  /**
   * Unsubscribe from an event
   */
  off: (event: string, listener: (...args: unknown[]) => void) => void;

  /**
   * Remove all listeners for an event
   */
  removeAllListeners: (event?: string) => void;
}

/**
 * Plugin logger
 */
export interface PluginLogger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

/**
 * Plugin interface
 */
export interface Plugin {
  /**
   * Plugin metadata
   */
  readonly metadata: PluginMetadata;

  /**
   * Called when plugin is loaded
   */
  onLoad?: (context: PluginContext) => void | Promise<void>;

  /**
   * Called when plugin is unloaded
   */
  onUnload?: (context: PluginContext) => void | Promise<void>;

  /**
   * Called when editor is ready
   */
  onEditorReady?: (context: PluginContext) => void | Promise<void>;

  /**
   * Called when selection changes
   */
  onSelectionChange?: (context: PluginContext, selection: SelectionState) => void | Promise<void>;

  /**
   * Called when plugin is activated
   */
  activate?: (context: PluginContext) => void | Promise<void>;

  /**
   * Called when plugin is deactivated
   */
  deactivate?: (context: PluginContext) => void | Promise<void>;
}

/**
 * Plugin manager configuration
 */
export interface PluginManagerConfig {
  /**
   * Base directory for plugins
   */
  pluginsDir?: string;

  /**
   * Whether to enable lazy loading
   */
  enableLazyLoading?: boolean;

  /**
   * Whether to enable plugin isolation
   */
  enableIsolation?: boolean;

  /**
   * Whether to enable hot reload during development
   */
  enableHotReload?: boolean;

  /**
   * Maximum number of plugins that can be loaded
   */
  maxPlugins?: number;

  /**
   * Plugin activation timeout in milliseconds
   */
  activationTimeout?: number;
}

/**
 * Plugin load result
 */
export interface PluginLoadResult {
  pluginId: PluginId;
  success: boolean;
  error?: Error;
}

/**
 * Plugin activation result
 */
export interface PluginActivationResult {
  pluginId: PluginId;
  success: boolean;
  error?: Error;
}

/**
 * Plugin manager events
 */
export type PluginManagerEvent =
  | 'plugin:loading'
  | 'plugin:loaded'
  | 'plugin:activating'
  | 'plugin:activated'
  | 'plugin:deactivating'
  | 'plugin:deactivated'
  | 'plugin:unloading'
  | 'plugin:unloaded'
  | 'plugin:error'
  | 'plugin:state:change';
