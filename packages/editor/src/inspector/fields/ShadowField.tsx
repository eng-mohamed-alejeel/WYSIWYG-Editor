/**
 * Shadow Field Renderer
 *
 * Renders shadow control fields for the inspector
 */

import React from 'react';
import { Input, ColorPicker, Switch } from '@wysiwyg/ui';
import { FieldRendererProps, ShadowValue } from '../types';

export const ShadowField: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled,
}) => {
  const shadowValue: ShadowValue = value ??
    field.defaultValue ?? {
      color: '#000000',
      offsetX: 0,
      offsetY: 4,
      blur: 8,
      spread: 0,
      inset: false,
    };

  const handleChange = (property: keyof ShadowValue, newValue: any) => {
    onChange({
      ...shadowValue,
      [property]: newValue,
    });
  };

  const generateBoxShadow = (): string => {
    const { color, offsetX, offsetY, blur, spread, inset } = shadowValue;
    const insetStr = inset ? 'inset ' : '';
    return `${insetStr}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`;
  };

  return (
    <div className="inspector-shadow-field">
      <label className="inspector-shadow-field-label">{field.label}</label>

      <div className="inspector-shadow-field-controls">
        <div className="inspector-shadow-field-row">
          <Input
            label="X Offset"
            type="number"
            value={shadowValue.offsetX ?? 0}
            onChange={(e) => handleChange('offsetX', parseFloat(e.target.value) || 0)}
            disabled={disabled ?? field.disabled === true}
            suffix="px"
            fullWidth
          />
          <Input
            label="Y Offset"
            type="number"
            value={shadowValue.offsetY ?? 0}
            onChange={(e) => handleChange('offsetY', parseFloat(e.target.value) || 0)}
            disabled={disabled ?? field.disabled === true}
            suffix="px"
            fullWidth
          />
        </div>

        <div className="inspector-shadow-field-row">
          <Input
            label="Blur"
            type="number"
            value={shadowValue.blur ?? 0}
            onChange={(e) => handleChange('blur', parseFloat(e.target.value) || 0)}
            disabled={disabled ?? field.disabled === true}
            suffix="px"
            fullWidth
          />
          <Input
            label="Spread"
            type="number"
            value={shadowValue.spread ?? 0}
            onChange={(e) => handleChange('spread', parseFloat(e.target.value) || 0)}
            disabled={disabled ?? field.disabled === true}
            suffix="px"
            fullWidth
          />
        </div>

        <div className="inspector-shadow-field-row">
          <ColorPicker
            label="Color"
            value={shadowValue.color ?? '#000000'}
            onChange={(value) => handleChange('color', value)}
            disabled={disabled ?? field.disabled === true}
            showPreview
            showInput
          />
          <div className="inspector-shadow-field-inset">
            <Switch
              label="Inset"
              checked={shadowValue.inset ?? false}
              onChange={(checked) => handleChange('inset', checked)}
              disabled={disabled ?? field.disabled === true}
            />
          </div>
        </div>

        <div className="inspector-shadow-field-preview">
          <label className="inspector-shadow-field-preview-label">Preview</label>
          <div
            className="inspector-shadow-field-preview-box"
            style={{ boxShadow: generateBoxShadow() }}
          >
            <span>Shadow Preview</span>
          </div>
        </div>
      </div>

      {field.helpText && <div className="inspector-field-help-text">{field.helpText}</div>}
      {error && <div className="inspector-field-error">{error}</div>}
    </div>
  );
};

export default ShadowField;
