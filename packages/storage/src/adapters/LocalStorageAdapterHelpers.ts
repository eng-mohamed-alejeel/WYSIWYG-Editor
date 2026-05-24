/**
 * Local Storage Adapter Helpers
 *
 * Helper functions for the LocalStorageAdapter.
 */

import { Project } from '@wysiwyg/core';
import { Asset } from '../types';

/**
 * Safely parse JSON data with validation
 */
function safeParseJSON<T>(
  data: string,
  defaultValue: T,
  validator?: (value: unknown) => value is T
): T {
  try {
    const parsed = JSON.parse(data) as unknown;
    if (validator && !validator(parsed)) {
      console.warn('Data validation failed, returning default value');
      return defaultValue;
    }
    return parsed as T;
  } catch (error) {
    console.error('Failed to parse JSON data:', error);
    return defaultValue;
  }
}

/**
 * Get projects from local storage
 */
export function getProjects(storagePrefix: string, projectsKey: string): Project[] {
  try {
    const data = localStorage.getItem(storagePrefix + projectsKey);
    if (data !== null) {
      return safeParseJSON<Project[]>(data, [], (value): value is Project[] => {
        return Array.isArray(value);
      });
    }
    return [];
  } catch (error) {
    console.error('Failed to get projects from storage:', error);
    return [];
  }
}

/**
 * Set projects in local storage
 */
export function setProjects(storagePrefix: string, projectsKey: string, projects: Project[]): void {
  try {
    localStorage.setItem(storagePrefix + projectsKey, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to set projects in storage:', error);
    throw new Error('Failed to save projects to storage');
  }
}

/**
 * Get assets from local storage
 */
export function getAssets(storagePrefix: string, assetsKey: string): Asset[] {
  try {
    const data = localStorage.getItem(storagePrefix + assetsKey);
    if (data !== null) {
      return safeParseJSON<Asset[]>(data, [], (value): value is Asset[] => {
        return Array.isArray(value);
      });
    }
    return [];
  } catch (error) {
    console.error('Failed to get assets from storage:', error);
    return [];
  }
}

/**
 * Set assets in local storage
 */
export function setAssets(storagePrefix: string, assetsKey: string, assets: Asset[]): void {
  try {
    localStorage.setItem(storagePrefix + assetsKey, JSON.stringify(assets));
  } catch (error) {
    console.error('Failed to set assets in storage:', error);
    throw new Error('Failed to save assets to storage');
  }
}

/**
 * Get components from local storage
 */
export function getComponents(
  storagePrefix: string,
  componentsKey: string
): Record<string, Record<string, unknown>> {
  try {
    const data = localStorage.getItem(storagePrefix + componentsKey);
    if (data !== null) {
      return safeParseJSON<Record<string, Record<string, unknown>>>(
        data,
        {},
        (value): value is Record<string, Record<string, unknown>> => {
          return typeof value === 'object' && value !== null && !Array.isArray(value);
        }
      );
    }
    return {};
  } catch (error) {
    console.error('Failed to get components from storage:', error);
    return {};
  }
}

/**
 * Set components in local storage
 */
export function setComponents(
  storagePrefix: string,
  componentsKey: string,
  components: Record<string, Record<string, unknown>>
): void {
  try {
    localStorage.setItem(storagePrefix + componentsKey, JSON.stringify(components));
  } catch (error) {
    console.error('Failed to set components in storage:', error);
    throw new Error('Failed to save components to storage');
  }
}
