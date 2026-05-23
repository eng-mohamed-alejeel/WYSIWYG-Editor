/**
 * Collaboration Store
 *
 * Central store for managing collaborative editing state
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import * as Y from 'yjs';
import { CRDTManager } from '../crdt/CRDTManager';
import { TransactionManager } from '../transactions/TransactionManager';
import { WebSocketManager } from '../websocket/WebSocketManager';
import { AwarenessManager } from '../awareness/AwarenessManager';
import {
  CollaborationStoreState,
  CollaborationActions,
  CollaborationConfig,
  CRDTOperation,
  Transaction,
  RemoteCursor,
  RemoteSelection,
  Conflict,
  ConflictResolution,
  PresenceState,
  UserId,
  ComponentId,
} from '../types';

interface CollaborationStore extends CollaborationStoreState, CollaborationActions {
  // Internal state
  doc: Y.Doc;
  crdtManager: CRDTManager;
  transactionManager: TransactionManager;
  webSocketManager: WebSocketManager;
  awarenessManager: AwarenessManager;
}

const initialState: CollaborationStoreState = {
  isConnected: false,
  connectionState: 'disconnected',
  users: new Map(),
  cursors: new Map(),
  selections: new Map(),
  presence: new Map(),
  conflicts: [],
  currentTransaction: null,
  vectorClock: {},
};

export const useCollaborationStore = create<CollaborationStore>()(
  subscribeWithSelector((set, get) => {
    // Initialize Yjs document
    const doc = new Y.Doc();

    // Initialize managers
    const crdtManager = new CRDTManager(doc);
    const transactionManager = new TransactionManager(crdtManager);
    const webSocketManager = new WebSocketManager(doc);
    const awarenessManager = new AwarenessManager(doc.awareness, '');

    // Setup WebSocket event handlers
    webSocketManager.on('connection:change', (event) => {
      set({
        connectionState: (event.payload as any).state,
        isConnected: (event.payload as any).state === 'connected',
      });
    });

    webSocketManager.on('user:join', (event) => {
      const user = event.payload as CollaborativeUser;
      set((state) => {
        const newUsers = new Map(state.users);
        newUsers.set(user.id, user);
        return { users: newUsers };
      });
    });

    webSocketManager.on('user:leave', (event) => {
      const userId = event.payload as UserId;
      set((state) => {
        const newUsers = new Map(state.users);
        newUsers.delete(userId);
        const newCursors = new Map(state.cursors);
        newCursors.delete(userId);
        const newSelections = new Map(state.selections);
        newSelections.delete(userId);
        const newPresence = new Map(state.presence);
        newPresence.delete(userId);
        return {
          users: newUsers,
          cursors: newCursors,
          selections: newSelections,
          presence: newPresence,
        };
      });
    });

    webSocketManager.on('cursor:move', (event) => {
      const cursor = event.payload as RemoteCursor;
      set((state) => {
        const newCursors = new Map(state.cursors);
        newCursors.set(cursor.userId, cursor);
        return { cursors: newCursors };
      });
    });

    webSocketManager.on('selection:change', (event) => {
      const selection = event.payload as RemoteSelection;
      set((state) => {
        const newSelections = new Map(state.selections);
        newSelections.set(selection.userId, selection);
        return { selections: newSelections };
      });
    });

    webSocketManager.on('operation:receive', async (event) => {
      const operation = event.payload as CRDTOperation;
      try {
        await crdtManager.applyOperation(operation);
        set({
          vectorClock: crdtManager.getVectorClock(),
        });
      } catch (error) {
        console.error('Failed to apply remote operation:', error);
      }
    });

    return {
      ...initialState,

      // Internal managers
      doc,
      crdtManager,
      transactionManager,
      webSocketManager,
      awarenessManager,

      // Actions
      connect: async (config: CollaborationConfig) => {
        try {
          // Update awareness manager with local user ID
          get().awarenessManager = new AwarenessManager(doc.awareness, config.userId);

          // Set local user info
          get().awarenessManager.setLocalUser({
            id: config.userId,
            name: config.userName,
            color: config.userColor,
            isOnline: true,
            lastSeen: Date.now(),
            permissions: {
              canEdit: true,
              canDelete: true,
              canAddComponents: true,
              canModifyStyles: true,
              canModifySettings: true,
              canInvite: true,
              canExport: true,
            },
          });

          // Connect WebSocket
          await webSocketManager.connect(config);

          set({
            isConnected: true,
            connectionState: 'connected',
          });
        } catch (error) {
          console.error('Failed to connect:', error);
          throw error;
        }
      },

      disconnect: async () => {
        await webSocketManager.disconnect();
        set({
          isConnected: false,
          connectionState: 'disconnected',
          users: new Map(),
          cursors: new Map(),
          selections: new Map(),
          presence: new Map(),
        });
      },

      sendOperation: async (operation: CRDTOperation) => {
        try {
          // Apply locally
          await crdtManager.applyOperation(operation);

          // Send to remote
          webSocketManager.send('update', operation);

          // Update vector clock
          set({
            vectorClock: crdtManager.getVectorClock(),
          });
        } catch (error) {
          console.error('Failed to send operation:', error);
          throw error;
        }
      },

      startTransaction: (description: string) => {
        const transaction = transactionManager.start(
          description,
          get().awarenessManager.getUser(get().doc.clientID.toString())?.id || ''
        );

        set({ currentTransaction: transaction });
        return transaction;
      },

      commitTransaction: async (transaction: Transaction) => {
        try {
          await transactionManager.commit(transaction);

          // Send all operations in the transaction
          for (const operation of transaction.operations) {
            await get().sendOperation(operation);
          }

          set({ currentTransaction: null });
        } catch (error) {
          console.error('Failed to commit transaction:', error);
          throw error;
        }
      },

      rollbackTransaction: async (transaction: Transaction) => {
        try {
          await transactionManager.rollback(transaction);
          set({ currentTransaction: null });
        } catch (error) {
          console.error('Failed to rollback transaction:', error);
          throw error;
        }
      },

      updateUserPresence: (presence: Partial<PresenceState>) => {
        get().awarenessManager.updateLocalPresence(presence);
        set((state) => {
          const newPresence = new Map(state.presence);
          const userId = get().doc.clientID.toString();
          const currentPresence = state.presence.get(userId) || {
            userId,
            isOnline: true,
            lastActive: Date.now(),
          };
          newPresence.set(userId, { ...currentPresence, ...presence });
          return { presence: newPresence };
        });
      },

      updateCursor: (cursor: RemoteCursor) => {
        get().awarenessManager.updateLocalCursor(cursor);
        set((state) => {
          const newCursors = new Map(state.cursors);
          newCursors.set(cursor.userId, cursor);
          return { cursors: newCursors };
        });
      },

      updateSelection: (selection: RemoteSelection) => {
        get().awarenessManager.updateLocalSelection(selection);
        set((state) => {
          const newSelections = new Map(state.selections);
          newSelections.set(selection.userId, selection);
          return { selections: newSelections };
        });
      },

      resolveConflict: async (conflictId: string, resolution: ConflictResolution) => {
        try {
          await crdtManager.resolveConflict(conflictId, resolution);
          set({
            conflicts: crdtManager.getConflicts(),
            vectorClock: crdtManager.getVectorClock(),
          });
        } catch (error) {
          console.error('Failed to resolve conflict:', error);
          throw error;
        }
      },

      syncDocument: async () => {
        try {
          const state = Y.encodeStateAsUpdate(get().doc);
          webSocketManager.send('sync', {
            documentState: state,
            vectorClock: crdtManager.getVectorClock(),
            version: 1,
          });
        } catch (error) {
          console.error('Failed to sync document:', error);
          throw error;
        }
      },
    };
  })
);

// Selectors for optimized re-renders
export const collaborationSelectors = {
  isConnected: (state: CollaborationStoreState) => state.isConnected,
  connectionState: (state: CollaborationStoreState) => state.connectionState,
  users: (state: CollaborationStoreState) => Array.from(state.users.values()),
  cursors: (state: CollaborationStoreState) => Array.from(state.cursors.values()),
  selections: (state: CollaborationStoreState) => Array.from(state.selections.values()),
  presence: (state: CollaborationStoreState) => Array.from(state.presence.values()),
  conflicts: (state: CollaborationStoreState) => state.conflicts,
  currentTransaction: (state: CollaborationStoreState) => state.currentTransaction,
  vectorClock: (state: CollaborationStoreState) => state.vectorClock,

  // Compound selectors
  onlineUsers: (state: CollaborationStoreState) =>
    Array.from(state.users.values()).filter((user) => user.isOnline),

  usersOnPage: (state: CollaborationStoreState, pageId: ComponentId) =>
    Array.from(state.users.values()).filter((user) => {
      const presence = state.presence.get(user.id);
      return presence?.currentPage === pageId;
    }),

  remoteCursors: (state: CollaborationStoreState) =>
    Array.from(state.cursors.values()).filter(
      (cursor) => cursor.userId !== state.users.get(cursor.userId)?.id
    ),

  remoteSelections: (state: CollaborationStoreState) =>
    Array.from(state.selections.values()).filter(
      (selection) => selection.userId !== state.users.get(selection.userId)?.id
    ),
};

// Custom hooks for common selections
export const useIsConnected = () => useCollaborationStore(collaborationSelectors.isConnected);
export const useConnectionState = () =>
  useCollaborationStore(collaborationSelectors.connectionState);
export const useUsers = () => useCollaborationStore(collaborationSelectors.users);
export const useCursors = () => useCollaborationStore(collaborationSelectors.cursors);
export const useSelections = () => useCollaborationStore(collaborationSelectors.selections);
export const usePresence = () => useCollaborationStore(collaborationSelectors.presence);
export const useConflicts = () => useCollaborationStore(collaborationSelectors.conflicts);
export const useCurrentTransaction = () =>
  useCollaborationStore(collaborationSelectors.currentTransaction);
export const useOnlineUsers = () => useCollaborationStore(collaborationSelectors.onlineUsers);
export const useRemoteCursors = () => useCollaborationStore(collaborationSelectors.remoteCursors);
export const useRemoteSelections = () =>
  useCollaborationStore(collaborationSelectors.remoteSelections);
