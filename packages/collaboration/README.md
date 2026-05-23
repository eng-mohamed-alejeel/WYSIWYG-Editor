# @wysiwyg/collaboration

Real-time collaborative editing infrastructure for the WYSIWYG Visual Editor Platform.

## Features

- **CRDT-Ready Architecture**: Built on Yjs for conflict-free replicated data types
- **Operational Transactions**: Batch operations with atomic commits and rollbacks
- **Real-Time Synchronization**: WebSocket-based synchronization layer
- **Multiplayer Awareness**: Real-time cursor and selection tracking
- **Conflict Resolution**: Built-in conflict detection and resolution strategies
- **Scalable State**: Modular store architecture with optimized subscriptions
- **Yjs Compatibility**: Full integration with Yjs ecosystem

## Installation

```bash
npm install @wysiwyg/collaboration
```

## Quick Start

```typescript
import { useCollaborationStore } from '@wysiwyg/collaboration';

// Initialize collaboration
const { connect, sendOperation } = useCollaborationStore();

// Connect to a collaborative session
await connect({
  sessionId: 'project-123',
  userId: 'user-456',
  userName: 'John Doe',
  userColor: '#FF5733',
  websocketUrl: 'wss://your-websocket-server.com',
  enablePresence: true,
  enableCursors: true,
  enableSelections: true,
  conflictResolution: 'last-write-wins',
  autoReconnect: true,
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
});

// Send operations
await sendOperation({
  id: 'op-123',
  type: 'update',
  path: ['components', 'comp-456', 'props', 'text'],
  value: 'New text',
  timestamp: Date.now(),
  userId: 'user-456',
  sessionId: 'project-123',
  vectorClock: {},
});
```

## Architecture

### CRDT Manager

The CRDT Manager handles conflict-free operations using Yjs:

```typescript
import { CRDTManager } from '@wysiwyg/collaboration';
import * as Y from 'yjs';

const doc = new Y.Doc();
const crdtManager = new CRDTManager(doc);

// Create and apply operations
const operation = crdtManager.createOperation(
  'update',
  ['components', 'comp-456', 'props', 'text'],
  'New text',
  'Old text',
  'user-456'
);

await crdtManager.applyOperation(operation);
```

### Transaction Manager

Batch operations into atomic transactions:

```typescript
import { TransactionManager } from '@wysiwyg/collaboration';

const transactionManager = new TransactionManager(crdtManager);

// Start a transaction
const transaction = transactionManager.start('Update component styles', 'user-456');

// Add operations
transactionManager.addOperation(transaction.id, operation1);
transactionManager.addOperation(transaction.id, operation2);

// Commit or rollback
await transactionManager.commit(transaction.id);
// or
await transactionManager.rollback(transaction.id);
```

### WebSocket Manager

Handle real-time synchronization:

```typescript
import { WebSocketManager } from '@wysiwyg/collaboration';

const wsManager = new WebSocketManager(doc);

// Connect
await wsManager.connect(config);

// Listen to events
wsManager.on('connection:change', (event) => {
  console.log('Connection state:', event.payload.state);
});

// Send messages
wsManager.send('update', operation);
```

### Awareness Manager

Track multiplayer cursors and selections:

```typescript
import { AwarenessManager } from '@wysiwyg/collaboration';

const awarenessManager = new AwarenessManager(doc.awareness, 'user-456');

// Update local cursor
awarenessManager.updateLocalCursor({
  componentId: 'comp-456',
  position: { x: 100, y: 200 },
});

// Get remote cursors
const cursors = awarenessManager.getCursors();
```

## Store Hooks

Use the provided hooks for accessing collaboration state:

```typescript
import {
  useIsConnected,
  useUsers,
  useCursors,
  useSelections,
  useOnlineUsers,
  useRemoteCursors,
  useRemoteSelections,
} from '@wysiwyg/collaboration';

function MyComponent() {
  const isConnected = useIsConnected();
  const users = useUsers();
  const cursors = useCursors();
  const onlineUsers = useOnlineUsers();
  const remoteCursors = useRemoteCursors();

  // ... component logic
}
```

## Conflict Resolution

The system supports multiple conflict resolution strategies:

- **last-write-wins**: Keep the most recent operation
- **first-write-wins**: Keep the earliest operation
- **merge**: Combine both operations
- **custom**: Use a custom resolver

```typescript
// Resolve a conflict
await resolveConflict('conflict-123', {
  strategy: 'last-write-wins',
});
```

## WebSocket Server

For production use, you'll need a WebSocket server. Here's a simple example using the Yjs WebSocket server:

```javascript
const WebSocketServer = require('ws').Server;
const Y = require('yjs');
const { setupWSConnection } = require('y-websocket/bin/utils');

const server = new WebSocketServer({ port: 1234 });

server.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
});
```

## Best Practices

1. **Use Transactions**: Group related operations into transactions for atomic updates
2. **Handle Conflicts**: Implement appropriate conflict resolution strategies for your use case
3. **Optimize Subscriptions**: Use the provided selectors for efficient re-renders
4. **Manage Awareness**: Clean up stale cursor and selection data
5. **Error Handling**: Always handle connection errors and implement reconnection logic

## API Reference

See the TypeScript definitions for complete API documentation.

## License

MIT
