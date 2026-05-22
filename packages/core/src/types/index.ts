/**
 * Core Types for WYSIWYG Visual Component Builder
 * 
 * This module defines the fundamental type system used throughout the platform.
 * All component definitions, state structures, and data models are typed here.
 */

/**
 * Unique identifier for components, pages, and other entities
 */
export type ComponentId = string;

/**
 * Component type identifier used in the component registry
 */
export type ComponentType = string;

/**
 * Breakpoint identifiers for responsive design
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

/**
 * Style property names
 */
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

/**
 * Style value type
 */
export type StyleValue = string | number;

/**
 * Style object mapping properties to values
 */
export type StyleObject = Partial<Record<StyleProperty, StyleValue>>;

/**
 * Responsive style mapping
 */
export type ResponsiveStyles = Partial<Record<Breakpoint, StyleObject>>;

/**
 * Component properties interface
 */
export interface ComponentProps {
  [key: string]: any;
}

/**
 * Component node in the JSON tree
 */
export interface ComponentNode {
  id: ComponentId;
  type: ComponentType;
  props: ComponentProps;
  styles: StyleObject;
  responsiveStyles?: ResponsiveStyles;
  children: ComponentNode[];
  metadata?: ComponentMetadata;
}

/**
 * Renderer context interface
 */
export interface RendererContext {
  isEditable: boolean;
  isPreview: boolean;
}

/**
 * Command interface for undo/redo functionality
 */
export interface Command {
  type: string;
  timestamp: number;
  execute(): void;
  undo(): void;
  description?: string;
}

/**
 * Component metadata
 */
export interface ComponentMetadata {
  name?: string;
  description?: string;
  tags?: string[];
  category?: string;
  locked?: boolean;
  visible?: boolean;
  customData?: Record<string, any>;
}

/**
 * Component definition for the registry
 */
export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  icon: string;
  category: string;
  defaultProps: ComponentProps;
  defaultStyles: StyleObject;
  defaultResponsiveStyles?: ResponsiveStyles;
  allowedChildren?: ComponentType[];
  allowedParents?: ComponentType[];
  inspector: InspectorField[];
  isContainer?: boolean;
  isVoid?: boolean;
}

/**
 * Inspector field types
 */
export type InspectorFieldType =
  | 'text'
  | 'number'
  | 'color'
  | 'select'
  | 'multiselect'
  | 'boolean'
  | 'image'
  | 'link'
  | 'richtext'
  | 'code'
  | 'array'
  | 'object'
  | 'style';

/**
 * Inspector field definition
 */
export interface InspectorField {
  name: string;
  label: string;
  type: InspectorFieldType;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  validation?: ValidationRule[];
  group?: string;
  visible?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helpText?: string;
}

/**
 * Validation rule for inspector fields
 */
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

/**
 * Page definition
 */
export interface Page {
  id: ComponentId;
  name: string;
  slug: string;
  components: ComponentNode[];
  metadata: PageMetadata;
  settings: PageSettings;
}

/**
 * Page metadata
 */
export interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  customData?: Record<string, any>;
}

/**
 * Page settings
 */
export interface PageSettings {
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  customHead?: string;
  customBody?: string;
}

/**
 * Project definition
 */
export interface Project {
  id: ComponentId;
  name: string;
  description?: string;
  pages: Page[];
  theme: Theme;
  assets: Asset[];
  settings: ProjectSettings;
  metadata: ProjectMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Theme definition
 */
export interface Theme {
  id: ComponentId;
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  breakpoints: ThemeBreakpoints;
  customTokens?: Record<string, any>;
}

/**
 * Theme colors
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  custom?: Record<string, string>;
}

/**
 * Theme typography
 */
export interface ThemeTypography {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

/**
 * Theme spacing
 */
export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

/**
 * Theme border radius
 */
export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

/**
 * Theme shadows
 */
export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

/**
 * Theme breakpoints
 */
export interface ThemeBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  wide: string;
}

/**
 * Project settings
 */
export interface ProjectSettings {
  defaultBreakpoint: Breakpoint;
  enableAiFeatures: boolean;
  enableAnalytics: boolean;
  customScripts?: string[];
  customStyles?: string;
}

/**
 * Project metadata
 */
export interface ProjectMetadata {
  version: string;
  platform?: 'odoo' | 'wordpress' | 'nextjs' | 'html';
  exportSettings?: ExportSettings;
}

/**
 * Export settings
 */
export interface ExportSettings {
  format: 'html' | 'react' | 'wordpress' | 'odoo';
  optimizeAssets: boolean;
  minify: boolean;
  includeSourceMaps: boolean;
  customExportPath?: string;
}

/**
 * Asset definition
 */
export interface Asset {
  id: ComponentId;
  name: string;
  type: 'image' | 'video' | 'audio' | 'font' | 'file' | 'code';
  url: string;
  size: number;
  mimeType?: string;
  metadata?: AssetMetadata;
}

/**
 * Asset metadata
 */
export interface AssetMetadata {
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  customData?: Record<string, any>;
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
  selectedIds: ComponentId[];
  hoveredId: ComponentId | null;
  focusedId: ComponentId | null;
}

/**
 * Editor state
 */
export interface EditorState {
  project: Project | null;
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
  onComponentSelect?: (componentId: ComponentId) => void;
  onComponentUpdate?: (componentId: ComponentId) => void;
  onComponentDelete?: (componentId: ComponentId) => void;
  onExport?: (format: string, data: any) => void;
}

/**
 * Export result
 */
export interface ExportResult {
  success: boolean;
  data?: any;
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
  customOptions?: Record<string, any>;
}
