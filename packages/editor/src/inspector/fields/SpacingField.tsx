/**
 * Spacing Field Renderer
 *
 * Renders spacing control fields (padding, margin) for the inspector
 */

import React, { useState, useCallback } from 'react';
import { Input, Switch } from '@wysiwyg/ui';
import { FieldRendererProps, SpacingValue } from '../types';

export const SpacingField: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled,
}) => {
  const spacingValue: SpacingValue = value ??
    field.defaultValue ?? {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      unit: 'px',
    };

  const [isLinked, setIsLinked] = useState(
    spacingValue.top === spacingValue.right &&
      spacingValue.right === spacingValue.bottom &&
      spacingValue.bottom === spacingValue.left
  );

  const handleChange = useCallback(
    (side: keyof SpacingValue, newValue: number | string) => {
      const updated = {
        ...spacingValue,
        [side]: newValue,
      };

      // If linked, update all sides
      if (
        isLinked &&
        (side === 'top' || side === 'right' || side === 'bottom' || side === 'left')
      ) {
        updated.top = newValue;
        updated.right = newValue;
        updated.bottom = newValue;
        updated.left = newValue;
      }

      onChange(updated);
    },
    [spacingValue, isLinked, onChange]
  );

  const handleUnitChange = useCallback((newUnit: string) => {
      onChange({
        ...spacingValue,
        unit: newUnit,
      });
    },
    [spacingValue, onChange]
  );

  const handleToggleLinked = useCallback(() => {
    const newLinked = !isLinked;
    setIsLinked(newLinked);

    if (newLinked) {
      // When linking, use top value for all sides
      const topValue = spacingValue.top ?? 0;
      onChange({
        ...spacingValue,
        top: topValue,
        right: topValue,
        bottom: topValue,
        left: topValue,
      });
    }
  }, [isLinked, spacingValue, onChange]);

  return (
    <div className="inspector-spacing-field">
      <div className="inspector-spacing-field-header">
        <label className="inspector-spacing-field-label">{field.label}</label>
        <Switch
          checked={isLinked}
          onChange={handleToggleLinked}
          size="small"
          label="Link"
          labelOnLeft
        />
      </div>

      <div className="inspector-spacing-field-inputs">
        <div className="inspector-spacing-field-row">
          <Input
            label="Top"
            type="number"
            value={spacingValue.top ?? 0}
            onChange={(e) => handleChange('top', parseFloat(e.target.value) || 0)}
            disabled={disabled ?? field.disabled === true}
            size="small"
            fullWidth
          />
          <Input
            label="Right"
            type="number"
            value={spacingValue.right ?? 0}
            onChange={(e) => handleChange('right', parseFloat(e.target.value) || 0)}
            disabled={(disabled ?? field.disabled === true) || isLinked}
            size="small"
            fullWidth
          />
        </div>

        <div className="inspector-spacing-field-row">
          <Input
            label="Bottom"
            type="number"
            value={spacingValue.bottom ?? 0}
            onChange={(e) => handleChange('bottom', parseFloat(e.target.value) || 0)}
            disabled={(disabled ?? field.disabled === true) || isLinked}
            size="small"
            fullWidth
          />
          <Input
            label="Left"
            type="number"
            value={spacingValue.left ?? 0}
            onChange={(e) => handleChange('left', parseFloat(e.target.value) || 0)}
            disabled={(disabled ?? field.disabled === true) || isLinked}
            size="small"
            fullWidth
          />
        </div>

        <div className="inspector-spacing-field-unit">
          <Select
            label="Unit"
            value={spacingValue.unit ?? 'px'}
            onChange={handleUnitChange}
            options={[
              { label: 'px', value: 'px' },
              { label: '%', value: '%' },
              { label: 'rem', value: 'rem' },
              { label: 'em', value: 'em' },
            ]}
            disabled={disabled ?? field.disabled === true}
            size="small"
          />
        </div>
      </div>

      {field.helpText && <div className="inspector-field-help-text">{field.helpText}</div>}
      {error && <div className="inspector-field-error">{error}</div>}
    </div>
  );
};

export default SpacingField;
