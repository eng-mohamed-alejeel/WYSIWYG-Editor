/**
 * Component Types for WYSIWYG Visual Component Builder
 *
 * This module defines component-related types.
 */

import { UnknownRecord, InspectorOption, ValidationFunction } from './common';

/**
 * Component properties interface
 */
export interface ComponentProps {
  [key: string]: unknown;
}

/**
 * Component node in the JSON tree
 */
export interface ComponentNode {
  id: string;
  type: string;
  props: ComponentProps;
  styles: Partial<Record<string, string | number>>;
  responsiveStyles?: Partial<Record<string, Partial<Record<string, string | number>>>>;
  children: ComponentNode[];
  metadata?: ComponentMetadata;
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
  customData?: UnknownRecord;
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
  defaultValue?: unknown;
  options?: InspectorOption[];
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
  value?: unknown;
  message: string;
  validator?: ValidationFunction;
}

/**
 * Component definition for the registry
 */
export interface ComponentDefinition {
  type: string;
  label: string;
  icon: string;
  category: string;
  defaultProps: ComponentProps;
  defaultStyles: Partial<Record<string, string | number>>;
  defaultResponsiveStyles?: Partial<Record<string, Partial<Record<string, string | number>>>>;
  allowedChildren?: string[];
  allowedParents?: string[];
  inspector: InspectorField[];
  isContainer?: boolean;
  isVoid?: boolean;
}
