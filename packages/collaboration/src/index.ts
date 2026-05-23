/**
 * @wysiwyg/collaboration
 *
 * Real-time collaborative editing infrastructure for WYSIWYG Editor
 *
 * This package provides:
 * - CRDT-ready architecture for conflict-free replication
 * - Operational transactions for batch operations
 * - Real-time synchronization via WebSocket
 * - Multiplayer selection and cursor awareness
 * - Conflict resolution foundation
 * - Yjs compatibility
 */

// Types
export * from './types';

// CRDT
export { CRDTManager } from './crdt/CRDTManager';

// Transactions
export { TransactionManager } from './transactions/TransactionManager';

// WebSocket
export { WebSocketManager } from './websocket/WebSocketManager';

// Awareness
export { AwarenessManager } from './awareness/AwarenessManager';

// Store
export {
  useCollaborationStore,
  collaborationSelectors,
  useIsConnected,
  useConnectionState,
  useUsers,
  useCursors,
  useSelections,
  usePresence,
  useConflicts,
  useCurrentTransaction,
  useOnlineUsers,
  useRemoteCursors,
  useRemoteSelections,
} from './store/CollaborationStore';

// Components
export { CollaborationProvider, useCollaboration } from './components/CollaborationProvider';
export { RemoteCursors } from './components/RemoteCursors';
export { RemoteSelections } from './components/RemoteSelections';
export { CollaborationStatus } from './components/CollaborationStatus';

// Re-export Yjs for convenience
export * from 'yjs';
