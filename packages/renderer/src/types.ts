/**
 * Renderer Types
 *
 * This module defines the types used by the rendering system.
 */

import { ComponentNode, Breakpoint, StyleObject } from '@wysiwyg/core';

/**
 * Renderer context
 */
export interface RendererContext {
  breakpoint: Breakpoint;
  isPreview: boolean;
  isEditable: boolean;
  componentRegistry: Map<string, ComponentRenderer>;
  theme?: any;
  children?: React.ReactNode;
  style?: string;
}

/**
 * Component renderer function
 */
export type ComponentRenderer = (node: ComponentNode, context: RendererContext) => React.ReactNode;

/**
 * Render options
 */
export interface RenderOptions {
  breakpoint?: Breakpoint;
  isPreview?: boolean;
  isEditable?: boolean;
  theme?: any;
}

/**
 * Render result
 */
export interface RenderResult {
  html: string;
  css: string;
  js: string;
  assets: string[];
}

/**
 * Style generator interface
 */
export interface StyleGenerator {
  generate(
    styles: StyleObject,
    responsiveStyles?: Record<Breakpoint, StyleObject>,
    breakpoint?: Breakpoint
  ): string;
}

/**
 * Component registry
 */
export interface ComponentRegistry {
  register(type: string, renderer: ComponentRenderer): void;
  unregister(type: string): void;
  get(type: string): ComponentRenderer | undefined;
  has(type: string): boolean;
  clear(): void;
  getAll(): Map<string, ComponentRenderer>;
}

/**
 * Renderer configuration
 */
export interface RendererConfig {
  enableMemoization?: boolean;
  enableVirtualization?: boolean;
  maxComponentDepth?: number;
  styleGenerator?: StyleGenerator;
}
