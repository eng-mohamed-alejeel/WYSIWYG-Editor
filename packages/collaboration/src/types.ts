/**
 * Collaboration Types
 *
 * Core type definitions for real-time collaborative editing system
 */

import { ComponentId, ComponentNode, Project } from '@wysiwyg/core';
import * as Y from 'yjs';

/**
 * Unique identifier for collaborative sessions
 */
export type SessionId = string;

/**
 * Unique identifier for users in collaborative sessions
 */
export type UserId = string;

/**
 * Unique identifier for operations in the CRDT system
 */
export type OperationId = string;

/**
 * Collaborative user information
 */
export interface CollaborativeUser {
  id: UserId;
  name: string;
  color: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: number;
  permissions: UserPermissions;
}

/**
 * User permissions for collaborative editing
 */
export interface UserPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canAddComponents: boolean;
  canModifyStyles: boolean;
  canModifySettings: boolean;
  canInvite: boolean;
  canExport: boolean;
}

/**
 * Remote cursor position
 */
export interface RemoteCursor {
  userId: UserId;
  componentId: ComponentId | null;
  position: {
    x: number;
    y: number;
  };
  selection?: {
    start: ComponentId;
    end: ComponentId;
  };
  timestamp: number;
}

/**
 * Remote selection state for multiplayer awareness
 */
export interface RemoteSelection {
  userId: UserId;
  selectedIds: ComponentId[];
  timestamp: number;
}

/**
 * Operation types in the CRDT system
 */
export type OperationType =
  | 'insert'
  | 'delete'
  | 'update'
  | 'move'
  | 'batch'
  | 'style-update'
  | 'prop-update';

/**
 * CRDT operation structure
 */
export interface CRDTOperation {
  id: OperationId;
  type: OperationType;
  path: string[];
  value?: unknown;
  oldValue?: unknown;
  timestamp: number;
  userId: UserId;
  sessionId: SessionId;
  vectorClock: VectorClock;
}

/**
 * Vector clock for tracking operation ordering
 */
export interface VectorClock {
  [userId: string]: number;
}

/**
 * Transaction for grouping operations
 */
export interface Transaction {
  id: string;
  operations: CRDTOperation[];
  startTime: number;
  endTime?: number;
  userId: UserId;
  status: 'pending' | 'committed' | 'rolled-back';
}

/**
 * Conflict resolution strategy
 */
export type ConflictResolutionStrategy =
  | 'last-write-wins'
  | 'first-write-wins'
  | 'merge'
  | 'custom';

/**
 * Conflict information
 */
export interface Conflict {
  id: string;
  operation1: CRDTOperation;
  operation2: CRDTOperation;
  path: string[];
  resolution?: ConflictResolution;
  timestamp: number;
}

/**
 * Conflict resolution
 */
export interface ConflictResolution {
  strategy: ConflictResolutionStrategy;
  resolvedValue?: unknown;
  customResolver?: string;
}

/**
 * WebSocket connection state
 */
export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

/**
 * WebSocket message types
 */
export type WebSocketMessageType =
  | 'sync'
  | 'update'
  | 'awareness'
  | 'cursor'
  | 'selection'
  | 'transaction'
  | 'presence'
  | 'error';

/**
 * WebSocket message structure
 */
export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  payload: T;
  timestamp: number;
  userId?: UserId;
  sessionId?: SessionId;
}

/**
 * Awareness update payload
 */
export interface AwarenessUpdate {
  users: CollaborativeUser[];
  cursors: RemoteCursor[];
  selections: RemoteSelection[];
}

/**
 * Sync payload for initial state synchronization
 */
export interface SyncPayload {
  documentState: Uint8Array;
  vectorClock: VectorClock;
  version: number;
}

/**
 * Collaborative session configuration
 */
export interface CollaborationConfig {
  sessionId: SessionId;
  userId: UserId;
  userName: string;
  userColor: string;
  websocketUrl: string;
  enablePresence: boolean;
  enableCursors: boolean;
  enableSelections: boolean;
  conflictResolution: ConflictResolutionStrategy;
  autoReconnect: boolean;
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

/**
 * Yjs document structure
 */
export interface CollaborativeDocument {
  doc: Y.Doc;
  project: Y.XmlFragment;
  components: Y.Map<Y.XmlFragment>;
  styles: Y.Map<Y.Map<unknown>>;
  metadata: Y.Map<unknown>;
  awareness: Y.Awareness;
}

/**
 * Operation transformer for conflict resolution
 */
export interface OperationTransformer {
  transform(op1: CRDTOperation, op2: CRDTOperation): CRDTOperation[];
}

/**
 * Presence state for users
 */
export interface PresenceState {
  userId: UserId;
  isOnline: boolean;
  lastActive: number;
  currentPage?: ComponentId;
  currentBreakpoint?: string;
}

/**
 * Collaborative editing event types
 */
export type CollaborationEventType =
  | 'user:join'
  | 'user:leave'
  | 'user:update'
  | 'cursor:move'
  | 'selection:change'
  | 'operation:receive'
  | 'operation:send'
  | 'transaction:start'
  | 'transaction:commit'
  | 'transaction:rollback'
  | 'conflict:detect'
  | 'conflict:resolve'
  | 'connection:change'
  | 'sync:start'
  | 'sync:complete'
  | 'sync:error';

/**
 * Collaborative editing event
 */
export interface CollaborationEvent<T = unknown> {
  type: CollaborationEventType;
  payload: T;
  timestamp: number;
  source: 'local' | 'remote';
  userId?: UserId;
}

/**
 * Event listener
 */
export type CollaborationEventListener<T = unknown> = (event: CollaborationEvent<T>) => void;

/**
 * Store state for collaboration
 */
export interface CollaborationStoreState {
  isConnected: boolean;
  connectionState: ConnectionState;
  users: Map<UserId, CollaborativeUser>;
  cursors: Map<UserId, RemoteCursor>;
  selections: Map<UserId, RemoteSelection>;
  presence: Map<UserId, PresenceState>;
  conflicts: Conflict[];
  currentTransaction: Transaction | null;
  vectorClock: VectorClock;
}

/**
 * Store actions for collaboration
 */
export interface CollaborationActions {
  connect: (config: CollaborationConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  sendOperation: (operation: CRDTOperation) => Promise<void>;
  startTransaction: (description: string) => Transaction;
  commitTransaction: (transaction: Transaction) => Promise<void>;
  rollbackTransaction: (transaction: Transaction) => Promise<void>;
  updateUserPresence: (presence: Partial<PresenceState>) => void;
  updateCursor: (cursor: RemoteCursor) => void;
  updateSelection: (selection: RemoteSelection) => void;
  resolveConflict: (conflictId: string, resolution: ConflictResolution) => Promise<void>;
  syncDocument: () => Promise<void>;
}
