/**
 * Responsive Layout System
 *
 * Provides responsive layout behavior across breakpoints including:
 * - Breakpoint management
 * - Responsive style application
 * - Layout adaptation
 * - Media query generation
 */

import { Breakpoint, ComponentNode, StyleObject } from '@wysiwyg/core';
import { ResponsiveLayoutConfig, LayoutConfig, LayoutContext, LayoutBounds } from '../types';

export interface ResponsiveLayoutResult {
  currentBreakpoint: Breakpoint;
  layoutConfig: LayoutConfig;
  styles: StyleObject;
  bounds: LayoutBounds;
  mediaQueries: string[];
}

export class ResponsiveLayout {
  private config: Required<ResponsiveLayoutConfig>;
  private breakpointOrder: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];

  constructor(config: Partial<ResponsiveLayoutConfig> = {}) {
    this.config = {
      breakpoints: config.breakpoints || {
        mobile: 640,
        tablet: 768,
        desktop: 1024,
        wide: 1280,
      },
      defaultBreakpoint: config.defaultBreakpoint || 'desktop',
      currentBreakpoint: config.currentBreakpoint || 'desktop',
      layoutConfigs: config.layoutConfigs || {},
    };
  }

  /**
   * Get current breakpoint based on viewport width
   */
  getCurrentBreakpoint(viewportWidth: number): Breakpoint {
    for (let i = this.breakpointOrder.length - 1; i >= 0; i--) {
      const breakpoint = this.breakpointOrder[i];
      if (viewportWidth >= this.config.breakpoints[breakpoint]) {
        return breakpoint;
      }
    }
    return this.breakpointOrder[0];
  }

  /**
   * Set current breakpoint
   */
  setCurrentBreakpoint(breakpoint: Breakpoint): void {
    this.config.currentBreakpoint = breakpoint;
  }

  /**
   * Get responsive layout configuration
   */
  getResponsiveLayout(node: ComponentNode, viewportWidth: number): ResponsiveLayoutResult {
    const currentBreakpoint = this.getCurrentBreakpoint(viewportWidth);
    const layoutConfig = this.getLayoutConfigForBreakpoint(node, currentBreakpoint);
    const styles = this.getStylesForBreakpoint(node, currentBreakpoint);
    const mediaQueries = this.generateMediaQueries(node);

    return {
      currentBreakpoint,
      layoutConfig,
      styles,
      bounds: this.calculateBounds(styles),
      mediaQueries,
    };
  }

  /**
   * Get layout configuration for a specific breakpoint
   */
  private getLayoutConfigForBreakpoint(node: ComponentNode, breakpoint: Breakpoint): LayoutConfig {
    // Check if there's a specific layout config for this breakpoint
    const breakpointConfig = this.config.layoutConfigs[breakpoint];
    if (breakpointConfig) {
      return breakpointConfig;
    }

    // Fall back to default breakpoint config
    const defaultConfig = this.config.layoutConfigs[this.config.defaultBreakpoint];
    if (defaultConfig) {
      return defaultConfig;
    }

    // Create default config based on node styles
    return this.createDefaultLayoutConfig(node);
  }

  /**
   * Get styles for a specific breakpoint
   */
  private getStylesForBreakpoint(node: ComponentNode, breakpoint: Breakpoint): StyleObject {
    const styles: StyleObject = { ...node.styles };

    // Apply responsive styles if available
    if (node.responsiveStyles) {
      const breakpointStyles = node.responsiveStyles[breakpoint];
      if (breakpointStyles) {
        Object.assign(styles, breakpointStyles);
      }
    }

    return styles;
  }

  /**
   * Calculate bounds from styles
   */
  private calculateBounds(styles: StyleObject): LayoutBounds {
    const width = this.parseSize(styles.width as string | number, 0);
    const height = this.parseSize(styles.height as string | number, 0);
    const top = this.parseSize(styles.top as string | number, 0);
    const left = this.parseSize(styles.left as string | number, 0);

    return {
      x: left,
      y: top,
      width,
      height,
    };
  }

  /**
   * Parse size value
   */
  private parseSize(value: string | number | undefined, reference: number): number {
    if (value === undefined || value === 'auto') {
      return reference;
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      if (value.endsWith('%')) {
        return (parseFloat(value) / 100) * reference;
      }
      if (value.endsWith('px')) {
        return parseFloat(value);
      }
      return parseFloat(value);
    }
    return reference;
  }

  /**
   * Create default layout configuration from node
   */
  private createDefaultLayoutConfig(node: ComponentNode): LayoutConfig {
    const display = node.styles.display as string;

    if (display === 'flex') {
      return {
        mode: 'flex',
        direction: (node.styles.flexDirection as any) || 'row',
        wrap: (node.styles.flexWrap as any) || 'nowrap',
        justifyContent: (node.styles.justifyContent as any) || 'flex-start',
        alignItems: (node.styles.alignItems as any) || 'stretch',
        gap: (node.styles.gap as number) || 0,
      };
    } else if (display === 'grid') {
      return {
        mode: 'grid',
        columns: this.parseGridTracks(node.styles.gridTemplateColumns as string),
        rows: this.parseGridTracks(node.styles.gridTemplateRows as string),
        columnGap: (node.styles.gap as number) || 0,
        rowGap: (node.styles.gap as number) || 0,
      };
    } else if (node.styles.position === 'absolute') {
      return {
        mode: 'absolute',
        position: 'absolute',
        top: node.styles.top as number | undefined,
        right: node.styles.right as number | undefined,
        bottom: node.styles.bottom as number | undefined,
        left: node.styles.left as number | undefined,
        zIndex: node.styles.zIndex as number | undefined,
      };
    }

    return {
      mode: 'flow',
    };
  }

  /**
   * Parse grid tracks from CSS string
   */
  private parseGridTracks(tracksString: string | undefined): any[] {
    if (!tracksString) {
      return ['auto'];
    }

    return tracksString.split(/\s+/).map((track) => {
      if (track.endsWith('px')) {
        return parseFloat(track);
      }
      if (track.endsWith('%')) {
        return track;
      }
      if (track === 'auto' || track === 'min-content' || track === 'max-content') {
        return track;
      }
      return track;
    });
  }

  /**
   * Generate media queries for responsive styles
   */
  private generateMediaQueries(node: ComponentNode): string[] {
    const mediaQueries: string[] = [];

    if (!node.responsiveStyles) {
      return mediaQueries;
    }

    for (const [breakpoint, styles] of Object.entries(node.responsiveStyles)) {
      const minWidth = this.config.breakpoints[breakpoint as Breakpoint];
      const stylesString = this.stylesToCSS(styles);

      mediaQueries.push(`
        @media (min-width: ${minWidth}px) {
          #${node.id} {
            ${stylesString}
          }
        }
      `);
    }

    return mediaQueries;
  }

  /**
   * Convert styles object to CSS string
   */
  private stylesToCSS(styles: StyleObject): string {
    return Object.entries(styles)
      .map(([property, value]) => {
        const cssProperty = this.camelToKebab(property);
        return `${cssProperty}: ${value};`;
      })
      .join('\n  ');
  }

  /**
   * Convert camelCase to kebab-case
   */
  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Update responsive configuration
   */
  updateConfig(config: Partial<ResponsiveLayoutConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      breakpoints: config.breakpoints
        ? { ...this.config.breakpoints, ...config.breakpoints }
        : this.config.breakpoints,
      layoutConfigs: config.layoutConfigs
        ? { ...this.config.layoutConfigs, ...config.layoutConfigs }
        : this.config.layoutConfigs,
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<ResponsiveLayoutConfig> {
    return { ...this.config };
  }

  /**
   * Get breakpoint value
   */
  getBreakpointValue(breakpoint: Breakpoint): number {
    return this.config.breakpoints[breakpoint];
  }

  /**
   * Get all breakpoints
   */
  getBreakpoints(): Record<Breakpoint, number> {
    return { ...this.config.breakpoints };
  }
}
