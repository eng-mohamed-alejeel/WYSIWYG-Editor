/**
 * State Management Utilities
 *
 * Helper functions and utilities for state management
 */

import { ComponentNode, ComponentId } from '@wysiwyg/core';

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }

  if (obj instanceof Object) {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * Deep compare two objects
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a == null || typeof a !== 'object' || b == null || typeof b !== 'object') {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = 'id'): ComponentId {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Find a component by ID in a tree
 */
export function findComponentById(
  components: ComponentNode[],
  id: ComponentId
): ComponentNode | null {
  for (const component of components) {
    if (component.id === id) {
      return component;
    }
    if (component.children.length > 0) {
      const found = findComponentById(component.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Update a component by ID in a tree
 */
export function updateComponentById(
  components: ComponentNode[],
  id: ComponentId,
  updates: Partial<ComponentNode>
): ComponentNode[] {
  return components.map((component) => {
    if (component.id === id) {
      return { ...component, ...updates };
    }
    if (component.children.length > 0) {
      return {
        ...component,
        children: updateComponentById(component.children, id, updates),
      };
    }
    return component;
  });
}

/**
 * Delete a component by ID from a tree
 */
export function deleteComponentById(components: ComponentNode[], id: ComponentId): ComponentNode[] {
  return components
    .filter((component) => component.id !== id)
    .map((component) => ({
      ...component,
      children: deleteComponentById(component.children, id),
    }));
}

/**
 * Get all component IDs in a tree
 */
export function getAllComponentIds(components: ComponentNode[]): ComponentId[] {
  const ids: ComponentId[] = [];

  function traverse(nodes: ComponentNode[]) {
    for (const node of nodes) {
      ids.push(node.id);
      if (node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(components);
  return ids;
}

/**
 * Check if a component is an ancestor of another
 */
export function isAncestor(
  components: ComponentNode[],
  ancestorId: ComponentId,
  descendantId: ComponentId
): boolean {
  const descendant = findComponentById(components, descendantId);
  if (!descendant) return false;

  function checkAncestor(node: ComponentNode): boolean {
    if (node.id === ancestorId) return true;
    for (const child of node.children) {
      if (checkAncestor(child)) return true;
    }
    return false;
  }

  return checkAncestor(descendant);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Batch multiple updates
 */
export function batchUpdates<T>(items: T[], updateFn: (item: T) => T): T[] {
  return items.map(updateFn);
}

/**
 * Create a selector with memoization
 */
export function createSelector<T, U>(
  selectorFn: (state: T) => U,
  equalityFn?: (a: U, b: U) => boolean
): (state: T) => U {
  let lastState: T | null = null;
  let lastResult: U | null = null;

  return (state: T): U => {
    if (lastState === state && lastResult !== null) {
      return lastResult;
    }

    const result = selectorFn(state);

    if (equalityFn && lastResult !== null && equalityFn(lastResult, result)) {
      return lastResult;
    }

    lastState = state;
    lastResult = result;
    return result;
  };
}

/**
 * Create a compound selector
 */
export function createCompoundSelector<T, U>(
  selectors: Array<(state: T) => any>,
  combineFn: (...args: any[]) => U
): (state: T) => U {
  return (state: T): U => {
    const values = selectors.map((selector) => selector(state));
    return combineFn(...values);
  };
}

/**
 * Validate component structure
 */
export function validateComponent(component: ComponentNode): boolean {
  if (!component.id || typeof component.id !== 'string') {
    return false;
  }

  if (!component.type || typeof component.type !== 'string') {
    return false;
  }

  if (!component.props || typeof component.props !== 'object') {
    return false;
  }

  if (!component.styles || typeof component.styles !== 'object') {
    return false;
  }

  if (!Array.isArray(component.children)) {
    return false;
  }

  // Validate children recursively
  for (const child of component.children) {
    if (!validateComponent(child)) {
      return false;
    }
  }

  return true;
}

/**
 * Flatten component tree
 */
export function flattenComponents(components: ComponentNode[]): ComponentNode[] {
  const flattened: ComponentNode[] = [];

  function traverse(nodes: ComponentNode[]) {
    for (const node of nodes) {
      flattened.push(node);
      if (node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(components);
  return flattened;
}

/**
 * Get component path
 */
export function getComponentPath(
  components: ComponentNode[],
  id: ComponentId
): ComponentNode[] | null {
  const path: ComponentNode[] = [];

  function traverse(nodes: ComponentNode[]): boolean {
    for (const node of nodes) {
      path.push(node);
      if (node.id === id) {
        return true;
      }
      if (node.children.length > 0) {
        if (traverse(node.children)) {
          return true;
        }
      }
      path.pop();
    }
    return false;
  }

  return traverse(components) ? path : null;
}
