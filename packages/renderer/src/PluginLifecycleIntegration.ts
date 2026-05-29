/**
 * Plugin Lifecycle Integration
 *
 * Provides integration between the plugin system and the renderer lifecycle,
 * enabling plugins to hook into the rendering process.
 */

import { ComponentNode } from '@wysiwyg/core';
import {
  RendererContext,
  PluginLifecycleIntegration,
  LifecycleHook,
  RendererMiddleware,
  MiddlewareContext,
  RenderPhase,
} from './types';
import { RenderLifecycleManager } from './RenderLifecycle';
import { RendererMiddlewareManager } from './RendererMiddleware';

/**
 * Plugin renderer hooks
 */
export interface PluginRendererHooks {
  beforeRender?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
  afterRender?: (
    node: ComponentNode,
    context: RendererContext,
    result: unknown
  ) => void | Promise<void>;
  beforeMount?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
  afterMount?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
  beforeUnmount?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
  afterUnmount?: (node: ComponentNode, context: RendererContext) => void | Promise<void>;
}

/**
 * Plugin renderer middleware
 */
export interface PluginRendererMiddleware {
  id: string;
  name: string;
  handler: (ctx: MiddlewareContext) => Promise<unknown>;
  priority?: number;
  enabled?: boolean;
  phases?: string[];
}

/**
 * Plugin lifecycle integration manager
 */
export class PluginLifecycleIntegrationManager {
  private integrations: Map<string, PluginLifecycleIntegration> = new Map();
  private lifecycleManager?: RenderLifecycleManager;
  private middlewareManager?: RendererMiddlewareManager;

  constructor(
    lifecycleManager?: RenderLifecycleManager,
    middlewareManager?: RendererMiddlewareManager
  ) {
    this.lifecycleManager = lifecycleManager;
    this.middlewareManager = middlewareManager;
  }

  /**
   * Register plugin lifecycle integration
   */
  registerPluginIntegration(
    pluginId: string,
    hooks: PluginRendererHooks,
    middleware?: PluginRendererMiddleware[],
    enabled: boolean = true
  ): void {
    const lifecycleHooks: LifecycleHook[] = [];

    // Convert plugin hooks to lifecycle hooks
    if (hooks.beforeRender) {
      lifecycleHooks.push({
        id: `${pluginId}-beforeRender`,
        phase: RenderPhase.BEFORE_RENDER,
        handler: async (ctx) => {
          await hooks.beforeRender!(ctx.node, ctx.context);
        },
        priority: 100,
      });
    }

    if (hooks.afterRender) {
      lifecycleHooks.push({
        id: `${pluginId}-afterRender`,
        phase: RenderPhase.AFTER_RENDER,
        handler: async (ctx) => {
          await hooks.afterRender!(ctx.node, ctx.context, ctx.metadata?.result);
        },
        priority: 100,
      });
    }

    if (hooks.beforeMount) {
      lifecycleHooks.push({
        id: `${pluginId}-beforeMount`,
        phase: RenderPhase.BEFORE_MOUNT,
        handler: async (ctx) => {
          await hooks.beforeMount!(ctx.node, ctx.context);
        },
        priority: 100,
      });
    }

    if (hooks.afterMount) {
      lifecycleHooks.push({
        id: `${pluginId}-afterMount`,
        phase: RenderPhase.AFTER_MOUNT,
        handler: async (ctx) => {
          await hooks.afterMount!(ctx.node, ctx.context);
        },
        priority: 100,
      });
    }

    if (hooks.beforeUnmount) {
      lifecycleHooks.push({
        id: `${pluginId}-beforeUnmount`,
        phase: RenderPhase.BEFORE_UNMOUNT,
        handler: async (ctx) => {
          await hooks.beforeUnmount!(ctx.node, ctx.context);
        },
        priority: 100,
      });
    }

    if (hooks.afterUnmount) {
      lifecycleHooks.push({
        id: `${pluginId}-afterUnmount`,
        phase: RenderPhase.AFTER_UNMOUNT,
        handler: async (ctx) => {
          await hooks.afterUnmount!(ctx.node, ctx.context);
        },
        priority: 100,
      });
    }

    // Convert plugin middleware to renderer middleware
    const rendererMiddleware: RendererMiddleware[] = middleware
      ? middleware.map((mw) => ({
          id: `${pluginId}-${mw.id}`,
          name: `${pluginId} - ${mw.name}`,
          handler: mw.handler,
          priority: mw.priority ?? 100,
          enabled: mw.enabled !== false,
          phases: mw.phases ? mw.phases.map((p) => p as unknown as RenderPhase) : undefined,
        }))
      : [];

    // Create integration
    const integration: PluginLifecycleIntegration = {
      pluginId,
      hooks: lifecycleHooks,
      middleware: rendererMiddleware,
      enabled,
    };

    this.integrations.set(pluginId, integration);

    // Register with lifecycle manager
    if (this.lifecycleManager) {
      this.lifecycleManager.registerPluginIntegration(integration);
    }

    // Register middleware with middleware manager
    if (this.middlewareManager && rendererMiddleware.length > 0) {
      rendererMiddleware.forEach((mw) => {
        this.middlewareManager!.register(mw);
      });
    }
  }

