import React from 'react';
import { Icon, EmptyState, Input, Switch } from '@wysiwyg/ui';
import { Plugin } from './types';

interface SettingsTabProps {
  selectedPlugin: Plugin | null;
  onToggle: (pluginId: string) => void;
  onSettingChange?: (pluginId: string, key: string, value: any) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  selectedPlugin,
  onToggle,
  onSettingChange
}) => {
  if (!selectedPlugin) {
    return (
      <EmptyState
        icon="settings"
        title="No plugin selected"
        description="Select a plugin to view its settings"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Icon name={selectedPlugin.icon as any} size="large" />
        <div>
          <h3 className="font-semibold">{selectedPlugin.name}</h3>
          <p className="text-sm text-gray-600">v{selectedPlugin.version}</p>
        </div>
      </div>

      <div className="property-item">
        <label className="property-item-label">Enable Plugin</label>
        <Switch
          checked={selectedPlugin.isEnabled}
          onChange={() => onToggle(selectedPlugin.id)}
        />
      </div>

      {selectedPlugin.settings && Object.entries(selectedPlugin.settings).map(([key, value]) => (
        <div key={key} className="property-item">
          <label className="property-item-label">{key}</label>
          <Input
            value={value as string}
            onChange={(e) => onSettingChange?.(selectedPlugin.id, key, e.target.value)}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
};
