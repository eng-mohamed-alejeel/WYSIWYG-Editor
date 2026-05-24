# Editor Runtime Architecture

## Overview

The Editor Runtime is a centralized architecture that orchestrates all editor subsystems following enterprise-grade patterns similar to VSCode and Figma. It provides a robust foundation for building extensible and maintainable editor applications.

## Core Components

### 1. EditorRuntime

The main orchestrator that manages all subsystems and their lifecycle.

**Features:**

- Lifecycle management (initialize, mount, destroy, reload)
- Service registration and dependency injection
- Plugin management
- Event orchestration
- State coordination

**Usage:**

```typescript
import { EditorRuntime } from '@wysiwyg/core';

const runtime = new EditorRuntime({
  config: {
    debug: true,
    maxHistorySize: 100,
    autoSaveInterval: 30000,
  },
  hooks: {
    onBeforeInitialize: async () => {
      console.log('Initializing runtime...');
    },
    onAfterMount: async () => {
      console.log('Runtime mounted successfully');
    },
  },
});

// Initialize the runtime
await runtime.initialize();

// Mount to DOM
await runtime.mount(document.getElementById('editor-container'));
```

### 2. ServiceContainer

Provides dependency injection and service management.

**Features:**

- Service registration with factory functions
- Dependency resolution
- Singleton and transient service support
- Lazy initialization

**Usage:**

```typescript
// Register a service
runtime.registerService({
  id: 'MyService',
  factory: (eventBus, stateStore) => new MyService(eventBus, stateStore),
  dependencies: ['EventBus', 'StateStore'],
  singleton: true,
});

// Get a service
const myService = runtime.getService('MyService');
```

### 3. EventBus

Event-driven communication system for loose coupling.

**Features:**

- Pub/sub pattern
- Event handlers with error isolation
- One-time event listeners
- Automatic cleanup

**Usage:**

```typescript
const eventBus = runtime.getEventBus();

// Subscribe to events
const unsubscribe = eventBus.on('component:selected', (data) => {
  console.log('Component selected:', data.componentId);
});

// Emit events
eventBus.emit('component:selected', { componentId: '123' });

// Unsubscribe
unsubscribe();
```

### 4. StateStore

Centralized state management with subscription support.

**Features:**

- Immutable state updates
- Change notifications
- State history tracking
- Event integration

**Usage:**

```typescript
const stateStore = runtime.getStateStore();

// Get current state
const state = stateStore.getState();

// Update state
stateStore.setState({
  isPreviewMode: true,
  zoom: 1.5,
});

// Subscribe to changes
const unsubscribe = stateStore.subscribe((newState, previousState) => {
  console.log('State changed:', newState, previousState);
});
```

### 5. HistoryManager

Manages command history for undo/redo functionality.

**Features:**

- Command execution with history
- Undo/redo support
- Configurable history size
- Event notifications

**Usage:**

```typescript
const commandManager = runtime.getCommandManager();

// Execute a command
commandManager.execute({
  type: 'update-component',
  execute: () => {
    /* do something */
  },
  undo: () => {
    /* undo it */
  },
  timestamp: Date.now(),
});

// Undo last command
commandManager.undo();

// Redo undone command
commandManager.redo();
```

### 6. PluginManager

Manages plugin lifecycle and registration.

**Features:**

- Plugin registration and initialization
- Component and command registration
- Plugin context providers
- Lifecycle hooks

**Usage:**

```typescript
// Register a plugin
runtime.registerPlugin({
  name: 'my-plugin',
  version: '1.0.0',
  initialize: (context) => {
    // Use plugin context
    context.registerComponent(myComponent);
    context.registerCommand(myCommand);
  },
  destroy: () => {
    // Cleanup
  },
});
```

### 7. CommandManager

Executes and manages editor commands.

**Features:**

- Command registration
- Execution with history
- Error handling
- Event notifications

**Usage:**

```typescript
const commandManager = runtime.getCommandManager();

// Register a command
commandManager.register({
  type: 'my-command',
  execute: () => {
    /* execute */
  },
  undo: () => {
    /* undo */
  },
  timestamp: Date.now(),
});

// Execute command
commandManager.execute({
  type: 'my-command',
  execute: () => {
    /* execute */
  },
  undo: () => {
    /* undo */
  },
  timestamp: Date.now(),
});
```

### 8. LayoutEngine

Manages editor layout and workspace organization.

**Features:**

- Panel management
- Layout configuration
- Panel visibility and sizing
- Active panel tracking

**Usage:**

```typescript
const layoutEngine = runtime.getLayoutEngine();

// Register a panel
layoutEngine.registerPanel({
  id: 'properties-panel',
  type: 'sidebar',
  position: 'right',
  title: 'Properties',
  size: 300,
  resizable: true,
  visible: true,
});

// Show/hide panel
layoutEngine.showPanel('properties-panel');
layoutEngine.hidePanel('properties-panel');

// Resize panel
layoutEngine.resizePanel('properties-panel', 400);
```

### 9. InspectorManager

Manages component inspection and property editing.

**Features:**

- Component inspection
- Field configuration
- Property editing
- Validation support

**Usage:**

