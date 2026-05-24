/**
 * Core Types for WYSIWYG Visual Component Builder
 *
 * This module exports all types used throughout the platform.
 * Types are organized into separate modules for better maintainability.
 */

// Export common types
export type { UnknownRecord, InspectorOption, ValidationFunction, ExportData } from './common';

// Export component-related types
export type {
  ComponentProps,
  ComponentNode,
  ComponentMetadata,
  InspectorFieldType,
  InspectorField,
  ValidationRule,
  ComponentDefinition,
} from './components';

// Export project and page-related types
export type {
  Page,
  PageMetadata,
  PageSettings,
  Project,
  Theme,
  ThemeColors,
  ThemeTypography,
  ThemeSpacing,
  ThemeBorderRadius,
  ThemeShadows,
  ThemeBreakpoints,
  ProjectSettings,
  ProjectMetadata,
  ExportSettings,
  Asset,
  AssetMetadata,
} from './project';

// Export editor and plugin-related types
export type {
  RendererContext,
  Command,
  HistoryState,
  SelectionState,
  EditorState,
  Plugin,
  PluginContext,
  PluginHooks,
  ExportResult,
  ExportOptions,
} from './editor';

// Export basic types
export type ComponentId = string;
export type ComponentType = string;
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

// Export style-related types
export type StyleProperty =
  | 'paddingTop'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'marginTop'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginRight'
  | 'backgroundColor'
  | 'color'
  | 'fontSize'
  | 'fontWeight'
  | 'lineHeight'
  | 'textAlign'
  | 'borderRadius'
  | 'borderWidth'
  | 'borderColor'
  | 'borderStyle'
  | 'boxShadow'
  | 'opacity'
  | 'display'
  | 'flexDirection'
  | 'justifyContent'
  | 'alignItems'
  | 'gap'
  | 'gridTemplateColumns'
  | 'gridTemplateRows'
  | 'width'
  | 'height'
  | 'maxWidth'
  | 'minWidth'
  | 'maxHeight'
  | 'minHeight'
  | 'position'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'zIndex';

export type StyleValue = string | number;
export type StyleObject = Partial<Record<StyleProperty, StyleValue>>;
export type ResponsiveStyles = Partial<Record<Breakpoint, StyleObject>>;
