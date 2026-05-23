/**
 * Text Field Renderer
 *
 * Renders text input fields for the inspector
 */

import React from 'react';
import { Input } from '@wysiwyg/ui';
import { FieldRendererProps } from '../types';

export const TextField: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      label={field.label}
      value={value ?? field.defaultValue ?? ''}
      onChange={handleChange}
      placeholder={field.placeholder}
      error={!!error}
      errorMessage={error}
      disabled={disabled ?? field.disabled === true}
      helpText={field.helpText}
      fullWidth
    />
  );
};

export default TextField;
