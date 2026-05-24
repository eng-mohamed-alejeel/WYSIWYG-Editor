/**
 * Visual Editor Hooks
 *
 * Custom hooks for common visual editor state selections
 */
import { useVisualEditorStore } from '../store/visualEditorStore';
import { visualEditorSelectors } from '../selectors/visualEditorSelectors';

export const useDragState = () => useVisualEditorStore(visualEditorSelectors.dragState);
export const useResizeState = () => useVisualEditorStore(visualEditorSelectors.resizeState);
export const useSnappingState = () => useVisualEditorStore(visualEditorSelectors.snappingState);
export const useHoverState = () => useVisualEditorStore(visualEditorSelectors.hoverState);
export const useSelectionBox = () => useVisualEditorStore(visualEditorSelectors.selectionBox);
export const useKeyboardNavigation = () =>
  useVisualEditorStore(visualEditorSelectors.keyboardNavigation);
export const useVisualEditorConfig = () => useVisualEditorStore(visualEditorSelectors.config);
export const useIsVisualEditorActive = () => useVisualEditorStore(visualEditorSelectors.isActive);
