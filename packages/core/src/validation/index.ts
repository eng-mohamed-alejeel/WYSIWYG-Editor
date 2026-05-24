/**
 * Validation Schemas using Zod
 *
 * This module exports all validation schemas used throughout the platform.
 * Schemas are organized into separate modules for better maintainability.
 */

import { z } from 'zod';

// Export component-related schemas
export {
  ComponentIdSchema,
  ComponentTypeSchema,
  StylePropertySchema,
  StyleValueSchema,
  StyleObjectSchema,
  ComponentPropsSchema,
  ComponentMetadataSchema,
  ComponentNodeSchema,
  InspectorFieldTypeSchema,
  ValidationRuleSchema,
  InspectorFieldSchema,
  ComponentDefinitionSchema,
  type ComponentNodeValidation,
} from './components';

// Export project and page-related schemas
export {
  PageMetadataSchema,
  PageSettingsSchema,
  PageSchema,
  ThemeColorsSchema,
  ThemeTypographySchema,
  ThemeSpacingSchema,
  ThemeBorderRadiusSchema,
  ThemeShadowsSchema,
  ThemeBreakpointsSchema,
  ThemeSchema,
  AssetTypeSchema,
  AssetMetadataSchema,
  AssetSchema,
  ProjectSettingsSchema,
  ProjectMetadataSchema,
  ProjectSchema,
} from './project';

// Export editor and plugin-related schemas
export {
  CommandSchema,
  HistoryStateSchema,
  SelectionStateSchema,
  EditorStateSchema,
  PluginHooksSchema,
  PluginContextSchema,
  PluginSchema,
  ExportOptionsSchema,
  ExportResultSchema,
} from './editor';

// Export basic schemas
export const BreakpointSchema = z.enum(['mobile', 'tablet', 'desktop', 'wide']);
export const ResponsiveStylesSchema = z
  .record(BreakpointSchema, z.record(z.string(), z.union([z.string(), z.number()])))
  .optional();
