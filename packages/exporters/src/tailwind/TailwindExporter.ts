/**
 * Tailwind CSS Exporter
 *
 * Exports projects with Tailwind CSS utility classes and configuration
 */

import { Project, Page, ComponentNode, ExportResult, ExportOptions } from '@wysiwyg/core';
import { BaseAdapter } from '../adapters/BaseAdapter';
import { ExportContext } from '../types';

export class TailwindExporter extends BaseAdapter {
  readonly format = 'tailwind' as const;

  async exportProject(project: Project, options?: ExportOptions): Promise<ExportResult> {
    try {
      const context = this.createContext(project, options);
      await this.processAssets(project.assets, context);

      const files: Record<string, string> = {};

      // Generate Tailwind configuration
      files['tailwind.config.js'] = this.generateTailwindConfig(project);
      files['tailwind.config.preset.js'] = this.generateTailwindPreset(project);

      // Generate CSS files
      files['styles/globals.css'] = this.generateGlobalStyles(project, context);
      files['styles/components.css'] = this.generateComponentStyles(project, context);
      files['styles/utilities.css'] = this.generateUtilityStyles(project);

      // Generate HTML with Tailwind classes
      files['index.html'] = this.generateHtml(project, context);

      // Generate component files with Tailwind classes
      for (const page of project.pages) {
        files[`pages/${page.slug}.html`] = this.generatePageHtml(page, context);
      }

      return {
        success: true,
        data: {
          files,
          assets: context.assets,
          styles: context.styles,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async exportPage(page: Page, options?: ExportOptions): Promise<ExportResult> {
    try {
      const context = this.createContext(page as any, options);
      const html = this.generatePageHtml(page, context);

      return {
        success: true,
        data: { html },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async exportComponent(component: ComponentNode, options?: ExportOptions): Promise<ExportResult> {
    try {
      const html = this.generateComponentHtml(component);
      const css = this.generateComponentTailwindClasses(component);

      return {
        success: true,
        data: { html, css },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  validateOptions(options: ExportOptions): boolean {
    return options.format === 'tailwind';
  }

  private generateTailwindConfig(project: Project): string {
    const colors = this.generateColorConfig(project.theme.colors);
    const spacing = this.generateSpacingConfig(project.theme.spacing);
    const borderRadius = this.generateBorderRadiusConfig(project.theme.borderRadius);
    const shadows = this.generateShadowConfig(project.theme.shadows);
    const breakpoints = this.generateBreakpointConfig(project.theme.breakpoints);

    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
${colors}
      },
      spacing: {
${spacing}
      },
      borderRadius: {
${borderRadius}
      },
      boxShadow: {
${shadows}
      },
      screens: {
${breakpoints}
      },
    },
  },
  plugins: [],
  presets: [
    require('./tailwind.config.preset'),
  ],
};`;
  }

  private generateTailwindPreset(project: Project): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ['${project.theme.typography.fontFamily.heading}', 'sans-serif'],
        body: ['${project.theme.typography.fontFamily.body}', 'sans-serif'],
        mono: ['${project.theme.typography.fontFamily.mono}', 'monospace'],
      },
      fontSize: {
        xs: '${project.theme.typography.fontSize.xs}',
        sm: '${project.theme.typography.fontSize.sm}',
        base: '${project.theme.typography.fontSize.base}',
        lg: '${project.theme.typography.fontSize.lg}',
        xl: '${project.theme.typography.fontSize.xl}',
        '2xl': '${project.theme.typography.fontSize['2xl']}',
        '3xl': '${project.theme.typography.fontSize['3xl']}',
        '4xl': '${project.theme.typography.fontSize['4xl']}',
      },
      fontWeight: {
        light: ${project.theme.typography.fontWeight.light},
        normal: ${project.theme.typography.fontWeight.normal},
        medium: ${project.theme.typography.fontWeight.medium},
        semibold: ${project.theme.typography.fontWeight.semibold},
        bold: ${project.theme.typography.fontWeight.bold},
      },
      lineHeight: {
        tight: ${project.theme.typography.lineHeight.tight},
        normal: ${project.theme.typography.lineHeight.normal},
        relaxed: ${project.theme.typography.lineHeight.relaxed},
      },
    },
  },
};`;
  }

  private generateColorConfig(colors: any): string {
    return Object.entries(colors)
      .filter(([_, value]) => typeof value === 'string')
      .map(([key, value]) => `        '${key}': '${value}'`)
      .join(',\n');
  }

  private generateSpacingConfig(spacing: any): string {
    return Object.entries(spacing)
      .map(([key, value]) => `        '${key}': '${value}'`)
      .join(',\n');
  }

  private generateBorderRadiusConfig(radius: any): string {
    return Object.entries(radius)
      .map(([key, value]) => `        '${key}': '${value}'`)
      .join(',\n');
  }

  private generateShadowConfig(shadows: any): string {
    return Object.entries(shadows)
      .map(([key, value]) => `        '${key}': '${value}'`)
      .join(',\n');
  }

  private generateBreakpointConfig(breakpoints: any): string {
    return Object.entries(breakpoints)
      .map(([key, value]) => `        '${key}': '${value}'`)
      .join(',\n');
  }

  private generateGlobalStyles(project: Project, context: ExportContext): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    ${this.generateThemeVariables(project.theme)}
  }
}

@layer components {
  /* Component styles will be injected here */
}`;
  }

  private generateThemeVariables(theme: any): string {
    const variables: string[] = [];

    // Colors
    Object.entries(theme.colors).forEach(([name, value]) => {
      if (typeof value === 'string') {
        variables.push(`    --color-${this.camelToKebab(name)}: ${value};`);
      }
    });

    // Spacing
    Object.entries(theme.spacing).forEach(([name, value]) => {
      variables.push(`    --spacing-${name}: ${value};`);
    });

    // Border radius
    Object.entries(theme.borderRadius).forEach(([name, value]) => {
      variables.push(`    --radius-${name}: ${value};`);
    });

    return variables.join('\n');
  }

  private generateComponentStyles(project: Project, context: ExportContext): string {
    const componentStyles: string[] = [];

    project.pages.forEach((page) => {
      page.components.forEach((component) => {
        const styles = this.generateComponentTailwindClasses(component);
        if (styles) {
          componentStyles.push(styles);
        }
      });
    });

    return `@layer components {
${componentStyles.join('\n\n')}
}`;
  }

  private generateUtilityStyles(project: Project): string {
    return `@layer utilities {
  /* Custom utility classes */
  .container-custom {
    @apply container mx-auto px-4;
  }

  .text-balance {
    text-wrap: balance;
  }
}`;
  }

  private generateHtml(project: Project, context: ExportContext): string {
    const pages = project.pages
      .map(
        (page) =>
          `    <a href="/${page.slug === 'home' ? '' : page.slug}" class="hover:text-gray-300">${page.name}</a>`
      )
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  <link href="./styles/globals.css" rel="stylesheet">
  <link href="./styles/components.css" rel="stylesheet">
  <link href="./styles/utilities.css" rel="stylesheet">
</head>
<body class="font-body text-gray-900 bg-white">
  <nav class="bg-gray-800 text-white">
    <div class="container-custom">
      <div class="flex justify-between items-center py-4">
        <h1 class="text-xl font-bold">${project.name}</h1>
        <div class="flex gap-4">
${pages}
        </div>
      </div>
    </div>
  </nav>
  <main class="min-h-screen">
    <!-- Main content will be rendered here -->
  </main>
  <footer class="bg-gray-100 mt-auto">
    <div class="container-custom py-6">
      <p class="text-center text-sm text-gray-600">
        © ${new Date().getFullYear()} ${project.name}. All rights reserved.
      </p>
    </div>
  </footer>
</body>
</html>`;
  }

  private generatePageHtml(page: Page, context: ExportContext): string {
    const components = page.components.map((comp) => this.generateComponentHtml(comp)).join('\n  ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.name}</title>
  <link href="../styles/globals.css" rel="stylesheet">
  <link href="../styles/components.css" rel="stylesheet">
  <link href="../styles/utilities.css" rel="stylesheet">
</head>
<body class="font-body text-gray-900 bg-white">
  <div class="page page-${page.id}">
    ${components}
  </div>
</body>
</html>`;
  }

  private generateComponentHtml(component: ComponentNode): string {
    const classes = this.generateComponentTailwindClasses(component);
    const children = component.children
      .map((child) => this.generateComponentHtml(child))
      .join('\n    ');

    return `<div id="${component.id}" class="${classes}">
    ${children}
  </div>`;
  }

  private generateComponentTailwindClasses(component: ComponentNode): string {
    const classes: string[] = [`component-${component.type}`];

    // Convert styles to Tailwind classes
    Object.entries(component.styles).forEach(([property, value]) => {
      const tailwindClass = this.styleToTailwindClass(property, value);
      if (tailwindClass) {
        classes.push(tailwindClass);
      }
    });

    // Handle responsive styles
    if (component.responsiveStyles) {
      Object.entries(component.responsiveStyles).forEach(([breakpoint, styles]) => {
        Object.entries(styles).forEach(([property, value]) => {
          const tailwindClass = this.styleToTailwindClass(property, value);
          if (tailwindClass) {
            classes.push(`${breakpoint}:${tailwindClass}`);
          }
        });
      });
    }

    return classes.join(' ');
  }

  private styleToTailwindClass(property: string, value: string | number): string {
    const propertyMap: Record<string, (value: string | number) => string> = {
      backgroundColor: (v) => `bg-${this.camelToKebab(v.toString())}`,
      color: (v) => `text-${this.camelToKebab(v.toString())}`,
      padding: (v) => `p-${this.camelToKebab(v.toString())}`,
      paddingTop: (v) => `pt-${this.camelToKebab(v.toString())}`,
      paddingBottom: (v) => `pb-${this.camelToKebab(v.toString())}`,
      paddingLeft: (v) => `pl-${this.camelToKebab(v.toString())}`,
      paddingRight: (v) => `pr-${this.camelToKebab(v.toString())}`,
      margin: (v) => `m-${this.camelToKebab(v.toString())}`,
      marginTop: (v) => `mt-${this.camelToKebab(v.toString())}`,
      marginBottom: (v) => `mb-${this.camelToKebab(v.toString())}`,
      marginLeft: (v) => `ml-${this.camelToKebab(v.toString())}`,
      marginRight: (v) => `mr-${this.camelToKebab(v.toString())}`,
      fontSize: (v) => `text-${this.camelToKebab(v.toString())}`,
      fontWeight: (v) => `font-${this.camelToKebab(v.toString())}`,
      textAlign: (v) => `text-${this.camelToKebab(v.toString())}`,
      borderRadius: (v) => `rounded-${this.camelToKebab(v.toString())}`,
      borderWidth: (v) => `border-${this.camelToKebab(v.toString())}`,
      borderColor: (v) => `border-${this.camelToKebab(v.toString())}`,
      display: (v) =>
        v === 'flex' ? 'flex' : v === 'grid' ? 'grid' : v === 'block' ? 'block' : '',
      flexDirection: (v) => `flex-${this.camelToKebab(v.toString())}`,
      justifyContent: (v) => `justify-${this.camelToKebab(v.toString())}`,
      alignItems: (v) => `items-${this.camelToKebab(v.toString())}`,
      gap: (v) => `gap-${this.camelToKebab(v.toString())}`,
      width: (v) => (v === '100%' ? 'w-full' : v === '50%' ? 'w-1/2' : `w-[${v}]`),
      height: (v) => (v === '100%' ? 'h-full' : v === '50%' ? 'h-1/2' : `h-[${v}]`),
      maxWidth: (v) => (v === '100%' ? 'max-w-full' : `max-w-[${v}]`),
      maxHeight: (v) => (v === '100%' ? 'max-h-full' : `max-h-[${v}]`),
      position: (v) => `position-${this.camelToKebab(v.toString())}`,
      top: (v) => `top-${this.camelToKebab(v.toString())}`,
      right: (v) => `right-${this.camelToKebab(v.toString())}`,
      bottom: (v) => `bottom-${this.camelToKebab(v.toString())}`,
      left: (v) => `left-${this.camelToKebab(v.toString())}`,
      zIndex: (v) => `z-${v}`,
      opacity: (v) => `opacity-${v}`,
    };

    const converter = propertyMap[property];
    return converter ? converter(value) : '';
  }
}
