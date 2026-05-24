/**
 * Editor Runtime Types
 *
 * Core types for the centralized Editor Runtime architecture
 */

import { EditorState, Plugin, Command } from '../types/editor';

/**
 * Runtime lifecycle states
 */
export enum RuntimeLifecycle {
  UNINITIALIZED = 'uninitialized',
  INITIALIZING = 'initializing',
  INITIALIZED = 'initialized',
  MOUNTING = 'mounting',
  MOUNTED = 'mounted',
  DESTROYING = 'destroying',
  DESTROYED = 'destroyed',
  RELOADING = 'reloading',
}

/**
 * Runtime configuration
 */
export interface RuntimeConfig {
  debug?: boolean;
  enableHotReload?: boolean;
  maxHistorySize?: number;
  autoSaveInterval?: number;
}

/**
 * Service identifier for dependency injection
 */
export type ServiceIdentifier<T> = string | symbol | { new (...args: unknown[]): T };

/**
 * Service descriptor
 */
export interface ServiceDescriptor<T = unknown> {
  id: ServiceIdentifier<T>;
  factory: (...args: unknown[]) => T;
  dependencies?: ServiceIdentifier<unknown>[];
  singleton?: boolean;
  lazy?: boolean;
}

/**
 * Service container interface
 */
export interface ServiceContainer<T = unknown> {
  register(descriptor: ServiceDescriptor<T>): void;
  get(id: ServiceIdentifier<T>): T;
  has(id: ServiceIdentifier<T>): boolean;
  dispose(): void;
}

export interface ServiceContainerInterface {
  register<T>(descriptor: ServiceDescriptor<T>): void;
  get<T>(id: ServiceIdentifier<T>): T;
  has<T>(id: ServiceIdentifier<T>): boolean;
  dispose(): void;
}

/**
 * Runtime hooks
 */
export interface RuntimeHooks {
  onBeforeInitialize?: () => void | Promise<void>;
  onAfterInitialize?: () => void | Promise<void>;
  onBeforeMount?: () => void | Promise<void>;
  onAfterMount?: () => void | Promise<void>;
  onBeforeDestroy?: () => void | Promise<void>;
  onAfterDestroy?: () => void | Promise<void>;
  onBeforeReload?: () => void | Promise<void>;
  onAfterReload?: () => void | Promise<void>;
  onError?: (error: Error) => void;
}

/**
 * Editor context providers
 */
export interface EditorContextProviders extends Record<string, unknown> {
  getEditorState: () => EditorState;
  updateEditorState: (updates: Partial<EditorState>) => void;
  executeCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  registerPlugin: (plugin: Plugin) => void;
  unregisterPlugin: (pluginName: string) => void;
}

/**
 * Runtime state
 */
export interface RuntimeState {
  lifecycle: RuntimeLifecycle;
  config: RuntimeConfig;
  plugins: Map<string, Plugin>;
  services: ServiceContainerInterface;
  contextProviders: EditorContextProviders;
}

/**
 * Runtime options
 */
export interface RuntimeOptions {
  config?: RuntimeConfig;
  hooks?: RuntimeHooks;
  initialServices?: ServiceDescriptor[];
  initialPlugins?: Plugin[];
}
