/**
 * Exporter Types
 *
 * This module defines the types used by the export system.
 */

import { Project, Page, ComponentNode, ExportResult, ExportOptions } from '@wysiwyg/core';

/**
 * Export format type
 */
export type ExportFormat = 'html' | 'react' | 'nextjs' | 'tailwind' | 'wordpress' | 'odoo';

/**
 * Exporter interface
 */
export interface Exporter {
  /**
   * Export format
   */
  format: ExportFormat;

  /**
   * Export a project
   */
  exportProject(project: Project, options?: ExportOptions): Promise<ExportResult>;

  /**
   * Export a page
   */
  exportPage(page: Page, options?: ExportOptions): Promise<ExportResult>;

  /**
   * Export a component
   */
  exportComponent(component: ComponentNode, options?: ExportOptions): Promise<ExportResult>;

  /**
   * Validate export options
   */
  validateOptions(options: ExportOptions): boolean;
}

/**
 * Export configuration
 */
export interface ExportConfig {
  /**
   * Output directory
   */
  outputDir?: string;

  /**
   * Include source maps
   */
  includeSourceMaps?: boolean;

  /**
   * Minify output
   */
  minify?: boolean;

  /**
   * Optimize assets
   */
  optimizeAssets?: boolean;

  /**
   * Custom export path
   */
  customExportPath?: string;

  /**
   * Export format
   */
  format: ExportFormat;
}

/**
 * Export context
 */
export interface ExportContext {
  /**
   * Project being exported
   */
  project: Project;

  /**
   * Current page being exported
   */
  currentPage?: Page;

  /**
   * Export configuration
   */
  config: ExportConfig;

  /**
   * Exported assets
   */
  assets: ExportedAsset[];

  /**
   * Exported styles
   */
  styles: ExportedStyle[];
}

/**
 * Exported asset
 */
export interface ExportedAsset {
  /**
   * Asset ID
   */
  id: string;

  /**
   * Asset URL
   */
  url: string;

  /**
   * Asset type
   */
  type: 'image' | 'video' | 'audio' | 'font' | 'file';

  /**
   * Export path
   */
  path: string;

  /**
   * Asset size
   */
  size?: number;
}

/**
 * Exported style
 */
export interface ExportedStyle {
  /**
   * Style ID
   */
  id: string;

  /**
   * Style content
   */
  content: string;

  /**
   * Style type
   */
  type: 'css' | 'scss' | 'less';

  /**
   * Scope (global or component-specific)
   */
  scope: 'global' | 'component';
}
