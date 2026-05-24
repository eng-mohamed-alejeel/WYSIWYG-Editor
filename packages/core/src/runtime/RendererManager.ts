/**
 * Renderer Manager Implementation
 *
 * Manages component rendering subsystem
 */

import { EventBus } from './EventBus';
import { ComponentNode, ComponentDefinition } from '../types/components';
import { RendererContext } from '../types/editor';

export interface RendererConfig {
  mode: 'edit' | 'preview';
  theme?: 'light' | 'dark';
  breakpoint?: 'mobile' | 'tablet' | 'desktop' | 'wide';
  zoom?: number;
}

export class RendererManager {
  private config: RendererConfig;
  private eventBus: EventBus;
  private componentDefinitions = new Map<string, ComponentDefinition>();
  private renderCache = new Map<string, unknown>();

  constructor(initialConfig: RendererConfig, eventBus?: EventBus) {
    this.eventBus = eventBus ?? new EventBus();
    this.config = initialConfig;

    // Listen for component registration
    this.eventBus.on('component:register', this.handleComponentRegistration.bind(this));
    // Listen for component updates
    this.eventBus.on('component:updated', this.handleComponentUpdate.bind(this));
  }

  getConfig(): RendererConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<RendererConfig>): void {
    const previousConfig = { ...this.config };
    this.config = { ...this.config, ...updates };

    // Clear cache when config changes
    this.renderCache.clear();

    this.eventBus.emit('renderer:config:updated', {
      config: this.config,
      previousConfig,
    });
  }

  registerComponent(definition: ComponentDefinition): void {
    const componentId = definition.type;
    if (this.componentDefinitions.has(componentId)) {
      console.warn(`Component "${componentId}" is already registered, overwriting`);
    }

    this.componentDefinitions.set(componentId, definition);
    this.renderCache.delete(componentId);

    this.eventBus.emit('renderer:component:registered', { definition });
  }

  unregisterComponent(componentId: string): void {
    if (this.componentDefinitions.has(componentId)) {
      this.componentDefinitions.delete(componentId);
      this.renderCache.delete(componentId);

      this.eventBus.emit('renderer:component:unregistered', { componentId });
    }
  }

  getComponentDefinition(componentId: string): ComponentDefinition | undefined {
    return this.componentDefinitions.get(componentId);
  }

  getRendererContext(): RendererContext {
    return {
      isEditable: this.config.mode === 'edit',
      isPreview: this.config.mode === 'preview',
    };
  }

  render(component: ComponentNode): unknown {
    const definition = this.componentDefinitions.get(component.type);

    if (!definition) {
      console.error(`Component definition not found for type: ${component.type}`);
      return null;
    }

    const cacheKey = this.getCacheKey(component);

    // Check cache
    if (this.renderCache.has(cacheKey)) {
      return this.renderCache.get(cacheKey);
    }

    const context = this.getRendererContext();
    const rendered: unknown =
      'render' in definition && typeof definition.render === 'function'
        ? definition.render(component, context)
        : null;

    // Cache result
    this.renderCache.set(cacheKey, rendered);

    this.eventBus.emit('renderer:component:rendered', {
      componentId: component.id,
      rendered: rendered as Record<string, unknown>,
    });

    return rendered;
  }

  renderTree(root: ComponentNode): Map<string, unknown> {
    const results = new Map<string, unknown>();

    const renderNode = (node: ComponentNode) => {
      const rendered = this.render(node);
      results.set(node.id, rendered);

      if (node.children !== undefined && node.children.length > 0) {
        for (const child of node.children) {
          renderNode(child);
        }
      }
    };

    renderNode(root);

    this.eventBus.emit('renderer:tree:rendered', {
      rootId: root.id,
      results: Array.from(results.entries()),
    });

    return results;
  }

  clearCache(componentId?: string): void {
    if (componentId !== undefined) {
      this.renderCache.delete(componentId);
    } else {
      this.renderCache.clear();
    }

    this.eventBus.emit('renderer:cache:cleared', { componentId });
  }

  private getCacheKey(component: ComponentNode): string {
    return `${component.id}-${JSON.stringify(component.props)}`;
  }

  private handleComponentRegistration(data: ComponentDefinition): void {
    this.registerComponent(data);
  }

  private handleComponentUpdate(data: {
    componentId: string;
    updates: Partial<ComponentNode>;
  }): void {
    this.renderCache.delete(data.componentId);
  }
}