  /**
   * Unregister plugin lifecycle integration
   */
  unregisterPluginIntegration(pluginId: string): void {
    const integration = this.integrations.get(pluginId);
    if (!integration) return;

    // Unregister from lifecycle manager
    if (this.lifecycleManager) {
      this.lifecycleManager.unregisterPluginIntegration(pluginId);
    }

    // Unregister middleware from middleware manager
    if (this.middlewareManager && integration.middleware) {
      integration.middleware.forEach((mw) => {
        this.middlewareManager!.unregister(mw.id);
      });
    }

    this.integrations.delete(pluginId);
  }

  /**
   * Enable or disable plugin integration
   */
  setEnabled(pluginId: string, enabled: boolean): void {
    const integration = this.integrations.get(pluginId);
    if (integration) {
      integration.enabled = enabled;

      // Update middleware enabled state
      if (this.middlewareManager && integration.middleware) {
        integration.middleware.forEach((mw) => {
          this.middlewareManager!.setEnabled(mw.id, enabled);
        });
      }
    }
  }

  /**
   * Get plugin integration
   */
  getIntegration(pluginId: string): PluginLifecycleIntegration | undefined {
    return this.integrations.get(pluginId);
  }

  /**
   * Get all integrations
   */
  getAllIntegrations(): PluginLifecycleIntegration[] {
    return Array.from(this.integrations.values());
  }

  /**
   * Get enabled integrations
   */
  getEnabledIntegrations(): PluginLifecycleIntegration[] {
    return this.getAllIntegrations().filter((i) => i.enabled !== false);
  }

  /**
   * Clear all integrations
   */
  clear(): void {
    this.integrations.forEach((_, pluginId) => {
      this.unregisterPluginIntegration(pluginId);
    });
  }
}

/**
 * Global plugin lifecycle integration manager instance
 */
let globalPluginIntegrationManager: PluginLifecycleIntegrationManager | null = null;

export function getGlobalPluginIntegrationManager(): PluginLifecycleIntegrationManager {
  if (!globalPluginIntegrationManager) {
    globalPluginIntegrationManager = new PluginLifecycleIntegrationManager();
  }
  return globalPluginIntegrationManager;
}

export function setGlobalPluginIntegrationManager(
  manager: PluginLifecycleIntegrationManager
): void {
  globalPluginIntegrationManager = manager;
}

export function resetGlobalPluginIntegrationManager(): void {
  globalPluginIntegrationManager = null;
}

/**
 * Helper function to register a plugin's renderer hooks
 */
export function registerPluginRendererHooks(
  pluginId: string,
  hooks: PluginRendererHooks,
  middleware?: PluginRendererMiddleware[]
): void {
  const manager = getGlobalPluginIntegrationManager();
  manager.registerPluginIntegration(pluginId, hooks, middleware);
}

/**
 * Helper function to unregister a plugin's renderer hooks
 */
export function unregisterPluginRendererHooks(pluginId: string): void {
  const manager = getGlobalPluginIntegrationManager();
  manager.unregisterPluginIntegration(pluginId);
}
