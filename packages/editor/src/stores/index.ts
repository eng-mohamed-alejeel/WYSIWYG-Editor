/**
 * State Management System
 *
 * Enterprise-grade state management using Zustand with:
 * - Separate concerns through dedicated stores
 * - Optimized re-renders with selectors
 * - Transaction support for complex operations
 * - Event system for cross-store communication
 * - Middleware-ready architecture
 * - CRDT collaboration support
 */

// Stores
export * from './editorStore';
export * from './selectionStore';
export * from './viewportStore';
export * from './historyStore';
export * from './assetsStore';
export * from './clipboardStore';

// Core Systems
export * from './middleware';
export * from './events';
export * from './types';

// Integration Layer
export * from './integration';

// Utilities
export * from './utils';

// Provider Components
export { EditorProvider, useEditor, useEditorState, useEditorActions } from './EditorProvider';
