/**
 * Number Field Renderer
 *
 * Renders number input fields for the inspector
 */

import React from 'react';
import { Input, Slider } from '@wysiwyg/ui';
import { FieldRendererProps } from '../types';

export const NumberField: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled,
}) => {
  const numValue = value ?? field.defaultValue ?? 0;
  const min = field.min ?? 0;
  const max = field.max ?? 100;
  const step = field.step ?? 1;
  const showSlider = min !== undefined && max !== undefined && max - min <= 1000;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(isNaN(newValue) ? 0 : newValue);
  };

  const handleSliderChange = (newValue: number) => {
    onChange(newValue);
  };

  return (
    <div className="inspector-number-field">
      {showSlider ? (
        <div className="inspector-number-field-with-slider">
          <Slider
            label={field.label}
            value={numValue}
            onChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled || field.disabled === true}
            showValue
          />
        </div>
      ) : (
        <Input
          label={field.label}
          type="number"
          value={numValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          error={!!error}
          errorMessage={error}
          disabled={disabled ?? field.disabled === true}
          helpText={field.helpText}
          fullWidth
        />
      )}
      {field.helpText && !showSlider && (
        <div className="inspector-field-help-text">{field.helpText}</div>
      )}
    </div>
  );
};

export default NumberField;
