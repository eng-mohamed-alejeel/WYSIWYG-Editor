# Migration Guide: From Context API to Zustand

This guide helps you migrate from the old Context API-based state management to the new Zustand-based system.

## Overview

The new state management system provides:

- Better performance with optimized re-renders
- Separation of concerns through focused stores
- Transaction support for complex operations
- Event-driven architecture
- Middleware support
- Better TypeScript support
- CRDT collaboration readiness

## Quick Start

### 1. Wrap Your App with EditorProvider

```typescript
import { EditorProvider } from '@wysiwyg/editor/stores';

function App() {
  return (
    <EditorProvider
      initialState={initialState}
      config={config}
      onStateChange={handleStateChange}
    >
      <YourEditorComponents />
    </EditorProvider>
  );
}
```

### 2. Migrate Component by Component

#### Before (Old Way)

```typescript
import { useEditor } from '@wysiwyg/editor';

function MyComponent() {
  const { state, updateSelection } = useEditor();
  const { selectedIds } = state.selection;

  return <div>{selectedIds.length} selected</div>;
}
```

#### After (New Way)

```typescript
import { useSelectedIds } from '@wysiwyg/editor/stores';

function MyComponent() {
  const selectedIds = useSelectedIds();

  return <div>{selectedIds.length} selected</div>;
}
```

## Store Migration Mapping

### Editor Store

| Old Way               | New Way              |
| --------------------- | -------------------- |
| `state.project`       | `useProject()`       |
| `state.currentPageId` | `useCurrentPageId()` |
| `state.isDirty`       | `useIsDirty()`       |
| `state.isPreviewMode` | `useIsPreviewMode()` |

### Selection Store

| Old Way                       | New Way                              |
| ----------------------------- | ------------------------------------ |
| `state.selection.selectedIds` | `useSelectedIds()`                   |
| `state.selection.hoveredId`   | `useHoveredId()`                     |
| `state.selection.focusedId`   | `useFocusedId()`                     |
| `updateSelection()`           | `selectComponent()`, `deselectAll()` |

### Viewport Store

| Old Way                   | New Way              |
| ------------------------- | -------------------- |
| `state.currentBreakpoint` | `useBreakpoint()`    |
| `state.zoom`              | `useZoom()`          |
| Custom viewport logic     | `useViewportState()` |

### History Store

| Old Way              | New Way                    |
| -------------------- | -------------------------- |
| `undo()`             | `useHistoryStore().undo()` |
| `redo()`             | `useHistoryStore().redo()` |
| Custom history logic | `useTransaction()`         |

### Clipboard Store

| Old Way             | New Way                         |
| ------------------- | ------------------------------- |
| `state.clipboard`   | `useClipboardItems()`           |
| `copyComponent()`   | `useClipboardActions().copy()`  |
| `pasteComponents()` | `useClipboardActions().paste()` |

## Common Migration Patterns

### Pattern 1: Simple State Access

#### Before

```typescript
const { state } = useEditor();
const project = state.project;
```

#### After

```typescript
const project = useProject();
```

### Pattern 2: State Updates

#### Before

```typescript
const { updateSelection } = useEditor();
updateSelection({ selectedIds: ['id1', 'id2'] });
```

#### After

```typescript
const { selectComponent } = useSelectionStore();
await selectComponent('id1');
await selectComponent('id2', true); // addToSelection
```

### Pattern 3: Complex Operations with Transactions

#### Before

```typescript
const { executeCommand } = useEditor();
executeCommand(command1);
executeCommand(command2);
executeCommand(command3);
```

#### After

```typescript
const { beginTransaction, commitTransaction, rollbackTransaction } = useTransaction();

beginTransaction('Complex operation');
try {
  await executeCommand(command1);
  await executeCommand(command2);
  await executeCommand(command3);
  await commitTransaction();
} catch (error) {
  rollbackTransaction();
}
```

