/**
 * Spacing System
 *
 * Provides a comprehensive spacing system with predefined scales,
 * responsive spacing, and smart spacing calculations
 */

import { Breakpoint } from '@wysiwyg/core';
import { SpacingScale, SpacingConfig, LayoutBounds } from '../types';

export class SpacingSystem {
  private config: Required<SpacingConfig>;
  private responsiveScales: Map<Breakpoint, Record<SpacingScale, number>>;

  constructor(config: Partial<SpacingConfig> = {}) {
    this.config = {
      scale: config.scale || this.getDefaultScale(),
      defaultPadding: config.defaultPadding ?? 16,
      defaultMargin: config.defaultMargin ?? 16,
      defaultGap: config.defaultGap ?? 16,
    };

    this.responsiveScales = new Map();
    this.initializeResponsiveScales();
  }

  /**
   * Get spacing value from scale
   */
  getSpacing(scale: SpacingScale, breakpoint?: Breakpoint): number {
    if (breakpoint) {
      const responsiveScale = this.responsiveScales.get(breakpoint);
      if (responsiveScale) {
        return responsiveScale[scale];
      }
    }
    return this.config.scale[scale];
  }

  /**
   * Calculate padding for a component
   */
  calculatePadding(
    componentBounds: LayoutBounds,
    scale: SpacingScale = 'md',
    breakpoint?: Breakpoint
  ): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    const spacing = this.getSpacing(scale, breakpoint);
    return {
      top: spacing,
      right: spacing,
      bottom: spacing,
      left: spacing,
    };
  }

  /**
   * Calculate margin for a component
   */
  calculateMargin(
    componentBounds: LayoutBounds,
    scale: SpacingScale = 'md',
    breakpoint?: Breakpoint
  ): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    const spacing = this.getSpacing(scale, breakpoint);
    return {
      top: spacing,
      right: spacing,
      bottom: spacing,
      left: spacing,
    };
  }

  /**
   * Calculate gap between components
   */
  calculateGap(scale: SpacingScale = 'md', breakpoint?: Breakpoint): number {
    return this.getSpacing(scale, breakpoint);
  }

  /**
   * Calculate responsive spacing
   */
  calculateResponsiveSpacing(scale: SpacingScale, currentBreakpoint: Breakpoint): number {
    const spacing = this.getSpacing(scale, currentBreakpoint);

    // Adjust spacing based on breakpoint
    const breakpointMultipliers: Record<Breakpoint, number> = {
      mobile: 0.75,
      tablet: 1,
      desktop: 1.25,
      wide: 1.5,
    };

    return spacing * (breakpointMultipliers[currentBreakpoint] || 1);
  }

  /**
   * Calculate smart spacing between components
   */
  calculateSmartSpacing(
    component1Bounds: LayoutBounds,
    component2Bounds: LayoutBounds,
    orientation: 'horizontal' | 'vertical' = 'horizontal',
    scale: SpacingScale = 'md'
  ): number {
    const baseSpacing = this.getSpacing(scale);

    // Calculate distance between components
    let distance: number;
    if (orientation === 'horizontal') {
      distance = Math.abs(component2Bounds.x - (component1Bounds.x + component1Bounds.width));
    } else {
      distance = Math.abs(component2Bounds.y - (component1Bounds.y + component1Bounds.height));
    }

    // Snap to nearest spacing value
    const spacingValues = Object.values(this.config.scale).sort((a, b) => a - b);
    let closestSpacing = baseSpacing;
    let minDiff = Math.abs(distance - baseSpacing);

    for (const spacing of spacingValues) {
      const diff = Math.abs(distance - spacing);
      if (diff < minDiff) {
        minDiff = diff;
        closestSpacing = spacing;
      }
    }

    return closestSpacing;
  }

  /**
   * Calculate optimal spacing for a container
   */
  calculateOptimalContainerSpacing(
    containerBounds: LayoutBounds,
    itemCount: number,
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ): {
    gap: number;
    padding: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  } {
    const containerSize =
      orientation === 'horizontal' ? containerBounds.width : containerBounds.height;

    // Calculate optimal gap based on container size and item count
    const availableSpace = containerSize * 0.8; // Use 80% of container for content
    const optimalGap = Math.min(availableSpace / (itemCount + 1), this.config.defaultGap * 2);

    // Find closest spacing value
    const spacingValues = Object.values(this.config.scale).sort((a, b) => a - b);
    let closestGap = this.config.defaultGap;
    let minDiff = Math.abs(optimalGap - this.config.defaultGap);

    for (const spacing of spacingValues) {
      const diff = Math.abs(optimalGap - spacing);
      if (diff < minDiff) {
        minDiff = diff;
        closestGap = spacing;
      }
    }

    return {
      gap: closestGap,
      padding: {
        top: closestGap,
        right: closestGap,
        bottom: closestGap,
        left: closestGap,
      },
    };
  }

  /**
   * Get spacing scale for CSS
   */
  getSpacingScaleCSS(): string {
    const scaleEntries = Object.entries(this.config.scale);
    return scaleEntries.map(([key, value]) => `  --spacing-${key}: ${value}px;`).join('\n');
  }

  /**
   * Update spacing configuration
   */
  updateConfig(config: Partial<SpacingConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      scale: config.scale ? { ...this.config.scale, ...config.scale } : this.config.scale,
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<SpacingConfig> {
    return { ...this.config };
  }

  /**
   * Get default spacing scale
   */
  private getDefaultScale(): Record<SpacingScale, number> {
    return {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
      '4xl': 96,
      '5xl': 128,
    };
  }

  /**
   * Initialize responsive spacing scales
   */
  private initializeResponsiveScales(): void {
    const baseScale = this.config.scale;

    // Mobile scale (75% of base)
    this.responsiveScales.set('mobile', this.createResponsiveScale(baseScale, 0.75));

    // Tablet scale (100% of base)
    this.responsiveScales.set('tablet', this.createResponsiveScale(baseScale, 1));

    // Desktop scale (125% of base)
    this.responsiveScales.set('desktop', this.createResponsiveScale(baseScale, 1.25));

    // Wide scale (150% of base)
    this.responsiveScales.set('wide', this.createResponsiveScale(baseScale, 1.5));
  }

  /**
   * Create responsive scale
   */
  private createResponsiveScale(
    baseScale: Record<SpacingScale, number>,
    multiplier: number
  ): Record<SpacingScale, number> {
    const responsiveScale: Partial<Record<SpacingScale, number>> = {};

    for (const [key, value] of Object.entries(baseScale)) {
      responsiveScale[key as SpacingScale] = Math.round(value * multiplier);
    }

    return responsiveScale as Record<SpacingScale, number>;
  }
}
