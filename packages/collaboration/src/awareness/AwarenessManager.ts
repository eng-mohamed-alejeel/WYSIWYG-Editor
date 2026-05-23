/**
 * Awareness Manager
 *
 * Manages multiplayer awareness including cursors and selections
 */

import * as Y from 'yjs';
import {
  CollaborativeUser,
  RemoteCursor,
  RemoteSelection,
  PresenceState,
  UserId,
  ComponentId,
} from '../types';

export class AwarenessManager {
  private awareness: Y.Awareness;
  private localUserId: UserId;
  private users: Map<UserId, CollaborativeUser> = new Map();
  private cursors: Map<UserId, RemoteCursor> = new Map();
  private selections: Map<UserId, RemoteSelection> = new Map();
  private presence: Map<UserId, PresenceState> = new Map();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(awareness: Y.Awareness, localUserId: UserId) {
    this.awareness = awareness;
    this.localUserId = localUserId;
    this.setupAwarenessHandlers();
    this.startCleanup();
  }

  /**
   * Setup awareness change handlers
   */
  private setupAwarenessHandlers(): void {
    this.awareness.on('change', () => {
      this.syncFromAwareness();
    });

    this.awareness.on('change', ({ added, removed, updated }: any) => {
      // Handle user join
      added.forEach((clientId: number) => {
        const state = this.awareness.getStates().get(clientId);
        if (state && state.user) {
          this.handleUserJoin(state.user);
        }
      });

      // Handle user leave
      removed.forEach((clientId: number) => {
        const state = this.awareness.getStates().get(clientId);
        if (state && state.user) {
          this.handleUserLeave(state.user.id);
        }
      });

      // Handle user update
      updated.forEach((clientId: number) => {
        const state = this.awareness.getStates().get(clientId);
        if (state && state.user) {
          this.handleUserUpdate(state.user);
        }
      });
    });
  }

  /**
   * Sync local state from awareness
   */
  private syncFromAwareness(): void {
    const states = this.awareness.getStates();

    for (const [clientId, state] of states) {
      const userId = state.user?.id;

      if (!userId) {
        continue;
      }

      // Update user info
      if (state.user) {
        this.users.set(userId, state.user);
      }

      // Update cursor
      if (state.cursor) {
        this.cursors.set(userId, state.cursor);
      }

      // Update selection
      if (state.selection) {
        this.selections.set(userId, state.selection);
      }

      // Update presence
      if (state.presence) {
        this.presence.set(userId, state.presence);
      }
    }
  }

  /**
   * Handle user join
   */
  private handleUserJoin(user: CollaborativeUser): void {
    this.users.set(user.id, user);
  }

  /**
   * Handle user leave
   */
  private handleUserLeave(userId: UserId): void {
    this.users.delete(userId);
    this.cursors.delete(userId);
    this.selections.delete(userId);
    this.presence.delete(userId);
  }

  /**
   * Handle user update
   */
  private handleUserUpdate(user: CollaborativeUser): void {
    this.users.set(user.id, user);
  }

  /**
   * Set local user info
   */
  setLocalUser(user: CollaborativeUser): void {
    this.awareness.setLocalStateField('user', user);
    this.users.set(user.id, user);
  }

  /**
   * Update local cursor position
   */
  updateLocalCursor(cursor: Omit<RemoteCursor, 'userId' | 'timestamp'>): void {
    const fullCursor: RemoteCursor = {
      ...cursor,
      userId: this.localUserId,
      timestamp: Date.now(),
    };

    this.awareness.setLocalStateField('cursor', fullCursor);
    this.cursors.set(this.localUserId, fullCursor);
  }

  /**
   * Update local selection
   */
  updateLocalSelection(selection: Omit<RemoteSelection, 'userId' | 'timestamp'>): void {
    const fullSelection: RemoteSelection = {
      ...selection,
      userId: this.localUserId,
      timestamp: Date.now(),
    };

    this.awareness.setLocalStateField('selection', fullSelection);
    this.selections.set(this.localUserId, fullSelection);
  }

  /**
   * Update local presence
   */
  updateLocalPresence(presence: Partial<PresenceState>): void {
    const currentPresence = this.presence.get(this.localUserId) || {
      userId: this.localUserId,
      isOnline: true,
      lastActive: Date.now(),
    };

    const updatedPresence: PresenceState = {
      ...currentPresence,
      ...presence,
      lastActive: Date.now(),
    };

    this.awareness.setLocalStateField('presence', updatedPresence);
    this.presence.set(this.localUserId, updatedPresence);
  }

  /**
   * Get all users
   */
  getUsers(): CollaborativeUser[] {
    return Array.from(this.users.values());
  }

  /**
   * Get user by ID
   */
  getUser(userId: UserId): CollaborativeUser | undefined {
    return this.users.get(userId);
  }

  /**
   * Get all cursors
   */
  getCursors(): RemoteCursor[] {
    return Array.from(this.cursors.values());
  }

  /**
   * Get cursor by user ID
   */
  getCursor(userId: UserId): RemoteCursor | undefined {
    return this.cursors.get(userId);
  }

  /**
   * Get all selections
   */
  getSelections(): RemoteSelection[] {
    return Array.from(this.selections.values());
  }

  /**
   * Get selection by user ID
   */
  getSelection(userId: UserId): RemoteSelection | undefined {
    return this.selections.get(userId);
  }

  /**
   * Get all presence states
   */
  getPresenceStates(): PresenceState[] {
    return Array.from(this.presence.values());
  }

  /**
   * Get presence by user ID
   */
  getPresence(userId: UserId): PresenceState | undefined {
    return this.presence.get(userId);
  }

  /**
   * Get online users
   */
  getOnlineUsers(): CollaborativeUser[] {
    return this.getUsers().filter((user) => user.isOnline);
  }

  /**
   * Get users on the same page
   */
  getUsersOnPage(pageId: ComponentId): CollaborativeUser[] {
    return this.getOnlineUsers().filter((user) => {
      const presence = this.presence.get(user.id);
      return presence?.currentPage === pageId;
    });
  }

  /**
   * Start cleanup of stale data
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupStaleData();
    }, 30000); // Clean up every 30 seconds
  }

  /**
   * Clean up stale data
   */
  private cleanupStaleData(): void {
    const now = Date.now();
    const staleThreshold = 60000; // 1 minute

    // Clean up stale presence
    for (const [userId, presence] of this.presence) {
      if (now - presence.lastActive > staleThreshold) {
        this.presence.delete(userId);
        this.cursors.delete(userId);
        this.selections.delete(userId);

        // Mark user as offline
        const user = this.users.get(userId);
        if (user) {
          user.isOnline = false;
          this.users.set(userId, user);
        }
      }
    }
  }

  /**
   * Clean up and destroy
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    this.users.clear();
    this.cursors.clear();
    this.selections.clear();
    this.presence.clear();
  }
}
