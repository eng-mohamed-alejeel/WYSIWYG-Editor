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
    result: unknown
  ): Promise<void> {
    const lifecycle = this.get(node.id);
    if (lifecycle?.onAfterRender) {
      await lifecycle.onAfterRender(node, context, result as React.ReactNode);
    }
  }

  async executeError(
    error: Error,
    node: ComponentNode,
    context: RendererContext
  ): Promise<React.ReactNode | null> {
    const lifecycle = this.get(node.id);
    if (lifecycle?.onError) {
      return (await lifecycle.onError(error, node, context)) as React.ReactNode;
    }
    return null;
  }

  async executeBeforeMount(node: ComponentNode, context: RendererContext): Promise<void> {
    const lifecycle = this.get(node.id);
    if (lifecycle?.onBeforeMount) {
      await lifecycle.onBeforeMount(node, context);
    }
  }

  async executeAfterMount(node: ComponentNode, context: RendererContext): Promise<void> {
    const lifecycle = this.get(node.id);
    if (lifecycle?.onAfterMount) {
      await lifecycle.onAfterMount(node, context);
    }
  }

  async executeBeforeUnmount(node: ComponentNode, context: RendererContext): Promise<void> {
    const lifecycle = this.get(node.id);
    if (lifecycle?.onBeforeUnmount) {
      await lifecycle.onBeforeUnmount(node, context);
    }
  }

  async executeAfterUnmount(node: ComponentNode, context: RendererContext): Promise<void> {
    const lifecycle = this.get(node.id);
    if (lifecycle?.onAfterUnmount) {
      await lifecycle.onAfterUnmount(node, context);
    }
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

    // Execute beforeMount hook
    if (!isMounted.current) {
      manager.executeBeforeMount(node, context).catch((error) => {
        console.error('Error in onBeforeMount lifecycle hook:', error);
      });

      // Execute mount hook
      manager.executeMount(node, context).catch((error) => {
        console.error('Error in onMount lifecycle hook:', error);
      });

      // Execute afterMount hook
      manager.executeAfterMount(node, context).catch((error) => {
        console.error('Error in onAfterMount lifecycle hook:', error);
      });

      isMounted.current = true;
    }

    return () => {
      // Execute beforeUnmount hook
      manager.executeBeforeUnmount(node, context).catch((error) => {
        console.error('Error in onBeforeUnmount lifecycle hook:', error);
      });

      // Execute unmount hook
      manager.executeUnmount(node, context).catch((error) => {
        console.error('Error in onUnmount lifecycle hook:', error);
      });

      // Execute afterUnmount hook
      manager.executeAfterUnmount(node, context).catch((error) => {
        console.error('Error in onAfterUnmount lifecycle hook:', error);
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
      manager.executeUpdate(node, context).catch((error) => {
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
      void executeCallback();
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
  result: unknown,
  callback?: (
    node: ComponentNode,
    context: RendererContext,
    result: unknown
  ) => void | Promise<void>
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
      void executeCallback();
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
  callback?: (
    error: Error,
    node: ComponentNode,
    context: RendererContext
  ) => React.ReactNode | Promise<React.ReactNode> | void
) {
  const handleError = useCallback(
    (error: Error) => {
      if (!callback) {
        return null;
      }

      try {
        const result = callback(error, node, context);
        if (result != null && typeof (result as Promise<React.ReactNode>).then === 'function') {
          (result as Promise<React.ReactNode>)
            .then(() => {})
            .catch((handlerError) => console.error('Error in async error handler:', handlerError));
          return null;
        }
        return result as React.ReactNode | null;
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
        return null;
      }
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

  WrappedComponent.displayName = `withLifecycle(${Component.displayName ?? Component.name ?? 'Component'})`;

  return WrappedComponent;
}
