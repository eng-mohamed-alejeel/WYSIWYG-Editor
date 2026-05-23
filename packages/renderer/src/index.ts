/**
 * WYSIWYG Editor Renderer Package
 *
 * This is the main entry point for the renderer package.
 * It exports all rendering-related functionality.
 */

// Types
export * from './types';

// Registry
export * from './registry';

// Styles
export * from './styles';

// Renderer (backward compatible)
export * from './renderer';

// New Renderer Engine
export { RendererEngine } from './RendererEngine';

// Error Boundary
export { RendererErrorBoundary, withErrorBoundary } from './ErrorBoundary';

// Virtualization
export {
  VirtualizedRenderer,
  useVirtualization,
  useVirtualizationParams,
} from './VirtualizedRenderer';

// Lazy Rendering
export { LazyComponentRenderer, withLazyLoading, useLazyLoading } from './LazyComponentRenderer';

// Lifecycle Hooks
export {
  LifecycleHookManager,
  getGlobalLifecycleManager,
  resetGlobalLifecycleManager,
  useRendererLifecycle,
  useBeforeRender,
  useAfterRender,
  useRenderError,
  withLifecycle,
} from './RendererLifecycle';

// Performance Monitor
export {
  PerformanceMonitor,
  getGlobalPerformanceMonitor,
  resetGlobalPerformanceMonitor,
  measurePerformance,
} from './PerformanceMonitor';

// Render Cache
export { LRUCache, FIFOCache, LFUCache, createRenderCache } from './RenderCache';