### Pattern 4: Event Handling

#### Before

```typescript
// No built-in event system
```

#### After

```typescript
import { eventBus } from '@wysiwyg/editor/stores';

useEffect(() => {
  const unsubscribe = eventBus.on('component:select', (event) => {
    console.log('Component selected:', event.payload);
  });

  return unsubscribe;
}, []);
```

## Benefits of Migration

### Performance Improvements

1. **Reduced Re-renders**: Components only re-render when their specific state changes
2. **Optimized Selectors**: Built-in shallow equality prevents unnecessary updates
3. **Lazy Loading**: Stores can be loaded on demand

### Better Developer Experience

1. **Type Safety**: Full TypeScript support with strict typing
2. **Better DevTools**: Zustand provides excellent debugging tools
3. **Clearer API**: Each store has a focused, well-documented API

### New Capabilities

1. **Transactions**: Batch operations with atomic commits
2. **Event System**: Cross-store communication
3. **Middleware**: Extensible architecture for logging, analytics, etc.
4. **Collaboration**: Built-in support for CRDT operations

## Backward Compatibility

The new system maintains backward compatibility through:

1. **Legacy Hooks**: `useEditor()` still works with the new stores
2. **Integration Layer**: Bridges old and new APIs
3. **Gradual Migration**: Migrate components at your own pace

## Testing Your Migration

### 1. Unit Tests

```typescript
import { renderHook, act } from '@testing-library/react';
import { useSelectedIds } from '@wysiwyg/editor/stores';

test('selection updates correctly', () => {
  const { result } = renderHook(() => useSelectedIds());

  act(() => {
    // Test selection logic
  });

  expect(result.current).toEqual(['id1']);
});
```

### 2. Integration Tests

```typescript
import { render, screen } from '@testing-library/react';
import { EditorProvider } from '@wysiwyg/editor/stores';

test('editor works with new provider', () => {
  render(
    <EditorProvider>
      <YourComponent />
    </EditorProvider>
  );

  // Test component behavior
});
```

## Common Issues and Solutions

### Issue: Component Not Updating

**Problem**: Component doesn't re-render when state changes

**Solution**: Make sure you're using the correct selector

```typescript
// Wrong
const state = useSelectionStore();

// Correct
const selectedIds = useSelectedIds();
```

### Issue: TypeScript Errors

**Problem**: Type errors after migration

**Solution**: Import types from the correct location

```typescript
// Wrong
import { SelectionState } from '@wysiwyg/editor';

// Correct
import { SelectionState } from '@wysiwyg/editor/stores';
```

### Issue: Performance Degradation

**Problem**: Component re-renders too frequently

**Solution**: Use shallow equality for compound selectors

```typescript
// Wrong
const { selectedIds, hoveredId } = useSelectionStore();

// Correct
const { selectedIds, hoveredId } = useSelectionStore(selectionSelectors.selectionState, shallow);
```

## Best Practices After Migration

1. **Use Specific Hooks**: Prefer `useProject()` over `useEditorStore()`
2. **Compound Selectors**: Use provided compound selectors with shallow equality
3. **Event System**: Use events for cross-component communication
4. **Transactions**: Use transactions for complex multi-step operations
5. **Type Safety**: Leverage TypeScript for type-safe state access

## Need Help?

- Check the [README.md](./src/stores/README.md) for detailed API documentation
- Review the [integration.ts](./src/stores/integration.ts) for examples
- Look at existing components that have been migrated

## Timeline

Recommended migration timeline:

1. **Week 1**: Set up EditorProvider and migrate simple components
2. **Week 2**: Migrate selection and viewport-related components
3. **Week 3**: Migrate history and clipboard functionality
4. **Week 4**: Optimize performance and add advanced features

## Conclusion

The new state management system provides a solid foundation for future growth while maintaining backward compatibility. Take your time with the migration, and don't hesitate to reach out if you need help.
