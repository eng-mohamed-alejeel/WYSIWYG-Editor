/**
 * Local Storage Adapter
 *
 * Stores data in the browser's local storage.
 */

import { Project, ComponentId } from '@wysiwyg/core';
import {
  StorageAdapter,
  StorageConfig,
  StorageResult,
  Asset,
  AssetMetadata,
  StorageEvent,
  StorageEventListener,
} from '../types';
import { getAssets, setAssets } from './LocalStorageAdapterHelpers';
import { StorageEventManager } from './StorageEventManager';
import { initializeStorage } from './StorageInitializer';
import {
  saveProject as saveProjectOp,
  loadProject as loadProjectOp,
  deleteProject as deleteProjectOp,
  listProjects as listProjectsOp,
  ProjectOperationsContext,
} from './ProjectOperations';
import {
  saveComponent as saveComponentOp,
  loadComponent as loadComponentOp,
  deleteComponent as deleteComponentOp,
  ComponentOperationsContext,
} from './ComponentOperations';
import {
  uploadAsset as uploadAssetOp,
  downloadAsset as downloadAssetOp,
  deleteAsset as deleteAssetOp,
  listAssets as listAssetsOp,
  AssetOperationsContext,
} from './AssetOperations';

export class LocalStorageAdapter implements StorageAdapter {
  type = 'local' as const;
  private eventManager = new StorageEventManager();
  private connected = false;
  private readonly STORAGE_PREFIX = 'wysiwyg_';
  private readonly PROJECTS_KEY = 'projects';
  private readonly ASSETS_KEY = 'assets';
  private readonly COMPONENTS_KEY = 'components';

  // eslint-disable-next-line @typescript-eslint/require-await
  async initialize(_config: StorageConfig): Promise<StorageResult> {
    try {
      this.connected = true;

      // Initialize storage if empty
      initializeStorage(this.STORAGE_PREFIX, [
        this.PROJECTS_KEY,
        this.ASSETS_KEY,
        this.COMPONENTS_KEY,
      ]);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private createProjectContext(): ProjectOperationsContext {
    return {
      STORAGE_PREFIX: this.STORAGE_PREFIX,
      PROJECTS_KEY: this.PROJECTS_KEY,
      emitEvent: (event) => this.emitEvent(event),
      ensureConnected: () => this.ensureConnected(),
    };
  }

  private createComponentContext(): ComponentOperationsContext {
    return {
      STORAGE_PREFIX: this.STORAGE_PREFIX,
      COMPONENTS_KEY: this.COMPONENTS_KEY,
      emitEvent: (event) => this.emitEvent(event),
      ensureConnected: () => this.ensureConnected(),
    };
  }

  private createAssetContext(): AssetOperationsContext {
    return {
      STORAGE_PREFIX: this.STORAGE_PREFIX,
      ASSETS_KEY: this.ASSETS_KEY,
      emitEvent: (event) => this.emitEvent(event),
      ensureConnected: () => this.ensureConnected(),
      getAssets: () => this.getAssets(),
      setAssets: (assets) => this.setAssets(assets),
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async saveProject(project: Project): Promise<StorageResult<Project>> {
    return saveProjectOp(this.createProjectContext(), project);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async loadProject(id: string): Promise<StorageResult<Project>> {
    return loadProjectOp(this.createProjectContext(), id);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async deleteProject(id: string): Promise<StorageResult> {
    return deleteProjectOp(this.createProjectContext(), id);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async listProjects(): Promise<StorageResult<Project[]>> {
    return listProjectsOp(this.createProjectContext());
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async saveComponent(component: Record<string, unknown>): Promise<StorageResult> {
    return saveComponentOp(this.createComponentContext(), component);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async loadComponent(id: ComponentId): Promise<StorageResult<Record<string, unknown>>> {
    return loadComponentOp(this.createComponentContext(), id);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async deleteComponent(id: ComponentId): Promise<StorageResult> {
    return deleteComponentOp(this.createComponentContext(), id);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async uploadAsset(file: File, metadata?: AssetMetadata): Promise<StorageResult<Asset>> {
    return uploadAssetOp(this.createAssetContext(), file, metadata);
  }

  async downloadAsset(id: string): Promise<StorageResult<Blob>> {
    return downloadAssetOp(this.createAssetContext(), id);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async deleteAsset(id: string): Promise<StorageResult> {
    return deleteAssetOp(this.createAssetContext(), id);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async listAssets(): Promise<StorageResult<Asset[]>> {
    return listAssetsOp(this.createAssetContext());
  }

  isConnected(): boolean {
    return this.connected;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async disconnect(): Promise<void> {
    this.connected = false;
    this.eventManager.clearListeners();
  }

  addEventListener(listener: StorageEventListener): void {
    this.eventManager.addEventListener(listener);
  }

  removeEventListener(listener: StorageEventListener): void {
    this.eventManager.removeEventListener(listener);
  }

  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error('Storage adapter is not connected. Call initialize() first.');
    }
  }

  private getAssets(): Asset[] {
    return getAssets(this.STORAGE_PREFIX, this.ASSETS_KEY);
  }

  private setAssets(assets: Asset[]): void {
    setAssets(this.STORAGE_PREFIX, this.ASSETS_KEY, assets);
  }

  private emitEvent(event: StorageEvent): void {
    this.eventManager.emitEvent(event);
  }
}
