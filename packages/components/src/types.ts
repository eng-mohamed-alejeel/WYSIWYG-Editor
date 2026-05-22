/**
 * Component Library Types
 * 
 * This module defines types specific to the component library.
 */

import { ComponentDefinition, ComponentNode, RendererContext } from '@wysiwyg/core';

/**
 * Base component props
 */
export interface BaseComponentProps {
  node: ComponentNode;
  context: RendererContext;
  children?: React.ReactNode;
  style?: string;
  className?: string;
}

/**
 * Component render function
 */
export type ComponentRenderFunction = (props: BaseComponentProps) => React.ReactElement;

/**
 * Component category
 */
export type ComponentCategory = 
  | 'layout'
  | 'typography'
  | 'media'
  | 'forms'
  | 'advanced'
  | 'ecommerce'
  | 'ai';

/**
 * Component metadata
 */
export interface ComponentMeta {
  type: string;
  label: string;
  icon: string;
  category: ComponentCategory;
  description?: string;
  tags?: string[];
  version?: string;
  author?: string;
}

/**
 * Component configuration
 */
export interface ComponentConfig {
  meta: ComponentMeta;
  definition: ComponentDefinition;
  render: ComponentRenderFunction;
}

/**
 * Component group
 */
export interface ComponentGroup {
  id: string;
  label: string;
  icon: string;
  components: string[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

/**
 * Component library configuration
 */
export interface ComponentLibraryConfig {
  groups: ComponentGroup[];
  searchEnabled?: boolean;
  filterEnabled?: boolean;
  categories?: ComponentCategory[];
}
