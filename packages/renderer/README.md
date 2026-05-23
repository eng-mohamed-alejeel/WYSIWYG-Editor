# WYSIWYG Renderer Package

A production-grade rendering engine for the WYSIWYG Editor with advanced features for scalable component rendering.

## Features

### Core Rendering
- **Multiple Renderer Modes**: Support for editor, preview, runtime, and export modes
- **Component Registry**: Flexible registration system for component renderers
- **Style Generation**: Automatic style generation with responsive breakpoint support
- **TypeScript Safety**: Full TypeScript support with strict type checking

### Performance Optimizations
- **Virtualization**: Efficient rendering of large component trees using windowing
- **Lazy Loading**: On-demand component loading based on viewport intersection
- **Render Caching**: Multiple cache strategies (LRU, FIFO, LFU) for rendered components
- **Memoization**: Smart memoization to reduce unnecessary re-renders
- **Deep Tree Optimization**: Optimized rendering for deeply nested component structures

### Error Handling
- **React Error Boundaries**: Graceful error handling at component level
- **Error Recovery**: Automatic error recovery with custom fallbacks
- **Error Reporting**: Detailed error reporting with stack traces

### Lifecycle Management
- **Render Lifecycle Hooks**: Before/after render, mount, update, and unmount hooks
- **Component Lifecycle**: Full lifecycle management for each component
- **Custom Hooks**: Extensible hook system for custom behaviors

### Monitoring & Debugging
- **Performance Metrics**: Real-time performance monitoring and metrics
- **Cache Statistics**: Detailed cache hit/miss statistics
- **Debug Mode**: Optional debug mode for development
- **Performance Reports**: Comprehensive performance reporting

## Installation

```bash
npm install @wysiwyg/renderer
```

## Basic Usage

### Simple Rendering

```typescript
import { Renderer, createDefaultRenderer } from '@wysiwyg/renderer';
import { ComponentNode } from '@wysiwyg/core';

// Create a renderer instance
const renderer = createDefaultRenderer();

// Register a component renderer
renderer.registerComponent('button', (node, context) => {
  return <button style={context.style}>{node.props.label}</button>;
});

// Render a component
const node: ComponentNode = {
  id: 'button-1',
  type: 'button',
  props: { label: 'Click Me' },
  styles: { backgroundColor: 'blue', color: 'white' },
  children: []
};

const rendered = renderer.renderNode(node);
```

### Using Renderer Modes

```typescript
import { Renderer, RendererMode } from '@wysiwyg/renderer';

const renderer = new Renderer(undefined, {
  enableVirtualization: true,
  enableLazyRendering: true,
  enableErrorBoundary: true,
});

// Render in editor mode
const editorRender = renderer.renderNode(node, {
  mode: 'editor',
  isEditable: true,
});

// Render in preview mode
const previewRender = renderer.renderNode(node, {
  mode: 'preview',
  isPreview: true,
});

// Render in runtime mode
const runtimeRender = renderer.renderNode(node, {
  mode: 'runtime',
});

// Render in export mode
const exportRender = renderer.renderNode(node, {
  mode: 'export',
});
```

### Using Virtualization

```typescript
import { PageRenderer } from '@wysiwyg/renderer';

function MyPage({ nodes }: { nodes: ComponentNode[] }) {
  return (
    <PageRenderer 
      nodes={nodes}
      options={{
        enableVirtualization: true,
        virtualizationThreshold: 50,
      }}
    />
  );
}
```

### Using Lazy Loading

```typescript
import { LazyComponentRenderer } from '@wysiwyg/renderer';

function MyComponent({ node, context }: { node: ComponentNode, context: RendererContext }) {
  return (
    <LazyComponentRenderer
      node={node}
      context={context}
      renderComponent={(node, context) => (
        <div>{/* Component content */}</div>
      )}
      threshold={0.1}
      rootMargin="50px"
    />
  );
}
```

### Using Error Boundaries

```typescript
import { RendererErrorBoundary } from '@wysiwyg/renderer';

function MyComponent() {
  return (
    <RendererErrorBoundary
      nodeId="my-component"
      mode="editor"
      onError={(error, errorInfo) => {
        console.error('Component error:', error, errorInfo);
      }}
    >
      {/* Component content */}
    </RendererErrorBoundary>
  );
}
```

### Using Lifecycle Hooks

