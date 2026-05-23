/**
 * Command Bus Architecture
 *
 * Centralized command system with:
 * - Command registry for command registration
 * - Command dispatcher for execution
 * - Keyboard shortcuts manager
 * - Undo/redo integration
 * - Middleware support
 * - Command history tracking
 * - Async command support
 * - Fully decoupled from UI components
 */

// Core components
export { commandRegistry } from './CommandRegistry';
export { commandDispatcher } from './CommandDispatcher';
export { commandMiddlewareManager } from './CommandMiddlewareManager';
export { commandHistoryManager } from './CommandHistoryManager';
export { keyboardShortcutsManager } from './KeyboardShortcutsManager';

// Editor commands
export { registerEditorCommands, editorCommands } from './editorCommands';

// React hooks
export * from './hooks';

// Integration utilities
export {
  initializeCommandBusIntegration,
  createStoreCommandHandler,
  createStoreSyncMiddleware,
} from './integration';

// Types
export * from './types';
