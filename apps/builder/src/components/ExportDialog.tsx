import React, { useState } from 'react';
import { Modal } from '@wysiwyg/ui';
import { Button } from '@wysiwyg/ui';
import { Select } from '@wysiwyg/ui';
import { Switch } from '@wysiwyg/ui';
import { Input } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

export interface ExportOptions {
  format: 'html' | 'react' | 'wordpress' | 'odoo';
  minify: boolean;
  includeSourceMaps: boolean;
  includeAssets: boolean;
  customFileName?: string;
  outputPath?: string;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose, onExport }) => {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'html',
    minify: false,
    includeSourceMaps: false,
    includeAssets: true,
  });

  const handleExport = () => {
    onExport(options);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Project" size="medium">
      <div className="space-y-6">
        <div className="property-group">
          <h3 className="property-group-title">Export Format</h3>

          <div className="property-item">
            <label className="property-item-label">Format</label>
            <Select
              value={options.format}
              onChange={(value) => setOptions({ ...options, format: value as any })}
              options={[
                { value: 'html', label: 'HTML Website' },
                { value: 'react', label: 'React Components' },
                { value: 'wordpress', label: 'WordPress Blocks' },
                { value: 'odoo', label: 'Odoo Snippets' },
              ]}
              className="w-full"
            />
          </div>

          <div className="property-item">
            <label className="property-item-label">Custom File Name</label>
            <Input
              value={options.customFileName || ''}
              onChange={(e) => setOptions({ ...options, customFileName: e.target.value })}
              placeholder="my-project"
              className="w-full"
            />
          </div>

          <div className="property-item">
            <label className="property-item-label">Output Path</label>
            <Input
              value={options.outputPath || ''}
              onChange={(e) => setOptions({ ...options, outputPath: e.target.value })}
              placeholder="./dist"
              className="w-full"
            />
          </div>
        </div>

        <div className="property-group">
          <h3 className="property-group-title">Export Options</h3>

          <div className="property-item">
            <label className="property-item-label">Minify Code</label>
            <Switch
              checked={options.minify}
              onChange={(checked) => setOptions({ ...options, minify: checked })}
            />
            <p className="text-sm text-gray-600 mt-1">
              Remove whitespace and comments from the exported code
            </p>
          </div>

          <div className="property-item">
            <label className="property-item-label">Include Source Maps</label>
            <Switch
              checked={options.includeSourceMaps}
              onChange={(checked) => setOptions({ ...options, includeSourceMaps: checked })}
            />
            <p className="text-sm text-gray-600 mt-1">Generate source maps for easier debugging</p>
          </div>

          <div className="property-item">
            <label className="property-item-label">Include Assets</label>
            <Switch
              checked={options.includeAssets}
              onChange={(checked) => setOptions({ ...options, includeAssets: checked })}
            />
            <p className="text-sm text-gray-600 mt-1">
              Include images, fonts, and other assets in the export
            </p>
          </div>
        </div>

        <div className="property-group">
          <h3 className="property-group-title">Format Specific Options</h3>

          {options.format === 'html' && (
            <div className="space-y-4">
              <div className="property-item">
                <label className="property-item-label">Include Bootstrap</label>
                <Switch checked={false} onChange={() => {}} />
              </div>
              <div className="property-item">
                <label className="property-item-label">Include jQuery</label>
                <Switch checked={false} onChange={() => {}} />
              </div>
            </div>
          )}

          {options.format === 'react' && (
            <div className="space-y-4">
              <div className="property-item">
                <label className="property-item-label">Use TypeScript</label>
                <Switch checked={false} onChange={() => {}} />
              </div>
              <div className="property-item">
                <label className="property-item-label">Use Tailwind CSS</label>
                <Switch checked={false} onChange={() => {}} />
              </div>
            </div>
          )}

          {options.format === 'wordpress' && (
            <div className="space-y-4">
              <div className="property-item">
                <label className="property-item-label">Plugin Name</label>
                <Input value="" onChange={() => {}} placeholder="my-blocks" className="w-full" />
              </div>
            </div>
          )}

          {options.format === 'odoo' && (
            <div className="space-y-4">
              <div className="property-item">
                <label className="property-item-label">Module Name</label>
                <Input
                  value=""
                  onChange={() => {}}
                  placeholder="web_editor_snippets"
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleExport}>
          <Icon name="download" size="small" />
          Export
        </Button>
      </div>
    </Modal>
  );
};

export default ExportDialog;
