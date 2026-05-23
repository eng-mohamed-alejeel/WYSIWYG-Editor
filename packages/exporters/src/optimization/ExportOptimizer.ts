/**
 * Export Optimizer
 *
 * Handles code minification, asset optimization, and performance improvements
 */

import { ExportContext, ExportedAsset, ExportedStyle } from '../types';
import { ExportFormat } from '../types';

export interface OptimizationOptions {
  /**
   * Minify HTML output
   */
  minifyHtml?: boolean;

  /**
   * Minify CSS output
   */
  minifyCss?: boolean;

  /**
   * Minify JavaScript output
   */
  minifyJs?: boolean;

  /**
   * Optimize images
   */
  optimizeImages?: boolean;

  /**
   * Generate critical CSS
   */
  generateCriticalCss?: boolean;

  /**
   * Remove unused CSS
   */
  removeUnusedCss?: boolean;

  /**
   * Inline critical assets
   */
  inlineCriticalAssets?: boolean;

  /**
   * Generate source maps
   */
  generateSourceMaps?: boolean;

  /**
   * Tree shake unused code
   */
  treeShake?: boolean;

  /**
   * Compress output
   */
  compress?: boolean;
}

export class ExportOptimizer {
  private options: OptimizationOptions;

  constructor(options: OptimizationOptions = {}) {
    this.options = {
      minifyHtml: true,
      minifyCss: true,
      minifyJs: true,
      optimizeImages: true,
      generateCriticalCss: false,
      removeUnusedCss: true,
      inlineCriticalAssets: false,
      generateSourceMaps: false,
      treeShake: true,
      compress: false,
      ...options,
    };
  }

  /**
   * Optimize export context
   */
  async optimizeContext(context: ExportContext, format: ExportFormat): Promise<ExportContext> {
    const optimizedContext = { ...context };

    // Optimize assets
    if (this.options.optimizeImages) {
      optimizedContext.assets = await this.optimizeAssets(context.assets);
    }

    // Optimize styles
    optimizedContext.styles = this.optimizeStyles(context.styles, format);

    return optimizedContext;
  }

  /**
   * Optimize HTML content
   */
  optimizeHtml(html: string): string {
    if (!this.options.minifyHtml) {
      return html;
    }

    return html
      // Remove comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove whitespace between tags
      .replace(/>\s+</g, '><')
      // Remove leading/trailing whitespace
      .trim()
      // Remove multiple spaces
      .replace(/\s{2,}/g, ' ')
      // Remove newlines
      .replace(/
/g, '');
  }

  /**
   * Optimize CSS content
   */
  optimizeCss(css: string): string {
    if (!this.options.minifyCss) {
      return css;
    }

    return css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove whitespace
      .replace(/\s+/g, ' ')
      // Remove spaces around special characters
      .replace(/\s*([{}:;,])\s*/g, '$1')
      // Remove trailing semicolons
      .replace(/;}/g, '}')
      // Remove leading/trailing whitespace
      .trim();
  }

  /**
   * Optimize JavaScript content
   */
  optimizeJs(js: string): string {
    if (!this.options.minifyJs) {
      return js;
    }

    return js
      // Remove single-line comments
      .replace(/\/\/.*$/gm, '')
      // Remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove whitespace around operators
      .replace(/\s*([=+\-*/%&|^!<>?:,;{}()[\]])\s*/g, '$1')
      // Remove multiple spaces
      .replace(/\s{2,}/g, ' ')
      // Remove leading/trailing whitespace
      .trim();
  }

  /**
   * Optimize assets
   */
  async optimizeAssets(assets: ExportedAsset[]): Promise<ExportedAsset[]> {
    const optimizedAssets: ExportedAsset[] = [];

    for (const asset of assets) {
      if (asset.type === 'image' && this.options.optimizeImages) {
        const optimizedAsset = await this.optimizeImage(asset);
        optimizedAssets.push(optimizedAsset);
      } else {
        optimizedAssets.push(asset);
      }
    }

    return optimizedAssets;
  }

  /**
   * Optimize image asset
   */
  private async optimizeImage(asset: ExportedAsset): Promise<ExportedAsset> {
    // In a real implementation, this would use image optimization libraries
    // For now, we'll just return the asset with optimized path
    return {
      ...asset,
      path: asset.path.replace(/\.(png|jpg|jpeg)$/, '.webp'),
    };
  }

  /**
   * Optimize styles
   */
  optimizeStyles(styles: ExportedStyle[], format: ExportFormat): ExportedStyle[] {
    return styles.map(style => ({
      ...style,
      content: this.optimizeStyleContent(style.content, style.type, format),
    }));
  }

  /**
   * Optimize style content based on type
   */
  private optimizeStyleContent(content: string, type: string, format: ExportFormat): string {
    switch (type) {
      case 'css':
        return this.optimizeCss(content);
      case 'scss':
      case 'less':
        // For preprocessor languages, we'd need to compile first
        return this.optimizeCss(content);
      default:
        return content;
    }
  }

  /**
   * Generate critical CSS
   */
  generateCriticalCss(html: string, css: string): string {
    // In a real implementation, this would use a critical CSS generator
    // For now, we'll return a subset of CSS that's likely to be critical
    const criticalSelectors = [
      'body',
      'html',
      'header',
      'nav',
      'main',
      'footer',
      '.container',
      '.container-custom',
    ];

    const criticalRules: string[] = [];
    const lines = css.split('}');

    for (const line of lines) {
      for (const selector of criticalSelectors) {
        if (line.includes(selector)) {
          criticalRules.push(line + '}');
          break;
        }
      }
    }

    return criticalRules.join('\n');
  }

  /**
   * Remove unused CSS
   */
  removeUnusedCss(css: string, html: string): string {
    // In a real implementation, this would use PurgeCSS or similar
    // For now, we'll return the CSS as-is
    return css;
  }

  /**
   * Inline critical assets
   */
  inlineCriticalAssets(html: string, criticalCss: string): string {
    // Inject critical CSS into head
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex === -1) {
      return html;
    }

    const criticalStyleTag = `<style>${criticalCss}</style>`;
    return html.slice(0, headEndIndex) + criticalStyleTag + html.slice(headEndIndex);
  }

  /**
   * Generate source map
   */
  generateSourceMap(code: string, file: string): string {
    // In a real implementation, this would generate proper source maps
    return `//# sourceMappingURL=${file}.map`;
  }

  /**
   * Tree shake unused code
   */
  treeShake(code: string, exports: string[]): string {
    // In a real implementation, this would analyze and remove unused exports
    return code;
  }

  /**
   * Compress output
   */
  compress(content: string): string {
    // In a real implementation, this would use gzip or brotli
    return content;
  }

  /**
   * Get optimization statistics
   */
  getStatistics(original: string, optimized: string): {
    originalSize: number;
    optimizedSize: number;
    reduction: number;
    reductionPercentage: number;
  } {
    const originalSize = Buffer.byteLength(original, 'utf8');
    const optimizedSize = Buffer.byteLength(optimized, 'utf8');
    const reduction = originalSize - optimizedSize;
    const reductionPercentage = (reduction / originalSize) * 100;

    return {
      originalSize,
      optimizedSize,
      reduction,
      reductionPercentage,
    };
  }
}

// Create and export default optimizer instance
export const defaultOptimizer = new ExportOptimizer();
