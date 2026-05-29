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
import { Breakpoint, StyleObject } from '@wysiwyg/core';
import { getGlobalPerformanceMonitor } from '../PerformanceMonitor';
import {
  OptimizedResponsiveRendererProps,
  StyleCacheEntry,
  BreakpointTransition,
  OptimizedResponsiveRendererBatchProps,
} from './types';

type SafeStyleRecord = Record<string, string | number | undefined>;
type ResponsiveStyleMap = Partial<Record<string, Partial<Record<string, string | number>>>>;

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
  return `${nodeId}-${String(breakpoint)}`;
}

/**
 * Maintain cache size with LRU eviction
 */
function maintainCacheSize(): void {
  if (styleCache.size > cacheMaxSize) {
    const entries: [string, StyleCacheEntry][] = Array.from(styleCache.entries()).sort(
      (a, b) => a[1].lastAccess - b[1].lastAccess
    );

    const toRemove = Math.floor(cacheMaxSize * 0.2);
    for (let i = 0; i < toRemove; i++) {
      const entry = entries[i];
      if (entry !== undefined) {
        const [key] = entry;
        styleCache.delete(key);
      }
    }
  }
}

/**
 * Get cached styles
 */
function getCachedStyles(nodeId: string, breakpoint: Breakpoint): StyleObject | undefined {
  const key = getCacheKey(nodeId, breakpoint);
  const entry = styleCache.get(key);

  if (entry === undefined) {
    return undefined;
  }

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
  const now = Date.now();

  const entry: StyleCacheEntry = {
    styles,
    timestamp: now,
    lastAccess: now,
    accessCount: 0,
  };

  styleCache.set(key, entry);

  maintainCacheSize();
}

/**
 * Track breakpoint transition for pre-warming
 */
function trackBreakpointTransition(from: Breakpoint, to: Breakpoint): void {
  const transition: BreakpointTransition = {
    from,
    to,
    timestamp: Date.now(),
  };

  breakpointTransitions.push(transition);

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
        const toBreakpoint: Breakpoint = t.to;
        const currentCount = acc[toBreakpoint] ?? 0;
        acc[toBreakpoint] = currentCount + 1;
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
  const keys = Array.from(styleCache.keys());
  const keysToDelete = keys.filter((key) => key.startsWith(keyPrefix));
  keysToDelete.forEach((key) => {
    styleCache.delete(key);
  });
}

/**
 * Clear all style cache
 */
export function clearAllStyleCache(): void {
  styleCache.clear();
  breakpointTransitions.length = 0;
}

/**
 * Merge responsive style objects safely
 */
function mergeResponsiveStyleObjects(
  baseStyles: SafeStyleRecord,
  responsiveStyles?: ResponsiveStyleMap,
  breakpoint?: Breakpoint
): StyleObject {
  const merged: SafeStyleRecord = { ...baseStyles };

  if (responsiveStyles == null || breakpoint == null) {
    return merged as StyleObject;
  }

  if (breakpoint === 'tablet') {
    const mobileStyles = responsiveStyles['mobile'];
    if (mobileStyles != null) Object.assign(merged, mobileStyles);
  } else if (breakpoint === 'desktop') {
    const mobileStyles = responsiveStyles['mobile'];
    const tabletStyles = responsiveStyles['tablet'];
    if (mobileStyles != null) Object.assign(merged, mobileStyles);
    if (tabletStyles != null) Object.assign(merged, tabletStyles);
  } else if (breakpoint === 'wide') {
    const mobileStyles = responsiveStyles['mobile'];
    const tabletStyles = responsiveStyles['tablet'];
    const desktopStyles = responsiveStyles['desktop'];
    if (mobileStyles != null) Object.assign(merged, mobileStyles);
    if (tabletStyles != null) Object.assign(merged, tabletStyles);
    if (desktopStyles != null) Object.assign(merged, desktopStyles);
  }

  const breakpointStyles = responsiveStyles[breakpoint];
  if (breakpointStyles != null) {
    Object.assign(merged, breakpointStyles);
  }

  return merged as StyleObject;
}

/**
 * Optimized Responsive Renderer Component
 */
