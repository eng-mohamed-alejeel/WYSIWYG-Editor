/**
 * Responsive Style Manager
 *
 * Manages style inheritance, overrides, and serialization for responsive design
 * Similar to Webflow's style management system
 */

import { Breakpoint, StyleObject, ComponentId } from '@wysiwyg/core';
import {
  StyleInheritanceChain,
  ResponsiveStyleOverride,
  SerializedResponsiveStyles,
} from './types';
import { getGlobalBreakpointManager } from './BreakpointManager';

/**
 * Responsive Style Manager Class
 */
export class ResponsiveStyleManager {
  private breakpointManager: ReturnType<typeof getGlobalBreakpointManager>;
  private styleCache: Map<string, Map<Breakpoint, StyleObject>>;
  private overrideCache: Map<ComponentId, Map<Breakpoint, StyleObject>>;

  constructor() {
    this.breakpointManager = getGlobalBreakpointManager();
    this.styleCache = new Map();
    this.overrideCache = new Map();
  }

  /**
   * Get the inheritance chain for a component
   */
  getInheritanceChain(
    baseStyles: StyleObject,
    responsiveStyles?: Record<Breakpoint, StyleObject>
  ): StyleInheritanceChain {
    return {
      base: { ...baseStyles },
      mobile: responsiveStyles?.mobile ? { ...responsiveStyles.mobile } : undefined,
      tablet: responsiveStyles?.tablet ? { ...responsiveStyles.tablet } : undefined,
      desktop: responsiveStyles?.desktop ? { ...responsiveStyles.desktop } : undefined,
      wide: responsiveStyles?.wide ? { ...responsiveStyles.wide } : undefined,
    };
  }

  /**
   * Get effective styles for a breakpoint considering inheritance
   */
  getEffectiveStyles(
    baseStyles: StyleObject,
    responsiveStyles?: Record<Breakpoint, StyleObject>,
    targetBreakpoint?: Breakpoint
  ): StyleObject {
    const breakpoint = targetBreakpoint || this.breakpointManager.getCurrentBreakpoint();
    const chain = this.getInheritanceChain(baseStyles, responsiveStyles);
    const effective: StyleObject = { ...baseStyles };

    // Apply styles from smaller breakpoints in order
    const breakpointOrder = this.breakpointManager.getBreakpointOrder();
    const currentIndex = breakpointOrder.indexOf(breakpoint);

    for (let i = 0; i <= currentIndex; i++) {
      const bp = breakpointOrder[i];
      const bpStyles = chain[bp as keyof StyleInheritanceChain];
      if (bpStyles) {
        Object.assign(effective, bpStyles);
      }
    }

    return effective;
  }

  /**
   * Check if a style property is inherited
   */
  isInherited(
    baseStyles: StyleObject,
    responsiveStyles: Record<Breakpoint, StyleObject>,
    property: string,
    breakpoint: Breakpoint
  ): boolean {
    const effectiveStyles = this.getEffectiveStyles(baseStyles, responsiveStyles, breakpoint);
    const baseValue = baseStyles[property as keyof StyleObject];
    const effectiveValue = effectiveStyles[property as keyof StyleObject];

    // If the value is different from base, it's inherited from a smaller breakpoint
    return baseValue !== effectiveValue;
  }

  /**
   * Check if a style property is overridden at a breakpoint
   */
  isOverridden(
    baseStyles: StyleObject,
    responsiveStyles: Record<Breakpoint, StyleObject>,
    property: string,
    breakpoint: Breakpoint
  ): boolean {
    const breakpointStyles = responsiveStyles[breakpoint];
    return breakpointStyles ? property in breakpointStyles : false;
  }

  /**
   * Get all overridden properties for a breakpoint
   */
  getOverriddenProperties(
    baseStyles: StyleObject,
    responsiveStyles: Record<Breakpoint, StyleObject>,
    breakpoint: Breakpoint
  ): string[] {
    const breakpointStyles = responsiveStyles[breakpoint];
    if (!breakpointStyles) return [];

    return Object.keys(breakpointStyles);
  }

