# Editor State Management System

Enterprise-grade state management for the WYSIWYG Editor using Zustand with optimized performance and scalability.

## Architecture Overview

The state management system is built on the following principles:

- **Separation of Concerns**: State is split into focused stores based on domain
- **Performance Optimization**: Uses selectors with shallow equality to minimize re-renders
- **Event-Driven**: Cross-store communication through an event bus
- **Middleware-Ready**: Extensible architecture for logging, persistence, analytics
- **Collaboration-Ready**: Built-in support for CRDT operations
- **Type-Safe**: Full TypeScript support with strict typing

## Store Structure

### 1. Editor Store (`editorStore`)

Manages core editor state:

- Project data
- Current page selection
- Dirty state tracking
- Preview mode
- Collaborator management

### 2. Selection Store (`selectionStore`)

Manages component selection:

- Selected components
- Hovered component
- Focused component
- Multi-selection support

### 3. Viewport Store (`viewportStore`)

Manages viewport state:

- Dimensions (width/height)
- Zoom level
- Current breakpoint
- Responsive mode

### 4. History Store (`historyStore`)

Manages undo/redo functionality:

- Past states
- Present state
- Future states
- Transaction support

### 5. Assets Store (`assetsStore`)

Manages asset handling:

- Asset storage
- Upload queue
- Upload progress
- Asset organization

### 6. Clipboard Store (`clipboardStore`)

Manages clipboard operations:

- Copy/paste items
- Multiple item types
- Timestamp tracking

## Usage Examples

### Using Store Hooks

```typescript
// Editor Store
import { useProject, useCurrentPageId } from '@wysiwyg/editor/stores';

function MyComponent() {
  const project = useProject();
  const currentPageId = useCurrentPageId();

  return <div>Current page: {currentPageId}</div>;
}

// Selection Store
import { useSelectedIds, useSelectionState } from '@wysiwyg/editor/stores';

function SelectionIndicator() {
  const { selectedIds, hoveredId } = useSelectionState();

  return <div>{selectedIds.length} components selected</div>;
}

// Viewport Store
import { useBreakpoint, useZoom } from '@wysiwyg/editor/stores';

function ViewportControls() {
  const breakpoint = useBreakpoint();
  const zoom = useZoom();

  return (
    <div>
      <span>Breakpoint: {breakpoint}</span>
      <span>Zoom: {Math.round(zoom * 100)}%</span>
    </div>
  );
}

// History Store
import { useCanUndo, useCanRedo, useTransaction } from '@wysiwyg/editor/stores';

function HistoryControls() {
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const { isInTransaction, beginTransaction, commitTransaction, rollbackTransaction } = useTransaction();

  const handleComplexOperation = async () => {
    beginTransaction('Complex operation');
    try {
      // Perform multiple operations
      await commitTransaction();
    } catch (error) {
      rollbackTransaction();
    }
  };

  return (
    <div>
      <button disabled={!canUndo} onClick={undo}>Undo</button>
      <button disabled={!canRedo} onClick={redo}>Redo</button>
    </div>
  );
}

// Assets Store
import { useAssets, useImages } from '@wysiwyg/editor/stores';

function AssetGallery() {
  const images = useImages();

  return (
    <div>
      {images.map(image => (
        <img key={image.id} src={image.url} alt={image.name} />
      ))}
    </div>
  );
}

// Clipboard Store
import { useClipboardItems, useClipboardActions } from '@wysiwyg/editor/stores';

function ClipboardPanel() {
  const items = useClipboardItems();
  const { copy, paste, clear } = useClipboardActions();

  return (
    <div>
      <button onClick={() => copy(items)}>Copy</button>
      <button onClick={paste}>Paste</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}
```

### Using Selectors

```typescript
import { useEditorStore, editorSelectors } from '@wysiwyg/editor/stores';

function MyComponent() {
  // Using a custom selector
  const project = useEditorStore(editorSelectors.project);

  // Using a compound selector with shallow equality
  const { project, currentPageId } = useEditorStore(
    editorSelectors.currentProjectAndPage,
    shallow
  );

  return <div>{project?.name}</div>;
}
```

### Event System

```typescript
import { eventBus } from '@wysiwyg/editor/stores';

// Subscribe to events
const unsubscribe = eventBus.on('component:select', (event) => {
  console.log('Component selected:', event.payload);
});

// Unsubscribe when done
unsubscribe();

// Emit events
eventBus.emit('component:select', { id: 'component-1' });

// Subscribe to all events
const unsubscribeAll = eventBus.onAny((event) => {
  console.log('Event:', event.type, event.payload);
});
```

### Transaction Support

