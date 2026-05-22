import React from 'react';
import { Input, Select, Switch } from '@wysiwyg/ui';
import { ComponentNode } from '@wysiwyg/core';

interface PropsTabProps {
  component: ComponentNode;
  onPropChange: (key: string, value: any) => void;
}

export const InputComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Input Type</label>
      <Select
        value={component.props?.type || 'text'}
        onChange={(value: string) => onPropChange('type', value)}
        className="w-full"
        options={[
          { label: 'Text', value: 'text' },
          { label: 'Email', value: 'email' },
          { label: 'Password', value: 'password' },
          { label: 'Number', value: 'number' },
          { label: 'Telephone', value: 'tel' },
          { label: 'URL', value: 'url' }
        ]}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Placeholder</label>
      <Input
        value={component.props?.placeholder || ''}
        onChange={(e) => onPropChange('placeholder', e.target.value)}
        className="w-full"
        placeholder="Enter placeholder text"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Default Value</label>
      <Input
        value={component.props?.value || ''}
        onChange={(e) => onPropChange('value', e.target.value)}
        className="w-full"
        placeholder="Enter default value"
      />
    </div>
  </div>
);

export const TextareaComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Placeholder</label>
      <Input
        value={component.props?.placeholder || ''}
        onChange={(e) => onPropChange('placeholder', e.target.value)}
        className="w-full"
        placeholder="Enter placeholder text"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Rows</label>
      <input
        type="number"
        value={component.props?.rows || 4}
        onChange={(e) => onPropChange('rows', Number(e.target.value))}
        className="w-full"
        min={2}
        max={20}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Default Value</label>
      <textarea
        value={component.props?.value || ''}
        onChange={(e) => onPropChange('value', e.target.value)}
        className="w-full"
        placeholder="Enter default value"
        rows={4}
      />
    </div>
  </div>
);

export const SelectComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Options</label>
      <textarea
        value={component.props?.options?.map((opt: any) => `${opt.label}:${opt.value}`).join('\n') || ''}
        onChange={(e) => {
          const options = e.target.value.split('\n')
            .filter(line => line.trim())
            .map(line => {
              const [label, value] = line.split(':');
              return { label: label?.trim() || line, value: value?.trim() || line };
            });
          onPropChange('options', options);
        }}
        className="w-full"
        placeholder="Option1:value1\nOption2:value2"
        rows={4}
      />
    </div>
  </div>
);

export const CheckboxComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Checked</label>
      <Switch
        checked={component.props?.checked || false}
        onChange={(checked) => onPropChange('checked', checked)}
      />
    </div>
  </div>
);

export const RadioComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Name</label>
      <Input
        value={component.props?.name || ''}
        onChange={(e) => onPropChange('name', e.target.value)}
        className="w-full"
        placeholder="Enter radio group name"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Checked</label>
      <Switch
        checked={component.props?.checked || false}
        onChange={(checked) => onPropChange('checked', checked)}
      />
    </div>
  </div>
);
