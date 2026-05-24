/**
 * Visual Editor Store
 *
 * Manages state for professional visual editing tools
 * Optimized for performance with selective subscriptions
 */

// Re-export from the modularized store structure
export { useVisualEditorStore } from './store/visualEditorStore';
export { visualEditorSelectors } from './selectors/visualEditorSelectors';
export {
  useDragState,
  useResizeState,
  useSnappingState,
  useHoverState,
  useSelectionBox,
  useKeyboardNavigation,
  useVisualEditorConfig,
  useIsVisualEditorActive,
} from './hooks/visualEditorHooks';
export { DEFAULT_CONFIG } from './config/defaultConfig';
export { initialState } from './config/initialState';
export {
  updateComponentBounds,
  getComponentBounds,
  getAllBounds,
  clearBoundsCache,
} from './utils/componentBounds';

// Re-export useHasHover from hooks
export { useHoverState as useHasHover } from './hooks/visualEditorHooks';
