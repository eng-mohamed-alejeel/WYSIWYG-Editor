/**
 * Storage Adapters Package
 *
 * Exports all storage adapters and related utilities.
 */

// Main adapter
export { LocalStorageAdapter } from './LocalStorageAdapter';

// Operations
export { saveProject, loadProject, deleteProject, listProjects } from './ProjectOperations';
export {
  saveComponent,
  loadComponent,
  deleteComponent,
  listComponents,
} from './ComponentOperations';
export {
  uploadAsset,
  downloadAsset,
  deleteAsset,
  listAssets,
  generateAssetId,
  createAsset,
} from './AssetOperations';

// Helpers
export {
  getProjects,
  setProjects,
  getAssets,
  setAssets,
  getComponents,
  setComponents,
} from './LocalStorageAdapterHelpers';
export { withErrorHandling, withVoidErrorHandling, createNotFoundError } from './OperationHelpers';
export { initializeStorage } from './StorageInitializer';
export type { StorageKeyConfig } from './StorageInitializer';

// Event management
export { StorageEventManager } from './StorageEventManager';

// Types
export type { ProjectOperationsContext } from './ProjectOperations';
export type { ComponentOperationsContext } from './ComponentOperations';
export type { AssetOperationsContext } from './AssetOperations';
