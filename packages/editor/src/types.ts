/**
 * Editor Types
 *
 * This module defines the types used by the visual editor.
 */

import { ComponentNode, ComponentId, Breakpoint, Command } from '@wysiwyg/core';

/**
 * Editor state
 */
export interface EditorState {
  project: any;
  currentPageId: ComponentId | null;
  selection: SelectionState;
  history: HistoryState;
  isDirty: boolean;
  isPreviewMode: boolean;
  currentBreakpoint: Breakpoint;
  zoom: number;
  clipboard: ComponentNode[];
}

/**
 * Selection state
 */
export interface SelectionState {
  selectedIds: ComponentId[];
  hoveredId: ComponentId | null;
  focusedId: ComponentId | null;
}

/**
 * History state
 */
export interface HistoryState {
  past: Command[];
  present: Command | null;
  future: Command[];
  maxSize: number;
}

/**
 * Editor configuration
 */
export interface EditorConfig {
  enableAiFeatures?: boolean;
  enableAnalytics?: boolean;
  maxHistorySize?: number;
  autoSaveInterval?: number;
  defaultBreakpoint?: Breakpoint;
}

/**
 * Editor context
 */
export interface EditorContext {
  state: EditorState;
  config: EditorConfig;
  executeCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  updateSelection: (selection: Partial<SelectionState>) => void;
  updateComponent: (id: ComponentId, updates: Partial<ComponentNode>) => void;
  deleteComponent: (id: ComponentId) => void;
  duplicateComponent: (id: ComponentId) => void;
  copyComponent: (id: ComponentId) => void;
  pasteComponents: () => void;
}

/**
 * Drag and drop state
 */
export interface DragDropState {
  isDragging: boolean;
  draggedComponentId: ComponentId | null;
  dropTargetId: ComponentId | null;
  dropPosition: 'before' | 'after' | 'inside' | null;
}

/**
 * Viewport state
 */
export interface ViewportState {
  width: number;
  height: number;
  zoom: number;
  breakpoint: Breakpoint;
}
