/**
 * Base Adapter
 *
 * Abstract base class for all export adapters providing common functionality
 * and enforcing a consistent interface across all export formats.
 */

import {
  Project,
  Page,
  ComponentNode,
  ExportResult,
  ExportOptions,
  Theme,
  Asset,
} from '@wysiwyg/core';
import { ExportContext, ExportedAsset, ExportedStyle } from '../types';

export abstract class BaseAdapter {
  /**
   * Export format identifier
   */
  abstract readonly format: string;

  /**
   * Export a complete project
   */
  abstract exportProject(project: Project, options?: ExportOptions): Promise<ExportResult>;

  /**
   * Export a single page
   */
  abstract exportPage(page: Page, options?: ExportOptions): Promise<ExportResult>;

  /**
   * Export a single component
   */
  abstract exportComponent(
    component: ComponentNode,
    options?: ExportOptions
  ): Promise<ExportResult>;

  /**
   * Validate export options
   */
  abstract validateOptions(options: ExportOptions): boolean;

  /**
   * Create export context
   */
  protected createContext(project: Project, options?: ExportOptions): ExportContext {
    return {
      project,
      config: {
        format: this.format as any,
        includeSourceMaps: options?.includeSourceMaps ?? false,
        minify: options?.minify ?? false,
        optimizeAssets: options?.optimizeAssets ?? false,
        customExportPath: options?.customOptions?.customExportPath as string | undefined,
      },
      assets: [],
      styles: [],
    };
  }

  /**
   * Process assets for export
   */
  protected async processAssets(assets: Asset[], context: ExportContext): Promise<ExportedAsset[]> {
    const exportedAssets: ExportedAsset[] = [];

    for (const asset of assets) {
      const exportedAsset: ExportedAsset = {
        id: asset.id,
        url: asset.url,
        type: asset.type,
        path: this.getAssetPath(asset, context),
        size: asset.size,
      };

      if (context.config.optimizeAssets) {
        exportedAsset.path = await this.optimizeAsset(exportedAsset);
      }

      exportedAssets.push(exportedAsset);
    }

    context.assets = exportedAssets;
    return exportedAssets;
  }

  /**
   * Get asset export path
   */
  protected getAssetPath(asset: Asset, context: ExportContext): string {
    const basePath = context.config.customExportPath || 'assets';
    return `${basePath}/${asset.type}s/${asset.name}`;
  }

  /**
   * Optimize asset (to be implemented by subclasses)
   */
  protected async optimizeAsset(asset: ExportedAsset): Promise<string> {
    // Default implementation returns original path
    return asset.path;
  }

  /**
   * Generate responsive styles
   */
  protected generateResponsiveStyles(component: ComponentNode, context: ExportContext): string {
    if (!component.responsiveStyles) return '';

    const responsiveClasses: string[] = [];

    Object.entries(component.responsiveStyles).forEach(([breakpoint, styles]) => {
      const className = this.generateResponsiveClassName(component, breakpoint);
      const styleContent = this.generateStyleString(styles);
      responsiveClasses.push(`
@media (${this.getBreakpointQuery(breakpoint)}) {
  .${className} {
    ${styleContent}
  }
}`);
    });

    return responsiveClasses.join('\n');
  }

  /**
   * Generate responsive class name
   */
  protected generateResponsiveClassName(component: ComponentNode, breakpoint: string): string {
    return `${component.type}-${component.id}-${breakpoint}`;
  }

  /**
   * Get media query for breakpoint
   */
  protected getBreakpointQuery(breakpoint: string): string {
    const queries: Record<string, string> = {
      mobile: 'max-width: 640px',
      tablet: 'min-width: 641px and max-width: 1024px',
      desktop: 'min-width: 1025px and max-width: 1440px',
      wide: 'min-width: 1441px',
    };
    return queries[breakpoint] || '';
  }

  /**
   * Convert style object to CSS string
   */
  protected generateStyleString(styles: Record<string, string | number>): string {
    return Object.entries(styles)
      .map(([key, value]) => `  ${this.camelToKebab(key)}: ${value};`)
      .join('\n');
  }

  /**
   * Convert camelCase to kebab-case
   */
  protected camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Convert string to PascalCase
   */
  protected toPascalCase(str: string): string {
    return str
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/\s+/g, '');
  }

  /**
   * Generate theme styles
   */
  protected generateThemeStyles(theme: Theme): string {
    const styles: string[] = [];

    // Colors
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([name, value]) => {
        if (typeof value === 'string') {
          styles.push(`  --color-${this.camelToKebab(name)}: ${value};`);
        }
      });
    }

    // Typography
    if (theme.typography) {
      if (theme.typography.fontFamily) {
        Object.entries(theme.typography.fontFamily).forEach(([name, value]) => {
          styles.push(`  --font-${name}: ${value};`);
        });
      }
      if (theme.typography.fontSize) {
        Object.entries(theme.typography.fontSize).forEach(([name, value]) => {
          styles.push(`  --text-${name}: ${value};`);
        });
      }
      if (theme.typography.fontWeight) {
        Object.entries(theme.typography.fontWeight).forEach(([name, value]) => {
          styles.push(`  --font-weight-${name}: ${value};`);
        });
      }
    }

    // Spacing
    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([name, value]) => {
        styles.push(`  --spacing-${name}: ${value};`);
      });
    }

    // Border radius
    if (theme.borderRadius) {
      Object.entries(theme.borderRadius).forEach(([name, value]) => {
        styles.push(`  --radius-${name}: ${value};`);
      });
    }

    // Shadows
    if (theme.shadows) {
      Object.entries(theme.shadows).forEach(([name, value]) => {
        styles.push(`  --shadow-${name}: ${value};`);
      });
    }

    return `:root {\n${styles.join('\n')}\n}`;
  }

  /**
   * Handle export error
   */
  protected handleError(error: unknown): ExportResult {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
