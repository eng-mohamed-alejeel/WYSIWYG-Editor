/**
 * Component Operations
 *
 * Handles component selection and update operations
 */

import { EventBus } from './EventBus';
import { StateStore } from './StateStore';
import { EditorState } from '../types/editor';
import { ComponentNode } from '../types/components';

export class ComponentOperations {
  constructor(
    private eventBus: EventBus,
    private stateStore: StateStore<EditorState>
  ) {}

  selectComponent(componentId: string): void {
    const state = this.stateStore.getState();
    this.stateStore.setState({
      selection: {
        ...state.selection,
        selectedIds: [componentId],
        focusedId: componentId,
      },
    });
    this.eventBus.emit('component:selected', { componentId });
  }

  updateComponent(componentId: string, updates: Partial<ComponentNode>): void {
    this.eventBus.emit('component:updated', { componentId, updates });
  }
}