export const OptimizedResponsiveRenderer: React.FC<OptimizedResponsiveRendererProps> = memo(
  ({ node, context, children }) => {
    const { breakpoint, mode } = context;
    const monitor = getGlobalPerformanceMonitor();

    const nodeBaseStyles = node.styles as SafeStyleRecord;
    const nodeResponsiveStyles = node.responsiveStyles as ResponsiveStyleMap | undefined;

    const renderCountRef = useRef(0);
    const lastBreakpointRef = useRef<Breakpoint>(breakpoint);
    const preWarmTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    // Track render count for debugging
    useEffect(() => {
      renderCountRef.current++;
      if (process.env.NODE_ENV === 'development' && renderCountRef.current > 10) {
        console.warn(
          `Component ${node.id} has rendered ${renderCountRef.current} times. ` +
            `Consider optimization. Current breakpoint: ${breakpoint}`
        );
      }
    }, [node.id, breakpoint]);

    // Generate responsive styles with enhanced caching
    const responsiveStyles = useMemo(() => {
      const startTime = performance.now();

      // Check cache first
      const cached = getCachedStyles(node.id, breakpoint);
      if (cached !== undefined) {
        monitor.incrementCacheHits();
        return cached;
      }

      monitor.incrementCacheMisses();

      // Generate new styles
      const styles = mergeResponsiveStyleObjects(nodeBaseStyles, nodeResponsiveStyles, breakpoint);

      // Cache the result
      cacheStyles(node.id, breakpoint, styles);

      const duration = performance.now() - startTime;
      if (process.env.NODE_ENV === 'development' && duration > 16) {
        console.warn(
          `Style generation for ${node.id} took ${duration.toFixed(2)}ms at breakpoint ${breakpoint}`
        );
      }

      return styles;
    }, [nodeBaseStyles, nodeResponsiveStyles, breakpoint, node.id, monitor]);

    // Handle breakpoint changes with pre-warming
    useEffect(() => {
      if (lastBreakpointRef.current !== breakpoint) {
        // Track transition
        trackBreakpointTransition(lastBreakpointRef.current, breakpoint);
        lastBreakpointRef.current = breakpoint;

        // Clear previous pre-warm timeout
        if (preWarmTimeoutRef.current !== undefined) {
          clearTimeout(preWarmTimeoutRef.current);
        }

        // Pre-warm likely next breakpoints
        const likelyNext = getLikelyNextBreakpoints(breakpoint);
        preWarmTimeoutRef.current = setTimeout(() => {
          likelyNext.forEach((bp) => {
            if (getCachedStyles(node.id, bp) === undefined) {
              const styles = mergeResponsiveStyleObjects(nodeBaseStyles, nodeResponsiveStyles, bp);
              cacheStyles(node.id, bp, styles);
            }
          });
        }, 100); // Small delay to not block current render
      }
    }, [breakpoint, nodeBaseStyles, nodeResponsiveStyles, node.id]);

    // Merge responsive styles with inline styles
    const mergedStyles = useMemo(() => {
      const baseStyles = { ...responsiveStyles } as SafeStyleRecord;
      const styleString = context.style;
      const inlineStyles =
        styleString !== undefined && styleString.length > 0 ? parseInlineStyles(styleString) : {};

      return {
        ...baseStyles,
        ...inlineStyles,
      } as React.CSSProperties;
    }, [responsiveStyles, context.style]);

    // Render children with optimized context
    const renderChildren = useCallback(() => {
      if (children === null || children === undefined) {
        return null;
      }

      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const childProps = {
            ...child.props,
            'data-component-id': node.id,
            'data-breakpoint': breakpoint,
          } as Record<string, unknown>;
          return React.cloneElement(child, childProps);
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
    const stylesRecord: Record<string, string> = {};
    const declarations = styleString.split(';').filter(Boolean);

    declarations.forEach((declaration) => {
      const parts = declaration.split(':');
      if (parts.length >= 2) {
        const property = parts[0].trim();
        const value = parts.slice(1).join(':').trim();
        if (property.length > 0 && value.length > 0) {
          const camelProperty = property.replace(/-([a-z])/g, (_match: string, letter: string) =>
            letter.toUpperCase()
          );
          stylesRecord[camelProperty] = value;
        }
      }
    });

    return stylesRecord as React.CSSProperties;
  } catch (error) {
    console.warn('Failed to parse inline styles:', error);
    return {};
  }
}

/**
 * Optimized Responsive Renderer Batch
 * Renders multiple components with batch optimization
 */

export const OptimizedResponsiveRendererBatch: React.FC<OptimizedResponsiveRendererBatchProps> =
  memo(({ nodes, context, renderNode }) => {
    const { breakpoint } = context;
    const batchStartTimeRef = useRef<number>();

    useEffect(() => {
      batchStartTimeRef.current = performance.now();
    }, [breakpoint]);

    useEffect(() => {
      const startTime = batchStartTimeRef.current;
      if (startTime !== undefined) {
        const duration = performance.now() - startTime;
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
