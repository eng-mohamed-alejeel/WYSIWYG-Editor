/**
 * Style Utilities
 *
 * Utility functions for handling CSS styles in components.
 */

import React from 'react';

/**
 * Parse inline styles from a string
 */
export function parseInlineStyles(style?: string): React.CSSProperties {
  if (!style) return {};

  const styles: Record<string, string> = {};
  const declarations = style.split(';').filter(Boolean);

  for (const declaration of declarations) {
    const [property, value] = declaration.split(':').map(s => s.trim());
    if (property && value) {
      styles[property] = value;
    }
  }

  return styles as React.CSSProperties;
}

/**
 * Merge multiple style objects safely
 */
export function mergeStyles(...styleObjects: Array<Record<string, any> | undefined>): React.CSSProperties {
  const merged: Record<string, any> = {};

  for (const styleObj of styleObjects) {
    if (styleObj && typeof styleObj === 'object') {
      Object.assign(merged, styleObj);
    }
  }

  return merged as React.CSSProperties;
}
