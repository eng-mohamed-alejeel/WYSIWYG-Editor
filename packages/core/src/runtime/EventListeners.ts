/**
 * Event Listeners Setup
 *
 * Handles setup of all runtime event listeners
 */

import { EventBus } from './EventBus';
import { InspectorManager } from './InspectorManager';
import { RuntimeOptions } from './types';
import { EditorState } from '../types/editor';

export function setupEventListeners(
  eventBus: EventBus,
  inspectorManager: InspectorManager,
  options: RuntimeOptions
): void {
  // Handle errors
  eventBus.on<Error>('error', (error) => {
    if (options.hooks?.onError) {
      options.hooks.onError(error);
    } else {
      console.error('Runtime error:', error);
    }
  });

  // Handle state changes
  eventBus.on<{ state: EditorState; previousState: EditorState }>(
    'state:change',
    ({ state, previousState }) => {
      eventBus.emit('runtime:state:changed', { state, previousState });
    }
  );

  // Handle component selection for inspector
  eventBus.on<{ componentId: string }>('component:selected', ({ componentId }) => {
    inspectorManager.clear();
    eventBus.emit('inspector:request:inspect', { componentId });
  });
}
