/**
 * Component Registry
 * 
 * This module manages the registration and retrieval of component renderers.
 */

import { ComponentRenderer, ComponentRegistry } from './types';

/**
 * Default component registry implementation
 */
export class DefaultComponentRegistry implements ComponentRegistry {
  private renderers: Map<string, ComponentRenderer> = new Map();

  /**
   * Register a component renderer
   */
  register(type: string, renderer: ComponentRenderer): void {
    if (this.renderers.has(type)) {
      console.warn(`Component renderer for type "${type}" is already registered. Overwriting.`);
    }
    this.renderers.set(type, renderer);
  }

  /**
   * Unregister a component renderer
   */
  unregister(type: string): void {
    this.renderers.delete(type);
  }

  /**
   * Get a component renderer by type
   */
  get(type: string): ComponentRenderer | undefined {
    return this.renderers.get(type);
  }

  /**
   * Check if a component renderer is registered
   */
  has(type: string): boolean {
    return this.renderers.has(type);
  }

  /**
   * Clear all registered renderers
   */
  clear(): void {
    this.renderers.clear();
  }

  /**
   * Get all registered renderers
   */
  getAll(): Map<string, ComponentRenderer> {
    return new Map(this.renderers);
  }

  /**
   * Get all registered component types
   */
  getTypes(): string[] {
    return Array.from(this.renderers.keys());
  }

  /**
   * Register multiple component renderers at once
   */
  registerBatch(renderers: Record<string, ComponentRenderer>): void {
    Object.entries(renderers).forEach(([type, renderer]) => {
      this.register(type, renderer);
    });
  }

  /**
   * Unregister multiple component renderers at once
   */
  unregisterBatch(types: string[]): void {
    types.forEach(type => {
      this.unregister(type);
    });
  }
}

/**
 * Create a singleton instance of the component registry
 */
let globalRegistry: DefaultComponentRegistry | null = null;

/**
 * Get or create the global component registry
 */
export function getGlobalRegistry(): DefaultComponentRegistry {
  if (!globalRegistry) {
    globalRegistry = new DefaultComponentRegistry();
  }
  return globalRegistry;
}

/**
 * Reset the global component registry
 */
export function resetGlobalRegistry(): void {
  globalRegistry = null;
}