  /**
   * Get breakpoints where a property is overridden
   */
  getPropertyOverrideBreakpoints(
    baseStyles: StyleObject,
    responsiveStyles: Record<Breakpoint, StyleObject>,
    property: string
  ): Breakpoint[] {
    const breakpoints: Breakpoint[] = [];

    for (const bp of this.breakpointManager.getBreakpointOrder()) {
      if (this.isOverridden(baseStyles, responsiveStyles, property, bp)) {
        breakpoints.push(bp);
      }
    }

    return breakpoints;
  }

  /**
   * Set a style override for a breakpoint
   */
  setStyleOverride(
    componentId: ComponentId,
    baseStyles: StyleObject,
    responsiveStyles: Record<Breakpoint, StyleObject>,
    breakpoint: Breakpoint,
    property: string,
    value: any
  ): Record<Breakpoint, StyleObject> {
    const newResponsiveStyles = { ...responsiveStyles };

    if (!newResponsiveStyles[breakpoint]) {
      newResponsiveStyles[breakpoint] = {};
    }

    newResponsiveStyles[breakpoint] = {
      ...newResponsiveStyles[breakpoint],
      [property]: value,
    };

    // Update cache
    this.updateOverrideCache(componentId, breakpoint, newResponsiveStyles[breakpoint]);

    return newResponsiveStyles;
  }

  /**
   * Remove a style override at a breakpoint
   */
  removeStyleOverride(
    componentId: ComponentId,
    responsiveStyles: Record<Breakpoint, StyleObject>,
    breakpoint: Breakpoint,
    property: string
  ): Record<Breakpoint, StyleObject> {
    const newResponsiveStyles = { ...responsiveStyles };
    const breakpointStyles = newResponsiveStyles[breakpoint];

    if (breakpointStyles) {
      const { [property]: removed, ...remaining } = breakpointStyles;

      if (Object.keys(remaining).length === 0) {
        delete newResponsiveStyles[breakpoint];
      } else {
        newResponsiveStyles[breakpoint] = remaining;
      }
    }

    // Update cache
    this.updateOverrideCache(componentId, breakpoint, newResponsiveStyles[breakpoint]);

    return newResponsiveStyles;
  }

  /**
   * Clear all overrides for a breakpoint
   */
  clearBreakpointOverrides(
    componentId: ComponentId,
    responsiveStyles: Record<Breakpoint, StyleObject>,
    breakpoint: Breakpoint
  ): Record<Breakpoint, StyleObject> {
    const newResponsiveStyles = { ...responsiveStyles };
    delete newResponsiveStyles[breakpoint];

    // Update cache
    this.updateOverrideCache(componentId, breakpoint, undefined);

    return newResponsiveStyles;
  }

  /**
   * Copy overrides from one breakpoint to another
   */
  copyOverrides(
    responsiveStyles: Record<Breakpoint, StyleObject>,
    fromBreakpoint: Breakpoint,
    toBreakpoint: Breakpoint
  ): Record<Breakpoint, StyleObject> {
    const newResponsiveStyles = { ...responsiveStyles };
    const fromStyles = responsiveStyles[fromBreakpoint];

    if (fromStyles) {
      newResponsiveStyles[toBreakpoint] = { ...fromStyles };
    }

    return newResponsiveStyles;
  }

  /**
   * Get style override information
   */
  getOverrideInfo(
    baseStyles: StyleObject,
    responsiveStyles: Record<Breakpoint, StyleObject>,
    property: string,
    breakpoint: Breakpoint
  ): ResponsiveStyleOverride {
    const isOverridden = this.isOverridden(baseStyles, responsiveStyles, property, breakpoint);
    const isInherited = this.isInherited(baseStyles, responsiveStyles, property, breakpoint);

    // Find source breakpoint if inherited
    let sourceBreakpoint: Breakpoint | undefined;
    if (isInherited && !isOverridden) {
      const breakpointOrder = this.breakpointManager.getBreakpointOrder();
      const currentIndex = breakpointOrder.indexOf(breakpoint);

      for (let i = 0; i < currentIndex; i++) {
        const bp = breakpointOrder[i];
        if (this.isOverridden(baseStyles, responsiveStyles, property, bp)) {
          sourceBreakpoint = bp;
          break;
        }
      }
    }

    return {
      breakpoint,
      styles: {
        [property]: this.getEffectiveStyles(baseStyles, responsiveStyles, breakpoint)[
          property as keyof StyleObject
        ],
      },
      isOverridden,
      sourceBreakpoint,
    };
  }

