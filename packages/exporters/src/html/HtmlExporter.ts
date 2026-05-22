/**
 * HTML Exporter
 *
 * Exports projects to static HTML websites.
 */

import { Project, Page, ComponentNode, ExportResult, ExportOptions } from '@wysiwyg/core';
import { Exporter, ExportContext } from '../types';

export class HtmlExporter implements Exporter {
  format = 'html' as const;

  async exportProject(project: Project, options?: ExportOptions): Promise<ExportResult> {
    try {
      const context: ExportContext = {
        project,
        config: {
          format: 'html',
          includeSourceMaps: options?.includeSourceMaps ?? false,
          minify: options?.minify ?? false,
          optimizeAssets: options?.optimizeAssets ?? false,
          customExportPath: options?.customOptions?.customExportPath
        },
        assets: [],
        styles: []
      };

      // Generate HTML for each page
      const pagesHtml = await Promise.all(
        project.pages.map(page => this.exportPage(page, options))
      );

      const html = this.generateProjectHtml(project, pagesHtml, context);

      return {
        success: true,
        data: {
          html,
          assets: context.assets,
          styles: context.styles
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async exportPage(page: Page, options?: ExportOptions): Promise<ExportResult> {
    try {
      const componentsHtml = await Promise.all(
        page.components.map(component => this.exportComponent(component, options))
      );

      const html = this.generatePageHtml(page, componentsHtml);

      return {
        success: true,
        data: { html }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async exportComponent(component: ComponentNode, options?: ExportOptions): Promise<ExportResult> {
    try {
      const html = this.generateComponentHtml(component);

      return {
        success: true,
        data: { html }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  validateOptions(options: ExportOptions): boolean {
    return options.format === 'html';
  }

  private generateProjectHtml(
    project: Project,
    pagesHtml: ExportResult[],
    context: ExportContext
  ): string {
    const styles = this.generateProjectStyles(project, context);
    const scripts = this.generateProjectScripts(project, context);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  ${pageMetadata(project)}
  ${styles}
</head>
<body>
  ${pagesHtml.map(result => result.data?.html || '').join('')}
  ${scripts}
</body>
</html>`;
  }

  private generatePageHtml(page: Page, componentsHtml: ExportResult[]): string {
    return `<div id="page-${page.id}" class="page">
  ${componentsHtml.map(result => result.data?.html || '').join('')}
</div>`;
  }

  private generateComponentHtml(component: ComponentNode): string {
    const style = this.generateInlineStyles(component.styles);
    const childrenHtml = component.children
      .map(child => this.generateComponentHtml(child))
      .join('');

    return `<div id="${component.id}" class="component component-${component.type}" style="${style}">
  ${childrenHtml}
</div>`;
  }

  private generateInlineStyles(styles: Record<string, any>): string {
    return Object.entries(styles)
      .map(([key, value]) => `${this.camelToKebab(key)}: ${value}`)
      .join('; ');
  }

  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private generateProjectStyles(project: Project, context: ExportContext): string {
    const themeStyles = this.generateThemeStyles(project.theme);
    return `<style>
  ${themeStyles}
</style>`;
  }

  private generateThemeStyles(theme: any): string {
    if (!theme) return '';

    let styles = '';

    if (theme.colors) {
      Object.entries(theme.colors).forEach(([name, value]) => {
        styles += `  --color-${name}: ${value};
`;
      });
    }

    if (theme.typography?.fontFamily) {
      Object.entries(theme.typography.fontFamily).forEach(([name, value]) => {
        styles += `  --font-${name}: ${value};
`;
      });
    }

    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([name, value]) => {
        styles += `  --spacing-${name}: ${value};
`;
      });
    }

    return `:root {
${styles}}`;
  }

  private generateProjectScripts(project: Project, context: ExportContext): string {
    const scripts = project.settings?.customScripts || [];
    return scripts.map(script => `<script>${script}</script>`).join('');
  }
}

function pageMetadata(project: Project): string {
  const metadata = project.pages[0]?.metadata;
  if (!metadata) return '';

  let meta = '';

  if (metadata.title) {
    meta += `  <title>${metadata.title}</title>
`;
  }

  if (metadata.description) {
    meta += `  <meta name="description" content="${metadata.description}">
`;
  }

  if (metadata.keywords && metadata.keywords.length > 0) {
    meta += `  <meta name="keywords" content="${metadata.keywords.join(', ')}">
`;
  }

  return meta;
}
