/**
 * Renderer Lifecycle Hooks
 *
 * This module provides lifecycle hooks for component rendering.
 */

import { useEffect, useRef, useCallback } from 'react';
import { ComponentNode } from '@wysiwyg/core';
import { RendererContext, RendererLifecycle } from './types';

/**
 * Lifecycle Hook Manager
 * Manages lifecycle hooks for component rendering
 */
export class LifecycleHookManager {
  private hooks: Map<string, RendererLifecycle> = new Map();

  register(nodeId: string, lifecycle: RendererLifecycle): void {
    this.hooks.set(nodeId, lifecycle);
  }

  unregister(nodeId: string): void {
    this.hooks.delete(nodeId);
  }

  get(nodeId: string): RendererLifecycle | undefined {
    return this.hooks.get(nodeId);
  }

  clear(): void {
    this.hooks.clear();
  }

  async executeBeforeRender(node: ComponentNode, context: RendererContext): Promise<void> {
    const lifecycle = this.get(node.id);
    if (lifecycle?.onBeforeRender) {
      await lifecycle.onBeforeRender(node, context);
    }
  }

  async executeAfterRender(
    node: ComponentNode,
    context: RendererContext,
    result: any
  ): Promise<void> {
    const lifecycle = this.get(node.id);
    if (lifecycle?.onAfterRender) {
      await lifecycle.onAfterRender(node, context, result);
    }
  }

  async executeError(
    error: Error,
    node: ComponentNode,
    context: RendererContext
  ): Promise<any> {
    const lifecycle = this.get(node.id);
    if (lifecycle?.onError) {
      return await lifecycle.onError(error, node, context);
    }
    return null;
  }

  async executeMount(node: ComponentNode, context: RendererContext): Promise<void> {
    const lifecycle = this.get(node.id);
    if (lifecycle?.onMount) {
      await lifecycle.onMount(node, context);
    }
  }

  async executeUpdate(node: ComponentNode, context: RendererContext): Promise<void> {
    const lifecycle = this.get(node.id);
    if (lifecycle?.onUpdate) {
      await lifecycle.onUpdate(node, context);
    }
  }

  async executeUnmount(node: ComponentNode, context: RendererContext): Promise<void> {
    const lifecycle = this.get(node.id);
    if (lifecycle?.onUnmount) {
      await lifecycle.onUnmount(node, context);
    }
  }
}

/**
 * Global lifecycle hook manager instance
 */
let globalLifecycleManager: LifecycleHookManager | null = null;

export function getGlobalLifecycleManager(): LifecycleHookManager {
  if (!globalLifecycleManager) {
    globalLifecycleManager = new LifecycleHookManager();
  }
  return globalLifecycleManager;
}

export function resetGlobalLifecycleManager(): void {
  globalLifecycleManager = null;
}

/**
 * Custom hook for managing component lifecycle
 */
export function useRendererLifecycle(
  node: ComponentNode,
  context: RendererContext,
  lifecycle?: RendererLifecycle
) {
  const manager = getGlobalLifecycleManager();
  const isMounted = useRef(false);

  useEffect(() => {
    // Register lifecycle hooks
    if (lifecycle) {
      manager.register(node.id, lifecycle);
    }

    // Execute mount hook
    if (!isMounted.current) {
      manager.executeMount(node, context).catch(error => {
        console.error('Error in onMount lifecycle hook:', error);
      });
      isMounted.current = true;
    }

    return () => {
      // Execute unmount hook
      manager.executeUnmount(node, context).catch(error => {
        console.error('Error in onUnmount lifecycle hook:', error);
      });

      // Unregister lifecycle hooks
      if (lifecycle) {
        manager.unregister(node.id);
      }
    };
  }, [node.id, lifecycle, manager, node, context]);

  // Execute update hook on context change
  useEffect(() => {
    if (isMounted.current) {
      manager.executeUpdate(node, context).catch(error => {
        console.error('Error in onUpdate lifecycle hook:', error);
      });
    }
  }, [context, manager, node]);
}

/**
 * Custom hook for before render lifecycle
 */
export function useBeforeRender(
  node: ComponentNode,
  context: RendererContext,
  callback?: (node: ComponentNode, context: RendererContext) => void | Promise<void>
) {
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (!hasExecuted.current && callback) {
      const executeCallback = async () => {
        try {
          await callback(node, context);
        } catch (error) {
          console.error('Error in beforeRender callback:', error);
        }
      };
      executeCallback();
      hasExecuted.current = true;
    }
  }, [node, context, callback]);
}

/**
 * Custom hook for after render lifecycle
 */
export function useAfterRender(
  node: ComponentNode,
  context: RendererContext,
  result: any,
  callback?: (node: ComponentNode, context: RendererContext, result: any) => void | Promise<void>
) {
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (!hasExecuted.current && callback) {
      const executeCallback = async () => {
        try {
          await callback(node, context, result);
        } catch (error) {
          console.error('Error in afterRender callback:', error);
        }
      };
      executeCallback();
      hasExecuted.current = true;
    }
  }, [node, context, result, callback]);
}

/**
 * Custom hook for error handling
 */
export function useRenderError(
  node: ComponentNode,
  context: RendererContext,
  callback?: (error: Error, node: ComponentNode, context: RendererContext) => any
) {
  const handleError = useCallback(
    (error: Error) => {
      if (callback) {
        try {
          return callback(error, node, context);
        } catch (handlerError) {
          console.error('Error in error handler:', handlerError);
          return null;
        }
      }
      return null;
    },
    [node, context, callback]
  );

  return handleError;
}

/**
 * Higher-order component for lifecycle management
 */
export function withLifecycle<P extends { node: ComponentNode; context: RendererContext }>(
  Component: React.ComponentType<P>,
  lifecycle?: RendererLifecycle
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => {
    useRendererLifecycle(props.node, props.context, lifecycle);
    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withLifecycle(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
