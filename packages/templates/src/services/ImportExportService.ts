/**
 * Import/Export Service
 *
 * Handles template data serialization and deserialization,
 * supporting multiple formats and optimization options.
 */

import type {
  Template,
  Section,
  ReusableComponent,
  TemplateImportOptions,
  TemplateExportOptions,
} from '../types';

export class ImportExportService {
  private static instance: ImportExportService;

  private constructor() {}

  public static getInstance(): ImportExportService {
    if (!ImportExportService.instance) {
      ImportExportService.instance = new ImportExportService();
    }
    return ImportExportService.instance;
  }

  /**
   * Import a template from data
   */
  public async importTemplate(data: any, options?: TemplateImportOptions): Promise<Template> {
    // Parse JSON if string
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

    // Validate basic structure
    if (!parsedData.metadata || !parsedData.content) {
      throw new Error('Invalid template structure: missing metadata or content');
    }

    // Generate new IDs if not preserving
    const template: Template = {
      ...parsedData,
      metadata: {
        ...parsedData.metadata,
        id: options?.preserveIds ? parsedData.metadata.id : crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      content: {
        ...parsedData.content,
        pages: options?.preserveIds
          ? parsedData.content.pages
          : parsedData.content.pages.map((page: any) => ({
              ...page,
              id: crypto.randomUUID(),
              components: this.regenerateComponentIds(page.components),
            })),
        theme: parsedData.content.theme,
        assets: parsedData.content.assets || [],
      },
    };

    return template;
  }

  /**
   * Export a template to specified format
   */
  public async exportTemplate(template: Template, options?: TemplateExportOptions): Promise<any> {
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      template: options?.minify ? JSON.stringify(template) : template,
      includeAssets: options?.includeAssets ?? true,
      includeTheme: options?.includeTheme ?? true,
    };

    if (options?.format === 'zip') {
      // In a real implementation, you would use a library like JSZip
      // to create a ZIP file containing the template and assets
      return {
        ...exportData,
        format: 'zip',
        // Add ZIP file creation logic here
      };
    }

    return exportData;
  }

  /**
   * Import a section from data
   */
  public async importSection(data: any, options?: TemplateImportOptions): Promise<Section> {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

    if (!parsedData.metadata || !parsedData.content) {
      throw new Error('Invalid section structure: missing metadata or content');
    }

    const section: Section = {
      ...parsedData,
      metadata: {
        ...parsedData.metadata,
        id: options?.preserveIds ? parsedData.metadata.id : crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      content: {
        ...parsedData.content,
        components: options?.preserveIds
          ? parsedData.content.components
          : this.regenerateComponentIds(parsedData.content.components),
      },
    };

    return section;
  }

  /**
   * Export a section to specified format
   */
  public async exportSection(section: Section, options?: TemplateExportOptions): Promise<any> {
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      section: options?.minify ? JSON.stringify(section) : section,
    };

    if (options?.format === 'zip') {
      return {
        ...exportData,
        format: 'zip',
      };
    }

    return exportData;
  }

  /**
   * Import a reusable component from data
   */
  public async importReusableComponent(
    data: any,
    options?: TemplateImportOptions
  ): Promise<ReusableComponent> {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

    if (!parsedData.metadata || !parsedData.content) {
      throw new Error('Invalid component structure: missing metadata or content');
    }

    const component: ReusableComponent = {
      ...parsedData,
      metadata: {
        ...parsedData.metadata,
        id: options?.preserveIds ? parsedData.metadata.id : crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      content: options?.preserveIds
        ? parsedData.content
        : this.regenerateComponentIds([parsedData.content])[0],
    };

    return component;
  }

  /**
   * Export a reusable component to specified format
   */
  public async exportReusableComponent(
    component: ReusableComponent,
    options?: TemplateExportOptions
  ): Promise<any> {
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      component: options?.minify ? JSON.stringify(component) : component,
    };

    if (options?.format === 'zip') {
      return {
        ...exportData,
        format: 'zip',
      };
    }

    return exportData;
  }

  /**
   * Import from file
   */
  public async importFromFile(file: File): Promise<Template | Section | ReusableComponent> {
    const content = await file.text();
    const data = JSON.parse(content);

    // Determine type based on structure
    if (data.template) {
      return this.importTemplate(data.template);
    } else if (data.section) {
      return this.importSection(data.section);
    } else if (data.component) {
      return this.importReusableComponent(data.component);
    } else {
      // Try to determine from structure
      if (data.content?.pages) {
        return this.importTemplate(data);
      } else if (data.content?.components) {
        return this.importSection(data);
      } else if (data.content && !data.content.pages && !data.content.components) {
        return this.importReusableComponent(data);
      } else {
        throw new Error('Unknown file format');
      }
    }
  }

  /**
   * Export to file
   */
  public async exportToFile(
    item: Template | Section | ReusableComponent,
    filename: string,
    options?: TemplateExportOptions
  ): Promise<Blob> {
    let exportData: any;

    if ('pages' in item.content) {
      exportData = await this.exportTemplate(item, options);
    } else if ('components' in item.content) {
      exportData = await this.exportSection(item, options);
    } else {
      exportData = await this.exportReusableComponent(item, options);
    }

    const jsonString = JSON.stringify(exportData, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  }

  /**
   * Download export as file
   */
  public downloadExport(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Validate export data
   */
  public validateExportData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('Export data is empty');
      return { valid: false, errors };
    }

    if (!data.version) {
      errors.push('Export data is missing version');
    }

    if (!data.exportedAt) {
      errors.push('Export data is missing export timestamp');
    }

    if (!data.template && !data.section && !data.component) {
      errors.push('Export data must contain template, section, or component');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Optimize template for export
   */
  public optimizeTemplate(template: Template): Template {
    return {
      ...template,
      content: {
        ...template.content,
        assets: template.content.assets.filter((asset) => asset.url && asset.url.length > 0),
      },
      // Remove any temporary or debug data
      metadata: {
        ...template.metadata,
        customData: this.cleanCustomData(template.metadata.customData),
      },
    };
  }

  /**
   * Compress export data
   */
  public async compressData(data: any): Promise<string> {
    // In a real implementation, you would use a compression library
    // like pako or lz-string
    return JSON.stringify(data);
  }

  /**
   * Decompress import data
   */
  public async decompressData(compressed: string): Promise<any> {
    // In a real implementation, you would use a compression library
    // like pako or lz-string
    return JSON.parse(compressed);
  }

  // Private helper methods

  private regenerateComponentIds(components: any[]): any[] {
    return components.map((component) => ({
      ...component,
      id: crypto.randomUUID(),
      children: component.children ? this.regenerateComponentIds(component.children) : [],
    }));
  }

  private cleanCustomData(customData?: Record<string, any>): Record<string, any> | undefined {
    if (!customData) {
      return undefined;
    }

    const cleaned: Record<string, any> = {};
    const excludeKeys = ['temp', 'debug', 'internal', '_'];

    Object.entries(customData).forEach(([key, value]) => {
      if (!excludeKeys.some((exclude) => key.startsWith(exclude))) {
        cleaned[key] = value;
      }
    });

    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }
}
