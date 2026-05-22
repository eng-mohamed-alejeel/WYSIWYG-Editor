/**
 * Core Utilities for WYSIWYG Visual Component Builder
 *
 * This module provides utility functions used throughout the platform.
 */
/**
 * Generate a unique ID for components
 */
export function generateId(prefix = 'component') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Find a component by ID in the tree
 */
export function findComponentById(tree, id) {
    for (const node of tree) {
        if (node.id === id) {
            return node;
        }
        if (node.children.length > 0) {
            const found = findComponentById(node.children, id);
            if (found) {
                return found;
            }
        }
    }
    return null;
}
/**
 * Find the parent of a component by ID
 */
export function findParentById(tree, id, parent = null) {
    for (const node of tree) {
        if (node.id === id) {
            return parent;
        }
        if (node.children.length > 0) {
            const found = findParentById(node.children, id, node);
            if (found) {
                return found;
            }
        }
    }
    return null;
}
/**
 * Update a component in the tree by ID
 */
export function updateComponentById(tree, id, updates) {
    return tree.map(node => {
        if (node.id === id) {
            return { ...node, ...updates };
        }
        if (node.children.length > 0) {
            return {
                ...node,
                children: updateComponentById(node.children, id, updates)
            };
        }
        return node;
    });
}
/**
 * Delete a component from the tree by ID
 */
export function deleteComponentById(tree, id) {
    return tree.filter(node => {
        if (node.id === id) {
            return false;
        }
        if (node.children.length > 0) {
            node.children = deleteComponentById(node.children, id);
        }
        return true;
    });
}
/**
 * Move a component to a new parent
 */
export function moveComponent(tree, componentId, newParentId, newIndex) {
    // Find and remove the component
    let component = null;
    const removeComponent = (nodes) => {
        return nodes.filter(node => {
            if (node.id === componentId) {
                component = node;
                return false;
            }
            if (node.children.length > 0) {
                node.children = removeComponent(node.children);
            }
            return true;
        });
    };
    const newTree = removeComponent([...tree]);
    if (!component) {
        return tree;
    }
    // If newParentId is null, move to root
    if (newParentId === null) {
        if (newIndex !== undefined) {
            newTree.splice(newIndex, 0, component);
            return newTree;
        }
        return [...newTree, component];
    }
    // Find the new parent and add the component
    const addToParent = (nodes) => {
        return nodes.map(node => {
            if (node.id === newParentId) {
                const newChildren = [...node.children];
                if (newIndex !== undefined) {
                    newChildren.splice(newIndex, 0, component);
                }
                else {
                    newChildren.push(component);
                }
                return { ...node, children: newChildren };
            }
            if (node.children.length > 0) {
                return {
                    ...node,
                    children: addToParent(node.children)
                };
            }
            return node;
        });
    };
    return addToParent(newTree);
}
/**
 * Clone a component tree
 */
export function cloneComponentTree(tree) {
    const cloneNode = (node) => ({
        ...node,
        id: generateId(node.type),
        children: node.children.map(cloneNode)
    });
    return tree.map(cloneNode);
}
/**
 * Get all component IDs in a tree
 */
export function getAllComponentIds(tree) {
    const ids = [];
    const traverse = (nodes) => {
        for (const node of nodes) {
            ids.push(node.id);
            if (node.children.length > 0) {
                traverse(node.children);
            }
        }
    };
    traverse(tree);
    return ids;
}
/**
 * Get all components of a specific type
 */
export function getComponentsByType(tree, type) {
    const components = [];
    const traverse = (nodes) => {
        for (const node of nodes) {
            if (node.type === type) {
                components.push(node);
            }
            if (node.children.length > 0) {
                traverse(node.children);
            }
        }
    };
    traverse(tree);
    return components;
}
/**
 * Check if a component can be a child of another component
 */
export function isValidChild(childType, parentType, allowedChildren) {
    if (parentType === null) {
        return true; // Root level allows any component
    }
    if (!allowedChildren) {
        return true; // No restrictions
    }
    const allowed = allowedChildren[parentType] || [];
    return allowed.includes(childType);
}
/**
 * Deep merge objects
 */
export function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
        const sourceValue = source[key];
        const targetValue = result[key];
        if (sourceValue &&
            typeof sourceValue === 'object' &&
            !Array.isArray(sourceValue) &&
            targetValue &&
            typeof targetValue === 'object' &&
            !Array.isArray(targetValue)) {
            result[key] = deepMerge(targetValue, sourceValue);
        }
        else {
            result[key] = sourceValue;
        }
    }
    return result;
}
/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
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
export function throttle(func, limit) {
    let inThrottle = false;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
/**
 * Format file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
/**
 * Validate URL
 */
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}
/**
 * Generate a random color
 */
export function generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null;
}
/**
 * Convert RGB color to hex
 */
export function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}
//# sourceMappingURL=index.js.map