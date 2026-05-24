/**
 * Editor Helper Hooks
 *
 * Convenience hooks for accessing editor state and actions
 */

import { useEditorContext } from './useEditorContext';

/**
 * Hook to access editor state and actions
 * Convenience wrapper around useEditorContext
 */
export const useEditor = () => {
  const context = useEditorContext();

  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }

  return context;
};

/**
 * Hook to access editor state only
 * Does not include actions
 */
export const useEditorState = () => {
  return useEditorContext().state;
};

/**
 * Hook to access editor actions only
 * Does not include state
 */
export const useEditorActions = () => {
  const context = useEditorContext();
  const { state, config, ...actions } = context;
  return actions;
};
