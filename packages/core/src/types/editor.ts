/**
 * Editor and Plugin Types for WYSIWYG Visual Component Builder
 *
 * This module defines editor and plugin related types.
 */

import { UnknownRecord } from './common';
import { ComponentNode, ComponentDefinition } from './components';
import { Project } from './project';

/**
 * Renderer context interface
 */
export interface RendererContext {
  isEditable: boolean;
  isPreview: boolean;
}

/**
 * Command for undo/redo system
 */
export interface Command {
  type: string;
  execute: () => void;
  undo: () => void;
  description?: string;
  timestamp: number;
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
 * Selection state
 */
export interface SelectionState {
  selectedIds: string[];
  hoveredId: string | null;
  focusedId: string | null;
}

/**
 * Editor state
 */
export interface EditorState {
  project: Project | null;
  currentPageId: string | null;
  selection: SelectionState;
  history: HistoryState;
  isDirty: boolean;
  isPreviewMode: boolean;
  currentBreakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide';
  zoom: number;
  clipboard: ComponentNode[];
}

/**
 * Plugin definition
 */
export interface Plugin {
  name: string;
  version: string;
  description?: string;
  initialize: (context: PluginContext) => void;
  destroy?: () => void;
  components?: ComponentDefinition[];
  commands?: Command[];
  hooks?: PluginHooks;
}

/**
 * Plugin context
 */
export interface PluginContext {
  registerComponent: (definition: ComponentDefinition) => void;
  registerCommand: (command: Command) => void;
  getProject: () => Project | null;
  updateProject: (project: Project) => void;
  getSelection: () => SelectionState;
  updateSelection: (selection: SelectionState) => void;
  executeCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;
}

/**
 * Plugin hooks
 */
export interface PluginHooks {
  onProjectLoad?: (project: Project) => void;
  onProjectSave?: (project: Project) => void;
  onComponentSelect?: (componentId: string) => void;
  onComponentUpdate?: (componentId: string) => void;
  onComponentDelete?: (componentId: string) => void;
  onExport?: (format: string, data: unknown) => void;
}

/**
 * Export result
 */
export interface ExportResult {
  success: boolean;
  data?: unknown;
  error?: string;
  warnings?: string[];
}

/**
 * Export options
 */
export interface ExportOptions {
  format: 'html' | 'react' | 'wordpress' | 'odoo';
  optimizeAssets: boolean;
  minify: boolean;
  includeSourceMaps: boolean;
  customOptions?: UnknownRecord;
}
