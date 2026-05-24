/**
 * Editor and Plugin Validation Schemas using Zod
 *
 * This module provides validation schemas for editor and plugin-related data structures.
 */

import { z } from 'zod';
import { ComponentIdSchema, ComponentNodeSchema, ComponentDefinitionSchema } from './components';
import { ProjectSchema } from './project';

/**
 * Command validation
 */
export const CommandSchema = z.object({
  type: z.string(),
  execute: z.function(),
  undo: z.function(),
  description: z.string().optional(),
  timestamp: z.number(),
});

/**
 * History State validation
 */
export const HistoryStateSchema = z.object({
  past: z.array(CommandSchema),
  present: CommandSchema.nullable(),
  future: z.array(CommandSchema),
  maxSize: z.number(),
});

/**
 * Selection State validation
 */
export const SelectionStateSchema = z.object({
  selectedIds: z.array(ComponentIdSchema),
  hoveredId: ComponentIdSchema.nullable(),
  focusedId: ComponentIdSchema.nullable(),
});

/**
 * Editor State validation
 */
export const EditorStateSchema = z.object({
  project: ProjectSchema.nullable(),
  currentPageId: ComponentIdSchema.nullable(),
  selection: SelectionStateSchema,
  history: HistoryStateSchema,
  isDirty: z.boolean(),
  isPreviewMode: z.boolean(),
  currentBreakpoint: z.enum(['mobile', 'tablet', 'desktop', 'wide']),
  zoom: z.number(),
  clipboard: z.array(ComponentNodeSchema),
});

/**
 * Plugin Hooks validation
 */
export const PluginHooksSchema = z
  .object({
    onProjectLoad: z.function().optional(),
    onProjectSave: z.function().optional(),
    onComponentSelect: z.function().optional(),
    onComponentUpdate: z.function().optional(),
    onComponentDelete: z.function().optional(),
    onExport: z.function().optional(),
  })
  .optional();

/**
 * Plugin Context validation
 */
export const PluginContextSchema = z.object({
  registerComponent: z.function(),
  registerCommand: z.function(),
  getProject: z.function(),
  updateProject: z.function(),
  getSelection: z.function(),
  updateSelection: z.function(),
  executeCommand: z.function(),
  undo: z.function(),
  redo: z.function(),
});

/**
 * Plugin validation
 */
export const PluginSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  initialize: z.function(),
  destroy: z.function().optional(),
  components: z.array(ComponentDefinitionSchema).optional(),
  commands: z.array(CommandSchema).optional(),
  hooks: PluginHooksSchema,
});

/**
 * Export Options validation
 */
export const ExportOptionsSchema = z.object({
  format: z.enum(['html', 'react', 'wordpress', 'odoo']),
  optimizeAssets: z.boolean(),
  minify: z.boolean(),
  includeSourceMaps: z.boolean(),
  customOptions: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Export Result validation
 */
export const ExportResultSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  warnings: z.array(z.string()).optional(),
});
