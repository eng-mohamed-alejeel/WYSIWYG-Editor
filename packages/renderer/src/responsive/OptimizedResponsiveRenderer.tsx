/**
 * Optimized Responsive Renderer
 *
 * Enhanced responsive rendering with:
 * - Efficient breakpoint management
 * - Smart style caching
 * - Batch updates
 * - Pre-warming
 * - Performance monitoring
 */

import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { ComponentNode, Breakpoint, StyleObject } from '@wysiwyg/core';
import { RendererContext } from '../types';
import { getGlobalStyleGenerator } from '../styles';
import { getGlobalPerformanceMonitor } from '../PerformanceMonitor';

interface OptimizedResponsiveRendererProps {
  node: ComponentNode;
  context: RendererContext;
  children?: React.ReactNode;
}

interface StyleCacheEntry {
  styles: StyleObject;
  timestamp: number;
  lastAccess: number;
  accessCount: number;
}

interface BreakpointTransition {
  from: Breakpoint;
  to: Breakpoint;
  timestamp: number;
}

// Global style cache with LRU eviction
const styleCache = new Map<string, StyleCacheEntry>();
const cacheMaxSize = 1000;
const cacheTTL = 5 * 60 * 1000; // 5 minutes

// Track breakpoint transitions for pre-warming
const breakpointTransitions: BreakpointTransition[] = [];
const maxTransitionHistory = 100;

/**
 * Generate cache key for a component
 */
function getCacheKey(nodeId: string, breakpoint: Breakpoint): string {
  return `${nodeId}-${breakpoint}`;
}

/**
 * Maintain cache size with LRU eviction
 */
function maintainCacheSize(): void {
  if (styleCache.size > cacheMaxSize) {
    const entries = Array.from(styleCache.entries()).sort(
      (a, b) => a[1].lastAccess - b[1].lastAccess
    );

    const toRemove = Math.floor(cacheMaxSize * 0.2);
    for (let i = 0; i < toRemove; i++) {
      styleCache.delete(entries[i][0]);
    }
  }
}

/**
 * Get cached styles
 */
function getCachedStyles(nodeId: string, breakpoint: Breakpoint): StyleObject | undefined {
  const key = getCacheKey(nodeId, breakpoint);
  const entry = styleCache.get(key);

  if (!entry) return undefined;

  // Check TTL
  if (Date.now() - entry.timestamp > cacheTTL) {
    styleCache.delete(key);
    return undefined;
  }

  // Update access info
  entry.lastAccess = Date.now();
  entry.accessCount++;

  return entry.styles;
}

/**
 * Cache styles
 */
function cacheStyles(nodeId: string, breakpoint: Breakpoint, styles: StyleObject): void {
  const key = getCacheKey(nodeId, breakpoint);

  styleCache.set(key, {
    styles,
    timestamp: Date.now(),
    lastAccess: Date.now(),
    accessCount: 0,
  });

  maintainCacheSize();
}

/**
 * Track breakpoint transition for pre-warming
 */
function trackBreakpointTransition(from: Breakpoint, to: Breakpoint): void {
  breakpointTransitions.push({
    from,
    to,
    timestamp: Date.now(),
  });

  // Maintain max history size
  if (breakpointTransitions.length > maxTransitionHistory) {
    breakpointTransitions.shift();
  }
}

/**
 * Get likely next breakpoints based on transition history
 */
function getLikelyNextBreakpoints(current: Breakpoint): Breakpoint[] {
  const recentTransitions = breakpointTransitions
    .filter((t) => t.from === current && Date.now() - t.timestamp < 60000) // Last minute
    .reduce(
      (acc, t) => {
        acc[t.to] = (acc[t.to] || 0) + 1;
        return acc;
      },
      {} as Record<Breakpoint, number>
    );

  return Object.entries(recentTransitions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([bp]) => bp as Breakpoint);
}

/**
 * Clear cache for a specific component
 */
export function clearComponentCache(nodeId: string): void {
  const keyPrefix = nodeId;
  Array.from(styleCache.keys())
    .filter((key) => key.startsWith(keyPrefix))
    .forEach((key) => styleCache.delete(key));
}

/**
 * Clear all style cache
 */
export function clearAllStyleCache(): void {
  styleCache.clear();
  breakpointTransitions.length = 0;
}

/**
 * Optimized Responsive Renderer Component
 */
