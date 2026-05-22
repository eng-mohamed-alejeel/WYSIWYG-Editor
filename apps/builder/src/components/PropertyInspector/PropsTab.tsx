import React from 'react';
import { Input, Switch } from '@wysiwyg/ui';
import { ComponentNode } from '@wysiwyg/core';

interface PropsTabProps {
  component: ComponentNode;
  onPropChange: (key: string, value: any) => void;
}

export const PropsTab: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-group">
      <h3 className="property-group-title">Basic Properties</h3>

      <div className="property-item">
        <label className="property-item-label">ID</label>
        <Input value={component.id} readOnly className="w-full" />
      </div>

      <div className="property-item">
        <label className="property-item-label">Type</label>
        <Input value={component.type} readOnly className="w-full" />
      </div>
    </div>

    {Object.entries(component.props || {}).map(([key, value]) => (
      <div key={key} className="property-item">
        <label className="property-item-label">{key}</label>
        {typeof value === 'boolean' ? (
          <Switch checked={value as boolean} onChange={(checked) => onPropChange(key, checked)} />
        ) : typeof value === 'number' ? (
          <Input
            type="number"
            value={value as number}
            onChange={(e) => onPropChange(key, Number(e.target.value))}
            className="w-full"
          />
        ) : (
          <Input
            value={value as string}
            onChange={(e) => onPropChange(key, e.target.value)}
            className="w-full"
          />
        )}
      </div>
    ))}
  </div>
);
