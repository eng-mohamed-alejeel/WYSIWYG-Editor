import React from 'react';
import { Input, Select, Switch } from '@wysiwyg/ui';
import { ComponentNode } from '@wysiwyg/core';
import { ComponentStyles, StyleValue } from './types';

interface AdvancedTabProps {
  component: ComponentNode;
  onPropChange: (key: string, value: any) => void;
  onStyleChange: (key: string, value: StyleValue) => void;
}

const getStyleValue = (
  styles: ComponentStyles | undefined,
  key: keyof ComponentStyles,
  defaultValue: string
): string => {
  const value = styles?.[key];
  return value !== undefined ? String(value) : defaultValue;
};

export const AdvancedTab: React.FC<AdvancedTabProps> = ({
  component,
  onPropChange,
  onStyleChange,
}) => {
  const styles = component.styles as ComponentStyles | undefined;

  return (
    <div className="space-y-4">
      <div className="property-group">
        <h3 className="property-group-title">Advanced Properties</h3>

        <div className="property-item">
          <label className="property-item-label">Custom CSS</label>
          <textarea
            className="property-item-input w-full h-32"
            value={component.props?.customCSS || ''}
            onChange={(e) => onPropChange('customCSS', e.target.value)}
            placeholder="Enter custom CSS..."
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Custom Classes</label>
          <Input
            value={component.props?.customClasses || ''}
            onChange={(e) => onPropChange('customClasses', e.target.value)}
            placeholder="class1 class2..."
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Custom Attributes</label>
          <Input
            value={component.props?.customAttributes || ''}
            onChange={(e) => onPropChange('customAttributes', e.target.value)}
            placeholder='{"data-id": "value"}'
            className="w-full"
          />
        </div>
      </div>

      <div className="property-group">
        <h3 className="property-group-title">Visibility</h3>

        <div className="property-item">
          <label className="property-item-label">Visible</label>
          <Switch
            checked={component.props?.visible !== false}
            onChange={(checked) => onPropChange('visible', checked)}
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Display</label>
          <Select
            value={getStyleValue(styles, 'display', 'block')}
            onChange={(value) => onStyleChange('display', value)}
            options={[
              { value: 'block', label: 'Block' },
              { value: 'inline', label: 'Inline' },
              { value: 'inline-block', label: 'Inline Block' },
              { value: 'flex', label: 'Flex' },
              { value: 'grid', label: 'Grid' },
              { value: 'none', label: 'None' },
            ]}
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Position</label>
          <Select
            value={getStyleValue(styles, 'position', 'static')}
            onChange={(value) => onStyleChange('position', value)}
            options={[
              { value: 'static', label: 'Static' },
              { value: 'relative', label: 'Relative' },
              { value: 'absolute', label: 'Absolute' },
              { value: 'fixed', label: 'Fixed' },
              { value: 'sticky', label: 'Sticky' },
            ]}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
