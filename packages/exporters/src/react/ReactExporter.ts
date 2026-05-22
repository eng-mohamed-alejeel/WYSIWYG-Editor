/**
 * React Exporter
 *
 * Exports projects to React components.
 */

import { Project, Page, ComponentNode, ExportResult, ExportOptions } from '@wysiwyg/core';
import { Exporter, ExportContext } from '../types';

export class ReactExporter implements Exporter {
  format = 'react' as const;

  async exportProject(project: Project, options?: ExportOptions): Promise<ExportResult> {
    try {
      const context: ExportContext = {
        project,
        config: {
          format: 'react',
          includeSourceMaps: options?.includeSourceMaps ?? false,
          minify: options?.minify ?? false,
          optimizeAssets: options?.optimizeAssets ?? false,
          customExportPath: options?.customOptions?.customExportPath
        },
        assets: [],
        styles: []
      };

      // Generate React components for each page
      const pagesComponents = await Promise.all(
        project.pages.map(page => this.exportPage(page, options))
      );

      const components = this.generateProjectComponents(project, pagesComponents, context);

      return {
        success: true,
        data: {
          components,
          assets: context.assets,
          styles: context.styles
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async exportPage(page: Page, options?: ExportOptions): Promise<ExportResult> {
    try {
      const componentsCode = await Promise.all(
        page.components.map(component => this.exportComponent(component, options))
      );

      const componentCode = this.generatePageComponent(page, componentsCode);

      return {
        success: true,
        data: { componentCode }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async exportComponent(component: ComponentNode, options?: ExportOptions): Promise<ExportResult> {
    try {
      const componentCode = this.generateComponentCode(component);

      return {
        success: true,
        data: { componentCode }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  validateOptions(options: ExportOptions): boolean {
    return options.format === 'react';
  }

  private generateProjectComponents(
    project: Project,
    pagesComponents: ExportResult[],
    context: ExportContext
  ): Record<string, string> {
    const components: Record<string, string> = {};

    // Generate theme provider
    components['ThemeProvider.tsx'] = this.generateThemeProvider(project, context);

    // Generate each page component
    pagesComponents.forEach((result, index) => {
      const page = project.pages[index];
      if (page && result.data?.componentCode) {
        components[`${this.toPascalCase(page.name)}.tsx`] = result.data.componentCode;
      }
    });

    // Generate main App component
    components['App.tsx'] = this.generateAppComponent(project, context);

    return components;
  }

  private generatePageComponent(page: Page, componentsCode: ExportResult[]): string {
    const imports = this.generateImports(page.components);
    const render = componentsCode.map(result => result.data?.componentCode || '').join('');

    return `import React from 'react';
${imports}

interface ${this.toPascalCase(page.name)}Props {
  className?: string;
  style?: React.CSSProperties;
}

export const ${this.toPascalCase(page.name)}: React.FC<${this.toPascalCase(page.name)}Props> = ({
  className,
  style
}) => {
  return (
    <div className={\`page page-${page.id} \${className || ''}\`} style={style}>
      {render}
    </div>
  );
};

export default ${this.toPascalCase(page.name)};`;
  }

  private generateComponentCode(component: ComponentNode): string {
    const style = this.generateStyleObject(component.styles);
    const childrenCode = component.children
      .map(child => this.generateComponentCode(child))
      .join('');

    return `<div id="${component.id}" className="component component-${component.type}" style={${style}}>
  {childrenCode}
</div>`;
  }

  private generateStyleObject(styles: Record<string, any>): string {
    const styleEntries = Object.entries(styles)
      .map(([key, value]) => `    '${key}': '${value}'`)
      .join(',\n');

    return `{
${styleEntries}
  }`;
  }

  private generateImports(components: ComponentNode[]): string {
    const uniqueTypes = new Set<string>();

    const collectTypes = (component: ComponentNode) => {
      uniqueTypes.add(component.type);
      component.children.forEach(collectTypes);
    };

    components.forEach(collectTypes);

    return Array.from(uniqueTypes)
      .map(type => `import { ${this.toPascalCase(type)} } from './components/${this.toPascalCase(type)}';`)
      .join('\n');
  }

  private generateThemeProvider(project: Project, context: ExportContext): string {
    const theme = project.theme || {};
    const themeObject = JSON.stringify(theme, null, 2);

    return `import React, { createContext, useContext } from 'react';

const ThemeContext = createContext<any>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = ${themeObject};

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;`;
  }

  private generateAppComponent(project: Project, context: ExportContext): string {
    const pageImports = project.pages
      .map(page => `import ${this.toPascalCase(page.name)} from './${this.toPascalCase(page.name)}';`)
      .join('\n');

    const pageComponents = project.pages
      .map(page => `        <${this.toPascalCase(page.name)} key={page.id} />`)
      .join('\n');

    return `import React from 'react';
import { ThemeProvider } from './ThemeProvider';
${pageImports}

function App() {
  return (
    <ThemeProvider>
${pageComponents}
    </ThemeProvider>
  );
}

export default App;`;
  }

  private toPascalCase(str: string): string {
    return str
      .replace(/[-_]/g, ' ')
      .replace(/\w/g, l => l.toUpperCase())
      .replace(/\s+/g, '');
  }
}
