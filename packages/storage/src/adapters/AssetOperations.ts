/**
 * Asset Operations
 *
 * Handles asset-related storage operations.
 */

import { Asset, AssetMetadata } from '../types';
import { StorageResult, StorageEvent } from '../types';
import { withErrorHandling } from './OperationHelpers';

export interface AssetOperationsContext {
  STORAGE_PREFIX: string;
  ASSETS_KEY: string;
  emitEvent: (event: StorageEvent) => void;
  ensureConnected: () => void;
  getAssets: () => Asset[];
  setAssets: (assets: Asset[]) => void;
}

export function generateAssetId(): string {
  return `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createAsset(file: File, metadata?: AssetMetadata): Asset {
  const assetId = generateAssetId();
  return {
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
}

export async function uploadAsset(
  context: AssetOperationsContext,
  file: File,
  metadata?: AssetMetadata
): Promise<StorageResult<Asset>> {
  return withErrorHandling(async () => {
    context.ensureConnected();

    const asset = createAsset(file, metadata);

    // Wrap FileReader in Promise to ensure completion
    await new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const assets = context.getAssets();
          assets.push(asset);
          context.setAssets(assets);

          context.emitEvent({
            type: 'upload',
            target: 'asset',
            targetId: asset.id,
            data: asset,
            timestamp: Date.now(),
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });

    return asset;
  });
}

export async function downloadAsset(
  context: AssetOperationsContext,
  id: string
): Promise<StorageResult<Blob>> {
  return withErrorHandling(async () => {
    context.ensureConnected();

    const assets = context.getAssets();
    const asset = assets.find((a: Asset) => a.id === id);

    if (asset === undefined) {
      throw new Error(`Asset with id ${id} not found`);
    }

    const response = await fetch(asset.url);
    if (!response.ok) {
      throw new Error('Failed to fetch asset');
    }

    const blob = await response.blob();

    context.emitEvent({
      type: 'download',
      target: 'asset',
      targetId: id,
      data: asset,
      timestamp: Date.now(),
    });

    return blob;
  });
}

export async function deleteAsset(
  context: AssetOperationsContext,
  id: string
): Promise<StorageResult> {
  return withErrorHandling(() => {
    context.ensureConnected();

    const assets = context.getAssets();
    const asset = assets.find((a: Asset) => a.id === id);

    if (asset === undefined) {
      throw new Error(`Asset with id ${id} not found`);
    }

    const filteredAssets = assets.filter((a: Asset) => a.id !== id);
    context.setAssets(filteredAssets);

    context.emitEvent({
      type: 'delete',
      target: 'asset',
      targetId: id,
      timestamp: Date.now(),
    });
  });
}

export async function listAssets(context: AssetOperationsContext): Promise<StorageResult<Asset[]>> {
  return withErrorHandling(() => {
    context.ensureConnected();

    const assets = context.getAssets();
    return assets;
  });
}
