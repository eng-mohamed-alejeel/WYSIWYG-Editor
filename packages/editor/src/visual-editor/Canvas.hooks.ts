/**
 * Custom Hooks for Canvas
 */

import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { useVisualEditorStore } from './visualEditorStore';
import { ComponentId } from '@wysiwyg/core';
import { calculateAlignmentGuides, calculateSmartSpacing } from './utils';
import { SmartSpacingIndicator, VisualEditorConfig, SnappingState, Rect } from './types';
import { ViewportState } from './Canvas.types';
import { throttle, getCombinedBounds } from './Canvas.utils';

/**
 * Hook for managing viewport state (zoom/pan)
 */
export function useViewport() {
  const [viewport, setViewport] = useState<ViewportState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    isPanning: false,
    panStart: { x: 0, y: 0 },
  });

  const transformStyle = useMemo(
    () => ({
      transform: `translate(${viewport.pan.x}px, ${viewport.pan.y}px) scale(${viewport.zoom})`,
      transformOrigin: '0 0',
    }),
    [viewport.pan, viewport.zoom]
  );

  return {
    viewport,
    setViewport,
    transformStyle,
  };
}

/**
 * Hook for managing component bounds
 */
export function useComponentBounds(
  canvasRef: React.RefObject<HTMLDivElement>,
  children: React.ReactNode,
  config: VisualEditorConfig
) {
  const boundsUpdateRef = useRef<number>();

  const updateBounds = useCallback(() => {
    if (boundsUpdateRef.current !== undefined) {
      cancelAnimationFrame(boundsUpdateRef.current);
    }

    boundsUpdateRef.current = requestAnimationFrame(() => {
      if (!canvasRef.current) return;

      const components = canvasRef.current.querySelectorAll('[data-component-id]');

      components.forEach((el) => {
        const id = el.getAttribute('data-component-id') as ComponentId;
        if (!id) return;

        const bounds = el.getBoundingClientRect();
        const parentId = el.parentElement?.getAttribute('data-component-id') as ComponentId | null;
        const depthAttr = el.getAttribute('data-depth');
        const depth = parseInt(depthAttr ?? '0', 10);

        useVisualEditorStore.getState().updateComponentBounds(id, bounds, parentId, depth);
      });
    });
  }, [canvasRef]);

  const throttledUpdateBounds = useMemo(
    () => throttle(updateBounds, config.performance?.throttleDelay ?? 16),
    [updateBounds, config.performance?.throttleDelay]
  );

  useEffect(() => {
    throttledUpdateBounds();
    return () => {
      if (boundsUpdateRef.current !== undefined) {
        cancelAnimationFrame(boundsUpdateRef.current);
      }
    };
  }, [children, throttledUpdateBounds]);

  return { updateBounds: throttledUpdateBounds };
}

/**
 * Hook for calculating alignment guides
 */
export function useAlignmentGuides(
  config: VisualEditorConfig,
  snappingState: SnappingState,
  selectedIds: string[]
) {
  return useMemo(() => {
    if (config.alignmentGuides.enabled !== true || snappingState.isActive !== true) {
      return [];
    }

    const { getComponentBounds, getAllBounds } = useVisualEditorStore.getState();
    const allBounds = getAllBounds();
    const selectedBounds = selectedIds
      .map((id: string) => getComponentBounds(id))
      .filter(Boolean) as Rect[];

    if (selectedBounds.length === 0) return [];

    const combinedBounds = getCombinedBounds(selectedBounds);
    const otherBounds = allBounds
      .filter((b: { id: string; bounds: Rect }) => !selectedIds.includes(b.id))
      .map((b: { id: string; bounds: Rect }) => b.bounds);

    return calculateAlignmentGuides(combinedBounds, otherBounds, config.snapping.threshold);
  }, [
    config.alignmentGuides.enabled,
    snappingState.isActive,
    selectedIds,
    config.snapping.threshold,
  ]);
}

/**
 * Hook for calculating smart spacing indicators
 */
export function useSmartSpacingIndicators(config: VisualEditorConfig, selectedIds: string[]) {
  return useMemo(() => {
    if (config.smartSpacing.enabled !== true) {
      return [];
    }

    const { getComponentBounds, getAllBounds } = useVisualEditorStore.getState();
    const allBounds = getAllBounds();
    const selectedBounds = selectedIds
      .map((id: string) => getComponentBounds(id))
      .filter(Boolean) as Rect[];

    if (selectedBounds.length === 0) return [];

    const indicators: SmartSpacingIndicator[] = [];
    const otherBounds = allBounds
      .filter((b: { id: string; bounds: Rect }) => !selectedIds.includes(b.id))
      .map((b: { id: string; bounds: Rect }) => b.bounds);

    selectedBounds.forEach((selectedRect) => {
      indicators.push(
        ...calculateSmartSpacing(selectedRect, otherBounds, config.snapping.threshold)
      );
    });

    return indicators;
  }, [config.smartSpacing.enabled, selectedIds, config.snapping.threshold]);
}
