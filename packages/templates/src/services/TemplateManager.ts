/**
 * Template Manager Service
 *
 * Handles business logic for template operations including CRUD,
 * validation, import/export, and preview generation.
 */

import type {
  Template,
  Section,
  ReusableComponent,
  TemplateId,
  SectionId,
  ReusableComponentId,
  TemplateImportOptions,
  TemplateExportOptions,
  TemplateValidationResult,
  ValidationError,
  ValidationWarning,
} from '../types';

export class TemplateManager {
  private static instance: TemplateManager;

  private constructor() {}

  public static getInstance(): TemplateManager {
    if (!TemplateManager.instance) {
      TemplateManager.instance = new TemplateManager();
    }
    return TemplateManager.instance;
  }

  /**
   * Validate a template structure
   */
  public validateTemplate(template: Template): TemplateValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate metadata
    if (!template.metadata) {
      errors.push({
        code: 'MISSING_METADATA',
        message: 'Template metadata is required',
        severity: 'error',
      });
    } else {
      this.validateMetadata(template.metadata, errors, warnings);
    }

    // Validate content
    if (!template.content) {
      errors.push({
        code: 'MISSING_CONTENT',
        message: 'Template content is required',
        severity: 'error',
      });
    } else {
      this.validateTemplateContent(template.content, errors, warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate a section structure
   */
  public validateSection(section: Section): TemplateValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate metadata
    if (!section.metadata) {
      errors.push({
        code: 'MISSING_METADATA',
        message: 'Section metadata is required',
        severity: 'error',
      });
    } else {
      this.validateMetadata(section.metadata, errors, warnings);
    }

    // Validate content
    if (!section.content) {
      errors.push({
        code: 'MISSING_CONTENT',
        message: 'Section content is required',
        severity: 'error',
      });
    } else {
      this.validateSectionContent(section.content, errors, warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate a reusable component structure
   */
  public validateReusableComponent(component: ReusableComponent): TemplateValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate metadata
    if (!component.metadata) {
      errors.push({
        code: 'MISSING_METADATA',
        message: 'Component metadata is required',
        severity: 'error',
      });
    } else {
      this.validateMetadata(component.metadata, errors, warnings);
    }

    // Validate content
    if (!component.content) {
      errors.push({
        code: 'MISSING_CONTENT',
        message: 'Component content is required',
        severity: 'error',
      });
    } else {
      this.validateComponentContent(component.content, errors, warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Import a template from data
   */
  public async importTemplate(data: any, options?: TemplateImportOptions): Promise<Template> {
    const validation = this.validateTemplate(data);

    if (!validation.valid) {
      throw new Error(
        `Template validation failed: ${validation.errors.map((e) => e.message).join(', ')}`
      );
    }

    // Generate new IDs if not preserving
    const template: Template = {
      ...data,
      metadata: {
        ...data.metadata,
        id: options?.preserveIds ? data.metadata.id : crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      content: {
        ...data.content,
        pages: options?.preserveIds
          ? data.content.pages
          : data.content.pages.map((page: any) => ({
              ...page,
              id: crypto.randomUUID(),
              components: this.regenerateComponentIds(page.components),
            })),
        theme: data.content.theme,
        assets: data.content.assets || [],
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
      };
    }

    return exportData;
  }

  /**
   * Generate a preview for a template
   */
  public async generateTemplatePreview(template: Template): Promise<string> {
    // In a real implementation, this would:
    // 1. Render the template in an iframe or canvas
    // 2. Capture a screenshot or generate HTML preview
    // 3. Return the URL or base64 data

    // For now, return a placeholder
    return template.metadata.previewUrls?.[0] || '';
  }

  /**
   * Generate a preview for a section
   */
  public async generateSectionPreview(section: Section): Promise<string> {
    // Similar to template preview generation
    return section.metadata.previewUrls?.[0] || '';
  }

  /**
   * Generate a preview for a reusable component
   */
  public async generateComponentPreview(component: ReusableComponent): Promise<string> {
    // Similar to template preview generation
    return component.metadata.previewUrls?.[0] || '';
  }

  /**
   * Clone a template
   */
  public cloneTemplate(template: Template): Template {
    return {
      ...template,
      metadata: {
        ...template.metadata,
        id: crypto.randomUUID(),
        name: `${template.metadata.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      content: {
        ...template.content,
        pages: template.content.pages.map((page) => ({
          ...page,
          id: crypto.randomUUID(),
          components: this.cloneComponents(page.components),
        })),
      },
    };
  }

  /**
   * Clone a section
   */
  public cloneSection(section: Section): Section {
    return {
      ...section,
      metadata: {
        ...section.metadata,
        id: crypto.randomUUID(),
        name: `${section.metadata.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      content: {
        ...section.content,
        components: this.cloneComponents(section.content.components),
      },
    };
  }

  /**
   * Clone a reusable component
   */
  public cloneReusableComponent(component: ReusableComponent): ReusableComponent {
    return {
      ...component,
      metadata: {
        ...component.metadata,
        id: crypto.randomUUID(),
        name: `${component.metadata.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      content: this.cloneComponents([component.content])[0],
    };
  }

  /**
   * Extract a section from a template
   */
  public extractSectionFromTemplate(
    template: Template,
    sectionName: string,
    componentIds: string[]
  ): Section {
    const pages = template.content.pages;
    let foundComponents: any[] = [];

    for (const page of pages) {
      const components = this.findComponentsByIds(page.components, componentIds);
      if (components.length > 0) {
        foundComponents = components;
        break;
      }
    }

    if (foundComponents.length === 0) {
      throw new Error('No components found with the specified IDs');
    }

    const section: Section = {
      metadata: {
        id: crypto.randomUUID(),
        name: sectionName,
        description: `Extracted from template: ${template.metadata.name}`,
        category: template.metadata.category,
        tags: [...template.metadata.tags],
        version: '1.0.0',
        author: template.metadata.author,
        authorId: template.metadata.authorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
      },
      content: {
        components: foundComponents,
        styles: {},
      },
      dependencies: template.dependencies,
    };

    return section;
  }

  /**
   * Create a reusable component from a component node
   */
  public createReusableComponentFromNode(
    node: any,
    name: string,
    description: string,
    category: string,
    author: string
  ): ReusableComponent {
    const component: ReusableComponent = {
      metadata: {
        id: crypto.randomUUID(),
        name,
        description,
        category,
        tags: [],
        version: '1.0.0',
        author,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
      },
      content: this.cloneComponents([node])[0],
    };

    return component;
  }

  // Private helper methods

  private validateMetadata(
    metadata: any,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!metadata.id) {
      errors.push({
        code: 'MISSING_ID',
        message: 'Metadata ID is required',
        severity: 'error',
      });
    }

    if (!metadata.name) {
      errors.push({
        code: 'MISSING_NAME',
        message: 'Metadata name is required',
        severity: 'error',
      });
    }

    if (!metadata.description) {
      warnings.push({
        code: 'MISSING_DESCRIPTION',
        message: 'Metadata description is recommended',
        severity: 'warning',
      });
    }

    if (!metadata.category) {
      errors.push({
        code: 'MISSING_CATEGORY',
        message: 'Metadata category is required',
        severity: 'error',
      });
    }

    if (!metadata.version) {
      warnings.push({
        code: 'MISSING_VERSION',
        message: 'Metadata version is recommended',
        severity: 'warning',
      });
    }

    if (!metadata.author) {
      warnings.push({
        code: 'MISSING_AUTHOR',
        message: 'Metadata author is recommended',
        severity: 'warning',
      });
    }
  }

  private validateTemplateContent(
    content: any,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!content.pages || !Array.isArray(content.pages) || content.pages.length === 0) {
      errors.push({
        code: 'INVALID_PAGES',
        message: 'Template must have at least one page',
        severity: 'error',
      });
    }

    if (!content.theme) {
      warnings.push({
        code: 'MISSING_THEME',
        message: 'Template theme is recommended',
        severity: 'warning',
      });
    }
  }

  private validateSectionContent(
    content: any,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (
      !content.components ||
      !Array.isArray(content.components) ||
      content.components.length === 0
    ) {
      errors.push({
        code: 'INVALID_COMPONENTS',
        message: 'Section must have at least one component',
        severity: 'error',
      });
    }
  }

  private validateComponentContent(
    content: any,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!content.id || !content.type) {
      errors.push({
        code: 'INVALID_COMPONENT',
        message: 'Component must have an ID and type',
        severity: 'error',
      });
    }
  }

  private regenerateComponentIds(components: any[]): any[] {
    return components.map((component) => ({
      ...component,
      id: crypto.randomUUID(),
      children: component.children ? this.regenerateComponentIds(component.children) : [],
    }));
  }

  private cloneComponents(components: any[]): any[] {
    return components.map((component) => ({
      ...component,
      id: crypto.randomUUID(),
      children: component.children ? this.cloneComponents(component.children) : [],
    }));
  }

  private findComponentsByIds(components: any[], ids: string[]): any[] {
    const found: any[] = [];

    for (const component of components) {
      if (ids.includes(component.id)) {
        found.push(component);
      }

      if (component.children && component.children.length > 0) {
        found.push(...this.findComponentsByIds(component.children, ids));
      }
    }

    return found;
  }
}
