/**
 * Renderer Types
 *
 * This module defines the types used by the production-grade rendering system.
 */

import { ComponentNode, Breakpoint, StyleObject } from '@wysiwyg/core';

/**
 * Renderer mode
 */
export type RendererMode = 'editor' | 'preview' | 'runtime' | 'export';

/**
 * Renderer context
 */
export interface RendererContext {
  breakpoint: Breakpoint;
  isPreview: boolean;
  isEditable: boolean;
  mode: RendererMode;
  componentRegistry: Map<string, ComponentRenderer>;
  theme?: Record<string, unknown>;
  children?: React.ReactNode;
  style?: string;
  parentId?: string;
  depth?: number;
  errorBoundary?: boolean;
  lazy?: boolean;
  virtualized?: boolean;
  cacheKey?: string;
  lifecycle?: RendererLifecycle;
  metadata?: Record<string, unknown>;
}

/**
 * Component renderer function
 */
export type ComponentRenderer = (node: ComponentNode, context: RendererContext) => React.ReactNode;

/**
 * Render options
 */
export interface RenderOptions {
  breakpoint?: Breakpoint;
  isPreview?: boolean;
  isEditable?: boolean;
  mode?: RendererMode;
  theme?: Record<string, unknown>;
  enableVirtualization?: boolean;
  enableLazyRendering?: boolean;
  enableErrorBoundary?: boolean;
  enableCaching?: boolean;
  virtualizationThreshold?: number;
  cacheSize?: number;
}

/**
 * Render result
 */
export interface RenderResult {
  html: string;
  css: string;
  js: string;
  assets: string[];
  metadata?: RenderMetadata;
}

/**
 * Render metadata
 */
export interface RenderMetadata {
  componentCount: number;
  renderTime: number;
  cacheHits: number;
  cacheMisses: number;
  virtualizedComponents: number;
  lazyLoadedComponents: number;
}

/**
 * Style generator interface
 */
export interface StyleGenerator {
  generate(
    styles: StyleObject,
    responsiveStyles?: Record<Breakpoint, StyleObject>,
    breakpoint?: Breakpoint
  ): string;
  generateScopedCss(
    className: string,
    styles: StyleObject,
    responsiveStyles?: Record<Breakpoint, StyleObject>
  ): string;
  generateThemeVariables(theme: Record<string, unknown>): string;
  generateResponsiveCss(
    styles: StyleObject,
    responsiveStyles?: Record<Breakpoint, StyleObject>
  ): string;
}

/**
 * Component registry
 */
export interface ComponentRegistry {
  register(type: string, renderer: ComponentRenderer): void;
  unregister(type: string): void;
  get(type: string): ComponentRenderer | undefined;
  has(type: string): boolean;
  clear(): void;
  getAll(): Map<string, ComponentRenderer>;
  getTypes(): string[];
  registerBatch(renderers: Record<string, ComponentRenderer>): void;
  unregisterBatch(types: string[]): void;
}

/**
 * Renderer configuration
 */
export interface RendererConfig {
  enableMemoization?: boolean;
  enableVirtualization?: boolean;
  enableLazyRendering?: boolean;
  enableErrorBoundary?: boolean;
  enableCaching?: boolean;
  maxComponentDepth?: number;
  virtualizationThreshold?: number;
  cacheSize?: number;
  styleGenerator?: StyleGenerator;
  performanceMonitoring?: boolean;
  debugMode?: boolean;
}

/**
 * Renderer lifecycle hooks
 */
export interface RendererLifecycle {
  onBeforeRender?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
  onAfterRender?: (
    node: ComponentNode,
    context: RendererContext,
    result: React.ReactNode
  ) => void | Promise<void>;
  onError?: (
    error: Error,
    node: ComponentNode,
    context: RendererContext
  ) => React.ReactNode | Promise<React.ReactNode>;
  onBeforeMount?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
  onAfterMount?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
  onBeforeUnmount?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
  onAfterUnmount?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
  onMount?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
  onUpdate?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
  onUnmount?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
}

/**
 * Render phase enum
 */
export enum RenderPhase {
  BEFORE_RENDER = 'beforeRender',
  RENDERING = 'rendering',
  AFTER_RENDER = 'afterRender',
  BEFORE_MOUNT = 'beforeMount',
  MOUNTING = 'mounting',
  AFTER_MOUNT = 'afterMount',
  BEFORE_UNMOUNT = 'beforeUnmount',
  UNMOUNTING = 'unmounting',
  AFTER_UNMOUNT = 'afterUnmount',
}

/**
 * Lifecycle hook context
 */
export interface LifecycleHookContext {
  phase: RenderPhase;
  node: ComponentNode;
  context: RendererContext;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * Lifecycle hook function type
 */
export type LifecycleHookFunction<T = void> = (ctx: LifecycleHookContext) => T | Promise<T>;

/**
 * Lifecycle hook definition
 */
export interface LifecycleHook {
  id: string;
  phase: RenderPhase;
  handler: LifecycleHookFunction;
  priority?: number;
  once?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Middleware context
 */
export interface MiddlewareContext {
  node: ComponentNode;
  context: RendererContext;
  phase: RenderPhase;
  next: () => Promise<unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * Middleware function type
 */
export type MiddlewareFunction = (ctx: MiddlewareContext) => Promise<unknown>;

/**
 * Middleware definition
 */
export interface RendererMiddleware {
  id: string;
  name: string;
  handler: MiddlewareFunction;
  priority?: number;
  enabled?: boolean;
  phases?: RenderPhase[];
}

/**
 * Render diagnostics data
 */
export interface RenderDiagnostics {
  nodeId: string;
  phase: RenderPhase;
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  error?: Error;
  metadata?: Record<string, unknown>;
}

/**
 * Profiling data for lifecycle hooks
 */
export interface LifecycleProfileData {
  hookId: string;
  phase: RenderPhase;
  executionTime: number;
  success: boolean;
  error?: Error;
}

/**
 * Plugin lifecycle integration
 */
export interface PluginLifecycleIntegration {
  pluginId: string;
  hooks: LifecycleHook[];
  middleware?: RendererMiddleware[];
  enabled?: boolean;
}

/**
 * Render lifecycle options
 */
export interface RenderLifecycleOptions {
  enableDiagnostics?: boolean;
  enableProfiling?: boolean;
  maxDiagnosticsEntries?: number;
  profilingSampleRate?: number;
  asyncTimeout?: number;
  maxConcurrentHooks?: number;
}

/**
 * Virtualization config
 */
export interface VirtualizationConfig {
  enabled: boolean;
  threshold: number;
  bufferSize?: number;
  overscan?: number;
}

/**
 * Cache config
 */
export interface CacheConfig {
  enabled: boolean;
  maxSize: number;
  ttl?: number;
  strategy?: 'lru' | 'fifo' | 'lfu';
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  virtualizedCount: number;
  lazyLoadedCount: number;
  cacheHitRate: number;
  memoryUsage?: number;
}

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  nodeId?: string;
}
