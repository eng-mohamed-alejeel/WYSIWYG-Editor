/**
 * Project and Page Types for WYSIWYG Visual Component Builder
 *
 * This module defines project and page related types.
 */

import { UnknownRecord } from './common';
import { ComponentNode } from './components';

/**
 * Page definition
 */
export interface Page {
  id: string;
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
  customData?: UnknownRecord;
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
  id: string;
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
  id: string;
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  breakpoints: ThemeBreakpoints;
  customTokens?: UnknownRecord;
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
  defaultBreakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide';
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
  id: string;
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
  customData?: UnknownRecord;
}
