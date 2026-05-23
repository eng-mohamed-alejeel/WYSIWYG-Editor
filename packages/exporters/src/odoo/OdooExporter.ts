/**
 * Odoo QWeb Exporter
 *
 * Exports projects to Odoo QWeb templates
 */

import { Project, Page, ComponentNode, ExportResult, ExportOptions } from '@wysiwyg/core';
import { BaseAdapter } from '../adapters/BaseAdapter';
import { ExportContext } from '../types';

export class OdooExporter extends BaseAdapter {
  readonly format = 'odoo' as const;

  async exportProject(project: Project, options?: ExportOptions): Promise<ExportResult> {
    try {
      const context = this.createContext(project, options);
      await this.processAssets(project.assets, context);

      const files: Record<string, string> = {};

      // Generate manifest file
      files['__manifest__.py'] = this.generateManifest(project);

      // Generate QWeb templates
      files['views/templates.xml'] = this.generateTemplates(project, context);
      files['views/assets.xml'] = this.generateAssetsXml(project, context);

      // Generate CSS
      files['static/src/css/style.css'] = this.generateMainCss(project, context);

      // Generate JavaScript
      files['static/src/js/main.js'] = this.generateMainJs(project);

      // Generate controller
      files['controllers/main.py'] = this.generateController(project);

      // Generate routes
      files['controllers/__init__.py'] = this.generateControllerInit();

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
      const template = this.generatePageTemplate(page, context);

      return {
        success: true,
        data: { template },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async exportComponent(component: ComponentNode, options?: ExportOptions): Promise<ExportResult> {
    try {
      const qweb = this.generateComponentQWeb(component);
      return {
        success: true,
        data: { qweb },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  validateOptions(options: ExportOptions): boolean {
    return options.format === 'odoo';
  }

  private generateManifest(project: Project): string {
    return `# -*- coding: utf-8 -*-
{
    'name': '${project.name}',
    'version': '${project.metadata.version || '1.0.0'}',
    'category': 'Website',
    'summary': '${project.description || 'Custom website module'}',
    'description': """
${project.description || 'Custom website module'}
    """,
    'author': '${project.metadata.customData?.author || 'Your Company'}',
    'website': '${project.metadata.customData?.website || ''}',
    'license': 'LGPL-3',
    'depends': ['website'],
    'data': [
        'views/assets.xml',
        'views/templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            '${this.camelToKebab(project.name)}/static/src/css/style.css',
            '${this.camelToKebab(project.name)}/static/src/js/main.js',
        ],
    },
    'installable': True,
    'application': True,
}`;
  }

  private generateTemplates(project: Project, context: ExportContext): string<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <data>
        <!-- Main Template -->
        <template id="${this.camelToKebab(project.name)}_main" name="${project.name}">
            ${this.generateMainTemplate(project, context)}
        </template>

        <!-- Page Templates -->
        ${project.pages.map(page => this.generatePageTemplate(page, context)).join('\n        ')}

        <!-- Component Templates -->
        ${this.generateComponentTemplates(project, context)}
    </data>
</odoo>`;
  }

  private generateMainTemplate(project: Project, context: ExportContext): string {
    const pages = project.pages
      .map(page => `        <li><a href="/${page.slug === 'home' ? '' : page.slug}">${page.name}</a></li>`)
      .join('\n');

    return `<t t-call="website.layout">
        <div id="wrap" class="oe_structure oe_empty">
            <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div class="container">
                    <a class="navbar-brand" href="/">${project.name}</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
${pages}
                        </ul>
                    </div>
                </div>
            </nav>

            <main class="container">
                <t t-out="request.httprequest.path == '/' and ${this.camelToKebab(project.name)}_home or request.httprequest.path"/>
            </main>

            <footer class="bg-light mt-4 py-4">
                <div class="container text-center">
                    <p class="mb-0">© ${new Date().getFullYear()} ${project.name}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    </t>`;
  }

  private generatePageTemplate(page: Page, context: ExportContext): string {
    const components = page.components
      .map(comp => this.generateComponentQWeb(comp))
      .join('\n            ');

    return `<template id="${this.camelToKebab(page.name)}" name="${page.name}">
            <div class="page page-${page.id}">
                ${components}
            </div>
        </template>`;
  }

  private generateComponentTemplates(project: Project, context: ExportContext): string {
    const allComponents = project.pages.flatMap(page => page.components);
    return allComponents
      .map(comp => this.generateComponentTemplate(comp))
      .join('\n        ');
  }

  private generateComponentTemplate(component: ComponentNode): string {
    const children = component.children
      .map(child => this.generateComponentQWeb(child))
      .join('\n            ');

    return `<template id="${this.camelToKebab(component.type)}" inherit_id="website.${this.camelToKebab(component.type)}" name="${component.type}">
            <div class="component component-${component.type}" t-att-id="'${component.id}'">
                ${children}
            </div>
        </template>`;
  }

  private generateComponentQWeb(component: ComponentNode): string {
    const styles = this.generateInlineStyles(component.styles);
    const children = component.children
      .map(child => this.generateComponentQWeb(child))
      .join('\n            ');

    return `<div class="component component-${component.type}" t-att-id="'${component.id}'" t-att-style="'${styles}'">
                ${children}
            </div>`;
  }

  private generateAssetsXml(project: Project, context: ExportContext): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <data>
        <template id="assets_frontend" inherit_id="web.assets_frontend" name="${project.name} Assets">
            <xpath expr="." position="inside">
                <link rel="stylesheet" href="/${this.camelToKebab(project.name)}/static/src/css/style.css"/>
                <script type="text/javascript" src="/${this.camelToKebab(project.name)}/static/src/js/main.js"/>
            </xpath>
        </template>
    </data>
</odoo>`;
  }

  private generateMainCss(project: Project, context: ExportContext): string {
    const themeStyles = this.generateThemeStyles(project.theme);
    const componentStyles = this.generateComponentStyles(project, context);

    return `/**
 * Main stylesheet for ${project.name}
 */

${themeStyles}

/* Component Styles */
${componentStyles}`;
  }

  private generateMainJs(project: Project): string {
    return `/**
 * Main JavaScript file for ${project.name}
 */

odoo.define('${this.camelToKebab(project.name)}.main', function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');

    publicWidget.registry.${this.toPascalCase(project.name)} = publicWidget.Widget.extend({
        selector: '.oe_structure',
        init: function () {
            this._super.apply(this, arguments);
            console.log('${project.name} initialized');
        },
    });

    return publicWidget.registry.${this.toPascalCase(project.name)};
});`;
  }

  private generateController(project: Project): string {
    return `# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request


class ${this.toPascalCase(project.name)}Controller(http.Controller):

    @http.route('/', type='http', auth='public', website=True)
    def index(self, **kwargs):
        return request.render('${this.camelToKebab(project.name)}_main')

    ${project.pages.filter(p => p.slug !== 'home').map(page => `
    @http.route('/${page.slug}', type='http', auth='public', website=True)
    def ${this.camelToKebab(page.name)}(self, **kwargs):
        return request.render('${this.camelToKebab(page.name)}')
    `).join('')}`;
  }

  private generateControllerInit(): string {
    return `# -*- coding: utf-8 -*-
from . import main`;
  }
}
