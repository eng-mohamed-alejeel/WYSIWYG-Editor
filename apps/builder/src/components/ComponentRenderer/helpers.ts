import React from 'react';

// Helper function to convert StyleObject to CSSProperties
export const convertStylesToCSS = (
  styles?: Record<string, string | number>
): React.CSSProperties => {
  if (!styles) return {};

  const cssStyles: React.CSSProperties = {};

  for (const [key, value] of Object.entries(styles)) {
    // Convert camelCase to kebab-case for CSS properties
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();

    // Handle specific CSS properties that need special treatment
    if (key === 'alignItems' || key === 'justifyContent' || key === 'flexDirection') {
      // Ensure these are strings, not numbers
      cssStyles[key as keyof React.CSSProperties] = String(value) as any;
    } else {
      cssStyles[cssKey as keyof React.CSSProperties] = value as any;
    }
  }

  return cssStyles;
};
