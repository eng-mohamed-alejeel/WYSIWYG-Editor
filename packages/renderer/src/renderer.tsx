/**
 * Component Renderer
 *
 * This module provides the main rendering functionality for components.
 * Maintains backward compatibility while using the new RendererEngine internally.
 */

import React from 'react';
import { ComponentNode, Breakpoint, StyleObject } from '@wysiwyg/core';
import { RendererContext, RenderOptions, ComponentRenderer, RendererConfig } from './types';
import { DefaultComponentRegistry, getGlobalRegistry } from './registry';
import { getGlobalStyleGenerator } from './styles';
import { RendererEngine } from './RendererEngine';

/**
 * Default renderer configuration
 */
const DEFAULT_CONFIG: Required<RendererConfig> = {
  enableMemoization: true,
  enableVirtualization: false,
  enableLazyRendering: false,
  enableErrorBoundary: true,
  enableCaching: false,
  maxComponentDepth: 100,
  virtualizationThreshold: 50,
  cacheSize: 100,
  styleGenerator: getGlobalStyleGenerator(),
  performanceMonitoring: false,
  debugMode: false,
};

/**
 * Component Renderer Props
 */
interface ComponentRendererProps {
  node: ComponentNode;
  context: RendererContext;
  depth?: number;
}

/**
 * Render a single component node
 * This is a simplified version for backward compatibility
 */
const ComponentRendererComponent: React.FC<ComponentRendererProps> = React.memo(
  ({ node, context, depth = 0 }) => {
    const { componentRegistry, breakpoint } = context;

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

    // Generate styles
    const style = React.useMemo(() => {
      const styleGenerator = getGlobalStyleGenerator();
      return styleGenerator.generate(
        node.styles,
        node.responsiveStyles as Record<Breakpoint, StyleObject> | undefined,
        breakpoint
      );
    }, [node.styles, node.responsiveStyles, breakpoint]);

    // Create child context
    const childContext = React.useMemo(
      () => ({
        ...context,
        parentId: node.id,
      }),
      [context, node.id]
    );

    // Render children
    const children = React.useMemo(() => {
      return node.children.map((childNode) => (
        <ComponentRendererComponent
          key={childNode.id}
          node={childNode}
          context={childContext}
          depth={depth + 1}
        />
      ));
    }, [node.children, childContext, depth]);

    // Render the component
    const renderedComponent = renderer(node, {
      ...context,
      children,
      style,
    });

    return renderedComponent;
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
export const PageRenderer: React.FC<PageRendererProps> = React.memo(({ nodes, options = {} }) => {
  // Create renderer context
  const context = React.useMemo<RendererContext>(
    () => ({
      breakpoint: options.breakpoint ?? 'desktop',
      isPreview: options.isPreview ?? false,
      isEditable: options.isEditable ?? false,
      mode: options.mode ?? (options.isPreview ? 'preview' : 'editor'),
      componentRegistry: getGlobalRegistry().getAll(),
      theme: options.theme,
      depth: 0,
    }),
    [options]
  );

  // Render all nodes
  const renderedNodes = React.useMemo(() => {
    return nodes.map((node) => (
      <ComponentRendererComponent key={node.id} node={node} context={context} />
    ));
  }, [nodes, context]);

  return <>{renderedNodes}</>;
});

PageRenderer.displayName = 'PageRenderer';

/**
 * Renderer Class
 *
 * Main renderer class that manages component rendering.
 * Uses RendererEngine internally for advanced features.
 */
export class Renderer {
  private engine: RendererEngine;

  constructor(registry?: DefaultComponentRegistry, config?: RendererConfig) {
    this.engine = new RendererEngine(registry, config);
  }

  /**
   * Render a component node
   */
  renderNode(node: ComponentNode, options: RenderOptions = {}): React.ReactNode {
    return this.engine.renderNode(node, options);
  }

  /**
   * Render multiple component nodes
   */
  renderNodes(nodes: ComponentNode[], options: RenderOptions = {}): React.ReactNode {
    return this.engine.renderNodes(nodes, options);
  }

  /**
   * Register a component renderer
   */
  registerComponent(type: string, renderer: ComponentRenderer): void {
    this.engine.registerComponent(type, renderer);
  }

  /**
   * Unregister a component renderer
   */
  unregisterComponent(type: string): void {
    this.engine.unregisterComponent(type);
  }

  /**
   * Get the component registry
   */
  getRegistry(): DefaultComponentRegistry {
    return this.engine.getRegistry();
  }

  /**
   * Update renderer configuration
   */
  updateConfig(config: Partial<RendererConfig>): void {
    this.engine.updateConfig(config);
  }

  /**
   * Get renderer configuration
   */
  getConfig(): Required<RendererConfig> {
    return this.engine.getConfig();
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return this.engine.getPerformanceMetrics();
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): string {
    return this.engine.getPerformanceReport();
  }

  /**
   * Reset performance metrics
   */
  resetPerformanceMetrics(): void {
    this.engine.resetPerformanceMetrics();
  }

  /**
   * Clear render cache
   */
  clearCache(): void {
    this.engine.clearCache();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.engine.getCacheStats();
  }

  /**
   * Register lifecycle hooks for a component
   */
  registerLifecycle(nodeId: string, lifecycle: any): void {
    this.engine.registerLifecycle(nodeId, lifecycle);
  }

  /**
   * Unregister lifecycle hooks for a component
   */
  unregisterLifecycle(nodeId: string): void {
    this.engine.unregisterLifecycle(nodeId);
  }
}

/**
 * Create a default renderer instance
 */
export function createDefaultRenderer(): Renderer {
  return new Renderer();
}

/**
 * Create a custom renderer with custom registry and config
 */
export function createRenderer(
  registry?: DefaultComponentRegistry,
  config?: RendererConfig
): Renderer {
  return new Renderer(registry, config);
}

// Export the new RendererEngine for advanced usage
export { RendererEngine };
export type { RendererMode } from './types';
