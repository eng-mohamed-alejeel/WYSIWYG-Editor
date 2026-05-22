/**
 * Validation Schemas using Zod
 * 
 * This module provides validation schemas for all data structures
 * used throughout the platform.
 */

import { z } from 'zod';

/**
 * Component ID validation
 */
export const ComponentIdSchema = z.string().min(1);

/**
 * Component Type validation
 */
export const ComponentTypeSchema = z.string().min(1);

/**
 * Breakpoint validation
 */
export const BreakpointSchema = z.enum(['mobile', 'tablet', 'desktop', 'wide']);

/**
 * Style Property validation
 */
export const StylePropertySchema = z.enum([
  'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'backgroundColor', 'color', 'fontSize', 'fontWeight',
  'lineHeight', 'textAlign', 'borderRadius', 'borderWidth',
  'borderColor', 'borderStyle', 'boxShadow', 'opacity',
  'display', 'flexDirection', 'justifyContent', 'alignItems',
  'gap', 'gridTemplateColumns', 'gridTemplateRows',
  'width', 'height', 'maxWidth', 'minWidth', 'maxHeight', 'minHeight',
  'position', 'top', 'right', 'bottom', 'left', 'zIndex'
]);

/**
 * Style Value validation
 */
export const StyleValueSchema = z.union([z.string(), z.number()]);

/**
 * Style Object validation
 */
export const StyleObjectSchema = z.record(StylePropertySchema, StyleValueSchema);

/**
 * Responsive Styles validation
 */
export const ResponsiveStylesSchema = z.record(BreakpointSchema, StyleObjectSchema).optional();

/**
 * Component Props validation
 */
export const ComponentPropsSchema = z.record(z.string(), z.any());

/**
 * Component Metadata validation
 */
export const ComponentMetadataSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  locked: z.boolean().optional(),
  visible: z.boolean().optional(),
  customData: z.record(z.string(), z.any()).optional()
}).optional();

/**
 * Component Node validation
 */
export const ComponentNodeSchema = z.object({
  id: ComponentIdSchema,
  type: ComponentTypeSchema,
  props: ComponentPropsSchema,
  styles: StyleObjectSchema,
  responsiveStyles: ResponsiveStylesSchema,
  children: z.array(z.lazy(() => ComponentNodeSchema)),
  metadata: ComponentMetadataSchema
});

export type ComponentNodeValidation = z.infer<typeof ComponentNodeSchema>;

/**
 * Inspector Field Type validation
 */
export const InspectorFieldTypeSchema = z.enum([
  'text', 'number', 'color', 'select', 'multiselect',
  'boolean', 'image', 'link', 'richtext', 'code',
  'array', 'object', 'style'
]);

/**
 * Validation Rule validation
 */
export const ValidationRuleSchema = z.object({
  type: z.enum(['required', 'min', 'max', 'pattern', 'custom']),
  value: z.any().optional(),
  message: z.string(),
  validator: z.function().optional()
});

/**
 * Inspector Field validation
 */
export const InspectorFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: InspectorFieldTypeSchema,
  defaultValue: z.any().optional(),
  options: z.array(z.object({
    label: z.string(),
    value: z.any()
  })).optional(),
  validation: z.array(ValidationRuleSchema).optional(),
  group: z.string().optional(),
  visible: z.boolean().optional(),
  disabled: z.boolean().optional(),
  placeholder: z.string().optional(),
  helpText: z.string().optional()
});

/**
 * Component Definition validation
 */
export const ComponentDefinitionSchema = z.object({
  type: ComponentTypeSchema,
  label: z.string(),
  icon: z.string(),
  category: z.string(),
  defaultProps: ComponentPropsSchema,
  defaultStyles: StyleObjectSchema,
  defaultResponsiveStyles: ResponsiveStylesSchema,
  allowedChildren: z.array(ComponentTypeSchema).optional(),
  allowedParents: z.array(ComponentTypeSchema).optional(),
  inspector: z.array(InspectorFieldSchema),
  isContainer: z.boolean().optional(),
  isVoid: z.boolean().optional()
});

/**
 * Page Metadata validation
 */
export const PageMetadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  author: z.string().optional(),
  customData: z.record(z.string(), z.any()).optional()
});

/**
 * Page Settings validation
 */
export const PageSettingsSchema = z.object({
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional()
  }).optional(),
  customHead: z.string().optional(),
  customBody: z.string().optional()
});

/**
 * Page validation
 */
export const PageSchema = z.object({
  id: ComponentIdSchema,
  name: z.string(),
  slug: z.string(),
  components: z.array(z.lazy(() => ComponentNodeSchema)),
  metadata: PageMetadataSchema,
  settings: PageSettingsSchema
});

/**
 * Theme Colors validation
 */
export const ThemeColorsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  foreground: z.string(),
  success: z.string(),
  warning: z.string(),
  error: z.string(),
  info: z.string(),
  custom: z.record(z.string(), z.string()).optional()
});

/**
 * Theme Typography validation
 */
