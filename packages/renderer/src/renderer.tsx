/**
 * Component Renderer
 *
 * This module provides the main rendering functionality for components.
 */

import React, { memo, useMemo } from 'react';
import { ComponentNode, Breakpoint, StyleObject } from '@wysiwyg/core';
import { RendererContext, RenderOptions, ComponentRenderer, RendererConfig } from './types';
import { DefaultComponentRegistry, getGlobalRegistry } from './registry';
import { getGlobalStyleGenerator } from './styles';

/**
 * Default renderer configuration
 */
const DEFAULT_CONFIG: Required<RendererConfig> = {
  enableMemoization: true,
  enableVirtualization: false,
  maxComponentDepth: 100,
  styleGenerator: getGlobalStyleGenerator(),
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
 */
const ComponentRendererComponent: React.FC<ComponentRendererProps> = memo(
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
    const style = useMemo(() => {
      const styleGenerator = getGlobalStyleGenerator();
      return styleGenerator.generate(
        node.styles,
        node.responsiveStyles as Record<Breakpoint, StyleObject> | undefined,
        breakpoint
      );
    }, [node.styles, node.responsiveStyles, breakpoint]);

    // Create child context
    const childContext = useMemo(
      () => ({
        ...context,
        parentId: node.id,
      }),
      [context, node.id]
    );

    // Render children
    const children = useMemo(() => {
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
export const PageRenderer: React.FC<PageRendererProps> = memo(({ nodes, options = {} }) => {
  // Create renderer context
  const context = useMemo<RendererContext>(
    () => ({
      breakpoint: options.breakpoint || 'desktop',
      isPreview: options.isPreview ?? false,
      isEditable: options.isEditable ?? false,
      componentRegistry: getGlobalRegistry().getAll(),
      theme: options.theme,
    }),
    [options]
  );

  // Render all nodes
  const renderedNodes = useMemo(() => {
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
 * Main renderer class that manages component rendering
 */
export class Renderer {
  private registry: DefaultComponentRegistry;
  private config: Required<RendererConfig>;

  constructor(registry?: DefaultComponentRegistry, config?: RendererConfig) {
    this.registry = registry || getGlobalRegistry();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Render a component node
   */
  renderNode(node: ComponentNode, options: RenderOptions = {}): React.ReactNode {
    const context: RendererContext = {
      breakpoint: options.breakpoint || 'desktop',
      isPreview: options.isPreview ?? false,
      isEditable: options.isEditable ?? false,
      componentRegistry: this.registry.getAll(),
      theme: options.theme,
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
  }

  /**
   * Get renderer configuration
   */
  getConfig(): Required<RendererConfig> {
    return { ...this.config };
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
