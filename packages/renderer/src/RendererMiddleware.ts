/* eslint-disable max-lines */
/**
 * Renderer Middleware System
 *
 * Provides middleware support for the rendering system,
 * enabling cross-cutting concerns and extensibility.
 */

import { ComponentNode } from '@wysiwyg/core';
import { RendererContext, RendererMiddleware, MiddlewareContext, RenderPhase } from './types';
import { RenderLifecycleManager } from './RenderLifecycle';

/**
 * Middleware execution context
 */
export interface MiddlewareExecutionContext {
  node: ComponentNode;
  context: RendererContext;
  phase: RenderPhase;
  index: number;
  middleware: RendererMiddleware[];
  metadata?: Record<string, unknown>;
}

/**
 * Middleware manager
 */
export class RendererMiddlewareManager {
  private middleware: RendererMiddleware[] = [];
  private lifecycleManager?: RenderLifecycleManager;

  constructor(lifecycleManager?: RenderLifecycleManager) {
    this.lifecycleManager = lifecycleManager;
  }

  /**
   * Register middleware
   */
  register(middleware: RendererMiddleware): void {
    this.middleware.push(middleware);
    this.middleware.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

  /**
   * Unregister middleware
   */
  unregister(middlewareId: string): void {
    this.middleware = this.middleware.filter((m) => m.id !== middlewareId);
  }

  /**
   * Get middleware by ID
   */
  get(middlewareId: string): RendererMiddleware | undefined {
    return this.middleware.find((m) => m.id === middlewareId);
  }

  /**
   * Get all middleware
   */
  getAll(): RendererMiddleware[] {
    return [...this.middleware];
  }

  /**
   * Clear all middleware
   */
  clear(): void {
    this.middleware = [];
  }

  /**
   * Execute middleware chain
   */
  async execute(
    phase: RenderPhase,
    node: ComponentNode,
    context: RendererContext,
    operation: () => Promise<unknown>,
    metadata?: Record<string, unknown>
  ): Promise<unknown> {
    const applicableMiddleware = this.middleware.filter(
      (mw) => mw.enabled !== false && (mw.phases === undefined || mw.phases.includes(phase))
    );

    if (applicableMiddleware.length === 0) {
      return operation();
    }

    const executionContext: MiddlewareExecutionContext = {
      node,
      context,
      phase,
      index: 0,
      middleware: applicableMiddleware,
      metadata,
    };

    return this.executeNext(executionContext, operation);
  }

  /**
   * Execute next middleware in the chain
   */
  private async executeNext(
    ctx: MiddlewareExecutionContext,
    operation: () => Promise<unknown>
  ): Promise<unknown> {
    if (ctx.index >= ctx.middleware.length) {
      return operation();
    }

    const middleware = ctx.middleware[ctx.index];
    ctx.index++;

    if (middleware === undefined) {
      return operation();
    }

    const middlewareContext: MiddlewareContext = {
      node: ctx.node,
      context: ctx.context,
      phase: ctx.phase,
      next: () => this.executeNext(ctx, operation),
      metadata: {
        ...ctx.metadata,
        middlewareId: middleware.id,
        middlewareName: middleware.name,
      },
    };

    try {
      return await middleware.handler(middlewareContext);
    } catch (error) {
      console.error(`Error in middleware ${middleware.id}:`, error);

      // If lifecycle manager is available, record the error
      if (this.lifecycleManager !== undefined) {
        await this.lifecycleManager.executePhase(ctx.phase, ctx.node, ctx.context, {
          error,
          middlewareId: middleware.id,
        });
      }

      throw error;
    }
  }

  /**
   * Enable or disable middleware
   */
  setEnabled(middlewareId: string, enabled: boolean): void {
    const middleware = this.get(middlewareId);
    if (middleware !== undefined) {
      middleware.enabled = enabled;
    }
  }

  /**
   * Get enabled middleware
   */
  getEnabled(): RendererMiddleware[] {
    return this.middleware.filter((m) => m.enabled !== false);
  }

  /**
   * Get middleware for a specific phase
   */
  getForPhase(phase: RenderPhase): RendererMiddleware[] {
    return this.middleware.filter(
      (m) => m.enabled !== false && (m.phases === undefined || m.phases.includes(phase))
    );
  }
}

/**
 * Global middleware manager instance
 */
let globalMiddlewareManager: RendererMiddlewareManager | null = null;

export function getGlobalMiddlewareManager(): RendererMiddlewareManager {
  if (globalMiddlewareManager === null) {
    globalMiddlewareManager = new RendererMiddlewareManager();
  }
  return globalMiddlewareManager;
}

export function setGlobalMiddlewareManager(manager: RendererMiddlewareManager): void {
  globalMiddlewareManager = manager;
}

export function resetGlobalMiddlewareManager(): void {
  globalMiddlewareManager = null;
}

/**
 * Common middleware implementations
 */

/**
 * Logging middleware
 */
export function createLoggingMiddleware(
  id: string = 'logging',
  name: string = 'Logging Middleware',
  enabled: boolean = true
): RendererMiddleware {
  return {
    id,
    name,
    enabled,
    priority: 100,
    phases: undefined,
    handler: async (ctx: MiddlewareContext) => {
      const { node, phase, next, metadata } = ctx;
      const startTime = performance.now();

      // eslint-disable-next-line no-console
      console.log(`[${phase}] Starting render for node ${node.id}`, {
        type: node.type,
        metadata,
      });

      try {
        const result = await next();
        const duration = performance.now() - startTime;

        // eslint-disable-next-line no-console
        console.log(`[${phase}] Completed render for node ${node.id}`, {
          type: node.type,
          duration: `${duration.toFixed(2)}ms`,
        });

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;

        console.error(`[${phase}] Failed render for node ${node.id}`, {
          type: node.type,
          duration: `${duration.toFixed(2)}ms`,
          error,
        });

        throw error;
      }
    },
  };
}

/**
 * Performance monitoring middleware
 */
export function createPerformanceMiddleware(
  id: string = 'performance',
  name: string = 'Performance Middleware',
  enabled: boolean = true
): RendererMiddleware {
  return {
    id,
    name,
    enabled,
    priority: 90,
    phases: undefined,
    handler: async (ctx: MiddlewareContext) => {
      const { node, phase, next } = ctx;
      const startTime = performance.now();

      try {
        const result = await next();
        const duration = performance.now() - startTime;

        // Record performance metrics
        const winPerf = window as unknown as { performance?: { mark?: (name: string) => void } };
        if (winPerf.performance?.mark !== undefined) {
          const markName = `render-${phase}-${node.id}`;
          winPerf.performance.mark(markName);
        }
        // eslint-disable-next-line no-console
        console.debug(
          `Performance middleware completed ${phase} for node ${node.id} in ${duration.toFixed(2)}ms`
        );

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        console.warn(`Performance middleware error after ${duration.toFixed(2)}ms`, error);
        throw error;
      }
    },
  };
}

/**
 * Error handling middleware
 */
export function createErrorHandlingMiddleware(
  id: string = 'error-handling',
  name: string = 'Error Handling Middleware',
  enabled: boolean = true,
  errorHandler?: (error: Error, ctx: MiddlewareContext) => unknown
): RendererMiddleware {
  return {
    id,
    name,
    enabled,
    priority: 1000,
    phases: undefined,
    handler: async (ctx: MiddlewareContext) => {
      try {
        return await ctx.next();
      } catch (error) {
        if (errorHandler !== undefined) {
          return errorHandler(error as Error, ctx);
        }
        throw error;
      }
    },
  };
}

/**
 * Caching middleware
 */
export function createCachingMiddleware(
  id: string = 'caching',
  name: string = 'Caching Middleware',
  enabled: boolean = true,
  cacheKeyGenerator?: (node: ComponentNode, context: RendererContext) => string,
  cache?: Map<string, unknown>
): RendererMiddleware {
  const internalCache = cache ?? new Map<string, unknown>();

  return {
    id,
    name,
    enabled,
    priority: 50,
    phases: [RenderPhase.BEFORE_RENDER, RenderPhase.AFTER_RENDER],
    handler: async (ctx: MiddlewareContext) => {
      const { node, context, phase, next } = ctx;

      if (phase === RenderPhase.BEFORE_RENDER) {
        const key =
          cacheKeyGenerator !== undefined
            ? cacheKeyGenerator(node, context)
            : `${node.id}-${JSON.stringify(node.props)}`;

        if (internalCache.has(key)) {
          return internalCache.get(key);
        }

        return next();
      }

      if (phase === RenderPhase.AFTER_RENDER) {
        const result = await next();
        const key =
          cacheKeyGenerator !== undefined
            ? cacheKeyGenerator(node, context)
            : `${node.id}-${JSON.stringify(node.props)}`;

        internalCache.set(key, result);
        return result;
      }

      return next();
    },
  };
}

/**
 * Validation middleware
 */
export function createValidationMiddleware(
  id: string = 'validation',
  name: string = 'Validation Middleware',
  enabled: boolean = true,
  validator?: (node: ComponentNode, context: RendererContext) => boolean | string
): RendererMiddleware {
  return {
    id,
    name,
    enabled,
    priority: 200,
    phases: [RenderPhase.BEFORE_RENDER],
    handler: async (ctx: MiddlewareContext) => {
      const { node, context, next } = ctx;

      if (validator !== undefined) {
        const validation = validator(node, context);
        if (validation !== true) {
          const errorMessage =
            typeof validation === 'string' ? validation : `Validation failed for node ${node.id}`;
          throw new Error(errorMessage);
        }
      }

      return next();
    },
  };
}

/**
 * Transformation middleware
 */
export function createTransformationMiddleware(
  id: string = 'transformation',
  name: string = 'Transformation Middleware',
  enabled: boolean = true,
  transformer?: (node: ComponentNode, context: RendererContext) => ComponentNode
): RendererMiddleware {
  return {
    id,
    name,
    enabled,
    priority: 150,
    phases: [RenderPhase.BEFORE_RENDER],
    handler: async (ctx: MiddlewareContext) => {
      const { node, context, next } = ctx;

      if (transformer !== undefined) {
        const transformedNode = transformer(node, context);
        ctx.node = transformedNode;
        return next();
      }

      return next();
    },
  };
}
