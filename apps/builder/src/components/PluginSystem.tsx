import React, { useState, useMemo, useCallback } from 'react';
import { Modal, Tabs, TabItem } from '@wysiwyg/ui';
import { Plugin, PluginSystemProps } from './PluginSystem/types';
import { plugins, categories } from './PluginSystem/data';
import { BrowseTab } from './PluginSystem/BrowseTab';
import { InstalledTab } from './PluginSystem/InstalledTab';
import { SettingsTab } from './PluginSystem/SettingsTab';

export const PluginSystem: React.FC<PluginSystemProps> = ({
  isOpen,
  onClose,
  onInstallPlugin,
  onUninstallPlugin,
  onTogglePlugin
}) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  const handleInstall = useCallback((plugin: Plugin) => {
    onInstallPlugin?.(plugin);
  }, [onInstallPlugin]);

  const handleUninstall = useCallback((pluginId: string) => {
    onUninstallPlugin?.(pluginId);
  }, [onUninstallPlugin]);

  const handleToggle = useCallback((pluginId: string) => {
    onTogglePlugin?.(pluginId);
  }, [onTogglePlugin]);

  const handleSettingChange = useCallback((pluginId: string, key: string, value: any) => {
    console.log('Setting change:', pluginId, key, value);
  }, []);

  const tabs = useMemo<TabItem[]>(() => [
    {
      id: 'browse',
      label: 'Browse Plugins',
      content: (
        <BrowseTab
          plugins={plugins}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          categories={categories}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onInstall={handleInstall}
          onUninstall={handleUninstall}
          onToggle={handleToggle}
        />
      )
    },
    {
      id: 'installed',
      label: 'Installed',
      content: (
        <InstalledTab
          plugins={plugins}
          onToggle={handleToggle}
          onSelectPlugin={setSelectedPlugin}
          onUninstall={handleUninstall}
        />
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      content: (
        <SettingsTab
          selectedPlugin={selectedPlugin}
          onToggle={handleToggle}
          onSettingChange={handleSettingChange}
        />
      )
    }
  ], [
    searchQuery,
    selectedCategory,
    selectedPlugin,
    handleInstall,
    handleUninstall,
    handleToggle,
    handleSettingChange
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plugin System"
      size="large"
    >
      <Tabs
        items={tabs}
        defaultActiveTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />
    </Modal>
  );
};

export default PluginSystem;
