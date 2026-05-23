import React from 'react';
import { Input, Select } from '@wysiwyg/ui';

interface GeneralTabProps {
  project: any;
  handleProjectUpdate: (updates: any) => void;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ project, handleProjectUpdate }) => (
  <div className="space-y-4">
    <div className="property-group">
      <h3 className="property-group-title">Project Settings</h3>
      <div className="property-item">
        <label className="property-item-label">Project Name</label>
        <Input
          value={project?.name || ''}
          onChange={(e) => handleProjectUpdate({ name: e.target.value })}
          placeholder="My Project"
          className="w-full"
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Description</label>
        <textarea
          className="property-item-input w-full h-24"
          value={project?.description || ''}
          onChange={(e) => handleProjectUpdate({ description: e.target.value })}
          placeholder="Project description..."
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Language</label>
        <Select
          value={project?.language || 'en'}
          onChange={(value) => handleProjectUpdate({ language: value })}
          options={[
            { value: 'en', label: 'English' },
            { value: 'ar', label: 'Arabic' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
            { value: 'es', label: 'Spanish' },
          ]}
          className="w-full"
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Direction</label>
        <Select
          value={project?.direction || 'ltr'}
          onChange={(value) => handleProjectUpdate({ direction: value })}
          options={[
            { value: 'ltr', label: 'Left to Right' },
            { value: 'rtl', label: 'Right to Left' },
          ]}
          className="w-full"
        />
      </div>
    </div>
    <div className="property-group">
      <h3 className="property-group-title">Viewport Settings</h3>
      <div className="property-item">
        <label className="property-item-label">Default Breakpoint</label>
        <Select
          value={project?.defaultBreakpoint || 'desktop'}
          onChange={(value) => handleProjectUpdate({ defaultBreakpoint: value })}
          options={[
            { value: 'desktop', label: 'Desktop (1200px)' },
            { value: 'tablet', label: 'Tablet (768px)' },
            { value: 'mobile', label: 'Mobile (375px)' },
          ]}
          className="w-full"
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Max Width</label>
        <Input
          type="number"
          value={project?.maxWidth || 1200}
          onChange={(e) => handleProjectUpdate({ maxWidth: Number(e.target.value) })}
          placeholder="1200"
          className="w-full"
        />
      </div>
    </div>
  </div>
);
