/**
 * Asset Exporter
 *
 * Handles asset processing, optimization, and export
 */

import { Asset } from '@wysiwyg/core';
import { ExportedAsset } from '../types';
import { ExportFormat } from '../types';

export interface AssetExportOptions {
  /**
   * Optimize images
   */
  optimizeImages?: boolean;

  /**
   * Convert images to WebP
   */
  convertToWebP?: boolean;

  /**
   * Generate responsive images
   */
  generateResponsiveImages?: boolean;

  /**
   * Generate image thumbnails
   */
  generateThumbnails?: boolean;

  /**
   * Compress assets
   */
  compressAssets?: boolean;

  /**
   * Output directory for assets
   */
  outputDir?: string;

  /**
   * Base URL for assets
   */
  baseUrl?: string;

  /**
   * Custom asset path generator
   */
  pathGenerator?: (asset: Asset, format: ExportFormat) => string;
}

export interface AssetProcessingResult {
  /**
   * Original asset
   */
  original: Asset;

  /**
   * Processed asset
   */
  processed: ExportedAsset;

  /**
   * Generated variants
   */
  variants?: ExportedAsset[];

  /**
   * Processing statistics
   */
  statistics?: {
    originalSize: number;
    processedSize: number;
    reduction: number;
    reductionPercentage: number;
  };
}

export class AssetExporter {
  private options: AssetExportOptions;

  constructor(options: AssetExportOptions = {}) {
    this.options = {
      optimizeImages: true,
      convertToWebP: false,
      generateResponsiveImages: true,
      generateThumbnails: false,
      compressAssets: false,
      outputDir: 'assets',
      baseUrl: '/assets',
      ...options,
    };
  }

  /**
   * Export a single asset
   */
  async exportAsset(asset: Asset, format: ExportFormat): Promise<AssetProcessingResult> {
    const path = this.generateAssetPath(asset, format);
    const url = this.generateAssetUrl(asset, format);

    const processedAsset: ExportedAsset = {
      id: asset.id,
      url,
      type: asset.type,
      path,
      size: asset.size,
    };

    const variants: ExportedAsset[] = [];

    // Process based on asset type
    if (asset.type === 'image') {
      if (this.options.optimizeImages) {
        const optimized = await this.optimizeImage(asset, path);
        processedAsset.path = optimized.path;
        processedAsset.size = optimized.size;
      }

      if (this.options.convertToWebP) {
        const webp = await this.convertToWebP(asset);
        variants.push(webp);
      }

      if (this.options.generateResponsiveImages) {
        const responsiveVariants = await this.generateResponsiveImages(asset);
        variants.push(...responsiveVariants);
      }

      if (this.options.generateThumbnails) {
        const thumbnail = await this.generateThumbnail(asset);
        variants.push(thumbnail);
      }
    }

    // Calculate statistics
    const statistics = this.calculateStatistics(asset, processedAsset);

    return {
      original: asset,
      processed: processedAsset,
      variants,
      statistics,
    };
  }

  /**
   * Export multiple assets
   */
  async exportAssets(assets: Asset[], format: ExportFormat): Promise<AssetProcessingResult[]> {
    const results: AssetProcessingResult[] = [];

    for (const asset of assets) {
      const result = await this.exportAsset(asset, format);
      results.push(result);
    }

    return results;
  }

  /**
   * Generate asset path
   */
  private generateAssetPath(asset: Asset, format: ExportFormat): string {
    if (this.options.pathGenerator) {
      return this.options.pathGenerator(asset, format);
    }

    const typeDir = this.getTypeDirectory(asset.type);
    return `${this.options.outputDir}/${typeDir}/${asset.name}`;
  }

  /**
   * Generate asset URL
   */
  private generateAssetUrl(asset: Asset, format: ExportFormat): string {
    const path = this.generateAssetPath(asset, format);
    return `${this.options.baseUrl}/${path.replace(`${this.options.outputDir}/`, '')}`;
  }

  /**
   * Get type directory
   */
  private getTypeDirectory(type: string): string {
    const typeDirs: Record<string, string> = {
      image: 'images',
      video: 'videos',
      audio: 'audio',
      font: 'fonts',
      file: 'files',
      code: 'scripts',
    };
    return typeDirs[type] || 'misc';
  }

