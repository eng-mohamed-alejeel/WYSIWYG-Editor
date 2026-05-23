/**
 * Select Field Renderer
 *
 * Renders select dropdown fields for the inspector
 */

import React from 'react';
import { Select } from '@wysiwyg/ui';
import { FieldRendererProps } from '../types';

export const SelectField: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled,
}) => {
  const selectValue = value ?? field.defaultValue ?? field.options?.[0]?.value ?? '';

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  const options =
    field.options?.map((opt) => ({
      value: opt.value,
      label: opt.label,
      disabled: opt.disabled,
      icon: opt.icon,
    })) ?? [];

  return (
    <div className="inspector-select-field">
      <Select
        label={field.label}
        value={selectValue}
        onChange={handleChange}
        options={options}
        placeholder={field.placeholder}
        error={!!error}
        errorMessage={error}
        disabled={disabled ?? field.disabled === true}
        fullWidth
      />
      {field.helpText && <div className="inspector-field-help-text">{field.helpText}</div>}
    </div>
  );
};

export default SelectField;
