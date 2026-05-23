# Command Bus Architecture

A centralized command system following enterprise editor architecture patterns, providing a decoupled and extensible way to handle editor operations.

## Architecture Overview

The command bus architecture consists of several core components that work together to provide a robust command execution system:

### Core Components

1. **Command Registry** (`CommandRegistry.ts`)
   - Manages command registration and lookup
   - Supports both command objects and command handlers
   - Singleton instance for global access

2. **Command Dispatcher** (`CommandDispatcher.ts`)
   - Central execution engine for all commands
   - Handles async command execution
   - Integrates with middleware and history
   - Supports transactions for batch operations

3. **Command Middleware Manager** (`CommandMiddlewareManager.ts`)
   - Priority-based middleware execution
   - Before/after hooks for command lifecycle
   - Error handling and recovery

4. **Command History Manager** (`CommandHistoryManager.ts`)
   - Tracks command execution history
   - Supports undo/redo operations
   - Configurable history size
   - Subscription-based change notifications

5. **Keyboard Shortcuts Manager** (`KeyboardShortcutsManager.ts`)
   - Maps keyboard shortcuts to commands
   - Handles keyboard event matching
   - Category-based shortcut organization

## Features

### ✅ Command Registry

- Register commands with typed payloads
- Register command handlers
- Command lookup and validation
- Support for both sync and async commands

### ✅ Command Dispatcher

- Centralized command execution
- Async command support
- Transaction support for batch operations
- Error handling and recovery
- Integration with middleware and history

### ✅ Keyboard Shortcuts

- Map keyboard combinations to commands
- Support for Ctrl, Shift, Alt, Meta modifiers
- Category-based organization
- Event-driven activation

### ✅ Undo/Redo Integration

- Automatic history tracking
- Per-command undo capability
- Configurable history size
- Subscription-based notifications

### ✅ Middleware Support

- Priority-based middleware execution
- Before/after hooks
- Error handling middleware
- Extensible architecture

### ✅ Command History Tracking

- Full execution history
- Timestamp tracking
- Undo/redo state management
- Change subscriptions

### ✅ Editor Actions

Pre-implemented commands for common editor operations:

- **Duplicate**: Duplicate components
- **Delete**: Delete components
- **Move**: Move components to new location
- **Wrap**: Wrap components in container
- **Group**: Group components together
- **Paste**: Paste from clipboard

### ✅ Typed Command Payloads

- Strongly typed command payloads
- Type-safe command execution
- Type-safe command results

### ✅ Decoupled Architecture

- Commands are fully decoupled from UI components
- Event-driven communication
- No direct UI dependencies

## Usage

### Registering Commands

```typescript
import { commandRegistry, Command } from './commands';

const myCommand: Command<MyPayload, MyResult> = {
  type: 'my:command',
  category: CommandCategory.COMPONENT,
  description: 'My custom command',

  validate: (payload) => {
    return payload.requiredField !== undefined;
  },

  execute: async (payload) => {
    // Command logic here
    return { success: true };
  },

  undo: async (payload, result) => {
    // Undo logic here
  },
};

commandRegistry.register(myCommand);
```

### Executing Commands

```typescript
import { commandDispatcher } from './commands';

const result = await commandDispatcher.execute('my:command', {
  requiredField: 'value',
});

if (result.success) {
  console.log('Command executed successfully');
} else {
  console.error('Command failed:', result.error);
}
```

### Using Editor Commands

```typescript
import { editorCommands } from './commands';

// Duplicate components
const duplicateResult = await editorCommands.duplicate({
  componentIds: ['component-1', 'component-2'],
});

// Delete components
const deleteResult = await editorCommands.delete({
  componentIds: ['component-1'],
});

// Move components
const moveResult = await editorCommands.move({
  componentIds: ['component-1'],
  targetParentId: 'parent-1',
  targetIndex: 0,
});
```

### Registering Keyboard Shortcuts

```typescript
import { keyboardShortcutsManager } from './commands';

keyboardShortcutsManager.register({
  command: 'component:delete',
  key: 'Delete',
  description: 'Delete selected components',
  category: CommandCategory.COMPONENT,
});

// Handle keyboard events
const shortcut = keyboardShortcutsManager.handle({
  key: 'Delete',
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  metaKey: false,
});

if (shortcut) {
  await commandDispatcher.execute(shortcut.command, payload);
}
```

### Using Middleware

```typescript
import { commandMiddlewareManager } from './commands';

commandMiddlewareManager.register({
  name: 'logging',
  priority: 100,
  before: (command, payload) => {
    console.log(`Executing command: ${command}`, payload);
    return payload;
  },
  after: (command, payload, result) => {
    console.log(`Command ${command} completed`, result);
  },
  onError: (error, command, payload) => {
    console.error(`Command ${command} failed`, error);
  },
});
```

### Using Command History

```typescript
import { commandHistoryManager } from './commands';

// Subscribe to history changes
const unsubscribe = commandHistoryManager.subscribe((history) => {
  console.log('History updated:', history);
});

// Undo last command
if (commandHistoryManager.canUndo()) {
  await commandDispatcher.undo();
}

// Redo last undone command
if (commandHistoryManager.canRedo()) {
  await commandDispatcher.redo();
}

// Unsubscribe when done
unsubscribe();
```

### Using Transactions

```typescript
import { commandDispatcher } from './commands';

// Begin transaction
const transactionId = commandDispatcher.beginTransaction();

try {
  // Execute multiple commands
  await commandDispatcher.execute('command:1', payload1);
  await commandDispatcher.execute('command:2', payload2);
  await commandDispatcher.execute('command:3', payload3);

  // Commit transaction
  commandDispatcher.commitTransaction();
} catch (error) {
  // Rollback on error
  commandDispatcher.rollbackTransaction();
}
```

## Integration with Existing Stores

The command bus architecture integrates seamlessly with the existing store system:

1. **Event Bus Integration**: Commands emit events through the existing event bus
2. **Middleware Integration**: Command middleware can interact with store middleware
3. **History Integration**: Command history can be synchronized with store history

## Best Practices

1. **Always validate payloads**: Implement validation in your commands
2. **Provide undo logic**: Make commands undoable when possible
3. **Use transactions**: Group related commands in transactions
4. **Handle errors**: Implement proper error handling in commands
5. **Document commands**: Add descriptions to commands for better discoverability
6. **Use categories**: Organize commands by category for better management
7. **Keep commands focused**: Each command should do one thing well
8. **Avoid UI dependencies**: Commands should not directly interact with UI components

## Enterprise Architecture Patterns

This implementation follows several enterprise architecture patterns:

1. **Command Pattern**: Encapsulates requests as objects
2. **Mediator Pattern**: Centralized command dispatcher
3. **Observer Pattern**: Event-driven communication
4. **Middleware Pattern**: Cross-cutting concerns
5. **Repository Pattern**: Command history management
6. **Singleton Pattern**: Global access to managers

## Future Enhancements

Potential areas for expansion:

- Command batching and queuing
- Command scheduling and delayed execution
- Command result caching
- Command performance monitoring
- Command analytics and tracking
- Command serialization for persistence
- Command replay for debugging
- Command permissions and authorization
- Command rate limiting
- Command dependency management