  /**
   * Optimize image
   */
  private async optimizeImage(asset: Asset, path: string): Promise<{ path: string; size: number }> {
    // In a real implementation, this would use image optimization libraries
    // For now, we'll return the original path with optimized suffix
    const optimizedPath = path.replace(/\.(\w+)$/, '-optimized.$1');
    const optimizedSize = Math.floor(asset.size * 0.8); // Assume 20% reduction

    return {
      path: optimizedPath,
      size: optimizedSize,
    };
  }

  /**
   * Convert image to WebP
   */
  private async convertToWebP(asset: Asset): Promise<ExportedAsset> {
    const webpPath = asset.url.replace(/\.(\w+)$/, '.webp');
    const webpSize = Math.floor(asset.size * 0.7); // Assume 30% reduction

    return {
      id: `${asset.id}-webp`,
      url: webpPath,
      type: 'image',
      path: webpPath,
      size: webpSize,
    };
  }

  /**
   * Generate responsive image variants
   */
  private async generateResponsiveImages(asset: Asset): Promise<ExportedAsset[]> {
    const breakpoints = [
      { name: 'mobile', width: 640 },
      { name: 'tablet', width: 1024 },
      { name: 'desktop', width: 1440 },
    ];

    const variants: ExportedAsset[] = [];

    for (const breakpoint of breakpoints) {
      const variantPath = asset.url.replace(/\.(\w+)$/, `-${breakpoint.name}.$1`);
      const variantSize = Math.floor(asset.size * (breakpoint.width / 1920));

      variants.push({
        id: `${asset.id}-${breakpoint.name}`,
        url: variantPath,
        type: 'image',
        path: variantPath,
        size: variantSize,
      });
    }

    return variants;
  }

  /**
   * Generate thumbnail
   */
  private async generateThumbnail(asset: Asset): Promise<ExportedAsset> {
    const thumbnailPath = asset.url.replace(/\.(\w+)$/, '-thumb.$1');
    const thumbnailSize = Math.floor(asset.size * 0.1); // Assume 90% reduction

    return {
      id: `${asset.id}-thumb`,
      url: thumbnailPath,
      type: 'image',
      path: thumbnailPath,
      size: thumbnailSize,
    };
  }

  /**
   * Calculate processing statistics
   */
  private calculateStatistics(
    original: Asset,
    processed: ExportedAsset
  ): {
    originalSize: number;
    processedSize: number;
    reduction: number;
    reductionPercentage: number;
  } {
    const originalSize = original.size;
    const processedSize = processed.size || originalSize;
    const reduction = originalSize - processedSize;
    const reductionPercentage = (reduction / originalSize) * 100;

    return {
      originalSize,
      processedSize,
      reduction,
      reductionPercentage,
    };
  }

  /**
   * Get export options
   */
  getOptions(): AssetExportOptions {
    return { ...this.options };
  }

  /**
   * Update export options
   */
  updateOptions(options: Partial<AssetExportOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Generate HTML for image with responsive sources
   */
  generateResponsiveImageHtml(asset: Asset, result: AssetProcessingResult): string {
    const variants = result.variants || [];
    const sources = variants
      .filter((v) => v.type === 'image')
      .map((v) => {
        const widthMatch = v.path.match(/-(\d+)\./);
        const width = widthMatch ? widthMatch[1] : '';
        return `<source srcset="${v.url}" media="(max-width: ${width}px)">`;
      })
      .join('\n    ');

    return `<picture>
    ${sources}
    <img src="${result.processed.url}" alt="${asset.metadata?.alt || ''}" loading="lazy">
</picture>`;
  }

  /**
   * Generate CSS for background image with responsive sources
   */
  generateResponsiveImageCss(asset: Asset, result: AssetProcessingResult): string {
    const variants = result.variants || [];
    const mediaQueries = variants
      .filter((v) => v.type === 'image')
      .map((v) => {
        const widthMatch = v.path.match(/-(\w+)\./);
        const breakpoint = widthMatch ? widthMatch[1] : '';
        return `@media (max-width: ${breakpoint}px) {
  background-image: url('${v.url}');
}`;
      })
      .join('\n');

    return `.bg-${asset.id} {
  background-image: url('${result.processed.url}');
  background-size: cover;
  background-position: center;
}

${mediaQueries}`;
  }
}

// Create and export default exporter instance
export const defaultAssetExporter = new AssetExporter();
