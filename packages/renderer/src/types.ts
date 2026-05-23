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
  theme?: any;
  children?: React.ReactNode;
  style?: string;
  parentId?: string;
  depth?: number;
  errorBoundary?: boolean;
  lazy?: boolean;
  virtualized?: boolean;
  cacheKey?: string;
  lifecycle?: RendererLifecycle;
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
  theme?: any;
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
  generateThemeVariables(theme: any): string;
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
  onBeforeRender?: (node: ComponentNode, context: RendererContext) => void;
  onAfterRender?: (node: ComponentNode, context: RendererContext, result: React.ReactNode) => void;
  onError?: (error: Error, node: ComponentNode, context: RendererContext) => React.ReactNode;
  onMount?: (node: ComponentNode, context: RendererContext) => void;
  onUpdate?: (node: ComponentNode, context: RendererContext) => void;
  onUnmount?: (node: ComponentNode, context: RendererContext) => void;
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
