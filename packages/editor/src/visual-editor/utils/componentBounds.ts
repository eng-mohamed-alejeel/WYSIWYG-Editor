/**
 * Component bounds management utilities
 */
import { ComponentId } from '@wysiwyg/core';
import { ComponentBounds } from '../types';

// Component bounds cache
const componentBoundsCache: Map<ComponentId, ComponentBounds> = new Map();

export function updateComponentBounds(
  id: ComponentId,
  bounds: DOMRect,
  parentId?: ComponentId | null,
  depth?: number
): void {
  componentBoundsCache.set(id, {
    id,
    bounds,
    parentId: parentId ?? null,
    depth: depth ?? 0,
    isVisible: bounds.width > 0 && bounds.height > 0,
  });
}

export function getComponentBounds(id: ComponentId): DOMRect | null {
  const cached = componentBoundsCache.get(id);
  if (!cached) return null;

  // Convert Rect to DOMRect
  const { bounds } = cached;
  return new DOMRect(bounds.x, bounds.y, bounds.width, bounds.height);
}

export function getAllBounds(): ComponentBounds[] {
  return Array.from(componentBoundsCache.values());
}

export function clearBoundsCache(): void {
  componentBoundsCache.clear();
}
