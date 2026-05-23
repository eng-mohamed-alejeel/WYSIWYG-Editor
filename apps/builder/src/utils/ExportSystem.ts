import { ComponentNode } from '@wysiwyg/core';
import { ExportOptions } from '../components/ExportDialog';

export class ExportSystem {
  static async exportToHTML(components: ComponentNode[], options: ExportOptions): Promise<string> {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Project</title>
  ${options.includeSourceMaps ? '<!-- Source maps included -->' : ''}
</head>
<body>
`;

    html += this.renderComponentsToHTML(components);

    html += `
</body>
</html>`;

    if (options.minify) {
      html = this.minifyHTML(html);
    }

    return html;
  }

  static async exportToReact(components: ComponentNode[], options: ExportOptions): Promise<string> {
    let code = `import React from 'react';

export const ExportedComponent: React.FC = () => {
  return (
    <div>
`;

    code += this.renderComponentsToReact(components, 2);

    code += `
    </div>
  );
};

export default ExportedComponent;`;

    if (options.minify) {
      code = this.minifyCode(code);
    }

    return code;
  }

  static async exportToWordPress(
    components: ComponentNode[],
    options: ExportOptions
  ): Promise<string> {
    let blocks = `<?php
/**
 * Plugin Name: Custom Blocks
 * Description: Custom blocks exported from WYSIWYG Builder
 * Version: 1.0.0
 */

function register_custom_blocks() {
`;

    blocks += this.renderComponentsToWordPress(components, 2);

    blocks += `}
add_action('init', 'register_custom_blocks');`;

    if (options.minify) {
      blocks = this.minifyCode(blocks);
    }

    return blocks;
  }

  static async exportToOdoo(components: ComponentNode[], options: ExportOptions): Promise<string> {
    let xml = `<?xml version="1.0" encoding="utf-8"?>
<odoo>
  <data noupdate="1">
`;

    xml += this.renderComponentsToOdoo(components, 2);

    xml += `
  </data>
</odoo>`;

    if (options.minify) {
      xml = this.minifyCode(xml);
    }

    return xml;
  }

  private static renderComponentsToHTML(components: ComponentNode[]): string {
    return components
      .map((component) => {
        const props = this.propsToHTMLAttributes(component.props);
        const styles = this.stylesToCSS(component.styles);

        let html = `<${component.type} ${props} style="${styles}">`;

        if (component.children.length > 0) {
          html += this.renderComponentsToHTML(component.children);
        }

        if (component.props?.text) {
          html += component.props.text;
        }

        html += `</${component.type}>`;

        return html;
      })
      .join('\n');
  }

  private static renderComponentsToReact(components: ComponentNode[], indent: number): string {
    return components
      .map((component) => {
        const props = this.propsToReactProps(component.props);
        const styles = this.stylesToReactStyles(component.styles);
        const indentStr = ' '.repeat(indent);

        let code = `${indentStr}<${this.capitalize(component.type)}
`;
        code += `${indentStr}  ${props}
`;
        code += `${indentStr}  style={${styles}}
`;

        if (component.children.length > 0) {
          code += `${indentStr}>
`;
          code += this.renderComponentsToReact(component.children, indent + 2);
          code += `${indentStr}</${this.capitalize(component.type)}>
`;
        } else {
          code += `${indentStr}/>\n`;
        }

        return code;
      })
      .join('\n');
  }

  private static renderComponentsToWordPress(components: ComponentNode[], indent: number): string {
    return components
      .map((component) => {
        const indentStr = ' '.repeat(indent);
        let code = `${indentStr}register_block_type('${component.type}', array(
`;
        code += `${indentStr}  'attributes' => array(
`;
        code += `${indentStr}    'content' => array(
`;
        code += `${indentStr}      'type' => 'string',
`;
        code += `${indentStr}      'default' => '${component.props?.text || ''}',
`;
        code += `${indentStr}    ),
`;
        code += `${indentStr}  ),
`;
        code += `${indentStr}  'render_callback' => function($attributes) {
`;
        code += `${indentStr}    return '<${component.type}>' . $attributes['content'] . '</${component.type}>';
`;
        code += `${indentStr}  },
`;
        code += `${indentStr}));\n`;

        return code;
      })
      .join('\n');
  }

  private static renderComponentsToOdoo(components: ComponentNode[], indent: number): string {
    return components
      .map((component) => {
        const indentStr = ' '.repeat(indent);
        let xml = `${indentStr}<record id="snippet_${component.id}" model="ir.ui.view">
`;
        xml += `${indentStr}  <field name="name">${component.type} Snippet</field>
`;
        xml += `${indentStr}  <field name="type">qweb</field>
`;
        xml += `${indentStr}  <field name="arch" type="xml">
`;
        xml += `${indentStr}    <t t-name="website.snippet_${component.id}">
`;
        xml += `${indentStr}      <${component.type} t-esc="widget.snippet.content"/>
`;
        xml += `${indentStr}    </t>
`;
        xml += `${indentStr}  </field>
`;
        xml += `${indentStr}</record>\n`;

        return xml;
      })
      .join('\n');
  }

  private static propsToHTMLAttributes(props: any): string {
    return Object.entries(props || {})
      .filter(([key]) => key !== 'text')
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
  }

  private static propsToReactProps(props: any): string {
    return Object.entries(props || {})
      .filter(([key]) => key !== 'text')
      .map(([key, value]) => {
        if (typeof value === 'boolean') {
          return `${key}={${value}}`;
        }
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        }
        return `${key}={${JSON.stringify(value)}}`;
      })
      .join('\n');
  }

  private static stylesToCSS(styles: any): string {
    return Object.entries(styles || {})
      .map(([key, value]) => `${this.camelToKebab(key)}: ${value}`)
      .join('; ');
  }

  private static stylesToReactStyles(styles: any): string {
    return JSON.stringify(styles || {});
  }

  private static camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private static minifyHTML(html: string): string {
    return html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
  }

  private static minifyCode(code: string): string {
    return code
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}();,:])\s*/g, '$1')
      .trim();
  }

  static async downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async exportProject(components: ComponentNode[], options: ExportOptions): Promise<void> {
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (options.format) {
      case 'html':
        content = await this.exportToHTML(components, options);
        filename = `${options.customFileName || 'project'}.html`;
        mimeType = 'text/html';
        break;

      case 'react':
        content = await this.exportToReact(components, options);
        filename = `${options.customFileName || 'project'}.tsx`;
        mimeType = 'text/typescript';
        break;

      case 'wordpress':
        content = await this.exportToWordPress(components, options);
        filename = `${options.customFileName || 'blocks'}.php`;
        mimeType = 'text/php';
        break;

      case 'odoo':
        content = await this.exportToOdoo(components, options);
        filename = `${options.customFileName || 'snippets'}.xml`;
        mimeType = 'text/xml';
        break;

      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }

    await this.downloadFile(content, filename, mimeType);
  }
}

export default ExportSystem;
