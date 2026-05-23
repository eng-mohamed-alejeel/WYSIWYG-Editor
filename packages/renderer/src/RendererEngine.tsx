/**
 * Production-Grade Renderer Engine
 *
 * This module provides the main rendering functionality with support for:
 * - Multiple renderer modes (editor, preview, runtime, export)
 * - Virtualization for large component trees
 * - Lazy component rendering
 * - React error boundaries
 * - Render lifecycle hooks
 * - Render caching
 * - Performance monitoring
 */

import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { ComponentNode, Breakpoint, StyleObject } from '@wysiwyg/core';
import {
  RendererContext,
  RendererMode,
  RenderOptions,
  ComponentRenderer,
  RendererConfig,
  RendererLifecycle,
  VirtualizationConfig,
  CacheConfig,
} from './types';
import { DefaultComponentRegistry, getGlobalRegistry } from './registry';
import { getGlobalStyleGenerator } from './styles';
import { RendererErrorBoundary } from './ErrorBoundary';
import { VirtualizedRenderer, useVirtualization } from './VirtualizedRenderer';
import { LazyComponentRenderer, useLazyLoading } from './LazyComponentRenderer';
import {
  useRendererLifecycle,
  useRenderError,
  getGlobalLifecycleManager,
} from './RendererLifecycle';
import { getGlobalPerformanceMonitor } from './PerformanceMonitor';
import { createRenderCache } from './RenderCache';

/**
 * Default renderer configuration
 */
const DEFAULT_CONFIG: Required<RendererConfig> = {
  enableMemoization: true,
  enableVirtualization: true,
  enableLazyRendering: true,
  enableErrorBoundary: true,
  enableCaching: true,
  maxComponentDepth: 100,
  virtualizationThreshold: 50,
  cacheSize: 100,
  styleGenerator: getGlobalStyleGenerator(),
  performanceMonitoring: true,
  debugMode: false,
};

/**
 * Component Renderer Props
 */
interface ComponentRendererProps {
  node: ComponentNode;
  context: RendererContext;
  depth?: number;
  lifecycle?: RendererLifecycle;
}

/**
 * Render a single component node with all advanced features
 */
const ComponentRendererComponent: React.FC<ComponentRendererProps> = memo(
  ({ node, context, depth = 0, lifecycle }) => {
    const { componentRegistry, breakpoint, mode, errorBoundary, lazy, virtualized } = context;
    const monitor = getGlobalPerformanceMonitor();
    const lifecycleManager = getGlobalLifecycleManager();
    const renderStartTimeRef = useRef<number>();

    // Track component count
    useEffect(() => {
      monitor.incrementComponentCount();
    }, [monitor]);

    // Setup lifecycle hooks
    useRendererLifecycle(node, context, lifecycle);

    // Error handler
    const handleError = useRenderError(node, context, lifecycle?.onError);

    // Check max depth
    if (depth > DEFAULT_CONFIG.maxComponentDepth) {
      console.warn(
        `Maximum component depth (${DEFAULT_CONFIG.maxComponentDepth}) exceeded for node ${node.id}`
      );
      return null;
    }

    // Get the component renderer
    const renderer = componentRegistry.get(node.type);
    if (!renderer) {
      console.warn(`No renderer found for component type: ${node.type}`);
      return null;
    }

    // Generate styles with memoization
    const style = useMemo(() => {
      const styleGenerator = DEFAULT_CONFIG.styleGenerator;
      return styleGenerator.generate(
        node.styles,
        node.responsiveStyles as Record<Breakpoint, StyleObject> | undefined,
        breakpoint
      );
    }, [node.styles, node.responsiveStyles, breakpoint]);

    // Create child context
    const childContext = useMemo<RendererContext>(
      () => ({
        ...context,
        parentId: node.id,
        depth: depth + 1,
      }),
      [context, node.id, depth]
    );

    // Render children with optimization
    const children = useMemo(() => {
      return node.children.map((childNode) => (
        <ComponentRendererComponent
          key={childNode.id}
          node={childNode}
          context={childContext}
          depth={depth + 1}
          lifecycle={lifecycle}
        />
      ));
    }, [node.children, childContext, depth, lifecycle]);

    // Render the component
    const renderComponent = useCallback(() => {
      renderStartTimeRef.current = monitor.startRender(node.id);

      try {
        const result = renderer(node, {
          ...context,
          children,
          style,
        });

        if (renderStartTimeRef.current) {
          monitor.endRender(node.id, node.type, renderStartTimeRef.current);
        }

        return result;
      } catch (error) {
        if (renderStartTimeRef.current) {
          monitor.endRender(node.id, node.type, renderStartTimeRef.current);
        }
        throw error;
      }
    }, [node, context, children, style, renderer, monitor]);

    // Apply error boundary if enabled
    const content =
      errorBoundary !== false ? (
        <RendererErrorBoundary
          nodeId={node.id}
          mode={mode}
          onError={(error, errorInfo) => {
            console.error(`Error rendering component ${node.id}:`, error, errorInfo);
            if (lifecycle?.onError) {
              lifecycle.onError(error, node, context);
            }
          }}
        >
          {renderComponent()}
        </RendererErrorBoundary>
      ) : (
        renderComponent()
      );

    // Apply lazy loading if enabled
    if (lazy !== false && useLazyLoading(node, context, depth)) {
      return (
        <LazyComponentRenderer node={node} context={context} renderComponent={renderComponent} />
      );
    }

    return content;
  }
);