```typescript
import { useRendererLifecycle } from '@wysiwyg/renderer';

function MyComponent({ node, context }: { node: ComponentNode, context: RendererContext }) {
  useRendererLifecycle(node, context, {
    onBeforeRender: (node, context) => {
      console.log('Before render:', node.id);
    },
    onAfterRender: (node, context, result) => {
      console.log('After render:', node.id);
    },
    onMount: (node, context) => {
      console.log('Mounted:', node.id);
    },
    onUpdate: (node, context) => {
      console.log('Updated:', node.id);
    },
    onUnmount: (node, context) => {
      console.log('Unmounted:', node.id);
    },
  });

  return <div>{/* Component content */}</div>;
}
```

### Using Performance Monitoring

```typescript
import { Renderer } from '@wysiwyg/renderer';

const renderer = new Renderer();

// Render components
renderer.renderNodes(nodes);

// Get performance metrics
const metrics = renderer.getPerformanceMetrics();
console.log('Performance metrics:', metrics);

// Get performance report
const report = renderer.getPerformanceReport();
console.log('Performance report:', report);

// Reset metrics
renderer.resetPerformanceMetrics();
```

## Configuration

### Renderer Configuration

```typescript
interface RendererConfig {
  // Enable memoization for components
  enableMemoization?: boolean;

  // Enable virtualization for large lists
  enableVirtualization?: boolean;

  // Enable lazy loading for components
  enableLazyRendering?: boolean;

  // Enable error boundaries
  enableErrorBoundary?: boolean;

  // Enable render caching
  enableCaching?: boolean;

  // Maximum component depth
  maxComponentDepth?: number;

  // Threshold for virtualization
  virtualizationThreshold?: number;

  // Cache size
  cacheSize?: number;

  // Custom style generator
  styleGenerator?: StyleGenerator;

  // Enable performance monitoring
  performanceMonitoring?: boolean;

  // Enable debug mode
  debugMode?: boolean;
}
```

### Virtualization Configuration

```typescript
interface VirtualizationConfig {
  enabled: boolean;
  threshold: number;
  bufferSize?: number;
  overscan?: number;
}
```

### Cache Configuration

```typescript
interface CacheConfig {
  enabled: boolean;
  maxSize: number;
  ttl?: number;
  strategy?: 'lru' | 'fifo' | 'lfu';
}
```

## API Reference

### Renderer

Main renderer class for component rendering.

#### Methods

- `renderNode(node, options)`: Render a single component node
- `renderNodes(nodes, options)`: Render multiple component nodes
- `registerComponent(type, renderer)`: Register a component renderer
- `unregisterComponent(type)`: Unregister a component renderer
- `getRegistry()`: Get the component registry
- `updateConfig(config)`: Update renderer configuration
- `getConfig()`: Get renderer configuration
- `getPerformanceMetrics()`: Get performance metrics
- `getPerformanceReport()`: Get performance report
- `resetPerformanceMetrics()`: Reset performance metrics
- `clearCache()`: Clear render cache
- `getCacheStats()`: Get cache statistics

### RendererEngine

Advanced renderer engine with all features enabled.

#### Methods

All Renderer methods plus:

- `registerLifecycle(nodeId, lifecycle)`: Register lifecycle hooks
- `unregisterLifecycle(nodeId)`: Unregister lifecycle hooks

### PageRenderer

React component for rendering pages with multiple components.

#### Props

- `nodes`: Array of component nodes to render
- `options`: Render options

## Best Practices

1. **Use Virtualization for Large Lists**: Enable virtualization when rendering more than 50 components
2. **Lazy Load Non-Critical Components**: Use lazy loading for components below the fold
3. **Enable Error Boundaries**: Always enable error boundaries in production
4. **Monitor Performance**: Use performance monitoring to identify bottlenecks
5. **Configure Cache**: Adjust cache size based on your application needs
6. **Use Lifecycle Hooks**: Leverage lifecycle hooks for side effects and cleanup
7. **Type Safety**: Always use TypeScript for type safety

## Migration Guide

### From Old Renderer

The new renderer maintains backward compatibility. You can continue using the old API:

```typescript
// Old API still works
import { Renderer } from '@wysiwyg/renderer';
const renderer = new Renderer();
```

To use new features, update to the new API:

```typescript
// New API with advanced features
import { RendererEngine } from '@wysiwyg/renderer';
const engine = new RendererEngine(undefined, {
  enableVirtualization: true,
  enableLazyRendering: true,
  enableErrorBoundary: true,
  enableCaching: true,
});
```

## License

MIT
