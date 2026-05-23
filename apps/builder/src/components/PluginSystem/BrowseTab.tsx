import React from 'react';
import { Button, Input, Select, Icon, EmptyState, Badge, Switch } from '@wysiwyg/ui';
import { Plugin } from './types';

interface BrowseTabProps {
  plugins: Plugin[];
  searchQuery: string;
  selectedCategory: string;
  categories: Array<{ id: string; label: string }>;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onInstall: (plugin: Plugin) => void;
  onUninstall: (pluginId: string) => void;
  onToggle: (pluginId: string) => void;
}

export const BrowseTab: React.FC<BrowseTabProps> = ({
  plugins,
  searchQuery,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
  onInstall,
  onUninstall,
  onToggle,
}) => {
  const filteredPlugins = plugins.filter((plugin) => {
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    const matchesSearch =
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search plugins..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Icon name="search" size="small" />}
          className="flex-1"
        />
        <Select
          value={selectedCategory}
          onChange={onCategoryChange}
          options={categories.map((c) => ({ value: c.id, label: c.label }))}
          className="w-48"
        />
      </div>

      {filteredPlugins.length === 0 ? (
        <EmptyState
          icon="plugin"
          title="No plugins found"
          description="Try adjusting your search or category filter"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredPlugins.map((plugin) => (
            <div
              key={plugin.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Icon name={plugin.icon as any} size="medium" />
                  <div>
                    <h3 className="font-semibold">{plugin.name}</h3>
                    <p className="text-sm text-gray-600">v{plugin.version}</p>
                  </div>
                </div>
                {plugin.isPremium && (
                  <Badge variant="default" size="sm">
                    Premium
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3">{plugin.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">by {plugin.author}</span>
                {plugin.isInstalled ? (
                  <div className="flex gap-2">
                    <Switch checked={plugin.isEnabled} onChange={() => onToggle(plugin.id)} />
                    <Button variant="ghost" size="small" onClick={() => onUninstall(plugin.id)}>
                      <Icon name="delete" size="small" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="primary" size="small" onClick={() => onInstall(plugin)}>
                    Install
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