ComponentRendererComponent.displayName = 'ComponentRendererComponent';

/**
 * Page Renderer Props
 */
interface PageRendererProps {
  nodes: ComponentNode[];
  options?: RenderOptions;
}

/**
 * Render a page with multiple component nodes
 */
export const PageRenderer: React.FC<PageRendererProps> = memo(({ nodes, options = {} }) => {
  const monitor = getGlobalPerformanceMonitor();
  const renderStartTimeRef = useRef<number>();

  // Determine renderer mode
  const mode: RendererMode = options.mode || (options.isPreview ? 'preview' : 'editor');

  // Create renderer context
  const context = useMemo<RendererContext>(
    () => ({
      breakpoint: options.breakpoint || 'desktop',
      isPreview: options.isPreview ?? false,
      isEditable: options.isEditable ?? false,
      mode,
      componentRegistry: getGlobalRegistry().getAll(),
      theme: options.theme,
      errorBoundary: options.enableErrorBoundary ?? DEFAULT_CONFIG.enableErrorBoundary,
      lazy: options.enableLazyRendering ?? DEFAULT_CONFIG.enableLazyRendering,
      virtualized: options.enableVirtualization ?? DEFAULT_CONFIG.enableVirtualization,
      depth: 0,
    }),
    [options, mode]
  );

  // Virtualization config
  const virtualizationConfig = useMemo<VirtualizationConfig>(
    () => ({
      enabled: options.enableVirtualization ?? DEFAULT_CONFIG.enableVirtualization,
      threshold: options.virtualizationThreshold ?? DEFAULT_CONFIG.virtualizationThreshold,
      bufferSize: 20,
      overscan: 5,
    }),
    [options.enableVirtualization, options.virtualizationThreshold]
  );

  // Determine if virtualization should be used
  const shouldVirtualize = useVirtualization(nodes, virtualizationConfig);

  // Render individual node
  const renderNode = useCallback(
    (node: ComponentNode, index: number) => (
      <ComponentRendererComponent key={node.id} node={node} context={context} />
    ),
    [context]
  );

  // Start performance monitoring
  useEffect(() => {
    renderStartTimeRef.current = monitor.startRender('page');
    return () => {
      if (renderStartTimeRef.current) {
        monitor.endRender('page', 'PageRenderer', renderStartTimeRef.current);
      }
    };
  }, [monitor]);

  // Render all nodes with or without virtualization
  const renderedContent = useMemo(() => {
    if (shouldVirtualize) {
      return (
        <VirtualizedRenderer
          nodes={nodes}
          context={context}
          config={virtualizationConfig}
          renderItem={renderNode}
        />
      );
    }

    return nodes.map(renderNode);
  }, [nodes, context, shouldVirtualize, virtualizationConfig, renderNode]);

  return <>{renderedContent}</>;
});

