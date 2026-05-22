/**
 * Core Utilities for WYSIWYG Visual Component Builder
 *
 * This module provides utility functions used throughout the platform.
 */
import { ComponentId, ComponentNode, ComponentType } from '../types';
/**
 * Generate a unique ID for components
 */
export declare function generateId(prefix?: string): ComponentId;
/**
 * Find a component by ID in the tree
 */
export declare function findComponentById(tree: ComponentNode[], id: ComponentId): ComponentNode | null;
/**
 * Find the parent of a component by ID
 */
export declare function findParentById(tree: ComponentNode[], id: ComponentId, parent?: ComponentNode | null): ComponentNode | null;
/**
 * Update a component in the tree by ID
 */
export declare function updateComponentById(tree: ComponentNode[], id: ComponentId, updates: Partial<ComponentNode>): ComponentNode[];
/**
 * Delete a component from the tree by ID
 */
export declare function deleteComponentById(tree: ComponentNode[], id: ComponentId): ComponentNode[];
/**
 * Move a component to a new parent
 */
export declare function moveComponent(tree: ComponentNode[], componentId: ComponentId, newParentId: ComponentId | null, newIndex?: number): ComponentNode[];
/**
 * Clone a component tree
 */
export declare function cloneComponentTree(tree: ComponentNode[]): ComponentNode[];
/**
 * Get all component IDs in a tree
 */
export declare function getAllComponentIds(tree: ComponentNode[]): ComponentId[];
/**
 * Get all components of a specific type
 */
export declare function getComponentsByType(tree: ComponentNode[], type: ComponentType): ComponentNode[];
/**
 * Check if a component can be a child of another component
 */
export declare function isValidChild(childType: ComponentType, parentType: ComponentType | null, allowedChildren?: Record<ComponentType, ComponentType[]>): boolean;
/**
 * Deep merge objects
 */
export declare function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T;
/**
 * Debounce function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Throttle function
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * Format file size
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Validate URL
 */
export declare function isValidUrl(url: string): boolean;
/**
 * Sanitize HTML to prevent XSS
 */
export declare function sanitizeHtml(html: string): string;
/**
 * Generate a random color
 */
export declare function generateRandomColor(): string;
/**
 * Convert hex color to RGB
 */
export declare function hexToRgb(hex: string): {
    r: number;
    g: number;
    b: number;
} | null;
/**
 * Convert RGB color to hex
 */
export declare function rgbToHex(r: number, g: number, b: number): string;
//# sourceMappingURL=index.d.ts.map