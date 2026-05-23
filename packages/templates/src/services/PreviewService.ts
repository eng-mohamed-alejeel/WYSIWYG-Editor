/**
 * Preview Service
 *
 * Handles template, section, and component preview generation
 * using various rendering strategies.
 */

import type { Template, Section, ReusableComponent, ComponentNode } from '../types';

export class PreviewService {
  private static instance: PreviewService;
  private previewCache: Map<string, { data: string; timestamp: number }>;
  private cacheDuration: number;

  private constructor() {
    this.previewCache = new Map();
    this.cacheDuration = 3600000; // 1 hour
  }

  public static getInstance(): PreviewService {
    if (!PreviewService.instance) {
      PreviewService.instance = new PreviewService();
    }
    return PreviewService.instance;
  }

  /**
   * Generate a preview for a template
   */
  public async generateTemplatePreview(
    template: Template,
    options?: {
      width?: number;
      height?: number;
      format?: 'png' | 'jpeg' | 'webp';
      quality?: number;
      useCache?: boolean;
    }
  ): Promise<string> {
    const cacheKey = `template:${template.metadata.id}`;

    if (options?.useCache !== false) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // In a real implementation, this would:
    // 1. Render the template in an iframe or canvas
    // 2. Capture a screenshot using html2canvas or similar
    // 3. Return the URL or base64 data

    // For now, return existing preview URL or generate placeholder
    const previewUrl =
      template.metadata.previewUrls?.[0] || this.generatePlaceholderPreview(template.metadata.name);

    this.setCache(cacheKey, previewUrl);
    return previewUrl;
  }

  /**
   * Generate a preview for a section
   */
  public async generateSectionPreview(
    section: Section,
    options?: {
      width?: number;
      height?: number;
      format?: 'png' | 'jpeg' | 'webp';
      quality?: number;
      useCache?: boolean;
    }
  ): Promise<string> {
    const cacheKey = `section:${section.metadata.id}`;

    if (options?.useCache !== false) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const previewUrl =
      section.metadata.previewUrls?.[0] || this.generatePlaceholderPreview(section.metadata.name);

    this.setCache(cacheKey, previewUrl);
    return previewUrl;
  }

  /**
   * Generate a preview for a reusable component
   */
  public async generateComponentPreview(
    component: ReusableComponent,
    options?: {
      width?: number;
      height?: number;
      format?: 'png' | 'jpeg' | 'webp';
      quality?: number;
      useCache?: boolean;
    }
  ): Promise<string> {
    const cacheKey = `component:${component.metadata.id}`;

    if (options?.useCache !== false) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const previewUrl =
      component.metadata.previewUrls?.[0] ||
      this.generatePlaceholderPreview(component.metadata.name);

    this.setCache(cacheKey, previewUrl);
    return previewUrl;
  }

  /**
   * Generate a preview for a component node
   */
  public async generateComponentNodePreview(
    node: ComponentNode,
    options?: {
      width?: number;
      height?: number;
      format?: 'png' | 'jpeg' | 'webp';
      quality?: number;
    }
  ): Promise<string> {
    // In a real implementation, this would:
    // 1. Render the component in an isolated container
    // 2. Capture a screenshot
    // 3. Return the URL or base64 data

    const cacheKey = `node:${node.id}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const previewUrl = this.generatePlaceholderPreview(node.type);
    this.setCache(cacheKey, previewUrl);
    return previewUrl;
  }

  /**
   * Generate multiple previews in batch
   */
  public async generateBatchPreviews(
    items: Array<{
      type: 'template' | 'section' | 'component';
      data: Template | Section | ReusableComponent;
    }>,
    options?: {
      width?: number;
      height?: number;
      format?: 'png' | 'jpeg' | 'webp';
      quality?: number;
      useCache?: boolean;
    }
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    // Process items in parallel with a concurrency limit
    const batchSize = 5;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const promises = batch.map(async (item) => {
        let previewUrl: string;

        switch (item.type) {
          case 'template':
            previewUrl = await this.generateTemplatePreview(item.data as Template, options);
            break;
          case 'section':
            previewUrl = await this.generateSectionPreview(item.data as Section, options);
            break;
          case 'component':
            previewUrl = await this.generateComponentPreview(
              item.data as ReusableComponent,
              options
            );
            break;
          default:
            previewUrl = '';
        }

        const id = (item.data as any).metadata.id;
        results.set(id, previewUrl);
      });

      await Promise.all(promises);
    }

    return results;
  }

  /**
   * Clear preview cache
   */
  public clearCache(): void {
    this.previewCache.clear();
  }

  /**
   * Clear specific preview from cache
   */
  public clearPreviewCache(id: string, type: 'template' | 'section' | 'component'): void {
    const cacheKey = `${type}:${id}`;
    this.previewCache.delete(cacheKey);
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): {
    size: number;
    keys: string[];
    oldestEntry?: { key: string; timestamp: number };
    newestEntry?: { key: string; timestamp: number };
  } {
    const entries = Array.from(this.previewCache.entries());

    if (entries.length === 0) {
      return {
        size: 0,
        keys: [],
      };
    }

    const sortedByTimestamp = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    return {
      size: entries.length,
      keys: entries.map(([key]) => key),
      oldestEntry: {
        key: sortedByTimestamp[0][0],
        timestamp: sortedByTimestamp[0][1].timestamp,
      },
      newestEntry: {
        key: sortedByTimestamp[sortedByTimestamp.length - 1][0],
        timestamp: sortedByTimestamp[sortedByTimestamp.length - 1][1].timestamp,
      },
    };
  }

  /**
   * Set cache duration
   */
  public setCacheDuration(duration: number): void {
    this.cacheDuration = duration;
  }

  // Private helper methods

  private getFromCache(key: string): string | null {
    const cached = this.previewCache.get(key);

    if (!cached) {
      return null;
    }

    const isExpired = Date.now() - cached.timestamp > this.cacheDuration;

    if (isExpired) {
      this.previewCache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: string): void {
    this.previewCache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private generatePlaceholderPreview(name: string): string {
    // In a real implementation, you could generate a placeholder
    // image using a service like placeholder.com or similar
    // For now, return a data URI placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Draw background
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, canvas.width / 2, canvas.height / 2);
    }

    return canvas.toDataURL('image/png');
  }
}
