/**
 * Project and Page Validation Schemas using Zod
 *
 * This module provides validation schemas for project and page-related data structures.
 */

import { z } from 'zod';
import { ComponentIdSchema, ComponentNodeSchema } from './components';

/**
 * Page Metadata validation
 */
export const PageMetadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  author: z.string().optional(),
  customData: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Page Settings validation
 */
export const PageSettingsSchema = z.object({
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
  customHead: z.string().optional(),
  customBody: z.string().optional(),
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
  settings: PageSettingsSchema,
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
  custom: z.record(z.string(), z.string()).optional(),
});

/**
 * Theme Typography validation
 */
export const ThemeTypographySchema = z.object({
  fontFamily: z.object({
    heading: z.string(),
    body: z.string(),
    mono: z.string(),
  }),
  fontSize: z.object({
    xs: z.string(),
    sm: z.string(),
    base: z.string(),
    lg: z.string(),
    xl: z.string(),
    '2xl': z.string(),
    '3xl': z.string(),
    '4xl': z.string(),
  }),
  fontWeight: z.object({
    light: z.number(),
    normal: z.number(),
    medium: z.number(),
    semibold: z.number(),
    bold: z.number(),
  }),
  lineHeight: z.object({
    tight: z.number(),
    normal: z.number(),
    relaxed: z.number(),
  }),
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
  '2xl': z.string(),
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
  full: z.string(),
});

/**
 * Theme Shadows validation
 */
export const ThemeShadowsSchema = z.object({
  sm: z.string(),
  md: z.string(),
  lg: z.string(),
  xl: z.string(),
});

/**
 * Theme Breakpoints validation
 */
export const ThemeBreakpointsSchema = z.object({
  mobile: z.string(),
  tablet: z.string(),
  desktop: z.string(),
  wide: z.string(),
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
  customTokens: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Asset Type validation
 */
export const AssetTypeSchema = z.enum(['image', 'video', 'audio', 'font', 'file', 'code']);

/**
 * Asset Metadata validation
 */
export const AssetMetadataSchema = z
  .object({
    width: z.number().optional(),
    height: z.number().optional(),
    alt: z.string().optional(),
    title: z.string().optional(),
    customData: z.record(z.string(), z.unknown()).optional(),
  })
  .optional();

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
  metadata: AssetMetadataSchema,
});

/**
 * Project Settings validation
 */
export const ProjectSettingsSchema = z.object({
  defaultBreakpoint: z.enum(['mobile', 'tablet', 'desktop', 'wide']),
  enableAiFeatures: z.boolean(),
  enableAnalytics: z.boolean(),
  customScripts: z.array(z.string()).optional(),
  customStyles: z.string().optional(),
});

/**
 * Project Metadata validation
 */
export const ProjectMetadataSchema = z.object({
  version: z.string(),
  platform: z.enum(['odoo', 'wordpress', 'nextjs', 'html']).optional(),
  exportSettings: z
    .object({
      format: z.enum(['html', 'react', 'wordpress', 'odoo']),
      optimizeAssets: z.boolean(),
      minify: z.boolean(),
      includeSourceMaps: z.boolean(),
      customExportPath: z.string().optional(),
    })
    .optional(),
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
  updatedAt: z.string(),
});
