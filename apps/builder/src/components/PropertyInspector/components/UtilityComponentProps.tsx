import React from 'react';
import { Input, Select } from '@wysiwyg/ui';
import { ComponentNode } from '@wysiwyg/core';

interface PropsTabProps {
  component: ComponentNode;
  onPropChange: (key: string, value: any) => void;
}

export const DividerComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Color</label>
      <Input
        type="color"
        value={component.props?.color || '#e5e7eb'}
        onChange={(e) => onPropChange('color', e.target.value)}
        className="w-full"
      />
    </div>
  </div>
);

export const SpacerComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Height</label>
      <Input
        value={component.props?.height || '1rem'}
        onChange={(e) => onPropChange('height', e.target.value)}
        className="w-full"
        placeholder="1rem"
      />
    </div>
  </div>
);

export const IconComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Icon Name</label>
      <Input
        value={component.props?.icon || 'star'}
        onChange={(e) => onPropChange('icon', e.target.value)}
        className="w-full"
        placeholder="star"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Size</label>
      <Select
        value={component.props?.size || 'medium'}
        onChange={(value: string) => onPropChange('size', value)}
        className="w-full"
        options={[
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' }
        ]}
      />
    </div>
  </div>
);

export const LayoutComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => {
  if (component.type === 'grid') {
    return (
      <div className="space-y-4">
        <div className="property-item">
          <label className="property-item-label">Columns</label>
          <Input
            value={component.props?.columns || 'repeat(auto-fit, minmax(250px, 1fr))'}
            onChange={(e) => onPropChange('columns', e.target.value)}
            className="w-full"
            placeholder="repeat(auto-fit, minmax(250px, 1fr))"
          />
        </div>
        <div className="property-item">
          <label className="property-item-label">Gap</label>
          <Input
            value={component.props?.gap || '1rem'}
            onChange={(e) => onPropChange('gap', e.target.value)}
            className="w-full"
            placeholder="1rem"
          />
        </div>
      </div>
    );
  }
  return null;
};