```typescript
const inspectorManager = runtime.getInspectorManager();

// Register component inspector
inspectorManager.registerComponentInspector('button', [
  {
    id: 'properties',
    title: 'Properties',
    order: 1,
    fields: [
      {
        id: 'text',
        label: 'Text',
        type: 'text',
        value: 'Click me',
        required: true,
      },
      {
        id: 'color',
        label: 'Color',
        type: 'color',
        value: '#000000',
      },
    ],
  },
]);

// Update field value
inspectorManager.updateField('text', 'New Text');
```

### 10. RendererManager

Manages component rendering subsystem.

**Features:**

- Component rendering
- Rendering context management
- Render caching
- Tree rendering

**Usage:**

```typescript
const rendererManager = runtime.getRendererManager();

// Register component
rendererManager.registerComponent({
  id: 'button',
  render: (component, context) => {
    return `<button>${component.props.text}</button>`;
  },
});

// Render component
const rendered = rendererManager.render(component);

// Render entire tree
const renderedTree = rendererManager.renderTree(rootComponent);
```

## Architecture Principles

### 1. Loose Coupling

All subsystems communicate through the EventBus, ensuring minimal direct dependencies between components.

### 2. Dependency Injection

Services are registered and injected through the ServiceContainer, making the system highly testable and modular.

### 3. Event-Driven

The architecture uses an event-driven pattern for communication, enabling reactive updates and extensibility.

### 4. Lifecycle Management

Clear lifecycle states and hooks ensure proper initialization, mounting, and cleanup of all subsystems.

### 5. Plugin Architecture

Plugins can extend functionality through a well-defined API, with access to core services through context providers.

## Runtime Lifecycle

```
UNINITIALIZED → INITIALIZING → INITIALIZED → MOUNTING → MOUNTED
                                              ↓
                                         DESTROYING → DESTROYED
```

### Lifecycle States

- **UNINITIALIZED**: Runtime created but not initialized
- **INITIALIZING**: Runtime is initializing subsystems
- **INITIALIZED**: All subsystems initialized and ready
- **MOUNTING**: Runtime is mounting to DOM
- **MOUNTED**: Runtime is fully operational
- **DESTROYING**: Runtime is being destroyed
- **DESTROYED**: Runtime has been cleaned up

### Lifecycle Hooks

- `onBeforeInitialize`: Called before initialization starts
- `onAfterInitialize`: Called after initialization completes
- `onBeforeMount`: Called before mounting to DOM
- `onAfterMount`: Called after mounting completes
- `onBeforeDestroy`: Called before destruction starts
- `onAfterDestroy`: Called after destruction completes
- `onBeforeReload`: Called before reload starts
- `onAfterReload`: Called after reload completes
- `onError`: Called when an error occurs

## Event System

### Core Events

- `runtime:initialized`: Runtime initialization completed
- `runtime:mounted`: Runtime mounted to DOM
- `runtime:destroyed`: Runtime destroyed
- `runtime:reloaded`: Runtime reloaded
- `state:change`: State updated
- `command:executed`: Command executed
- `component:selected`: Component selected
- `component:updated`: Component updated

### Event Pattern

```typescript
// Subscribe
const unsubscribe = eventBus.on('event:name', (data) => {
  // Handle event
});

// Emit
eventBus.emit('event:name', {
  /* data */
});

// Unsubscribe
unsubscribe();
```

## Service Registration

### Core Services

The runtime automatically registers these core services:

- `EventBus`: Event communication
- `StateStore`: State management
- `HistoryManager`: Command history
- `CommandManager`: Command execution
- `PluginManager`: Plugin management
- `LayoutEngine`: Layout management
- `InspectorManager`: Component inspection
- `RendererManager`: Component rendering

### Custom Services

```typescript
runtime.registerService({
  id: 'CustomService',
  factory: (eventBus, stateStore) => {
    return new CustomService(eventBus, stateStore);
  },
  dependencies: ['EventBus', 'StateStore'],
  singleton: true,
});
```

## Best Practices

1. **Use Events for Communication**: Always use the EventBus for inter-subsystem communication
2. **Register Services Early**: Register all services during initialization
3. **Handle Errors Gracefully**: Implement error handling in event listeners and commands
4. **Clean Up Resources**: Always unsubscribe from events and dispose services when done
5. **Use Type Safety**: Leverage TypeScript types for all runtime interactions
6. **Test in Isolation**: Use dependency injection to test subsystems independently

## Migration Guide

### From Direct Instantiation

**Before:**

```typescript
const renderer = new Renderer();
const history = new History();
```

**After:**

```typescript
const runtime = new EditorRuntime();
await runtime.initialize();
const renderer = runtime.getRendererManager();
const history = runtime.getService('HistoryManager');
```

### From Direct State Management

**Before:**

```typescript
let state = { ... };
setState({ ...state, key: value });
```

**After:**

```typescript
const stateStore = runtime.getStateStore();
stateStore.setState({ key: value });
```

## Contributing

When contributing to the Editor Runtime:

1. Follow the existing architecture patterns
2. Use TypeScript for all new code
3. Add comprehensive JSDoc comments
4. Ensure loose coupling through events
5. Register services through the container
6. Implement proper cleanup in destroy methods
7. Add lifecycle hooks where appropriate
