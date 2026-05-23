/**
 * Inspector Engine Types
 *
 * Comprehensive type definitions for the schema-driven inspector system
 */

import { ComponentNode, ComponentId, Breakpoint, StyleProperty } from '@wysiwyg/core';

/**
 * All supported inspector field types
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
  | 'style'
  | 'spacing'
  | 'typography'
  | 'shadow'
  | 'gradient'
  | 'responsive';

/**
 * Validation rule types
 */
export type ValidationRuleType =
  | 'required'
  | 'min'
  | 'max'
  | 'pattern'
  | 'custom'
  | 'minLength'
  | 'maxLength';

/**
 * Validation rule definition
 */
export interface ValidationRule {
  type: ValidationRuleType;
  value?: any;
  message: string;
  validator?: (value: any, formData?: Record<string, any>) => boolean;
}

/**
 * Conditional field visibility logic
 */
export interface ConditionalField {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin' | 'contains';
  value: any;
}

/**
 * Inspector field definition
 */
export interface InspectorField {
  name: string;
  label: string;
  type: InspectorFieldType;
  defaultValue?: any;
  options?: Array<{ label: string; value: any; icon?: React.ReactNode; disabled?: boolean }>;
  validation?: ValidationRule[];
  group?: string;
  section?: string;
  visible?: boolean | ConditionalField[];
  disabled?: boolean | ConditionalField[];
  placeholder?: string;
  helpText?: string;
  icon?: React.ReactNode;
  responsive?: boolean;
  breakpoint?: Breakpoint;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  fields?: InspectorField[]; // For nested objects/arrays
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

/**
 * Inspector section definition
 */
export interface InspectorSection {
  id: string;
  label: string;
  icon?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  fields: InspectorField[];
  order?: number;
}

/**
 * Inspector group definition
 */
export interface InspectorGroup {
  id: string;
  label: string;
  icon?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  sections: InspectorSection[];
  order?: number;
}

/**
 * Complete inspector schema
 */
export interface InspectorSchema {
  groups: InspectorGroup[];
}

/**
 * Form data structure
 */
export interface InspectorFormData {
  [key: string]: any;
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  rule: ValidationRule;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Inspector context
 */
export interface InspectorContext {
  component: ComponentNode;
  schema: InspectorSchema;
  formData: InspectorFormData;
  updateField: (name: string, value: any, breakpoint?: Breakpoint) => void;
  validateField: (name: string) => ValidationResult;
  validateAll: () => ValidationResult;
  currentBreakpoint: Breakpoint;
  isResponsive: boolean;
}

/**
 * Field renderer props
 */
export interface FieldRendererProps {
  field: InspectorField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
  context: InspectorContext;
}

/**
 * Field renderer component
 */
export interface FieldRenderer {
  type: InspectorFieldType;
  component: React.FC<FieldRendererProps>;
}

/**
 * Spacing value structure
 */
export interface SpacingValue {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  unit?: string;
}

/**
 * Typography value structure
 */
export interface TypographyValue {
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  lineHeight?: number | string;
  letterSpacing?: number | string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
}

/**
 * Shadow value structure
 */
export interface ShadowValue {
  color?: string;
  offsetX?: number | string;
  offsetY?: number | string;
  blur?: number | string;
  spread?: number | string;
  inset?: boolean;
}

/**
 * Gradient value structure
 */
export interface GradientValue {
  type: 'linear' | 'radial';
  direction?: number | string;
  colors: Array<{
    color: string;
    position: number;
  }>;
}

/**
 * Responsive value structure
 */
export interface ResponsiveValue<T = any> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

/**
 * Inspector configuration
 */
export interface InspectorConfig {
  enableResponsiveEditing?: boolean;
  enableLivePreview?: boolean;
  enableValidation?: boolean;
  showBreakpoints?: Breakpoint[];
  defaultBreakpoint?: Breakpoint;
  debounceDelay?: number;
  theme?: InspectorTheme;
}

/**
 * Inspector theme
 */
export interface InspectorTheme {
  colors?: {
    primary?: string;
    secondary?: string;
    error?: string;
    warning?: string;
    background?: string;
    border?: string;
    text?: string;
  };
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
}
