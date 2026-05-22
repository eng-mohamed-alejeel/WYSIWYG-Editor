/**
 * Style Generator
 * 
 * This module handles the generation of CSS styles from style objects.
 */

import { StyleObject, StyleProperty, Breakpoint } from '@wysiwyg/core';
import { DEFAULT_BREAKPOINTS } from '@wysiwyg/shared';
import { StyleGenerator } from './types';

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

    if (!responsiveStyles || !breakpoint) {
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
    return Object.entries(styles)
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
    const merged: StyleObject = { ...baseStyles };

    // Apply styles from smaller breakpoints
    if (breakpoint === 'tablet') {
      Object.assign(merged, responsiveStyles.mobile || {});
    } else if (breakpoint === 'desktop') {
      Object.assign(merged, responsiveStyles.mobile || {});
      Object.assign(merged, responsiveStyles.tablet || {});
    } else if (breakpoint === 'wide') {
      Object.assign(merged, responsiveStyles.mobile || {});
      Object.assign(merged, responsiveStyles.tablet || {});
      Object.assign(merged, responsiveStyles.desktop || {});
    }

    // Apply current breakpoint styles
    Object.assign(merged, responsiveStyles[breakpoint] || {});

    return merged;
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
  private formatValue(value: any): string {
    if (typeof value === 'number') {
      return `${value}px`;
    }
    return String(value);
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
    if (responsiveStyles) {
      Object.entries(responsiveStyles).forEach(([breakpoint, breakpointStyles]) => {
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

    if (responsiveStyles) {
      Object.entries(responsiveStyles).forEach(([breakpoint, breakpointStyles]) => {
        const mediaQuery = this.generateMediaQuery(breakpoint as Breakpoint);
        const breakpointCss = this.styleObjectToCss(breakpointStyles);
        css += `
${mediaQuery} { .${className} { ${breakpointCss} } }`;
      });
    }

    return css;
  }

  /**
   * Generate CSS variables from theme
   */
  generateThemeVariables(theme: any): string {
    const variables: string[] = [];

    // Colors
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([name, value]) => {
        variables.push(`--color-${name}: ${value};`);
      });
    }

    // Typography
    if (theme.typography) {
      if (theme.typography.fontFamily) {
        Object.entries(theme.typography.fontFamily).forEach(([name, value]) => {
          variables.push(`--font-${name}: ${value};`);
        });
      }
      if (theme.typography.fontSize) {
        Object.entries(theme.typography.fontSize).forEach(([name, value]) => {
          variables.push(`--font-size-${name}: ${value};`);
        });
      }
      if (theme.typography.fontWeight) {
        Object.entries(theme.typography.fontWeight).forEach(([name, value]) => {
          variables.push(`--font-weight-${name}: ${value};`);
        });
      }
      if (theme.typography.lineHeight) {
        Object.entries(theme.typography.lineHeight).forEach(([name, value]) => {
          variables.push(`--line-height-${name}: ${value};`);
        });
      }
    }

    // Spacing
    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([name, value]) => {
        variables.push(`--spacing-${name}: ${value};`);
      });
    }

    // Border radius
    if (theme.borderRadius) {
      Object.entries(theme.borderRadius).forEach(([name, value]) => {
        variables.push(`--radius-${name}: ${value};`);
      });
    }

    // Shadows
    if (theme.shadows) {
      Object.entries(theme.shadows).forEach(([name, value]) => {
        variables.push(`--shadow-${name}: ${value};`);
      });
    }

    // Breakpoints
    if (theme.breakpoints) {
      Object.entries(theme.breakpoints).forEach(([name, value]) => {
        variables.push(`--breakpoint-${name}: ${value};`);
      });
    }

    // Custom tokens
    if (theme.customTokens) {
      Object.entries(theme.customTokens).forEach(([name, value]) => {
        variables.push(`--${name}: ${value};`);
      });
    }

    return `:root {
${variables.join('\n')}
}`;
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
  if (!globalStyleGenerator) {
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