```typescript
import { useTransaction } from '@wysiwyg/editor/stores';

function ComplexOperation() {
  const { isInTransaction, beginTransaction, commitTransaction, rollbackTransaction } = useTransaction();

  const handleOperation = async () => {
    beginTransaction('Update multiple components');
    try {
      // Perform multiple state changes
      await updateComponent1();
      await updateComponent2();
      await updateComponent3();

      // Commit all changes as a single history entry
      await commitTransaction();
    } catch (error) {
      // Rollback all changes if any fails
      rollbackTransaction();
    }
  };

  return <button onClick={handleOperation}>Execute</button>;
}
```

## Performance Optimization

### Selectors with Shallow Equality

All stores provide optimized selectors that use shallow equality to prevent unnecessary re-renders:

```typescript
// Good - Uses shallow equality
const { width, height } = useViewportStore(viewportSelectors.dimensions, shallow);

// Avoid - Will cause re-renders on any state change
const { width, height } = useViewportStore();
```

### Selective Subscriptions

Subscribe only to the state you need:

```typescript
// Good - Subscribes only to project
const project = useProject();

// Avoid - Subscribes to entire store
const { project, currentPageId, isDirty, isPreviewMode, collaborators } = useEditorStore();
```

## Middleware

The system includes built-in middleware for common concerns:

- **Logging**: Logs all state changes
- **Events**: Emits events for state changes
- **Analytics**: Tracks important actions
- **Performance**: Monitors action performance
- **CRDT Sync**: Prepares operations for collaboration

### Custom Middleware

```typescript
import { middlewareManager } from '@wysiwyg/editor/stores';

middlewareManager.register({
  name: 'custom',
  priority: 50,
  before: (state, action, payload) => {
    console.log('Before:', action, payload);
    return payload;
  },
  after: (state, action, payload) => {
    console.log('After:', action);
  },
  onError: (error, action, payload) => {
    console.error('Error:', error);
  },
});
```

## CRDT Collaboration

The system is designed to support CRDT-based collaboration:

```typescript
import { eventBus } from '@wysiwyg/editor/stores';

// Listen for remote operations
eventBus.on('crdt:operation', (event) => {
  if (event.source === 'remote') {
    // Apply remote operation
    applyCRDTOperation(event.payload);
  }
});

// Emit local operations for sync
eventBus.emit('crdt:operation', {
  type: 'update',
  path: ['components', 'component-1', 'props'],
  value: { text: 'New text' },
});
```

## Best Practices

1. **Use Selectors**: Always use the provided selectors or create custom ones
2. **Shallow Equality**: Use `shallow` for compound selectors
3. **Event System**: Use events for cross-store communication
4. **Transactions**: Use transactions for complex multi-step operations
5. **Type Safety**: Leverage TypeScript for type-safe state access
6. **Performance**: Profile and optimize selectors for hot paths
7. **Testing**: Test store logic independently from UI components

## Migration from Context API

The new state management system is designed to be a drop-in replacement for the existing Context API:

```typescript
// Old way
import { useEditor } from '@wysiwyg/editor';
const { state, updateSelection } = useEditor();

// New way
import { useSelectionStore } from '@wysiwyg/editor/stores';
const { selectedIds, selectComponent } = useSelectionStore();
```

## API Reference

### Editor Store

- `useProject()`: Get current project
- `useCurrentPageId()`: Get current page ID
- `useIsDirty()`: Get dirty state
- `useIsPreviewMode()`: Get preview mode
- `useCollaborators()`: Get collaborators list

### Selection Store

- `useSelectedIds()`: Get selected component IDs
- `useHoveredId()`: Get hovered component ID
- `useFocusedId()`: Get focused component ID
- `useHasSelection()`: Check if any component is selected
- `useSelectionState()`: Get complete selection state

### Viewport Store

- `useViewportDimensions()`: Get viewport dimensions
- `useZoom()`: Get zoom level
- `useBreakpoint()`: Get current breakpoint
- `useIsResponsive()`: Get responsive mode state

### History Store

- `useCanUndo()`: Check if undo is available
- `useCanRedo()`: Check if redo is available
- `usePresent()`: Get present state
- `useTransaction()`: Get transaction helpers

### Assets Store

- `useAssets()`: Get all assets
- `useImages()`: Get image assets
- `useVideos()`: Get video assets
- `useAudios()`: Get audio assets
- `useUploadQueue()`: Get upload queue

### Clipboard Store

- `useClipboardItems()`: Get clipboard items
- `useClipboardComponents()`: Get component items
- `useClipboardText()`: Get text items
- `useClipboardAssets()`: Get asset items
- `useClipboardActions()`: Get clipboard actions

## Contributing

When adding new features to the state management system:

1. Define types in `types.ts`
2. Create or update the appropriate store
3. Add selectors with shallow equality
4. Create custom hooks for common use cases
5. Add event emissions for state changes
6. Update this documentation
7. Consider middleware implications

## License

MIT
