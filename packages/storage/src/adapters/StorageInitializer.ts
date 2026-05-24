/**
 * Storage Initializer
 *
 * Handles initialization of storage keys with flexible default values.
 */

export interface StorageKeyConfig {
  key: string;
  defaultValue: unknown;
}

export function initializeStorage(storagePrefix: string, keys: string[]): void;

export function initializeStorage(storagePrefix: string, configs: StorageKeyConfig[]): void;

export function initializeStorage(
  storagePrefix: string,
  input: string[] | StorageKeyConfig[]
): void {
  const configs: StorageKeyConfig[] =
    Array.isArray(input) && typeof input[0] === 'string'
      ? (input as string[]).map((key) => ({
          key,
          defaultValue: getDefaultStorageValue(key),
        }))
      : (input as StorageKeyConfig[]);

  configs.forEach((config) => {
    const fullKey = storagePrefix + config.key;
    if (localStorage.getItem(fullKey) === null) {
      try {
        localStorage.setItem(fullKey, JSON.stringify(config.defaultValue));
      } catch (error) {
        console.error(`Failed to initialize storage key '${fullKey}':`, error);
      }
    }
  });
}

/**
 * Get default storage value based on key name
 */
function getDefaultStorageValue(key: string): unknown {
  switch (key) {
    case 'projects':
    case 'assets':
      return [];
    case 'components':
      return {};
    default:
      return null;
  }
}
