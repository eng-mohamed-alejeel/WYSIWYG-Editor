/**
 * Visual Editor Component
 *
 * Main editor component that provides the visual editing interface.
 */

import React, { useRef, useEffect } from 'react';
import { EditorState, EditorConfig, EditorContext as EditorContextType } from './types';
import { useEditorCommands } from './hooks/useEditorCommands';

interface EditorProps {
  initialState?: Partial<EditorState>;
  config?: EditorConfig;
  onStateChange?: (state: EditorState) => void;
  children?: React.ReactNode;
}

// Create editor context with proper typing
const EditorContext = React.createContext<EditorContextType | null>(null);

const DEFAULT_CONFIG: Required<EditorConfig> = {
  enableAiFeatures: false,
  enableAnalytics: false,
  maxHistorySize: 50,
  autoSaveInterval: 30000,
  defaultBreakpoint: 'desktop',
};

export const Editor: React.FC<EditorProps> = ({
  initialState,
  config,
  onStateChange,
  children,
}) => {
  const configRef = useRef({ ...DEFAULT_CONFIG, ...config });

  const {
    state,
    executeCommand,
    undo,
    redo,
    updateSelection,
    updateComponent,
    deleteComponent,
    duplicateComponent,
    copyComponent,
    pasteComponents,
  } = useEditorCommands({
    initialState: initialState ?? {},
    config: configRef.current,
    onStateChange,
  });

  // Auto-save effect
  useEffect(() => {
    if (!configRef.current.autoSaveInterval) return;

    const interval = setInterval(() => {
      if (state.isDirty) {
        // Auto-save logic would go here
        // setState((prev) => ({ ...prev, isDirty: false }));
      }
    }, configRef.current.autoSaveInterval);

    return () => clearInterval(interval);
  }, [state.isDirty]);

  // Create editor context value
  const contextValue = {
    state,
    config: configRef.current,
    executeCommand,
    undo,
    redo,
    updateSelection,
    updateComponent,
    deleteComponent,
    duplicateComponent,
    copyComponent,
    pasteComponents,
  };

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};

// Custom hook to use editor context
export const useEditor = (): EditorContextType => {
  const context = React.useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an Editor provider');
  }
  return context;
};