  /**
   * Serialize responsive styles
   */
  serializeResponsiveStyles(
    componentId: ComponentId,
    baseStyles: StyleObject,
    responsiveStyles: Record<Breakpoint, StyleObject>
  ): SerializedResponsiveStyles {
    return {
      base: baseStyles,
      overrides: responsiveStyles,
      metadata: {
        version: '1.0.0',
        lastModified: Date.now(),
        componentId,
      },
    };
  }

  /**
   * Deserialize responsive styles
   */
  deserializeResponsiveStyles(data: SerializedResponsiveStyles): {
    base: StyleObject;
    responsiveStyles: Record<Breakpoint, StyleObject>;
  } {
    return {
      base: data.base,
      responsiveStyles: data.overrides,
    };
  }

  /**
   * Update override cache
   */
  private updateOverrideCache(
    componentId: ComponentId,
    breakpoint: Breakpoint,
    styles?: StyleObject
  ): void {
    if (!this.overrideCache.has(componentId)) {
      this.overrideCache.set(componentId, new Map());
    }

    const componentCache = this.overrideCache.get(componentId)!;
    if (styles) {
      componentCache.set(breakpoint, styles);
    } else {
      componentCache.delete(breakpoint);
    }
  }

  /**
   * Get cached override styles
   */
  getCachedOverrides(componentId: ComponentId, breakpoint: Breakpoint): StyleObject | undefined {
    const componentCache = this.overrideCache.get(componentId);
    return componentCache?.get(breakpoint);
  }

  /**
   * Clear style cache for a component
   */
  clearComponentCache(componentId: ComponentId): void {
    this.overrideCache.delete(componentId);
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    this.styleCache.clear();
    this.overrideCache.clear();
  }

  /**
   * Generate CSS for responsive styles
   */
  generateResponsiveCss(
    className: string,
    baseStyles: StyleObject,
    responsiveStyles: Record<Breakpoint, StyleObject>
  ): string {
    const cssRules: string[] = [];

    // Base styles
    cssRules.push(`.${className} { ${this.stylesToCss(baseStyles)} }`);

    // Responsive styles
    for (const breakpoint of this.breakpointManager.getBreakpointOrder()) {
      const breakpointStyles = responsiveStyles[breakpoint];
      if (breakpointStyles) {
        const mediaQuery = this.getMediaQuery(breakpoint);
        cssRules.push(`${mediaQuery} { .${className} { ${this.stylesToCss(breakpointStyles)} } }`);
      }
    }

    return cssRules.join('\n');
  }

  /**
   * Convert style object to CSS string
   */
  private stylesToCss(styles: StyleObject): string {
    return Object.entries(styles)
      .map(([property, value]) => {
        const cssProperty = this.camelToKebab(property);
        return `${cssProperty}: ${this.formatValue(value)};`;
      })
      .join(' ');
  }

  /**
   * Convert camel case to kebab case
   */
  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Format CSS value
   */
  private formatValue(value: any): string {
    if (typeof value === 'number') {
      return `${value}px`;
    }
    return String(value);
  }

  /**
   * Get media query for breakpoint
   */
  private getMediaQuery(breakpoint: Breakpoint): string {
    const device = this.breakpointManager.getDevicesByBreakpoint(breakpoint)[0];
    return `@media (min-width: ${device.width}px)`;
  }
}

/**
 * Global responsive style manager instance
 */
let globalStyleManager: ResponsiveStyleManager | null = null;

/**
 * Get or create the global responsive style manager
 */
export function getGlobalResponsiveStyleManager(): ResponsiveStyleManager {
  if (!globalStyleManager) {
    globalStyleManager = new ResponsiveStyleManager();
  }
  return globalStyleManager;
}

/**
 * Reset the global responsive style manager
 */
export function resetGlobalResponsiveStyleManager(): void {
  globalStyleManager = null;
}
