/**
 * Style Generator
 *
 * This module handles the generation of CSS styles from style objects.
 */

import { StyleObject, Breakpoint } from '@wysiwyg/core';
import { DEFAULT_BREAKPOINTS } from '@wysiwyg/shared';
import { StyleGenerator } from './types';

type SafeStyleRecord = Record<string, string | number | undefined>;

/**
 * Default style generator implementation
 */
export class DefaultStyleGenerator implements StyleGenerator {
  /**
   * Generate CSS from style object
   */
  generate(
    styles: StyleObject,
    responsiveStyles?: Record<Breakpoint, StyleObject>,
    breakpoint?: Breakpoint
  ): string {
    const baseStyles = this.styleObjectToCss(styles);

    if (responsiveStyles == null || breakpoint == null) {
      return baseStyles;
    }

    // Merge responsive styles
    const mergedStyles = this.mergeResponsiveStyles(styles, responsiveStyles, breakpoint);
    return this.styleObjectToCss(mergedStyles);
  }

  /**
   * Convert style object to CSS string
   */
  private styleObjectToCss(styles: StyleObject): string {
    const record = styles as SafeStyleRecord;
    return Object.entries(record)
      .map(([property, value]) => {
        const cssProperty = this.camelCaseToKebabCase(property);
        return `${cssProperty}: ${this.formatValue(value)};`;
      })
      .join(' ');
  }

  /**
   * Merge responsive styles for a specific breakpoint
   */
  private mergeResponsiveStyles(
    baseStyles: StyleObject,
    responsiveStyles: Record<Breakpoint, StyleObject>,
    breakpoint: Breakpoint
  ): StyleObject {
    const merged: SafeStyleRecord = { ...(baseStyles as SafeStyleRecord) };

    // Apply styles from smaller breakpoints
    if (breakpoint === 'tablet') {
      const mobileStyles = responsiveStyles.mobile as SafeStyleRecord | undefined;
      if (mobileStyles != null) Object.assign(merged, mobileStyles);
    } else if (breakpoint === 'desktop') {
      const mobileStyles = responsiveStyles.mobile as SafeStyleRecord | undefined;
      const tabletStyles = responsiveStyles.tablet as SafeStyleRecord | undefined;
      if (mobileStyles != null) Object.assign(merged, mobileStyles);
      if (tabletStyles != null) Object.assign(merged, tabletStyles);
    } else if (breakpoint === 'wide') {
      const mobileStyles = responsiveStyles.mobile as SafeStyleRecord | undefined;
      const tabletStyles = responsiveStyles.tablet as SafeStyleRecord | undefined;
      const desktopStyles = responsiveStyles.desktop as SafeStyleRecord | undefined;
      if (mobileStyles != null) Object.assign(merged, mobileStyles);
      if (tabletStyles != null) Object.assign(merged, tabletStyles);
      if (desktopStyles != null) Object.assign(merged, desktopStyles);
    }

    // Apply current breakpoint styles
    const bpStyles = responsiveStyles[breakpoint] as SafeStyleRecord | undefined;
    if (bpStyles != null) Object.assign(merged, bpStyles);

    return merged as StyleObject;
  }

  /**
   * Convert camel case to kebab case
   */
  private camelCaseToKebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Format CSS value
   */
  private formatValue(value: string | number | undefined): string {
    if (typeof value === 'number') {
      return `${value}px`;
    }
    return String(value ?? '');
  }

  /**
   * Generate responsive CSS with media queries
   */
  generateResponsiveCss(
    styles: StyleObject,
    responsiveStyles?: Record<Breakpoint, StyleObject>
  ): string {
    const cssRules: string[] = [];

    // Base styles
    cssRules.push(this.styleObjectToCss(styles));

    // Responsive styles
    if (responsiveStyles != null) {
      const record = responsiveStyles as Record<string, StyleObject>;
      Object.entries(record).forEach(([breakpoint, breakpointStyles]) => {
        const mediaQuery = this.generateMediaQuery(breakpoint as Breakpoint);
        const css = this.styleObjectToCss(breakpointStyles);
        cssRules.push(`${mediaQuery} { ${css} }`);
      });
    }

    return cssRules.join('\n');
  }

  /**
   * Generate media query for a breakpoint
   */
  private generateMediaQuery(breakpoint: Breakpoint): string {
    const breakpointValue = DEFAULT_BREAKPOINTS[breakpoint];
    return `@media (min-width: ${breakpointValue})`;
  }

