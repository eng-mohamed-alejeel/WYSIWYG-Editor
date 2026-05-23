/**
 * Responsive Renderer Optimization
 *
 * Optimized rendering for responsive components with caching and performance improvements
 */

import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { ComponentNode, Breakpoint, StyleObject } from '@wysiwyg/core';
import { RendererContext } from '../types';
import { getGlobalStyleGenerator } from '../styles';

interface ResponsiveRendererProps {
  node: ComponentNode;
  context: RendererContext;
  children?: React.ReactNode;
}

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
  return styleCache.get(key)?.get(breakpoint);
}

/**
 * Cache styles
 */
function cacheStyles(nodeId: string, breakpoint: Breakpoint, styles: StyleObject): void {
  const key = getCacheKey(nodeId, breakpoint);

  if (!styleCache.has(key)) {
    styleCache.set(key, new Map());
  }

  styleCache.get(key)!.set(breakpoint, styles);
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
 * Responsive Renderer Component
 * Optimized for performance with caching and memoization
 */
export const ResponsiveRenderer: React.FC<ResponsiveRendererProps> = memo(
  ({ node, context, children }) => {
    const { breakpoint, mode } = context;
    const styleGenerator = getGlobalStyleGenerator();
    const renderCountRef = useRef(0);
    const lastBreakpointRef = useRef<Breakpoint>(breakpoint);

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

    // Generate responsive styles with caching
    const responsiveStyles = useMemo(() => {
      // Check cache first
      const cached = getCachedStyles(node.id, breakpoint);
      if (cached) {
        return cached;
      }

      // Generate new styles
      const styles = styleGenerator.generate(
        node.styles,
        node.responsiveStyles as Record<Breakpoint, StyleObject> | undefined,
        breakpoint
      );

      // Cache the result
      cacheStyles(node.id, breakpoint, styles);

      return styles;
    }, [node.styles, node.responsiveStyles, breakpoint, styleGenerator, node.id]);

    // Handle breakpoint changes
    useEffect(() => {
      if (lastBreakpointRef.current !== breakpoint) {
        lastBreakpointRef.current = breakpoint;
        // Pre-warm cache for adjacent breakpoints
        const adjacentBreakpoints: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];
        const currentIndex = adjacentBreakpoints.indexOf(breakpoint);

        if (currentIndex > 0) {
          const prevBreakpoint = adjacentBreakpoints[currentIndex - 1];
          const prevStyles = getCachedStyles(node.id, prevBreakpoint);
          if (!prevStyles) {
            const styles = styleGenerator.generate(
              node.styles,
              node.responsiveStyles as Record<Breakpoint, StyleObject> | undefined,
              prevBreakpoint
            );
            cacheStyles(node.id, prevBreakpoint, styles);
          }
        }

        if (currentIndex < adjacentBreakpoints.length - 1) {
          const nextBreakpoint = adjacentBreakpoints[currentIndex + 1];
          const nextStyles = getCachedStyles(node.id, nextBreakpoint);
          if (!nextStyles) {
            const styles = styleGenerator.generate(
              node.styles,
              node.responsiveStyles as Record<Breakpoint, StyleObject> | undefined,
              nextBreakpoint
            );
            cacheStyles(node.id, nextBreakpoint, styles);
          }
        }
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

ResponsiveRenderer.displayName = 'ResponsiveRenderer';

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
 * Responsive Renderer Batch
 * Renders multiple components with batch optimization
 */
interface ResponsiveRendererBatchProps {
  nodes: ComponentNode[];
  context: RendererContext;
  renderNode: (node: ComponentNode, context: RendererContext) => React.ReactNode;
}

export const ResponsiveRendererBatch: React.FC<ResponsiveRendererBatchProps> = memo(
  ({ nodes, context, renderNode }) => {
    const { breakpoint } = context;
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
    const breakpoints: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];

    const previewStyles = useMemo(() => {
      const styles: Record<Breakpoint, string> = {} as any;

      breakpoints.forEach((bp) => {
        styles[bp] = styleGenerator.generate(
          node.styles,
          node.responsiveStyles as Record<Breakpoint, StyleObject> | undefined,
          bp
        );
      });

      return styles;
    }, [node.styles, node.responsiveStyles, styleGenerator]);

    return (
      <div className="responsive-style-preview">
        {breakpoints.map((bp) => (
          <div
            key={bp}
            className={`preview-item ${bp === currentBreakpoint ? 'active' : ''}`}
            onClick={() => onBreakpointChange?.(bp)}
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
