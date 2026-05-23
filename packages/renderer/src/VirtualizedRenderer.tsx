/**
 * Virtualized Renderer
 *
 * This module provides virtualization support for rendering large component trees efficiently.
 */

import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { ComponentNode } from '@wysiwyg/core';
import { RendererContext, VirtualizationConfig } from './types';

interface VirtualizedRendererProps {
  nodes: ComponentNode[];
  context: RendererContext;
  config: VirtualizationConfig;
  renderItem: (node: ComponentNode, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface VirtualizedState {
  startIndex: number;
  endIndex: number;
  totalHeight: number;
}

/**
 * Virtualized Renderer Component
 * Renders only visible components for better performance with large lists
 */
export const VirtualizedRenderer: React.FC<VirtualizedRendererProps> = ({
  nodes,
  context,
  config,
  renderItem,
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<VirtualizedState>({
    startIndex: 0,
    endIndex: Math.min(config.bufferSize || 20, nodes.length),
    totalHeight: 0,
  });

  const { threshold = 50, bufferSize = 20, overscan = 5 } = config;

  // Calculate visible range based on scroll position
  const calculateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    // Estimate item height (can be customized based on actual component heights)
    const estimatedItemHeight = 100;

    const startIndex = Math.max(0, Math.floor(scrollTop / estimatedItemHeight) - overscan);
    const endIndex = Math.min(
      nodes.length,
      Math.ceil((scrollTop + containerHeight) / estimatedItemHeight) + overscan
    );

    setState((prev) => ({
      ...prev,
      startIndex,
      endIndex,
      totalHeight: nodes.length * estimatedItemHeight,
    }));
  }, [nodes.length, overscan]);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', calculateVisibleRange, { passive: true });
    calculateVisibleRange();

    return () => {
      container.removeEventListener('scroll', calculateVisibleRange);
    };
  }, [calculateVisibleRange]);

  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => {
      calculateVisibleRange();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateVisibleRange]);

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
    return nodes.slice(state.startIndex, state.endIndex);
  }, [nodes, state.startIndex, state.endIndex]);

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
    >
      <div style={{ height: state.totalHeight, position: 'relative' }}>
        {visibleNodes.map((node, index) => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              top: (state.startIndex + index) * 100, // Should match estimatedItemHeight
              left: 0,
              right: 0,
            }}
          >
            {renderItem(node, state.startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Hook for determining if a component should be virtualized
 */
export function useVirtualization(nodes: ComponentNode[], config: VirtualizationConfig): boolean {
  return useMemo(() => {
    return config.enabled && nodes.length >= config.threshold;
  }, [nodes.length, config.enabled, config.threshold]);
}

/**
 * Hook for calculating virtualization parameters
 */
export function useVirtualizationParams(
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