  /**
   * Generate scoped CSS with a unique class name
   */
  generateScopedCss(
    className: string,
    styles: StyleObject,
    responsiveStyles?: Record<Breakpoint, StyleObject>
  ): string {
    const baseStyles = this.styleObjectToCss(styles);
    let css = `.${className} { ${baseStyles} }`;

    if (responsiveStyles != null) {
      const record = responsiveStyles as Record<string, StyleObject>;
      Object.entries(record).forEach(([breakpoint, breakpointStyles]) => {
        const mediaQuery = this.generateMediaQuery(breakpoint as Breakpoint);
        const breakpointCss = this.styleObjectToCss(breakpointStyles);
        css += `\n${mediaQuery} { .${className} { ${breakpointCss} } }`;
      });
    }

    return css;
  }

  /**
   * Generate CSS variables from theme
   */
  generateThemeVariables(theme: Record<string, unknown>): string {
    const variables: string[] = [];

    const t = theme;

    // Colors
    if (t.colors != null && typeof t.colors === 'object') {
      Object.entries(t.colors as Record<string, unknown>).forEach(([name, value]) => {
        variables.push(`--color-${name}: ${String(value)};`);
      });
    }

    // Typography
    if (t.typography != null && typeof t.typography === 'object') {
      const ty = t.typography as Record<string, unknown>;
      if (ty.fontFamily != null && typeof ty.fontFamily === 'object') {
        Object.entries(ty.fontFamily as Record<string, unknown>).forEach(([name, value]) => {
          variables.push(`--font-${name}: ${String(value)};`);
        });
      }
      if (ty.fontSize != null && typeof ty.fontSize === 'object') {
        Object.entries(ty.fontSize as Record<string, unknown>).forEach(([name, value]) => {
          variables.push(`--font-size-${name}: ${String(value)};`);
        });
      }
      if (ty.fontWeight != null && typeof ty.fontWeight === 'object') {
        Object.entries(ty.fontWeight as Record<string, unknown>).forEach(([name, value]) => {
          variables.push(`--font-weight-${name}: ${String(value)};`);
        });
      }
      if (ty.lineHeight != null && typeof ty.lineHeight === 'object') {
        Object.entries(ty.lineHeight as Record<string, unknown>).forEach(([name, value]) => {
          variables.push(`--line-height-${name}: ${String(value)};`);
        });
      }
    }

    // Spacing
    if (t.spacing != null && typeof t.spacing === 'object') {
      Object.entries(t.spacing as Record<string, unknown>).forEach(([name, value]) => {
        variables.push(`--spacing-${name}: ${String(value)};`);
      });
    }

    // Border radius
    if (t.borderRadius != null && typeof t.borderRadius === 'object') {
      Object.entries(t.borderRadius as Record<string, unknown>).forEach(([name, value]) => {
        variables.push(`--radius-${name}: ${String(value)};`);
      });
    }

    // Shadows
    if (t.shadows != null && typeof t.shadows === 'object') {
      Object.entries(t.shadows as Record<string, unknown>).forEach(([name, value]) => {
        variables.push(`--shadow-${name}: ${String(value)};`);
      });
    }

    // Breakpoints
    if (t.breakpoints != null && typeof t.breakpoints === 'object') {
      Object.entries(t.breakpoints as Record<string, unknown>).forEach(([name, value]) => {
        variables.push(`--breakpoint-${name}: ${String(value)};`);
      });
    }

    // Custom tokens
    if (t.customTokens != null && typeof t.customTokens === 'object') {
      Object.entries(t.customTokens as Record<string, unknown>).forEach(([name, value]) => {
        variables.push(`--${name}: ${String(value)};`);
      });
    }

    return `:root {\n${variables.join('\n')}\n}`;
  }
}

/**
 * Create a singleton instance of the style generator
 */
let globalStyleGenerator: DefaultStyleGenerator | null = null;

/**
 * Get or create the global style generator
 */
export function getGlobalStyleGenerator(): DefaultStyleGenerator {
  if (globalStyleGenerator === null) {
    globalStyleGenerator = new DefaultStyleGenerator();
  }
  return globalStyleGenerator;
}

/**
 * Reset the global style generator
 */
export function resetGlobalStyleGenerator(): void {
  globalStyleGenerator = null;
}
