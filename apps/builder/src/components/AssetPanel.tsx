import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@wysiwyg/ui';
import { Input } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Tabs, TabItem } from '@wysiwyg/ui';
import { EmptyState } from '@wysiwyg/ui';

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'font' | 'icon' | 'other';
  url: string;
  size: number;
  createdAt: string;
}

export const AssetPanel: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedCategory] = useState<'all' | 'images' | 'videos' | 'fonts' | 'icons'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAssets: Asset[] = Array.from(files).map((file) => ({
      id: `asset_${Date.now()}_${Math.random()}`,
      name: file.name,
      type: getFileType(file.type),
      url: URL.createObjectURL(file),
      size: file.size,
      createdAt: new Date().toISOString(),
    }));

    setAssets([...assets, ...newAssets]);
  };

  const getFileType = (mimeType: string): Asset['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('font')) return 'font';
    if (mimeType.includes('icon')) return 'icon';
    return 'other';
  };

  const handleDelete = (assetId: string) => {
    setAssets(assets.filter((asset) => asset.id !== assetId));
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'images' && asset.type === 'image') ||
      (selectedCategory === 'videos' && asset.type === 'video') ||
      (selectedCategory === 'fonts' && asset.type === 'font') ||
      (selectedCategory === 'icons' && asset.type === 'icon');

    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const allTab: TabItem = {
    id: 'all',
    label: 'All',
    content: renderAssetGrid(filteredAssets),
  };

  const imagesTab: TabItem = {
    id: 'images',
    label: 'Images',
    content: renderAssetGrid(filteredAssets.filter((a) => a.type === 'image')),
  };

  const videosTab: TabItem = {
    id: 'videos',
    label: 'Videos',
    content: renderAssetGrid(filteredAssets.filter((a) => a.type === 'video')),
  };

  const fontsTab: TabItem = {
    id: 'fonts',
    label: 'Fonts',
    content: renderAssetGrid(filteredAssets.filter((a) => a.type === 'font')),
  };

  const iconsTab: TabItem = {
    id: 'icons',
    label: 'Icons',
    content: renderAssetGrid(filteredAssets.filter((a) => a.type === 'icon')),
  };

  function renderAssetGrid(items: Asset[]) {
    if (items.length === 0) {
      return (
        <EmptyState
          icon="image"
          title="No assets found"
          description="Upload assets to get started"
          actionText="Upload Asset"
          onAction={handleUpload}
        />
      );
    }

    return (
      <div className="asset-grid">
        {items.map((asset) => (
          <div key={asset.id} className="asset-item">
            <div className="asset-item-preview">
              {asset.type === 'image' && (
                <Image src={asset.url} alt={asset.name} width={100} height={100} />
              )}
              {asset.type === 'video' && <video src={asset.url} />}
              {asset.type !== 'image' && asset.type !== 'video' && (
                <Icon name="file" size="large" />
              )}
            </div>
            <div className="asset-item-info">
              <div className="asset-item-name">{asset.name}</div>
              <div className="asset-item-meta">
                <span>{formatFileSize(asset.size)}</span>
                <span>{formatDate(asset.createdAt)}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="small"
              className="asset-item-delete"
              onClick={() => handleDelete(asset.id)}
            >
              <Icon name="delete" size="small" />
            </Button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="asset-panel">
        <div className="asset-panel-header">
          <h3 className="text-sm font-semibold">Assets</h3>
          <Button variant="primary" size="small" onClick={handleUpload}>
            <Icon name="plus" size="small" />
            Upload
          </Button>
        </div>

        <div className="asset-panel-search">
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Icon name="search" size="small" />}
            className="w-full"
          />
        </div>

        <div className="asset-panel-content">
          <Tabs
            items={[allTab, imagesTab, videosTab, fontsTab, iconsTab]}
            variant="pills"
            className="flex-1"
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
    </>
  );
};

export default AssetPanel;