export const ThemeTypographySchema = z.object({
  fontFamily: z.object({
    heading: z.string(),
    body: z.string(),
    mono: z.string()
  }),
  fontSize: z.object({
    xs: z.string(),
    sm: z.string(),
    base: z.string(),
    lg: z.string(),
    xl: z.string(),
    '2xl': z.string(),
    '3xl': z.string(),
    '4xl': z.string()
  }),
  fontWeight: z.object({
    light: z.number(),
    normal: z.number(),
    medium: z.number(),
    semibold: z.number(),
    bold: z.number()
  }),
  lineHeight: z.object({
    tight: z.number(),
    normal: z.number(),
    relaxed: z.number()
  })
});

/**
 * Theme Spacing validation
 */
export const ThemeSpacingSchema = z.object({
  xs: z.string(),
  sm: z.string(),
  md: z.string(),
  lg: z.string(),
  xl: z.string(),
  '2xl': z.string()
});

/**
 * Theme Border Radius validation
 */
export const ThemeBorderRadiusSchema = z.object({
  none: z.string(),
  sm: z.string(),
  md: z.string(),
  lg: z.string(),
  xl: z.string(),
  full: z.string()
});

/**
 * Theme Shadows validation
 */
export const ThemeShadowsSchema = z.object({
  sm: z.string(),
  md: z.string(),
  lg: z.string(),
  xl: z.string()
});

/**
 * Theme Breakpoints validation
 */
export const ThemeBreakpointsSchema = z.object({
  mobile: z.string(),
  tablet: z.string(),
  desktop: z.string(),
  wide: z.string()
});

/**
 * Theme validation
 */
export const ThemeSchema = z.object({
  id: ComponentIdSchema,
  name: z.string(),
  colors: ThemeColorsSchema,
  typography: ThemeTypographySchema,
  spacing: ThemeSpacingSchema,
  borderRadius: ThemeBorderRadiusSchema,
  shadows: ThemeShadowsSchema,
  breakpoints: ThemeBreakpointsSchema,
  customTokens: z.record(z.string(), z.any()).optional()
});

/**
 * Asset Type validation
 */
export const AssetTypeSchema = z.enum(['image', 'video', 'audio', 'font', 'file', 'code']);

/**
 * Asset Metadata validation
 */
export const AssetMetadataSchema = z.object({
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  customData: z.record(z.string(), z.any()).optional()
}).optional();

/**
 * Asset validation
 */
export const AssetSchema = z.object({
  id: ComponentIdSchema,
  name: z.string(),
  type: AssetTypeSchema,
  url: z.string(),
  size: z.number(),
  mimeType: z.string().optional(),
  metadata: AssetMetadataSchema
});

/**
 * Project Settings validation
 */
export const ProjectSettingsSchema = z.object({
  defaultBreakpoint: BreakpointSchema,
  enableAiFeatures: z.boolean(),
  enableAnalytics: z.boolean(),
  customScripts: z.array(z.string()).optional(),
  customStyles: z.string().optional()
});

/**
 * Project Metadata validation
 */
export const ProjectMetadataSchema = z.object({
  version: z.string(),
  platform: z.enum(['odoo', 'wordpress', 'nextjs', 'html']).optional(),
  exportSettings: z.object({
    format: z.enum(['html', 'react', 'wordpress', 'odoo']),
    optimizeAssets: z.boolean(),
    minify: z.boolean(),
    includeSourceMaps: z.boolean(),
    customExportPath: z.string().optional()
  }).optional()
});

/**
 * Project validation
 */
export const ProjectSchema = z.object({
  id: ComponentIdSchema,
  name: z.string(),
  description: z.string().optional(),
  pages: z.array(PageSchema),
  theme: ThemeSchema,
  assets: z.array(AssetSchema),
  settings: ProjectSettingsSchema,
  metadata: ProjectMetadataSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

/**
 * Command validation
 */
export const CommandSchema = z.object({
  type: z.string(),
  execute: z.function(),
  undo: z.function(),
  description: z.string().optional(),
  timestamp: z.number()
});

/**
 * History State validation
 */
export const HistoryStateSchema = z.object({
  past: z.array(CommandSchema),
  present: CommandSchema.nullable(),
  future: z.array(CommandSchema),
  maxSize: z.number()
});

/**
 * Selection State validation
 */
export const SelectionStateSchema = z.object({
  selectedIds: z.array(ComponentIdSchema),
  hoveredId: ComponentIdSchema.nullable(),
  focusedId: ComponentIdSchema.nullable()
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
  currentBreakpoint: BreakpointSchema,
  zoom: z.number(),
  clipboard: z.array(ComponentNodeSchema)
});

/**
 * Plugin Hooks validation
 */
export const PluginHooksSchema = z.object({
  onProjectLoad: z.function().optional(),
  onProjectSave: z.function().optional(),
  onComponentSelect: z.function().optional(),
  onComponentUpdate: z.function().optional(),
  onComponentDelete: z.function().optional(),
  onExport: z.function().optional()
}).optional();

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
  redo: z.function()
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
  hooks: PluginHooksSchema
});

/**
 * Export Options validation
 */
export const ExportOptionsSchema = z.object({
  format: z.enum(['html', 'react', 'wordpress', 'odoo']),
  optimizeAssets: z.boolean(),
  minify: z.boolean(),
  includeSourceMaps: z.boolean(),
  customOptions: z.record(z.string(), z.any()).optional()
});

/**
 * Export Result validation
 */
export const ExportResultSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  warnings: z.array(z.string()).optional()
});