PageRenderer.displayName = 'PageRenderer';

/**
 * Renderer Engine Class
 *
 * Main renderer class that manages component rendering with all advanced features
 */
export class RendererEngine {
  private registry: DefaultComponentRegistry;
  private config: Required<RendererConfig>;
  private cache?: ReturnType<typeof createRenderCache>;
  private lifecycleManager = getGlobalLifecycleManager();
  private performanceMonitor = getGlobalPerformanceMonitor();

  constructor(registry?: DefaultComponentRegistry, config?: RendererConfig) {
    this.registry = registry || getGlobalRegistry();
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Initialize cache if enabled
    if (this.config.enableCaching) {
      const cacheConfig: CacheConfig = {
        enabled: true,
        maxSize: this.config.cacheSize,
        strategy: 'lru',
      };
      this.cache = createRenderCache(cacheConfig);
    }
  }

  /**
   * Render a component node
   */
  renderNode(node: ComponentNode, options: RenderOptions = {}): React.ReactNode {
    const mode: RendererMode = options.mode || (options.isPreview ? 'preview' : 'editor');
    const context: RendererContext = {
      breakpoint: options.breakpoint || 'desktop',
      isPreview: options.isPreview ?? false,
      isEditable: options.isEditable ?? false,
      mode,
      componentRegistry: this.registry.getAll(),
      theme: options.theme,
      errorBoundary: options.enableErrorBoundary ?? this.config.enableErrorBoundary,
      lazy: options.enableLazyRendering ?? this.config.enableLazyRendering,
      virtualized: options.enableVirtualization ?? this.config.enableVirtualization,
      depth: 0,
    };

    return <ComponentRendererComponent key={node.id} node={node} context={context} />;
  }

  /**
   * Render multiple component nodes
   */
  renderNodes(nodes: ComponentNode[], options: RenderOptions = {}): React.ReactNode {
    return <PageRenderer nodes={nodes} options={options} />;
  }

  /**
   * Register a component renderer
   */
  registerComponent(type: string, renderer: ComponentRenderer): void {
    this.registry.register(type, renderer);
  }

  /**
   * Unregister a component renderer
   */
  unregisterComponent(type: string): void {
    this.registry.unregister(type);
  }

  /**
   * Get the component registry
   */
  getRegistry(): DefaultComponentRegistry {
    return this.registry;
  }

  /**
   * Update renderer configuration
   */
  updateConfig(config: Partial<RendererConfig>): void {
    this.config = { ...this.config, ...config };

    // Reinitialize cache if configuration changed
    if (config.enableCaching !== undefined || config.cacheSize !== undefined) {
      if (this.config.enableCaching) {
        const cacheConfig: CacheConfig = {
          enabled: true,
          maxSize: this.config.cacheSize,
          strategy: 'lru',
        };
        this.cache = createRenderCache(cacheConfig);
      } else {
        this.cache = undefined;
      }
    }
  }

  /**
   * Get renderer configuration
   */
  getConfig(): Required<RendererConfig> {
    return { ...this.config };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return this.performanceMonitor.getPerformanceMetrics();
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): string {
    return this.performanceMonitor.getReport();
  }

  /**
   * Reset performance metrics
   */
  resetPerformanceMetrics(): void {
    this.performanceMonitor.reset();
  }

  /**
   * Clear render cache
   */
  clearCache(): void {
    if (this.cache) {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache?.getStats();
  }
}

/**
 * Create a default renderer engine instance
 */
export function createDefaultRendererEngine(): RendererEngine {
  return new RendererEngine();
}

/**
 * Create a custom renderer engine with custom registry and config
 */
export function createRendererEngine(
  registry?: DefaultComponentRegistry,
  config?: RendererConfig
): RendererEngine {
  return new RendererEngine(registry, config);
}
