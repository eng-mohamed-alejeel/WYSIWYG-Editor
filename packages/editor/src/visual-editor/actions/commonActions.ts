/**
 * Common Actions
 *
 * Common actions for the visual editor
 */
import { eventBus } from '../../stores/events';
import { initialState } from '../config/initialState';
import { VisualEditorState } from '../types';

export function createCommonActions(
  set: (
    partial:
      | VisualEditorState
      | Partial<VisualEditorState>
      | ((state: VisualEditorState) => VisualEditorState | Partial<VisualEditorState>),
    replace?: boolean | undefined
  ) => void,
  get: () => VisualEditorState & { clearBoundsCache: () => void }
) {
  return {
    reset: () => {
      set(initialState, false);
      get().clearBoundsCache();
      eventBus.emit('visual:reset', null);
    },
  };
}
