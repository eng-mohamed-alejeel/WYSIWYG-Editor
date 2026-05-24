/**
 * Editor Provider
 *
 * Provides the editor state management context to the application
 * Bridges the new Zustand-based stores with React components
 */

import React from 'react';
import { EditorState, EditorConfig } from '../types';
import { useMiddleware } from './hooks/useMiddleware';
import { useStateInitialization } from './hooks/useStateInitialization';
import { useStateChanges } from './hooks/useStateChanges';
import { useAutoSave } from './hooks/useAutoSave';

interface EditorProviderProps {
  initialState?: Partial<EditorState>;
  config?: EditorConfig;
  onStateChange?: (state: EditorState) => void;
  children: React.ReactNode;
}

/**
 * Editor Provider Component
 *
 * Initializes the state management system and provides
 * integration with existing components
 */
export const EditorProvider: React.FC<EditorProviderProps> = ({
  initialState,
  config,
  onStateChange,
  children,
}) => {
  // Initialize middleware
  useMiddleware(config);

  // Initialize state from props
  useStateInitialization(initialState);

  // Handle state changes
  useStateChanges(onStateChange);

  // Auto-save functionality
  useAutoSave(config);

  return <>{children}</>;
};

// Re-export editor hooks
export { useEditorContext } from './hooks/useEditorContext';
export { useEditor, useEditorState, useEditorActions } from './hooks/useEditorHelpers';
