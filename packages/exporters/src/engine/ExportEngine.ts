/**
 * Export Engine
 *
 * Core export engine that orchestrates all exporters and provides a unified API
 */

import { Project, Page, ComponentNode, ExportResult, ExportOptions } from '@wysiwyg/core';
import { Exporter, ExportFormat, ExportContext } from '../types';
import { BaseAdapter } from '../adapters/BaseAdapter';
import { ComponentMapper, componentMapper } from '../mapping/ComponentMapper';
import {
  ExportOptimizer,
  defaultOptimizer,
  OptimizationOptions,
} from '../optimization/ExportOptimizer';
import { HtmlExporter } from '../html/HtmlExporter';
import { ReactExporter } from '../react/ReactExporter';
import { NextjsExporter } from '../nextjs/NextjsExporter';
import { TailwindExporter } from '../tailwind/TailwindExporter';
import { WordPressExporter } from '../wordpress/WordPressExporter';
import { OdooExporter } from '../odoo/OdooExporter';

export interface EngineConfig {
  /**
   * Enable optimization
   */
  enableOptimization?: boolean;

  /**
   * Optimization options
   */
  optimizationOptions?: OptimizationOptions;

  /**
   * Enable component mapping
   */
  enableMapping?: boolean;

  /**
   * Custom component mapper
   */
  componentMapper?: ComponentMapper;

  /**
   * Custom optimizer
   */
  optimizer?: ExportOptimizer;

  /**
   * Custom exporters
   */
  customExporters?: Map<ExportFormat, Exporter>;
}

export class ExportEngine {
  private exporters: Map<ExportFormat, Exporter> = new Map();
  private componentMapper: ComponentMapper;
  private optimizer: ExportOptimizer;
  private config: EngineConfig;

  constructor(config: EngineConfig = {}) {
    this.config = {
      enableOptimization: true,
      enableMapping: true,
      componentMapper: config.componentMapper || componentMapper,
      optimizer: config.optimizer || defaultOptimizer,
      ...config,
    };

    this.componentMapper = this.config.componentMapper!;
    this.optimizer = this.config.optimizer!;

    // Register default exporters
    this.registerDefaultExporters();

    // Register custom exporters if provided
    if (this.config.customExporters) {
      this.config.customExporters.forEach((exporter, format) => {
        this.registerExporter(format, exporter);
      });
    }
  }

  /**
   * Register default exporters
   */
  private registerDefaultExporters(): void {
    this.registerExporter('html', new HtmlExporter());
    this.registerExporter('react', new ReactExporter());
    this.registerExporter('nextjs', new NextjsExporter());
    this.registerExporter('tailwind', new TailwindExporter());
    this.registerExporter('wordpress', new WordPressExporter());
    this.registerExporter('odoo', new OdooExporter());
  }

  /**
   * Register an exporter for a specific format
   */
  registerExporter(format: ExportFormat, exporter: Exporter): void {
    this.exporters.set(format, exporter);
  }

  /**
   * Unregister an exporter
   */
  unregisterExporter(format: ExportFormat): void {
    this.exporters.delete(format);
  }

  /**
   * Get an exporter for a specific format
   */
  getExporter(format: ExportFormat): Exporter | undefined {
    return this.exporters.get(format);
  }

  /**
   * Check if a format is supported
   */
  supportsFormat(format: ExportFormat): boolean {
    return this.exporters.has(format);
  }

  /**
   * Get all supported formats
   */
  getSupportedFormats(): ExportFormat[] {
    return Array.from(this.exporters.keys());
  }

