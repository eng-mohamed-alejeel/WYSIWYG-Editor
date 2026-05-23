/**
 * Assets Store
 *
 * Manages asset state including uploads, deletions, and organization
 * Optimized for performance with selective subscriptions
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { ComponentId } from '@wysiwyg/core';
import { AssetsStoreState, Asset, UploadOperation } from './types';
import { eventBus } from './events';
import { middlewareManager } from './middleware';

interface AssetsStore extends AssetsStoreState {
  // Actions
  addAsset: (asset: Asset) => Promise<void>;
  removeAsset: (id: ComponentId) => Promise<void>;
  updateAsset: (id: ComponentId, updates: Partial<Asset>) => Promise<void>;
  getAsset: (id: ComponentId) => Asset | undefined;
  getAssetsByType: (type: Asset['type']) => Asset[];
  startUpload: (file: File) => Promise<void>;
  updateUploadProgress: (id: ComponentId, progress: number) => void;
  completeUpload: (id: ComponentId, asset: Asset) => void;
  failUpload: (id: ComponentId, error: Error) => void;
  reset: () => void;
  hydrate: (state: Partial<AssetsStoreState>) => void;
  toJSON: () => string;
}

const initialState: AssetsStoreState = {
  assets: new Map(),
  isLoading: false,
  error: null,
  uploadQueue: [],
};

export const useAssetsStore = create<AssetsStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    addAsset: async (asset: Asset) => {
      try {
        const processedPayload = await middlewareManager.executeBefore(get(), 'addAsset', asset);

        set(
          (state) => {
            const newAssets = new Map(state.assets);
            newAssets.set(processedPayload.id, processedPayload);
            return { assets: newAssets };
          },
          false,
          'addAsset'
        );

        await middlewareManager.executeAfter(get(), 'addAsset', processedPayload);
        eventBus.emit('asset:add', processedPayload);
      } catch (error) {
        console.error('Error adding asset:', error);
        throw error;
      }
    },

    removeAsset: async (id: ComponentId) => {
      try {
        const processedPayload = await middlewareManager.executeBefore(get(), 'removeAsset', id);

        set(
          (state) => {
            const newAssets = new Map(state.assets);
            const asset = newAssets.get(processedPayload);
            newAssets.delete(processedPayload);
            return { assets: newAssets };
          },
          false,
          'removeAsset'
        );

        await middlewareManager.executeAfter(get(), 'removeAsset', processedPayload);
        eventBus.emit('asset:delete', processedPayload);
      } catch (error) {
        console.error('Error removing asset:', error);
        throw error;
      }
    },

    updateAsset: async (id: ComponentId, updates: Partial<Asset>) => {
      try {
        const payload = { id, updates };
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'updateAsset',
          payload
        );

        set(
          (state) => {
            const newAssets = new Map(state.assets);
            const existing = newAssets.get(processedPayload.id);
            if (existing) {
              newAssets.set(processedPayload.id, { ...existing, ...processedPayload.updates });
            }
            return { assets: newAssets };
          },
          false,
          'updateAsset'
        );

        await middlewareManager.executeAfter(get(), 'updateAsset', processedPayload);
        eventBus.emit('asset:update', processedPayload);
      } catch (error) {
        console.error('Error updating asset:', error);
        throw error;
      }
    },

    getAsset: (id: ComponentId): Asset | undefined => {
      return get().assets.get(id);
    },

    getAssetsByType: (type: Asset['type']): Asset[] => {
      return Array.from(get().assets.values()).filter((asset) => asset.type === type);
    },

    startUpload: async (file: File) => {
      try {
        const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const uploadOperation: UploadOperation = {
          id: uploadId,
          file,
          progress: 0,
          status: 'pending',
        };

        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'startUpload',
          uploadOperation
        );

        set(
          (state) => ({
            uploadQueue: [...state.uploadQueue, processedPayload as UploadOperation],
            isLoading: true,
          }),
          false,
          'startUpload'
        );

        await middlewareManager.executeAfter(get(), 'startUpload', processedPayload);
        eventBus.emit('asset:upload:start', processedPayload);

        // Simulate upload progress (in real implementation, this would be actual upload)
        const interval = setInterval(() => {
          const state = get();
          const upload = state.uploadQueue.find((u) => u.id === uploadId);
          if (upload && upload.status !== 'completed' && upload.status !== 'error') {
            const newProgress = Math.min(upload.progress + 10, 100);
            get().updateUploadProgress(uploadId, newProgress);

            if (newProgress >= 100) {
              clearInterval(interval);
              // In real implementation, you'd create the asset here
            }
          } else {
            clearInterval(interval);
          }
        }, 200);
      } catch (error) {
        console.error('Error starting upload:', error);
        throw error;
      }
    },

    updateUploadProgress: (id: ComponentId, progress: number) => {
      set(
        (state) => ({
          uploadQueue: state.uploadQueue.map((upload) =>
            upload.id === id
              ? { ...upload, progress, status: progress >= 100 ? 'completed' : 'uploading' }
              : upload
          ),
        }),
        false,
        'updateUploadProgress'
      );
      eventBus.emit('asset:upload:progress', { id, progress });
    },

    completeUpload: (id: ComponentId, asset: Asset) => {
      set(
        (state) => {
          const newAssets = new Map(state.assets);
          newAssets.set(asset.id, asset);

          return {
            assets: newAssets,
            uploadQueue: state.uploadQueue.filter((upload) => upload.id !== id),
            isLoading: state.uploadQueue.length > 1,
          };
        },
        false,
        'completeUpload'
      );
      eventBus.emit('asset:upload:complete', asset);
    },

    failUpload: (id: ComponentId, error: Error) => {
      set(
        (state) => ({
          uploadQueue: state.uploadQueue.map((upload) =>
            upload.id === id ? { ...upload, status: 'error' as const, error } : upload
          ),
          isLoading: state.uploadQueue.some((u) => u.id !== id && u.status === 'uploading'),
        }),
        false,
        'failUpload'
      );
      eventBus.emit('asset:upload:error', { id, error });
    },

    reset: () => {
      set(initialState, false, 'reset');
      eventBus.emit('assets:reset', null);
    },

    hydrate: (state: Partial<AssetsStoreState>) => {
      set(
        (currentState) => ({
          ...currentState,
          ...state,
          assets: state.assets
            ? new Map(Object.entries(state.assets).map(([k, v]) => [k, v as Asset]))
            : currentState.assets,
        }),
        false,
        'hydrate'
      );
    },

    toJSON: (): string => {
      const state = get();
      return JSON.stringify({
        assets: Array.from(state.assets.entries()),
        isLoading: state.isLoading,
        error: state.error?.message,
        uploadQueue: state.uploadQueue,
      });
    },
  }))
);

// Selectors with shallow equality for optimized re-renders
export const assetsSelectors = {
  assets: (state: AssetsStoreState) => Array.from(state.assets.values()),
  isLoading: (state: AssetsStoreState) => state.isLoading,
  error: (state: AssetsStoreState) => state.error,
  uploadQueue: (state: AssetsStoreState) => state.uploadQueue,
  assetsCount: (state: AssetsStoreState) => state.assets.size,

  // Type-specific selectors
  images: (state: AssetsStoreState) =>
    Array.from(state.assets.values()).filter((a) => a.type === 'image'),
  videos: (state: AssetsStoreState) =>
    Array.from(state.assets.values()).filter((a) => a.type === 'video'),
  audios: (state: AssetsStoreState) =>
    Array.from(state.assets.values()).filter((a) => a.type === 'audio'),

  // Compound selectors
  assetsState: (state: AssetsStoreState) => ({
    assets: Array.from(state.assets.values()),
    isLoading: state.isLoading,
    error: state.error,
    uploadQueue: state.uploadQueue,
  }),
};

// Custom hooks for common selections
export const useAssets = () => useAssetsStore(assetsSelectors.assets, shallow);
export const useIsLoadingAssets = () => useAssetsStore(assetsSelectors.isLoading);
export const useAssetsError = () => useAssetsStore(assetsSelectors.error);
export const useUploadQueue = () => useAssetsStore(assetsSelectors.uploadQueue, shallow);
export const useAssetsCount = () => useAssetsStore(assetsSelectors.assetsCount);
export const useImages = () => useAssetsStore(assetsSelectors.images, shallow);
export const useVideos = () => useAssetsStore(assetsSelectors.videos, shallow);
export const useAudios = () => useAssetsStore(assetsSelectors.audios, shallow);
export const useAssetsState = () => useAssetsStore(assetsSelectors.assetsState, shallow);