export const OptimizedResponsiveRenderer: React.FC<OptimizedResponsiveRendererProps> = memo(
  ({ node, context, children }) => {
    const { breakpoint, mode } = context;
    const styleGenerator = getGlobalStyleGenerator();
    const monitor = getGlobalPerformanceMonitor();

    const renderCountRef = useRef(0);
    const lastBreakpointRef = useRef<Breakpoint>(breakpoint);
    const preWarmTimeoutRef = useRef<NodeJS.Timeout>();

    // Track render count for debugging
    useEffect(() => {
      renderCountRef.current++;
      if (process.env.NODE_ENV === 'development' && renderCountRef.current > 10) {
        console.warn(
          `Component ${node.id} has rendered ${renderCountRef.current} times. ` +
            `Consider optimization. Current breakpoint: ${breakpoint}`
        );
      }
    });

    // Generate responsive styles with enhanced caching
    const responsiveStyles = useMemo(() => {
      const startTime = performance.now();

      // Check cache first
      const cached = getCachedStyles(node.id, breakpoint);
      if (cached) {
        monitor.incrementCacheHits();
        return cached;
      }

      monitor.incrementCacheMisses();

      // Generate new styles
      const styles = styleGenerator.generate(
        node.styles,
        node.responsiveStyles as Record<Breakpoint, StyleObject> | undefined,
        breakpoint
      );

      // Cache the result
      cacheStyles(node.id, breakpoint, styles);

      const duration = performance.now() - startTime;
      if (process.env.NODE_ENV === 'development' && duration > 16) {
        console.warn(
          `Style generation for ${node.id} took ${duration.toFixed(2)}ms at breakpoint ${breakpoint}`
        );
      }

      return styles;
    }, [node.styles, node.responsiveStyles, breakpoint, styleGenerator, node.id, monitor]);

    // Handle breakpoint changes with pre-warming
    useEffect(() => {
      if (lastBreakpointRef.current !== breakpoint) {
        // Track transition
        trackBreakpointTransition(lastBreakpointRef.current, breakpoint);
        lastBreakpointRef.current = breakpoint;

        // Clear previous pre-warm timeout
        if (preWarmTimeoutRef.current) {
          clearTimeout(preWarmTimeoutRef.current);
        }

        // Pre-warm likely next breakpoints
        const likelyNext = getLikelyNextBreakpoints(breakpoint);
        preWarmTimeoutRef.current = setTimeout(() => {
          likelyNext.forEach((bp) => {
            if (!getCachedStyles(node.id, bp)) {
              const styles = styleGenerator.generate(
                node.styles,
                node.responsiveStyles as Record<Breakpoint, StyleObject> | undefined,
                bp
              );
              cacheStyles(node.id, bp, styles);
            }
          });
        }, 100); // Small delay to not block current render
      }
    }, [breakpoint, node.styles, node.responsiveStyles, styleGenerator, node.id]);

    // Merge responsive styles with inline styles
    const mergedStyles = useMemo(() => {
      return {
        ...responsiveStyles,
        // Add any additional inline styles from context
        ...(context.style ? parseInlineStyles(context.style) : {}),
      };
    }, [responsiveStyles, context.style]);

    // Render children with optimized context
    const renderChildren = useCallback(() => {
      if (!children) return null;

      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            'data-component-id': node.id,
            'data-breakpoint': breakpoint,
          } as any);
        }
        return child;
      });
    }, [children, node.id, breakpoint]);

    return (
      <div
        className={`responsive-component ${mode === 'editor' ? 'editor-mode' : ''}`}
        style={mergedStyles}
        data-component-id={node.id}
        data-breakpoint={breakpoint}
        data-component-type={node.type}
      >
        {renderChildren()}
      </div>
    );
  }
);

OptimizedResponsiveRenderer.displayName = 'OptimizedResponsiveRenderer';

/**
 * Parse inline styles from string
 */
function parseInlineStyles(styleString: string): React.CSSProperties {
  try {
    const styles: React.CSSProperties = {};
    const declarations = styleString.split(';').filter(Boolean);

    declarations.forEach((declaration) => {
      const [property, value] = declaration.split(':').map((s) => s.trim());
      if (property && value) {
        const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        (styles as any)[camelProperty] = value;
      }
    });

    return styles;
  } catch (error) {
    console.warn('Failed to parse inline styles:', error);
    return {};
  }
}

/**
 * Optimized Responsive Renderer Batch
 * Renders multiple components with batch optimization
 */
interface OptimizedResponsiveRendererBatchProps {
  nodes: ComponentNode[];
  context: RendererContext;
  renderNode: (node: ComponentNode, context: RendererContext) => React.ReactNode;
}

export const OptimizedResponsiveRendererBatch: React.FC<OptimizedResponsiveRendererBatchProps> =
  memo(({ nodes, context, renderNode }) => {
    const { breakpoint } = context;
    const monitor = getGlobalPerformanceMonitor();
    const batchStartTimeRef = useRef<number>();

    useEffect(() => {
      batchStartTimeRef.current = performance.now();
    }, [breakpoint]);

    useEffect(() => {
      if (batchStartTimeRef.current) {
        const duration = performance.now() - batchStartTimeRef.current;
        if (process.env.NODE_ENV === 'development' && duration > 100) {
          console.warn(
            `Batch render took ${duration.toFixed(2)}ms for ${nodes.length} components. ` +
              `Consider virtualization for large component trees.`
          );
        }
      }
    }, [nodes.length]);

    // Batch render with memoization
    const renderedNodes = useMemo(() => {
      return nodes.map((node) => renderNode(node, context));
    }, [nodes, context, renderNode]);

    return <>{renderedNodes}</>;
  });

OptimizedResponsiveRendererBatch.displayName = 'OptimizedResponsiveRendererBatch';
