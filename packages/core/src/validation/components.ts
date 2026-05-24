/**
 * Component Validation Schemas using Zod
 *
 * This module provides validation schemas for component-related data structures.
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
 * Style Property validation
 */
export const StylePropertySchema = z.enum([
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'backgroundColor',
  'color',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'textAlign',
  'borderRadius',
  'borderWidth',
  'borderColor',
  'borderStyle',
  'boxShadow',
  'opacity',
  'display',
  'flexDirection',
  'justifyContent',
  'alignItems',
  'gap',
  'gridTemplateColumns',
  'gridTemplateRows',
  'width',
  'height',
  'maxWidth',
  'minWidth',
  'maxHeight',
  'minHeight',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'zIndex',
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
 * Component Props validation
 */
export const ComponentPropsSchema = z.record(z.string(), z.unknown());

/**
 * Component Metadata validation
 */
export const ComponentMetadataSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    locked: z.boolean().optional(),
    visible: z.boolean().optional(),
    customData: z.record(z.string(), z.unknown()).optional(),
  })
  .optional();

/**
 * Component Node validation
 */
export const ComponentNodeSchema: z.ZodTypeAny = z.object({
  id: ComponentIdSchema,
  type: ComponentTypeSchema,
  props: ComponentPropsSchema,
  styles: StyleObjectSchema,
  responsiveStyles: z.record(z.string(), StyleObjectSchema).optional(),
  children: z.array(z.lazy(() => ComponentNodeSchema)),
  metadata: ComponentMetadataSchema,
});

export type ComponentNodeValidation = z.infer<typeof ComponentNodeSchema>;

/**
 * Inspector Field Type validation
 */
export const InspectorFieldTypeSchema = z.enum([
  'text',
  'number',
  'color',
  'select',
  'multiselect',
  'boolean',
  'image',
  'link',
  'richtext',
  'code',
  'array',
  'object',
  'style',
]);

/**
 * Validation Rule validation
 */
export const ValidationRuleSchema = z.object({
  type: z.enum(['required', 'min', 'max', 'pattern', 'custom']),
  value: z.unknown().optional(),
  message: z.string(),
  validator: z.function().optional(),
});

/**
 * Inspector Field validation
 */
export const InspectorFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: InspectorFieldTypeSchema,
  defaultValue: z.unknown().optional(),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.unknown(),
      })
    )
    .optional(),
  validation: z.array(ValidationRuleSchema).optional(),
  group: z.string().optional(),
  visible: z.boolean().optional(),
  disabled: z.boolean().optional(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
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
  defaultResponsiveStyles: z.record(z.string(), StyleObjectSchema).optional(),
  allowedChildren: z.array(ComponentTypeSchema).optional(),
  allowedParents: z.array(ComponentTypeSchema).optional(),
  inspector: z.array(InspectorFieldSchema),
  isContainer: z.boolean().optional(),
  isVoid: z.boolean().optional(),
});
