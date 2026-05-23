import React from 'react';
import { Input, Select } from '@wysiwyg/ui';

interface StylesTabProps {
  project: any;
  handleProjectUpdate: (updates: any) => void;
}

export const StylesTab: React.FC<StylesTabProps> = ({ project, handleProjectUpdate }) => (
  <div className="space-y-4">
    <div className="property-group">
      <h3 className="property-group-title">Global Styles</h3>
      <div className="property-item">
        <label className="property-item-label">Font Family</label>
        <Select
          value={project?.styles?.fontFamily || 'Inter'}
          onChange={(value) =>
            handleProjectUpdate({
              styles: { ...project?.styles, fontFamily: value },
            })
          }
          options={[
            { value: 'Inter', label: 'Inter' },
            { value: 'Roboto', label: 'Roboto' },
            { value: 'Open Sans', label: 'Open Sans' },
            { value: 'Lato', label: 'Lato' },
            { value: 'Montserrat', label: 'Montserrat' },
          ]}
          className="w-full"
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Base Font Size</label>
        <Input
          type="number"
          value={parseInt(project?.styles?.baseFontSize || '16')}
          onChange={(e) =>
            handleProjectUpdate({
              styles: { ...project?.styles, baseFontSize: e.target.value },
            })
          }
          placeholder="16"
          className="w-full"
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Line Height</label>
        <Input
          type="number"
          step="0.1"
          value={parseFloat(project?.styles?.lineHeight || '1.5')}
          onChange={(e) =>
            handleProjectUpdate({
              styles: { ...project?.styles, lineHeight: e.target.value },
            })
          }
          placeholder="1.5"
          className="w-full"
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Primary Color</label>
        <Input
          type="color"
          value={project?.styles?.primaryColor || '#3b82f6'}
          onChange={(e) =>
            handleProjectUpdate({
              styles: { ...project?.styles, primaryColor: e.target.value },
            })
          }
          className="w-full"
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Secondary Color</label>
        <Input
          type="color"
          value={project?.styles?.secondaryColor || '#64748b'}
          onChange={(e) =>
            handleProjectUpdate({
              styles: { ...project?.styles, secondaryColor: e.target.value },
            })
          }
          className="w-full"
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Background Color</label>
        <Input
          type="color"
          value={project?.styles?.backgroundColor || '#ffffff'}
          onChange={(e) =>
            handleProjectUpdate({
              styles: { ...project?.styles, backgroundColor: e.target.value },
            })
          }
          className="w-full"
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Text Color</label>
        <Input
          type="color"
          value={project?.styles?.textColor || '#000000'}
          onChange={(e) =>
            handleProjectUpdate({
              styles: { ...project?.styles, textColor: e.target.value },
            })
          }
          className="w-full"
        />
      </div>
    </div>
    <div className="property-group">
      <h3 className="property-group-title">Custom CSS</h3>
      <div className="property-item">
        <textarea
          className="property-item-input w-full h-48 font-mono text-sm"
          value={project?.styles?.customCSS || ''}
          onChange={(e) =>
            handleProjectUpdate({
              styles: { ...project?.styles, customCSS: e.target.value },
            })
          }
          placeholder="Enter custom CSS..."
        />
      </div>
    </div>
  </div>
);