  /**
   * Export a project
   */
  async exportProject(
    project: Project,
    format: ExportFormat,
    options?: ExportOptions
  ): Promise<ExportResult> {
    try {
      // Validate format
      if (!this.supportsFormat(format)) {
        throw new Error(`Unsupported export format: ${format}`);
      }

      // Validate options
      const exporter = this.getExporter(format)!;
      if (
        !exporter.validateOptions(
          options || { format, optimizeAssets: false, minify: false, includeSourceMaps: false }
        )
      ) {
        throw new Error('Invalid export options');
      }

      // Apply component mapping if enabled
      let mappedProject = project;
      if (this.config.enableMapping) {
        mappedProject = this.mapProjectComponents(project, format);
      }

      // Export the project
      const result = await exporter.exportProject(mappedProject, options);

      // Optimize if enabled
      if (result.success && this.config.enableOptimization && result.data) {
        result.data = await this.optimizeExport(result.data, format);
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Export a page
   */
  async exportPage(
    page: Page,
    format: ExportFormat,
    options?: ExportOptions
  ): Promise<ExportResult> {
    try {
      // Validate format
      if (!this.supportsFormat(format)) {
        throw new Error(`Unsupported export format: ${format}`);
      }

      // Get exporter
      const exporter = this.getExporter(format)!;

      // Apply component mapping if enabled
      let mappedPage = page;
      if (this.config.enableMapping) {
        mappedPage = this.mapPageComponents(page, format);
      }

      // Export the page
      const result = await exporter.exportPage(mappedPage, options);

      // Optimize if enabled
      if (result.success && this.config.enableOptimization && result.data) {
        result.data = await this.optimizeExport(result.data, format);
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Export a component
   */
  async exportComponent(
    component: ComponentNode,
    format: ExportFormat,
    options?: ExportOptions
  ): Promise<ExportResult> {
    try {
      // Validate format
      if (!this.supportsFormat(format)) {
        throw new Error(`Unsupported export format: ${format}`);
      }

      // Get exporter
      const exporter = this.getExporter(format)!;

      // Apply component mapping if enabled
      let mappedComponent = component;
      if (this.config.enableMapping) {
        mappedComponent = this.componentMapper.mapComponent(component, format);
      }

      // Export the component
      const result = await exporter.exportComponent(mappedComponent, options);

      // Optimize if enabled
      if (result.success && this.config.enableOptimization && result.data) {
        result.data = await this.optimizeExport(result.data, format);
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Map project components for a specific format
   */
  private mapProjectComponents(project: Project, format: ExportFormat): Project {
    return {
      ...project,
      pages: project.pages.map((page) => this.mapPageComponents(page, format)),
    };
  }

  /**
   * Map page components for a specific format
   */
  private mapPageComponents(page: Page, format: ExportFormat): Page {
    return {
      ...page,
      component: this.componentMapper.mapComponents(page.components, format),
    };
  }

  /**
   * Optimize export result
   */
  private async optimizeExport(data: any, format: ExportFormat): Promise<any> {
    const optimizedData = { ...data };

    // Optimize HTML
    if (optimizedData.html) {
      optimizedData.html = this.optimizer.optimizeHtml(optimizedData.html);
    }

    // Optimize CSS
    if (optimizedData.css) {
      optimizedData.css = this.optimizer.optimizeCss(optimizedData.css);
    }

    // Optimize JavaScript
    if (optimizedData.js) {
      optimizedData.js = this.optimizer.optimizeJs(optimizedData.js);
    }

    // Optimize styles
    if (optimizedData.styles) {
      optimizedData.styles = this.optimizer.optimizeStyles(optimizedData.styles, format);
    }

    // Optimize files
    if (optimizedData.files) {
      optimizedData.files = this.optimizeFiles(optimizedData.files, format);
    }

    return optimizedData;
  }

  /**
   * Optimize exported files
   */
  private optimizeFiles(
    files: Record<string, string>,
    format: ExportFormat
  ): Record<string, string> {
    const optimizedFiles: Record<string, string> = {};

    Object.entries(files).forEach(([filename, content]) => {
      if (filename.endsWith('.html')) {
        optimizedFiles[filename] = this.optimizer.optimizeHtml(content);
      } else if (filename.endsWith('.css')) {
        optimizedFiles[filename] = this.optimizer.optimizeCss(content);
      } else if (filename.endsWith('.js')) {
        optimizedFiles[filename] = this.optimizer.optimizeJs(content);
      } else {
        optimizedFiles[filename] = content;
      }
    });

    return optimizedFiles;
  }

  /**
   * Get engine configuration
   */
  getConfig(): EngineConfig {
    return { ...this.config };
  }

  /**
   * Update engine configuration
   */
  updateConfig(config: Partial<EngineConfig>): void {
    this.config = { ...this.config, ...config };

    // Update references if provided
    if (config.componentMapper) {
      this.componentMapper = config.componentMapper;
    }
    if (config.optimizer) {
      this.optimizer = config.optimizer;
    }
  }
}

// Create and export default engine instance
export const defaultExportEngine = new ExportEngine();
