import React from 'react';
import { Button, Icon, EmptyState, Switch } from '@wysiwyg/ui';
import { Plugin } from './types';

interface InstalledTabProps {
  plugins: Plugin[];
  onToggle: (pluginId: string) => void;
  onSelectPlugin: (plugin: Plugin) => void;
  onUninstall: (pluginId: string) => void;
}

export const InstalledTab: React.FC<InstalledTabProps> = ({
  plugins,
  onToggle,
  onSelectPlugin,
  onUninstall
}) => {
  const installedPlugins = plugins.filter(p => p.isInstalled);

  return (
    <div className="space-y-4">
      {installedPlugins.length === 0 ? (
        <EmptyState
          icon="plugin"
          title="No plugins installed"
          description="Browse and install plugins to enhance your builder"
        />
      ) : (
        <div className="space-y-2">
          {installedPlugins.map(plugin => (
            <div
              key={plugin.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Icon name={plugin.icon as any} size="medium" />
                <div>
                  <h3 className="font-semibold">{plugin.name}</h3>
                  <p className="text-sm text-gray-600">v{plugin.version}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={plugin.isEnabled}
                  onChange={() => onToggle(plugin.id)}
                />
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onSelectPlugin(plugin)}
                >
                  <Icon name="settings" size="small" />
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onUninstall(plugin.id)}
                >
                  <Icon name="delete" size="small" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
