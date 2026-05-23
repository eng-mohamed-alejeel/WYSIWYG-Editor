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

export class LocalStorageAdapter implements StorageAdapter {
  type = 'local' as const;
  private eventListeners: StorageEventListener[] = [];
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
      const projectsKey = this.STORAGE_PREFIX + this.PROJECTS_KEY;
      if (localStorage.getItem(projectsKey) === null) {
        localStorage.setItem(projectsKey, JSON.stringify([]));
      }

      const assetsKey = this.STORAGE_PREFIX + this.ASSETS_KEY;
      if (localStorage.getItem(assetsKey) === null) {
        localStorage.setItem(assetsKey, JSON.stringify([]));
      }

      const componentsKey = this.STORAGE_PREFIX + this.COMPONENTS_KEY;
      if (localStorage.getItem(componentsKey) === null) {
        localStorage.setItem(componentsKey, JSON.stringify({}));
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async saveProject(project: Project): Promise<StorageResult<Project>> {
    try {
      this.ensureConnected();

      const projects = this.getProjects();
      const existingIndex = projects.findIndex((p) => p.id === project.id);

      if (existingIndex >= 0) {
        projects[existingIndex] = project;
      } else {
        projects.push(project);
      }

      this.setProjects(projects);
      this.emitEvent({
        type: 'save',
        target: 'project',
        targetId: project.id,
        data: project,
        timestamp: Date.now(),
      });

      return { success: true, data: project };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async loadProject(id: string): Promise<StorageResult<Project>> {
    try {
      this.ensureConnected();

      const projects = this.getProjects();
      const project = projects.find((p) => p.id === id);

      if (!project) {
        return {
          success: false,
          error: `Project with id ${id} not found`,
        };
      }

      this.emitEvent({
        type: 'load',
        target: 'project',
        targetId: id,
        data: project,
        timestamp: Date.now(),
      });

      return { success: true, data: project };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async deleteProject(id: string): Promise<StorageResult> {
    try {
      this.ensureConnected();

      const projects = this.getProjects();
      const filteredProjects = projects.filter((p) => p.id !== id);

      this.setProjects(filteredProjects);
      this.emitEvent({
        type: 'delete',
        target: 'project',
        targetId: id,
        timestamp: Date.now(),
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async listProjects(): Promise<StorageResult<Project[]>> {
    try {
      this.ensureConnected();

      const projects = this.getProjects();
      return { success: true, data: projects };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async saveComponent(component: Record<string, unknown>): Promise<StorageResult> {
    try {
      this.ensureConnected();

      const components = this.getComponents();
      const componentId = String(component.id);
      components[componentId] = component;

      this.setComponents(components);
      this.emitEvent({
        type: 'save',
        target: 'component',
        targetId: componentId,
        data: component,
        timestamp: Date.now(),
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async loadComponent(id: ComponentId): Promise<StorageResult<Record<string, unknown>>> {
    try {
      this.ensureConnected();

      const components = this.getComponents();
      const component = components[id];

      if (component === undefined) {
        return {
          success: false,
          error: `Component with id ${id} not found`,
        };
      }

      this.emitEvent({
        type: 'load',
        target: 'component',
        targetId: id,
        data: component,
        timestamp: Date.now(),
      });

      return { success: true, data: component };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async deleteComponent(id: ComponentId): Promise<StorageResult> {
    try {
      this.ensureConnected();

      const components = this.getComponents();
      delete components[id];

      this.setComponents(components);
      this.emitEvent({
        type: 'delete',
        target: 'component',
        targetId: id,
        timestamp: Date.now(),
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async uploadAsset(file: File, metadata?: AssetMetadata): Promise<StorageResult<Asset>> {
    try {
      this.ensureConnected();

      const reader = new FileReader();
      const assetId = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const asset: Asset = {
        id: assetId,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        metadata: {
          name: file.name,
          type: file.type,
          ...metadata,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      reader.onload = () => {
        const assets = this.getAssets();
        assets.push(asset);
        this.setAssets(assets);

        this.emitEvent({
          type: 'upload',
          target: 'asset',
          targetId: assetId,
          data: asset,
          timestamp: Date.now(),
        });
      };

      reader.readAsDataURL(file);

      return { success: true, data: asset };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async downloadAsset(id: string): Promise<StorageResult<Blob>> {
    try {
      this.ensureConnected();

      const assets = this.getAssets();
      const asset = assets.find((a) => a.id === id);

      if (!asset) {
        return {
          success: false,
          error: `Asset with id ${id} not found`,
        };
      }

      const response = await fetch(asset.url);
      const blob = await response.blob();

      this.emitEvent({
        type: 'download',
        target: 'asset',
        targetId: id,
        data: blob,
        timestamp: Date.now(),
      });

      return { success: true, data: blob };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async deleteAsset(id: string): Promise<StorageResult> {
    try {
      this.ensureConnected();

      const assets = this.getAssets();
      const filteredAssets = assets.filter((a) => a.id !== id);

      this.setAssets(filteredAssets);
      this.emitEvent({
        type: 'delete',
        target: 'asset',
        targetId: id,
        timestamp: Date.now(),
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async listAssets(): Promise<StorageResult<Asset[]>> {
    try {
      this.ensureConnected();

      const assets = this.getAssets();
      return { success: true, data: assets };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async disconnect(): Promise<void> {
    this.connected = false;
    this.eventListeners = [];
  }

  addEventListener(listener: StorageEventListener): void {
    this.eventListeners.push(listener);
  }

  removeEventListener(listener: StorageEventListener): void {
    this.eventListeners = this.eventListeners.filter((l) => l !== listener);
  }

  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error('Storage adapter is not connected. Call initialize() first.');
    }
  }

  private getProjects(): Project[] {
    const data = localStorage.getItem(this.STORAGE_PREFIX + this.PROJECTS_KEY);
    if (data !== null) {
      return JSON.parse(data) as Project[];
    }
    return [];
  }

  private setProjects(projects: Project[]): void {
    localStorage.setItem(this.STORAGE_PREFIX + this.PROJECTS_KEY, JSON.stringify(projects));
  }

  private getAssets(): Asset[] {
    const data = localStorage.getItem(this.STORAGE_PREFIX + this.ASSETS_KEY);
    if (data !== null) {
      return JSON.parse(data) as Asset[];
    }
    return [];
  }

  private setAssets(assets: Asset[]): void {
    localStorage.setItem(this.STORAGE_PREFIX + this.ASSETS_KEY, JSON.stringify(assets));
  }

  private getComponents(): Record<string, Record<string, unknown>> {
    const data = localStorage.getItem(this.STORAGE_PREFIX + this.COMPONENTS_KEY);
    if (data !== null) {
      return JSON.parse(data) as Record<string, Record<string, unknown>>;
    }
    return {};
  }

  private setComponents(components: Record<string, Record<string, unknown>>): void {
    localStorage.setItem(this.STORAGE_PREFIX + this.COMPONENTS_KEY, JSON.stringify(components));
  }

  private emitEvent(event: StorageEvent): void {
    this.eventListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in storage event listener:', error);
      }
    });
  }
}
