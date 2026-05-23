/**
 * Next.js Exporter
 *
 * Exports projects to Next.js framework with App Router support
 */

import { Project, Page, ComponentNode, ExportResult, ExportOptions } from '@wysiwyg/core';
import { BaseAdapter } from '../adapters/BaseAdapter';
import { ExportContext } from '../types';

export class NextjsExporter extends BaseAdapter {
  readonly format = 'nextjs' as const;

  async exportProject(project: Project, options?: ExportOptions): Promise<ExportResult> {
    try {
      const context = this.createContext(project, options);
      await this.processAssets(project.assets, context);

      const files: Record<string, string> = {};

      // Generate app directory structure
      files['app/layout.tsx'] = this.generateLayout(project, context);
      files['app/page.tsx'] = this.generateHomePage(project, context);
      files['app/globals.css'] = this.generateGlobalStyles(project, context);

      // Generate page components
      for (const page of project.pages) {
        const pagePath = page.slug === 'home' ? 'page' : page.slug;
        files[`app/${pagePath}/page.tsx`] = this.generatePageComponent(page, context);
      }

      // Generate components
      files['components/ThemeProvider.tsx'] = this.generateThemeProvider(project);
      files['components/Navigation.tsx'] = this.generateNavigation(project);
      files['components/Footer.tsx'] = this.generateFooter(project);

      // Generate configuration files
      files['next.config.js'] = this.generateNextConfig(project);
      files['tailwind.config.ts'] = this.generateTailwindConfig(project);
      files['tsconfig.json'] = this.generateTSConfig();

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
      const componentCode = this.generatePageComponent(page, context);

      return {
        success: true,
        data: { componentCode },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async exportComponent(component: ComponentNode, options?: ExportOptions): Promise<ExportResult> {
    try {
      const componentCode = this.generateComponentCode(component);
      return {
        success: true,
        data: { componentCode },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  validateOptions(options: ExportOptions): boolean {
    return options.format === 'nextjs';
  }

  private generateLayout(project: Project, context: ExportContext): string {
    return `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '${project.name}',
  description: '${project.description || ''}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}`;
  }

  private generateHomePage(project: Project, context: ExportContext): string {
    const homePage = project.pages.find((p) => p.slug === 'home');
    if (!homePage) {
      return `export default function HomePage() {
  return <div>No home page found</div>;
}`;
    }

    return this.generatePageComponent(homePage, context);
  }

  private generatePageComponent(page: Page, context: ExportContext): string {
    const components = page.components.map((comp) => this.generateComponentCode(comp)).join('\n  ');

    return `import React from 'react';

export default function ${this.toPascalCase(page.name)}() {
  return (
    <div className="page page-${page.id}">
      {${components}}
    </div>
  );
}`;
  }

  private generateComponentCode(component: ComponentNode): string {
    const style = this.generateStyleObject(component.styles);
    const responsiveStyles = this.generateResponsiveStyles(component, {} as any);
    const children = component.children
      .map((child) => this.generateComponentCode(child))
      .join('\n      ');

    return `<${this.toPascalCase(component.type)}
      id="${component.id}"
      className="component component-${component.type}"
      style={${style}}
    >
      {${children}}
    </${this.toPascalCase(component.type)}>`;
  }

  private generateStyleObject(styles: Record<string, string | number>): string {
    const entries = Object.entries(styles)
      .map(([key, value]) => `      '${key}': '${value}'`)
      .join(',\n');
    return `{\n${entries}\n    }`;
  }

  private generateThemeProvider(project: Project): string {
    const theme = JSON.stringify(project.theme, null, 2);

    return `'use client';

import React, { createContext, useContext } from 'react';

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = ${theme};

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};`;
  }

  private generateNavigation(project: Project): string {
    const navLinks = project.pages
      .map(
        (page) =>
          `        <Link href="/${page.slug === 'home' ? '' : page.slug}">${page.name}</Link>`
      )
      .join('\n');

    return `'use client';

import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            ${project.name}
          </Link>
          <div className="flex gap-4">
${navLinks}
          </div>
        </div>
      </div>
    </nav>
  );
}`;
  }

  private generateFooter(project: Project): string {
    return `export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-gray-600">
          © ${new Date().getFullYear()} ${project.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}`;
  }

  private generateGlobalStyles(project: Project, context: ExportContext): string {
    const themeStyles = this.generateThemeStyles(project.theme);

    return `@tailwind base;
@tailwind components;
@tailwind utilities;

${themeStyles}

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}`;
  }

  private generateNextConfig(project: Project): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;`;
  }

  private generateTailwindConfig(project: Project): string {
    const colors = project.theme.colors;
    const colorConfig = Object.entries(colors)
      .map(([key, value]) => `      '${key}': '${value}'`)
      .join(',\n');

    return `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
${colorConfig}
      },
      spacing: {
        ...Object.fromEntries(
          Object.entries(${JSON.stringify(project.theme.spacing)}).map(([k, v]) => [k, v])
        ),
      },
      borderRadius: {
        ...Object.fromEntries(
          Object.entries(${JSON.stringify(project.theme.borderRadius)}).map(([k, v]) => [k, v])
        ),
      },
      boxShadow: {
        ...Object.fromEntries(
          Object.entries(${JSON.stringify(project.theme.shadows)}).map(([k, v]) => [k, v])
        ),
      },
    },
  },
  plugins: [],
};

export default config;`;
  }

  private generateTSConfig(): string {
    return `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;
  }
}
