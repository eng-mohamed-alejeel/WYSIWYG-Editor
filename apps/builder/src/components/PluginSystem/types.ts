export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  icon: string;
  category: 'components' | 'tools' | 'integrations' | 'themes';
  isInstalled: boolean;
  isEnabled: boolean;
  isPremium?: boolean;
  settings?: any;
}

interface PluginSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallPlugin?: (plugin: Plugin) => void;
  onUninstallPlugin?: (pluginId: string) => void;
  onTogglePlugin?: (pluginId: string) => void;
}

export type { PluginSystemProps };
