/**
 * Types for Responsive Renderers
 */

import React from 'react';
import { Breakpoint, StyleObject, ComponentNode } from '@wysiwyg/core';
import { RendererContext } from '../types';

// ComponentNode is imported from @wysiwyg/core to ensure type consistency

/**
 * Type guard to check if value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if value is not empty
 */
export function isNotEmpty(value: string | unknown[] | null | undefined): boolean {
  return isDefined(value) && value.length > 0;
}

/**
 * Props for OptimizedResponsiveRenderer component
 */
export interface OptimizedResponsiveRendererProps {
  node: ComponentNode;
  context: RendererContext;
  children?: React.ReactNode;
}

/**
 * Entry in the style cache
 */
export interface StyleCacheEntry {
  styles: StyleObject;
  timestamp: number;
  lastAccess: number;
  accessCount: number;
}

/**
 * Breakpoint transition information
 */
export interface BreakpointTransition {
  from: Breakpoint;
  to: Breakpoint;
  timestamp: number;
}

/**
 * Props for OptimizedResponsiveRendererBatch component
 */
export interface OptimizedResponsiveRendererBatchProps {
  nodes: ComponentNode[];
  context: RendererContext;
  renderNode: (node: ComponentNode, context: RendererContext) => React.ReactNode;
}

/**
 * Props for ResponsiveRenderer component
 */
export interface ResponsiveRendererProps {
  node: ComponentNode;
  context: RendererContext;
  children?: React.ReactNode;
}

/**
 * Props for ResponsiveRendererBatch component
 */
export interface ResponsiveRendererBatchProps {
  nodes: ComponentNode[];
  context: RendererContext;
  renderNode: (node: ComponentNode, context: RendererContext) => React.ReactNode;
}

/**
 * Style cache configuration
 */
export interface StyleCacheConfig {
  maxSize: number;
  ttl: number;
}

/**
 * Breakpoint transition history entry
 */
export interface BreakpointTransitionHistory {
  transitions: BreakpointTransition[];
  maxHistory: number;
}

/**
 * Performance metrics for responsive rendering
 */
export interface ResponsivePerformanceMetrics {
  renderTime: number;
  cacheHits: number;
  cacheMisses: number;
  styleGenerationTime: number;
}
