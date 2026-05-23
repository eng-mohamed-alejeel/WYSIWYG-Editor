/**
 * Component Mapper
 *
 * Maps visual builder components to framework-specific components
 */

import { ComponentNode, ComponentDefinition } from '@wysiwyg/core';
import { ExportFormat } from '../types';

export interface ComponentMapping {
  /**
   * Source component type
   */
  sourceType: string;

  /**
   * Target component type for each format
   */
  targetTypes: Partial<Record<ExportFormat, string>>;

  /**
   * Props mapping function
   */
  mapProps?: (props: Record<string, any>, format: ExportFormat) => Record<string, any>;

  /**
   * Styles mapping function
   */
  mapStyles?: (styles: Record<string, any>, format: ExportFormat) => Record<string, any>;

  /**
   * Custom transformation function
   */
  transform?: (component: ComponentNode, format: ExportFormat) => ComponentNode;

  /**
   * Whether to wrap in a container
   */
  wrapInContainer?: boolean;

  /**
   * Container component type
   */
  containerType?: string;
}

export class ComponentMapper {
  private mappings: Map<string, ComponentMapping> = new Map();
  private formatSpecificMappings: Map<ExportFormat, Map<string, ComponentMapping>> = new Map();

  /**
   * Register a component mapping
   */
  registerMapping(mapping: ComponentMapping): void {
    this.mappings.set(mapping.sourceType, mapping);

    // Register format-specific mappings
    Object.entries(mapping.targetTypes).forEach(([format, targetType]) => {
      if (!this.formatSpecificMappings.has(format as ExportFormat)) {
        this.formatSpecificMappings.set(format as ExportFormat, new Map());
      }
      this.formatSpecificMappings.get(format as ExportFormat)!.set(mapping.sourceType, mapping);
    });
  }

  /**
   * Register multiple component mappings
   */
  registerMappings(mappings: ComponentMapping[]): void {
    mappings.forEach((mapping) => this.registerMapping(mapping));
  }

  /**
   * Get mapping for a component type and format
   */
  getMapping(componentType: string, format: ExportFormat): ComponentMapping | undefined {
    // First check format-specific mappings
    const formatMappings = this.formatSpecificMappings.get(format);
    if (formatMappings?.has(componentType)) {
      return formatMappings.get(componentType);
    }

    // Fall back to general mappings
    return this.mappings.get(componentType);
  }

  /**
   * Map a component to a specific format
   */
  mapComponent(component: ComponentNode, format: ExportFormat): ComponentNode {
    const mapping = this.getMapping(component.type, format);

    if (!mapping) {
      return component;
    }

    let mappedComponent: ComponentNode = { ...component };

    // Transform component type
    if (mapping.targetTypes[format]) {
      mappedComponent.type = mapping.targetTypes[format]!;
    }

    // Map props
    if (mapping.mapProps) {
      mappedComponent.props = mapping.mapProps(component.props, format);
    }

    // Map styles
    if (mapping.mapStyles) {
      mappedComponent.styles = mapping.mapStyles(component.styles, format);
    }

    // Apply custom transformation
    if (mapping.transform) {
      mappedComponent = mapping.transform(mappedComponent, format);
    }

    // Recursively map children
    mappedComponent.children = mappedComponent.children.map((child) =>
      this.mapComponent(child, format)
    );

    return mappedComponent;
  }

  /**
   * Map multiple components
   */
  mapComponents(components: ComponentNode[], format: ExportFormat): ComponentNode[] {
    return components.map((component) => this.mapComponent(component, format));
  }

  /**
   * Check if a component type is mapped for a format
   */
  isMapped(componentType: string, format: ExportFormat): boolean {
    return this.getMapping(componentType, format) !== undefined;
  }

  /**
   * Get all mapped component types for a format
   */
  getMappedTypes(format: ExportFormat): string[] {
    const formatMappings = this.formatSpecificMappings.get(format);
    if (!formatMappings) {
      return [];
    }
    return Array.from(formatMappings.keys());
  }

  /**
   * Remove a mapping
   */
  removeMapping(componentType: string, format?: ExportFormat): void {
    if (format) {
      const formatMappings = this.formatSpecificMappings.get(format);
      if (formatMappings) {
        formatMappings.delete(componentType);
      }
    } else {
      this.mappings.delete(componentType);
      this.formatSpecificMappings.forEach((map) => map.delete(componentType));
    }
  }

  /**
   * Clear all mappings
   */
  clearMappings(): void {
    this.mappings.clear();
    this.formatSpecificMappings.clear();
  }
}

// Create and export singleton instance
export const componentMapper = new ComponentMapper();

// Register default mappings
componentMapper.registerMappings([
  {
    sourceType: 'button',
    targetTypes: {
      html: 'button',
      react: 'Button',
      nextjs: 'Button',
      tailwind: 'button',
      wordpress: 'button',
      odoo: 'button',
    },
    mapProps: (props, format) => {
      if (format === 'react' || format === 'nextjs') {
        return {
          ...props,
          variant: props.variant || 'primary',
          size: props.size || 'medium',
        };
      }
      return props;
    },
  },
  {
    sourceType: 'container',
    targetTypes: {
      html: 'div',
      react: 'Container',
      nextjs: 'Container',
      tailwind: 'div',
      wordpress: 'div',
      odoo: 'div',
    },
    wrapInContainer: true,
    containerType: 'div',
  },
  {
    sourceType: 'text',
    targetTypes: {
      html: 'p',
      react: 'Typography',
      nextjs: 'Typography',
      tailwind: 'p',
      wordpress: 'p',
      odoo: 'p',
    },
    mapProps: (props, format) => {
      if (format === 'react' || format === 'nextjs') {
        return {
          ...props,
          variant: props.variant || 'body1',
        };
      }
      return props;
    },
  },
  {
    sourceType: 'image',
    targetTypes: {
      html: 'img',
      react: 'Image',
      nextjs: 'Image',
      tailwind: 'img',
      wordpress: 'img',
      odoo: 'img',
    },
    mapProps: (props, format) => {
      if (format === 'nextjs') {
        return {
          ...props,
          priority: props.priority || false,
          fill: props.fill || false,
        };
      }
      return props;
    },
  },
  {
    sourceType: 'form',
    targetTypes: {
      html: 'form',
      react: 'Form',
      nextjs: 'Form',
      tailwind: 'form',
      wordpress: 'form',
      odoo: 'form',
    },
  },
  {
    sourceType: 'input',
    targetTypes: {
      html: 'input',
      react: 'TextField',
      nextjs: 'TextField',
      tailwind: 'input',
      wordpress: 'input',
      odoo: 'input',
    },
  },
  {
    sourceType: 'link',
    targetTypes: {
      html: 'a',
      react: 'Link',
      nextjs: 'Link',
      tailwind: 'a',
      wordpress: 'a',
      odoo: 'a',
    },
    mapProps: (props, format) => {
      if (format === 'nextjs') {
        return {
          ...props,
          href: props.href || '/',
        };
      }
      return props;
    },
  },
]);
