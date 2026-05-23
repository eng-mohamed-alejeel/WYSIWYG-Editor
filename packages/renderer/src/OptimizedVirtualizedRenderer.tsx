/**
 * Optimized Virtualized Renderer
 *
 * Enhanced virtualization system with advanced features:
 * - Dynamic item sizing
 * - Smooth scrolling
 * - Placeholder rendering
 * - Pre-fetching
 * - Performance monitoring
 */

import React, { useMemo, useRef, useEffect, useState, useCallback, memo } from 'react';
import { ComponentNode } from '@wysiwyg/core';
import { RendererContext, VirtualizationConfig } from './types';
import { getGlobalPerformanceMonitor } from './PerformanceMonitor';

interface OptimizedVirtualizedRendererProps {
  nodes: ComponentNode[];
  context: RendererContext;
  config: VirtualizationConfig;
  renderItem: (node: ComponentNode, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: React.ReactNode;
  onScroll?: (scrollTop: number) => void;
}

interface VirtualizedState {
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  scrollTop: number;
  isScrolling: boolean;
}

interface ItemSize {
  height: number;
  measured: boolean;
}

interface PositionCache {
  [key: number]: {
    offset: number;
    size: number;
  };
}

/**
 * Optimized Virtualized Renderer Component
 * Renders only visible components with advanced performance optimizations
 */
export const OptimizedVirtualizedRenderer: React.FC<OptimizedVirtualizedRendererProps> = memo(
  ({ nodes, context, config, renderItem, className, style, placeholder, onScroll }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<VirtualizedState>({
      startIndex: 0,
      endIndex: Math.min(config.bufferSize || 20, nodes.length),
      totalHeight: 0,
      scrollTop: 0,
      isScrolling: false,
    });

    const { threshold = 50, bufferSize = 20, overscan = 5 } = config;
    const monitor = getGlobalPerformanceMonitor();

    // Position cache for measured items
    const positionCacheRef = useRef<PositionCache>({});
    const itemSizeCacheRef = useRef<Map<number, ItemSize>>(new Map());
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();
    const lastScrollTimeRef = useRef<number>(0);

    // Calculate visible range based on scroll position and measured sizes
    const calculateVisibleRange = useCallback(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      let startIndex = 0;
      let endIndex = nodes.length;
      let totalHeight = 0;

      // Use measured sizes when available, estimate otherwise
      let currentOffset = 0;
      for (let i = 0; i < nodes.length; i++) {
        const itemSize = itemSizeCacheRef.current.get(i);
        const height = itemSize?.measured ? itemSize.height : 100; // Default estimate

        positionCacheRef.current[i] = {
          offset: currentOffset,
          size: height,
        };

        currentOffset += height;

        // Find start index (first visible item)
        if (currentOffset < scrollTop + overscan * height) {
          startIndex = i;
        }

        // Find end index (last visible item)
        if (currentOffset < scrollTop + containerHeight + overscan * height) {
          endIndex = i + 1;
        }
      }

      totalHeight = currentOffset;

      setState((prev) => ({
        ...prev,
        startIndex: Math.max(0, startIndex - overscan),
        endIndex: Math.min(nodes.length, endIndex + overscan),
        totalHeight,
        scrollTop,
      }));
    }, [nodes.length, overscan]);

    // Handle scroll events with throttling
    const handleScroll = useCallback(
      (event: React.UIEvent<HTMLDivElement>) => {
        const now = performance.now();
        const scrollTop = event.currentTarget.scrollTop;

        // Throttle scroll updates to ~60fps
        if (now - lastScrollTimeRef.current < 16) {
          return;
        }

        lastScrollTimeRef.current = now;
        setState((prev) => ({ ...prev, scrollTop, isScrolling: true }));

        // Clear previous timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Set new timeout to detect when scrolling stops
        scrollTimeoutRef.current = setTimeout(() => {
          setState((prev) => ({ ...prev, isScrolling: false }));
        }, 150);

        onScroll?.(scrollTop);
      },
      [onScroll]
    );

    // Measure item height after render
    const measureItem = useCallback(
      (index: number, element: HTMLElement | null) => {
        if (!element) return;

        const height = element.offsetHeight;
        const cached = itemSizeCacheRef.current.get(index);

        // Only update if size changed significantly
        if (!cached || !cached.measured || Math.abs(cached.height - height) > 5) {
          itemSizeCacheRef.current.set(index, { height, measured: true });

          // Recalculate visible range when item size changes
          requestAnimationFrame(calculateVisibleRange);
        }
      },
      [calculateVisibleRange]
    );

    // Attach scroll listener and initial calculation
    useEffect(() => {
      calculateVisibleRange();

      const container = containerRef.current;
      if (!container) return;

      const resizeObserver = new ResizeObserver(() => {
        calculateVisibleRange();
      });

      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, [calculateVisibleRange, nodes.length]);

    // Don't virtualize if below threshold
    if (nodes.length < threshold) {
      return (
        <div className={className} style={style}>
          {nodes.map((node, index) => renderItem(node, index))}
        </div>
      );
    }

    // Render only visible items
    const visibleNodes = useMemo(() => {
      monitor.incrementVirtualizedCount();
      return nodes.slice(state.startIndex, state.endIndex);
    }, [nodes, state.startIndex, state.endIndex, monitor]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          ...style,
          height: '100%',
          overflow: 'auto',
          position: 'relative',
        }}
        onScroll={handleScroll}
      >
        <div ref={scrollRef} style={{ height: state.totalHeight, position: 'relative' }}>
          {visibleNodes.map((node, index) => {
            const actualIndex = state.startIndex + index;
            const position = positionCacheRef.current[actualIndex];

            return (
              <div
                key={node.id}
                ref={(element) => measureItem(actualIndex, element)}
                style={{
                  position: 'absolute',
                  top: position?.offset || actualIndex * 100,
                  left: 0,
                  right: 0,
                  minHeight: position?.size || 100,
                }}
              >
                {state.isScrolling && placeholder ? placeholder : renderItem(node, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

OptimizedVirtualizedRenderer.displayName = 'OptimizedVirtualizedRenderer';

/**
 * Hook for determining if a component should be virtualized
 */
export function useOptimizedVirtualization(
  nodes: ComponentNode[],
  config: VirtualizationConfig
): boolean {
  return useMemo(() => {
    return config.enabled && nodes.length >= config.threshold;
  }, [nodes.length, config.enabled, config.threshold]);
}

/**
 * Hook for calculating virtualization parameters with dynamic sizing
 */
export function useOptimizedVirtualizationParams(
  nodes: ComponentNode[],
  config: VirtualizationConfig,
  containerHeight?: number
) {
  return useMemo(() => {
    const { threshold = 50, bufferSize = 20, overscan = 5 } = config;

    if (nodes.length < threshold) {
      return {
        shouldVirtualize: false,
        startIndex: 0,
        endIndex: nodes.length,
        totalHeight: 0,
      };
    }

    // Estimate total height based on default item size
    const estimatedItemHeight = 100;
    const totalHeight = nodes.length * estimatedItemHeight;
    const visibleCount = Math.ceil((containerHeight || 600) / estimatedItemHeight);
    const startIndex = Math.max(0, Math.floor(0 / estimatedItemHeight) - overscan);
    const endIndex = Math.min(nodes.length, visibleCount + overscan);

    return {
      shouldVirtualize: true,
      startIndex,
      endIndex,
      totalHeight,
    };
  }, [nodes.length, config, containerHeight]);
}
