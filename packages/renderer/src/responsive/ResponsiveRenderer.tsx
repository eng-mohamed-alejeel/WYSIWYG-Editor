/**
 * Responsive Renderer Optimization
 *
 * Optimized rendering for responsive components with caching and performance improvements
 */

import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { ComponentNode, Breakpoint, StyleObject } from '@wysiwyg/core';
import { getGlobalStyleGenerator } from '../styles';
import { ResponsiveRendererProps, ResponsiveRendererBatchProps } from './types';

type SafeStyleRecord = Record<string, string | number | undefined>;
type ResponsiveStyleMap = Partial<Record<string, Partial<Record<string, string | number>>>>;

// Style cache for performance optimization
const styleCache = new Map<string, Map<Breakpoint, StyleObject>>();
const cacheMaxSize = 1000;

/**
 * Generate cache key for a component
 */
function getCacheKey(nodeId: string, breakpoint: Breakpoint): string {
  return `${nodeId}-${breakpoint}`;
}

/**
 * Clear old cache entries when size limit is reached
 */
function maintainCacheSize(): void {
  if (styleCache.size > cacheMaxSize) {
    const entries = Array.from(styleCache.entries());
    entries.slice(0, Math.floor(cacheMaxSize * 0.2)).forEach(([key]) => {
      styleCache.delete(key);
    });
  }
}

/**
 * Get cached styles
 */
function getCachedStyles(nodeId: string, breakpoint: Breakpoint): StyleObject | undefined {
  const key = getCacheKey(nodeId, breakpoint);
  const cachedMap = styleCache.get(key);
  return cachedMap?.get(breakpoint);
}

/**
 * Cache styles
 */
function cacheStyles(nodeId: string, breakpoint: Breakpoint, styles: StyleObject): void {
  const key = getCacheKey(nodeId, breakpoint);

  if (!styleCache.has(key)) {
    styleCache.set(key, new Map());
  }

  styleCache.get(key)?.set(breakpoint, styles);
  maintainCacheSize();
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
}

/**
 * Merge responsive style objects safely
 */
function mergeResponsiveStyleObjects(
  baseStyles: SafeStyleRecord,
  breakpoint: Breakpoint,
  responsiveStyles?: ResponsiveStyleMap
): StyleObject {
  const merged: SafeStyleRecord = { ...baseStyles };

  if (responsiveStyles == null) {
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
 * Responsive Renderer Component
 * Optimized for performance with caching and memoization
 */
export const ResponsiveRenderer: React.FC<ResponsiveRendererProps> = memo(
  ({ node, context, children }) => {
    const { breakpoint, mode } = context;
    const nodeId: string = node.id;
    const nodeType: string = node.type;
    const nodeBaseStyles = node.styles as SafeStyleRecord;
    const nodeResponsiveStyles = node.responsiveStyles as ResponsiveStyleMap | undefined;
    const renderCountRef = useRef(0);
    const lastBreakpointRef = useRef<Breakpoint>(breakpoint);

    // Track render count for debugging
    useEffect(() => {
      renderCountRef.current++;
      if (process.env.NODE_ENV === 'development' && renderCountRef.current > 10) {
        console.warn(
          `Component ${nodeId} has rendered ${renderCountRef.current} times. ` +
            `Consider optimization. Current breakpoint: ${breakpoint}`
        );
      }
    });

    // Generate responsive styles with caching
    const responsiveStyles = useMemo(() => {
      // Check cache first
      const cached = getCachedStyles(nodeId, breakpoint);
      if (cached !== undefined) {
        return cached;
      }

      // Generate new styles
      const styles = mergeResponsiveStyleObjects(nodeBaseStyles, breakpoint, nodeResponsiveStyles);

      // Cache the result
      cacheStyles(nodeId, breakpoint, styles);

      return styles;
    }, [nodeBaseStyles, nodeResponsiveStyles, breakpoint, nodeId]);

    // Handle breakpoint changes
    useEffect(() => {
      if (lastBreakpointRef.current !== breakpoint) {
        lastBreakpointRef.current = breakpoint;
        // Pre-warm cache for adjacent breakpoints
        const adjacentBreakpoints: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];
        const currentIndex = adjacentBreakpoints.indexOf(breakpoint);

        if (currentIndex > 0) {
          const prevBreakpoint = adjacentBreakpoints[currentIndex - 1];
          if (
            prevBreakpoint !== undefined &&
            getCachedStyles(nodeId, prevBreakpoint) === undefined
          ) {
            const styles = mergeResponsiveStyleObjects(
              nodeBaseStyles,
              prevBreakpoint,
              nodeResponsiveStyles
            );
            cacheStyles(nodeId, prevBreakpoint, styles);
          }
        }

        if (currentIndex < adjacentBreakpoints.length - 1) {
          const nextBreakpoint = adjacentBreakpoints[currentIndex + 1];
          if (
            nextBreakpoint !== undefined &&
            getCachedStyles(nodeId, nextBreakpoint) === undefined
          ) {
            const styles = mergeResponsiveStyleObjects(
              nodeBaseStyles,
              nextBreakpoint,
              nodeResponsiveStyles
            );
            cacheStyles(nodeId, nextBreakpoint, styles);
          }
        }
      }
    }, [breakpoint, nodeBaseStyles, nodeResponsiveStyles, nodeId]);

    // Merge responsive styles with inline styles
    const mergedStyles = useMemo(
      () =>
        ({
          ...responsiveStyles,
          // Add any additional inline styles from context
          ...(context.style != null && context.style.trim().length > 0
            ? parseInlineStyles(context.style)
            : {}),
        }) as React.CSSProperties,
      [responsiveStyles, context.style]
    );

    // Render children with optimized context
    const renderChildren = useCallback(() => {
      if (children === null || children === undefined) return null;

      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            'data-component-id': nodeId,
            'data-breakpoint': breakpoint,
          } as unknown as Record<string, unknown>);
        }
        return child;
      });
    }, [children, nodeId, breakpoint]);

    return (
      <div
        className={`responsive-component ${mode === 'editor' ? 'editor-mode' : ''}`}
        style={mergedStyles}
        data-component-id={nodeId}
        data-breakpoint={breakpoint}
        data-component-type={nodeType}
      >
        {renderChildren()}
      </div>
    );
  }
);

