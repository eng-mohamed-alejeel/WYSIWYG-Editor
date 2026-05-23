import React from 'react';
import { Input, Select, Switch } from '@wysiwyg/ui';

interface AdvancedTabProps {
  project: any;
  handleProjectUpdate: (updates: any) => void;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({ project, handleProjectUpdate }) => (
  <div className="space-y-4">
    <div className="property-group">
      <h3 className="property-group-title">Advanced Settings</h3>
      <div className="property-item">
        <label className="property-item-label">Enable AI Features</label>
        <Switch
          checked={project?.settings?.enableAiFeatures || false}
          onChange={(checked) =>
            handleProjectUpdate({
              settings: { ...project?.settings, enableAiFeatures: checked },
            })
          }
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Enable Analytics</label>
        <Switch
          checked={project?.settings?.enableAnalytics || false}
          onChange={(checked) =>
            handleProjectUpdate({
              settings: { ...project?.settings, enableAnalytics: checked },
            })
          }
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Auto-save Interval (ms)</label>
        <Input
          type="number"
          value={project?.settings?.autoSaveInterval || 30000}
          onChange={(e) =>
            handleProjectUpdate({
              settings: { ...project?.settings, autoSaveInterval: Number(e.target.value) },
            })
          }
          placeholder="30000"
          className="w-full"
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Max History Size</label>
        <Input
          type="number"
          value={project?.settings?.maxHistorySize || 50}
          onChange={(e) =>
            handleProjectUpdate({
              settings: { ...project?.settings, maxHistorySize: Number(e.target.value) },
            })
          }
          placeholder="50"
          className="w-full"
        />
      </div>
    </div>
    <div className="property-group">
      <h3 className="property-group-title">Export Settings</h3>
      <div className="property-item">
        <label className="property-item-label">Default Export Format</label>
        <Select
          value={project?.settings?.defaultExportFormat || 'html'}
          onChange={(value) =>
            handleProjectUpdate({
              settings: { ...project?.settings, defaultExportFormat: value },
            })
          }
          options={[
            { value: 'html', label: 'HTML' },
            { value: 'react', label: 'React' },
            { value: 'wordpress', label: 'WordPress' },
            { value: 'odoo', label: 'Odoo' },
          ]}
          className="w-full"
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Minify Code</label>
        <Switch
          checked={project?.settings?.minifyCode || false}
          onChange={(checked) =>
            handleProjectUpdate({
              settings: { ...project?.settings, minifyCode: checked },
            })
          }
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Include Source Maps</label>
        <Switch
          checked={project?.settings?.includeSourceMaps || false}
          onChange={(checked) =>
            handleProjectUpdate({
              settings: { ...project?.settings, includeSourceMaps: checked },
            })
          }
        />
      </div>
    </div>
  </div>
);
