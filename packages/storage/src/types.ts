/**
 * Storage Types
 *
 * This module defines the types used by the storage system.
 */

import { Project, ComponentId } from '@wysiwyg/core';

/**
 * Storage adapter type
 */
export type StorageAdapterType = 'local' | 'remote' | 'database' | 'file';

/**
 * Storage operation result
 */
export interface StorageResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  /**
   * Adapter type
   */
  type: StorageAdapterType;

  /**
   * Initialize the adapter
   */
  initialize(config: StorageConfig): Promise<StorageResult>;

  /**
   * Save a project
   */
  saveProject(project: Project): Promise<StorageResult<Project>>;

  /**
   * Load a project
   */
  loadProject(id: string): Promise<StorageResult<Project>>;

  /**
   * Delete a project
   */
  deleteProject(id: string): Promise<StorageResult>;

  /**
   * List all projects
   */
  listProjects(): Promise<StorageResult<Project[]>>;

  /**
   * Save a component
   */
  saveComponent(component: any): Promise<StorageResult>;

  /**
   * Load a component
   */
  loadComponent(id: ComponentId): Promise<StorageResult>;

  /**
   * Delete a component
   */
  deleteComponent(id: ComponentId): Promise<StorageResult>;

  /**
   * Upload an asset
   */
  uploadAsset(file: File, metadata?: AssetMetadata): Promise<StorageResult<Asset>>;

  /**
   * Download an asset
   */
  downloadAsset(id: string): Promise<StorageResult<Blob>>;

  /**
   * Delete an asset
   */
  deleteAsset(id: string): Promise<StorageResult>;

  /**
   * List assets
   */
  listAssets(): Promise<StorageResult<Asset[]>>;

  /**
   * Check if the adapter is connected
   */
  isConnected(): boolean;

  /**
   * Disconnect the adapter
   */
  disconnect(): Promise<void>;
}

/**
 * Storage configuration
 */
export interface StorageConfig {
  /**
   * Adapter type
   */
  type: StorageAdapterType;

  /**
   * Storage URL (for remote storage)
   */
  url?: string;

  /**
   * API key (for remote storage)
   */
  apiKey?: string;

  /**
   * Storage path (for file storage)
   */
  path?: string;

  /**
   * Database configuration (for database storage)
   */
  database?: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };

  /**
   * Cache configuration
   */
  cache?: {
    enabled: boolean;
    ttl?: number;
  };

  /**
   * Encryption settings
   */
  encryption?: {
    enabled: boolean;
    key?: string;
  };

  /**
   * Compression settings
   */
  compression?: {
    enabled: boolean;
    level?: number;
  };

  /**
   * Custom configuration
   */
  custom?: Record<string, any>;
}

/**
 * Asset metadata
 */
export interface AssetMetadata {
  /**
   * Asset name
   */
  name?: string;

  /**
   * Asset type
   */
  type?: string;

  /**
   * Asset tags
   */
  tags?: string[];

  /**
   * Custom metadata
   */
  custom?: Record<string, any>;
}

/**
 * Asset
 */
export interface Asset {
  /**
   * Asset ID
   */
  id: string;

  /**
   * Asset URL
   */
  url: string;

  /**
   * Asset type
   */
  type: string;

  /**
   * Asset size
   */
  size: number;

  /**
   * Asset metadata
   */
  metadata?: AssetMetadata;

  /**
   * Created timestamp
   */
  createdAt: number;

  /**
   * Updated timestamp
   */
  updatedAt: number;
}

/**
 * Storage event
 */
export interface StorageEvent {
  /**
   * Event type
   */
  type: 'save' | 'load' | 'delete' | 'upload' | 'download';

  /**
   * Event target
   */
  target: 'project' | 'component' | 'asset';

  /**
   * Target ID
   */
  targetId: string;

  /**
   * Event data
   */
  data?: any;

  /**
   * Timestamp
   */
  timestamp: number;
}

/**
 * Storage event listener
 */
export type StorageEventListener = (event: StorageEvent) => void;
