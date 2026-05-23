# WYSIWYG Editor Design Tokens

A comprehensive design token and theme system for the WYSIWYG Editor platform, built with modern design system architecture principles.

## Features

- 🎨 **Color Tokens**: Primary, secondary, semantic colors, neutrals, backgrounds, text, and borders
- 📝 **Typography Tokens**: Font families, sizes, weights, line heights, and letter spacing
- 📐 **Spacing Tokens**: Consistent spacing scale from 0 to 96
- ⭕ **Radius Tokens**: Border radius values for consistent rounded corners
- 🌑 **Shadow Tokens**: Pre-defined shadow effects for depth and elevation
- 🌓 **Theme Switching**: Support for light, dark, and auto themes
- 🔄 **CSS Variable Generation**: Automatic CSS custom property generation
- 🎯 **Reusable Shared Styles**: Utility classes and style helpers
- 💾 **Token Serialization**: Export/import tokens in multiple formats
- 🏪 **Marketplace Support**: Infrastructure for theme marketplace
- 🌐 **Global Styles**: Comprehensive base styles and reset

## Installation

\`\`\`bash
npm install @wysiwyg-editor/design-tokens
\`\`\`

## Quick Start

### 1. Wrap your app with ThemeProvider

\`\`\`tsx
import { ThemeProvider, GlobalStyles } from '@wysiwyg-editor/design-tokens';

function App() {
return (
<ThemeProvider>
<GlobalStyles />
{/_ Your app content _/}
</ThemeProvider>
);
}
\`\`\`

### 2. Use design tokens in your components

\`\`\`tsx
import { useTheme } from '@wysiwyg-editor/design-tokens';

function MyComponent() {
const { theme, isDark } = useTheme();

return (
<div style={{
      backgroundColor: theme.tokens.colors.background.default.value,
      color: theme.tokens.colors.text.primary.value,
      padding: theme.tokens.spacing['4'].value + 'rem',
      borderRadius: theme.tokens.radius.md.value + 'rem',
    }}>
{/_ Component content _/}
</div>
);
}
\`\`\`

### 3. Use CSS variables in your styles

\`\`\`css
.my-component {
background-color: var(--dt-background-default);
color: var(--dt-text-primary);
padding: var(--dt-spacing-4);
border-radius: var(--dt-radius-md);
box-shadow: var(--dt-shadows-md);
}
\`\`\`

## API Reference

### Components

#### ThemeProvider

Wraps your application with theme context.

\`\`\`tsx
<ThemeProvider
config={{
    defaultTheme: 'light',
    enableDarkMode: true,
    enableThemeSwitcher: true,
    themeStorageKey: 'my-app-theme',
  }}

> {children}
> </ThemeProvider>
> \`\`\`

#### ThemeSwitcher

A ready-to-use theme switcher component.

\`\`\`tsx
<ThemeSwitcher
  showLabels={true}
  iconSize={20}
  className="custom-class"
/>
\`\`\`

#### GlobalStyles

Applies global styles and resets to your application.

\`\`\`tsx
<GlobalStyles />
\`\`\`

### Hooks

#### useTheme

Access theme context in your components.

\`\`\`tsx
const { theme, themeMode, setTheme, setThemeMode, isDark } = useTheme();
\`\`\`

### Utilities

#### CSS Variables

Generate CSS variables from design tokens.

\`\`\`typescript
import { generateCSSVariables, generateCSSString } from '@wysiwyg-editor/design-tokens';

// Get CSS variables as an object
const variables = generateCSSVariables(tokens);

// Get CSS string
const cssString = generateCSSString(tokens);
\`\`\`

#### Token Serialization

Export/import design tokens in various formats.

\`\`\`typescript
import {
exportToJSON,
exportToCSS,
exportToSCSS,
exportToJS,
exportToTS,
importFromJSON,
} from '@wysiwyg-editor/design-tokens';

// Export tokens
const json = exportToJSON(tokens);
const css = exportToCSS(tokens);
const scss = exportToSCSS(tokens);

// Import tokens
const tokens = importFromJSON(jsonString);
\`\`\`

#### Theme Manager

Manage themes programmatically.

\`\`\`typescript
import { getThemeManager } from '@wysiwyg-editor/design-tokens';

const manager = getThemeManager();

// Add custom theme
manager.addTheme(customTheme);

// Create theme from base
const customTheme = manager.createCustomTheme('light', {
colors: {
primary: { value: '#FF0000' },
},
});

// Export theme
const themeData = manager.exportTheme('custom-theme');
\`\`\`

## Design Token Structure

### Color Tokens

- Primary/Secondary colors with hover/active states
- Semantic colors (success, warning, error, info)
- Neutral color scale (50-900)
- Background colors
- Text colors
- Border colors

### Typography Tokens

- Font families (sans, serif, mono, display)
- Font sizes (xs to 5xl)
- Font weights (light to extrabold)
- Line heights (tight to loose)
- Letter spacing

### Spacing Tokens

Consistent scale from 0 to 96, based on 0.25rem increments.

### Radius Tokens

Border radius values from none to full.

### Shadow Tokens

Pre-defined shadows for various elevation levels.

## Theme Customization

### Creating Custom Themes

\`\`\`typescript
import { ThemeManager } from '@wysiwyg-editor/design-tokens';

const manager = new ThemeManager();

const customTheme = manager.createCustomTheme('light', {
colors: {
primary: { value: '#FF0000' },
primaryHover: { value: '#CC0000' },
},
}, {
name: 'Red Theme',
description: 'A theme with red primary colors',
tags: ['custom', 'red'],
});
\`\`\`

### Theme Marketplace Support

The design token system includes infrastructure for a theme marketplace:

\`\`\`typescript
// Fetch themes from marketplace
const themes = await manager.fetchMarketplaceThemes();

// Publish theme to marketplace
const success = await manager.publishThemeToMarketplace('custom-theme');
\`\`\`

## Best Practices

1. **Always use design tokens**: Avoid hardcoding values in your components
2. **Use CSS variables**: Prefer CSS variables over inline styles for better performance
3. **Theme-aware components**: Make components work in both light and dark modes
4. **Consistent spacing**: Use the spacing scale for all spacing needs
5. **Semantic colors**: Use semantic colors for status indicators
6. **Accessibility**: Ensure color contrast ratios meet WCAG standards

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
