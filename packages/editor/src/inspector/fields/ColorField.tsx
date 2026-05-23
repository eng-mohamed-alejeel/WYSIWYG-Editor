/**
 * Color Field Renderer
 *
 * Renders color picker fields for the inspector
 */

import React from 'react';
import { ColorPicker } from '@wysiwyg/ui';
import { FieldRendererProps } from '../types';

export const ColorField: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled,
}) => {
  const colorValue = value ?? field.defaultValue ?? '#000000';

  const handleChange = (newColor: string) => {
    onChange(newColor);
  };

  return (
    <div className="inspector-color-field">
      <ColorPicker
        label={field.label}
        value={colorValue}
        onChange={handleChange}
        disabled={disabled ?? field.disabled === true}
        showPreview
        showInput
        showPresets
        size="medium"
      />
      {field.helpText && <div className="inspector-field-help-text">{field.helpText}</div>}
      {error && <div className="inspector-field-error">{error}</div>}
    </div>
  );
};

export default ColorField;
