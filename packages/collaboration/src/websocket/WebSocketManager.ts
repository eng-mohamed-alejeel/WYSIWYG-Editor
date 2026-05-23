/**
 * WebSocket Manager
 *
 * Manages WebSocket connections for real-time synchronization
 */

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import {
  CollaborationConfig,
  ConnectionState,
  WebSocketMessage,
  WebSocketMessageType,
  UserId,
  SessionId,
  CollaborationEventListener,
  CollaborationEvent,
} from '../types';

export class WebSocketManager {
  private config: CollaborationConfig | null = null;
  private provider: WebsocketProvider | null = null;
  private doc: Y.Doc;
  private connectionState: ConnectionState = 'disconnected';
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private eventListeners: Map<string, Set<CollaborationEventListener>> = new Map();
  private messageQueue: WebSocketMessage[] = [];

  constructor(doc: Y.Doc) {
    this.doc = doc;
  }

  /**
   * Connect to WebSocket server
   */
  async connect(config: CollaborationConfig): Promise<void> {
    if (this.connectionState === 'connected') {
      throw new Error('Already connected');
    }

    this.config = config;
    this.connectionState = 'connecting';

    try {
      // Create WebSocket provider
      this.provider = new WebsocketProvider(config.websocketUrl, config.sessionId, this.doc, {
        connect: true,
        params: {
          userId: config.userId,
          userName: config.userName,
        },
      });

      // Setup connection handlers
      this.setupConnectionHandlers();

      // Setup message handlers
      this.setupMessageHandlers();

      // Send queued messages
      this.flushMessageQueue();

      this.emitEvent({
        type: 'connection:change',
        payload: { state: 'connected' },
        timestamp: Date.now(),
        source: 'local',
      });
    } catch (error) {
      this.connectionState = 'error';
      this.emitEvent({
        type: 'connection:change',
        payload: { state: 'error', error },
        timestamp: Date.now(),
        source: 'local',
      });
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  async disconnect(): Promise<void> {
    if (this.provider) {
      this.provider.destroy();
      this.provider = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.connectionState = 'disconnected';
    this.reconnectAttempts = 0;

    this.emitEvent({
      type: 'connection:change',
      payload: { state: 'disconnected' },
      timestamp: Date.now(),
      source: 'local',
    });
  }

  /**
   * Send a message through WebSocket
   */
  send<T>(type: WebSocketMessageType, payload: T): void {
    const message: WebSocketMessage<T> = {
      type,
      payload,
      timestamp: Date.now(),
      userId: this.config?.userId,
      sessionId: this.config?.sessionId,
    };

    if (this.connectionState === 'connected' && this.provider) {
      this.sendMessage(message);
    } else {
      // Queue message for later
      this.messageQueue.push(message);
    }
  }

  /**
   * Send message through WebSocket
   */
  private sendMessage(message: WebSocketMessage): void {
    if (!this.provider) {
      return;
    }

    // Send message through Yjs awareness
    const awareness = this.provider.awareness;
    awareness.setLocalStateField('message', message);
  }

  /**
   * Flush queued messages
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  /**
   * Setup connection handlers
   */
  private setupConnectionHandlers(): void {
    if (!this.provider) {
      return;
    }

    this.provider.on('status', (status: ConnectionState) => {
      this.connectionState = status;

      if (status === 'connected') {
        this.reconnectAttempts = 0;
      } else if (status === 'disconnected' && this.config?.autoReconnect) {
        this.handleReconnect();
      }

      this.emitEvent({
        type: 'connection:change',
        payload: { state: status },
        timestamp: Date.now(),
        source: 'local',
      });
    });

    this.provider.on('connection-error', (error: Error) => {
      this.connectionState = 'error';
      this.emitEvent({
        type: 'connection:change',
        payload: { state: 'error', error },
        timestamp: Date.now(),
        source: 'local',
      });
    });
  }

  /**
   * Setup message handlers
   */
  private setupMessageHandlers(): void {
    if (!this.provider) {
      return;
    }

    const awareness = this.provider.awareness;

    awareness.on('change', () => {
      const states = awareness.getStates();

      for (const [clientId, state] of states) {
        if (clientId !== awareness.clientID && state.message) {
          this.handleIncomingMessage(state.message as WebSocketMessage);
        }
      }
    });
  }

  /**
   * Handle incoming message
   */
  private handleIncomingMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'sync':
        this.handleSyncMessage(message);
        break;

      case 'update':
        this.handleUpdateMessage(message);
        break;

      case 'awareness':
        this.handleAwarenessMessage(message);
        break;

      case 'cursor':
        this.handleCursorMessage(message);
        break;

      case 'selection':
        this.handleSelectionMessage(message);
        break;

      case 'transaction':
        this.handleTransactionMessage(message);
        break;

      case 'presence':
        this.handlePresenceMessage(message);
        break;

      case 'error':
        this.handleError(message);
        break;

      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  /**
   * Handle sync message
   */
  private handleSyncMessage(message: WebSocketMessage): void {
    this.emitEvent({
      type: 'sync:start',
      payload: message.payload,
      timestamp: message.timestamp,
      source: 'remote',
      userId: message.userId,
    });
  }

  /**
   * Handle update message
   */
  private handleUpdateMessage(message: WebSocketMessage): void {
    this.emitEvent({
      type: 'operation:receive',
      payload: message.payload,
      timestamp: message.timestamp,
      source: 'remote',
      userId: message.userId,
    });
  }

  /**
   * Handle awareness message
   */
  private handleAwarenessMessage(message: WebSocketMessage): void {
    this.emitEvent({
      type: 'user:update',
      payload: message.payload,
      timestamp: message.timestamp,
      source: 'remote',
      userId: message.userId,
    });
  }

  /**
   * Handle cursor message
   */
  private handleCursorMessage(message: WebSocketMessage): void {
    this.emitEvent({
      type: 'cursor:move',
      payload: message.payload,
      timestamp: message.timestamp,
      source: 'remote',
      userId: message.userId,
    });
  }

  /**
   * Handle selection message
   */
  private handleSelectionMessage(message: WebSocketMessage): void {
    this.emitEvent({
      type: 'selection:change',
      payload: message.payload,
      timestamp: message.timestamp,
      source: 'remote',
      userId: message.userId,
    });
  }

  /**
   * Handle transaction message
   */
  private handleTransactionMessage(message: WebSocketMessage): void {
    this.emitEvent({
      type: 'transaction:commit',
      payload: message.payload,
      timestamp: message.timestamp,
      source: 'remote',
      userId: message.userId,
    });
  }

  /**
   * Handle presence message
   */
  private handlePresenceMessage(message: WebSocketMessage): void {
    this.emitEvent({
      type: 'user:update',
      payload: message.payload,
      timestamp: message.timestamp,
      source: 'remote',
      userId: message.userId,
    });
  }

  /**
   * Handle error message
   */
  private handleError(message: WebSocketMessage): void {
    this.emitEvent({
      type: 'sync:error',
      payload: message.payload,
      timestamp: message.timestamp,
      source: 'remote',
      userId: message.userId,
    });
  }

  /**
   * Handle reconnection
   */
  private handleReconnect(): void {
    if (!this.config) {
      return;
    }

    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.connectionState = 'error';
      this.emitEvent({
        type: 'connection:change',
        payload: { state: 'error', error: 'Max reconnection attempts reached' },
        timestamp: Date.now(),
        source: 'local',
      });
      return;
    }

    this.reconnectAttempts++;
    this.connectionState = 'reconnecting';

    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.connect(this.config!);
      } catch (error) {
        console.error('Reconnection failed:', error);
        this.handleReconnect();
      }
    }, this.config.reconnectInterval);
  }

  /**
   * Add event listener
   */
  on(eventType: string, listener: CollaborationEventListener): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }

    this.eventListeners.get(eventType)!.add(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }

  /**
   * Emit event to listeners
   */
  private emitEvent(event: CollaborationEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connectionState === 'connected';
  }

  /**
   * Get awareness instance
   */
  getAwareness(): Y.Awareness | null {
    return this.provider?.awareness || null;
  }
}