ResponsiveRenderer.displayName = 'ResponsiveRenderer';

/**
 * Parse inline styles from string
 */
function parseInlineStyles(styleString: string): React.CSSProperties {
  try {
    const stylesRecord: Record<string, string> = {};
    const declarations = styleString.split(';').filter(Boolean);

    declarations.forEach((declaration) => {
      const parts = declaration.split(':').map((s) => s.trim());
      const [property, value] = parts;
      if (property != null && property.length > 0 && value != null && value.length > 0) {
        const camelProperty = property.replace(/-([a-z])/g, (_, letter: string) =>
          letter.toUpperCase()
        );
        stylesRecord[camelProperty] = value;
      }
    });

    return stylesRecord as React.CSSProperties;
  } catch (error) {
    console.warn('Failed to parse inline styles:', error);
    return {};
  }
}

/**
 * Responsive Renderer Batch
 * Renders multiple components with batch optimization
 */

export const ResponsiveRendererBatch: React.FC<ResponsiveRendererBatchProps> = memo(
  ({ nodes, context, renderNode }) => {
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
  }
);

ResponsiveRendererBatch.displayName = 'ResponsiveRendererBatch';

/**
 * Responsive Style Preview
 * Shows preview of styles across all breakpoints
 */
interface ResponsiveStylePreviewProps {
  node: ComponentNode;
  currentBreakpoint: Breakpoint;
  onBreakpointChange?: (breakpoint: Breakpoint) => void;
}

export const ResponsiveStylePreview: React.FC<ResponsiveStylePreviewProps> = memo(
  ({ node, currentBreakpoint, onBreakpointChange }) => {
    const styleGenerator = getGlobalStyleGenerator();
    const breakpoints: Breakpoint[] = useMemo(() => ['mobile', 'tablet', 'desktop', 'wide'], []);

    const previewStyles = useMemo(() => {
      const styles: Partial<Record<Breakpoint, string>> = {};

      breakpoints.forEach((bp: Breakpoint) => {
        const nodeStyles = node.styles as StyleObject;
        const nodeResponsiveStyles = node.responsiveStyles as
          | Record<Breakpoint, StyleObject>
          | undefined;
        styles[bp] = styleGenerator.generate(nodeStyles, nodeResponsiveStyles, bp);
      });

      return styles as Record<Breakpoint, string>;
    }, [node.styles, node.responsiveStyles, styleGenerator, breakpoints]);

    return (
      <div className="responsive-style-preview">
        {breakpoints.map((bp: Breakpoint) => (
          <div
            key={bp}
            role="button"
            tabIndex={0}
            className={`preview-item ${bp === currentBreakpoint ? 'active' : ''}`}
            onClick={() => onBreakpointChange?.(bp)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onBreakpointChange?.(bp);
              }
            }}
          >
            <div className="preview-breakpoint">{bp}</div>
            <div className="preview-styles">{previewStyles[bp]}</div>
          </div>
        ))}
      </div>
    );
  }
);

ResponsiveStylePreview.displayName = 'ResponsiveStylePreview';
