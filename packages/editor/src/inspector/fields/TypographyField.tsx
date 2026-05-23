/**
 * Typography Field Renderer
 *
 * Renders typography control fields for the inspector
 */

import React from 'react';
import { Input, Select, ColorPicker } from '@wysiwyg/ui';
import { FieldRendererProps, TypographyValue } from '../types';

const FONT_FAMILY_OPTIONS = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, sans-serif' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
];

const FONT_WEIGHT_OPTIONS = [
  { label: 'Thin (100)', value: 100 },
  { label: 'Light (300)', value: 300 },
  { label: 'Normal (400)', value: 400 },
  { label: 'Medium (500)', value: 500 },
  { label: 'Semi Bold (600)', value: 600 },
  { label: 'Bold (700)', value: 700 },
  { label: 'Extra Bold (800)', value: 800 },
];

const TEXT_ALIGN_OPTIONS = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
  { label: 'Justify', value: 'justify' },
];

export const TypographyField: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled,
}) => {
  const typographyValue: TypographyValue = value ??
    field.defaultValue ?? {
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
      textAlign: 'left',
      color: '#000000',
    };

  const handleChange = (property: keyof TypographyValue, newValue: any) => {
    onChange({
      ...typographyValue,
      [property]: newValue,
    });
  };

  return (
    <div className="inspector-typography-field">
      <label className="inspector-typography-field-label">{field.label}</label>

      <div className="inspector-typography-field-controls">
        <div className="inspector-typography-field-row">
          <Select
            label="Font Family"
            value={typographyValue.fontFamily ?? 'Arial, sans-serif'}
            onChange={(value) => handleChange('fontFamily', value)}
            options={FONT_FAMILY_OPTIONS}
            disabled={disabled ?? field.disabled === true}
            fullWidth
          />
        </div>

        <div className="inspector-typography-field-row">
          <Input
            label="Font Size"
            type="number"
            value={typographyValue.fontSize ?? 16}
            onChange={(e) => handleChange('fontSize', parseFloat(e.target.value) || 16)}
            disabled={disabled ?? field.disabled === true}
            suffix="px"
            fullWidth
          />
          <Select
            label="Font Weight"
            value={typographyValue.fontWeight ?? 400}
            onChange={(value) => handleChange('fontWeight', parseInt(value, 10))}
            options={FONT_WEIGHT_OPTIONS}
            disabled={disabled ?? field.disabled === true}
            fullWidth
          />
        </div>

        <div className="inspector-typography-field-row">
          <Input
            label="Line Height"
            type="number"
            step={0.1}
            value={typographyValue.lineHeight ?? 1.5}
            onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value) || 1.5)}
            disabled={disabled ?? field.disabled === true}
            fullWidth
          />
          <Input
            label="Letter Spacing"
            type="number"
            step={0.1}
            value={typographyValue.letterSpacing ?? 0}
            onChange={(e) => handleChange('letterSpacing', parseFloat(e.target.value) || 0)}
            disabled={disabled ?? field.disabled === true}
            suffix="px"
            fullWidth
          />
        </div>

        <div className="inspector-typography-field-row">
          <Select
            label="Text Align"
            value={typographyValue.textAlign ?? 'left'}
            onChange={(value) => handleChange('textAlign', value)}
            options={TEXT_ALIGN_OPTIONS}
            disabled={disabled ?? field.disabled === true}
            fullWidth
          />
          <ColorPicker
            label="Color"
            value={typographyValue.color ?? '#000000'}
            onChange={(value) => handleChange('color', value)}
            disabled={disabled ?? field.disabled === true}
            showPreview
            showInput
          />
        </div>
      </div>

      {field.helpText && <div className="inspector-field-help-text">{field.helpText}</div>}
      {error && <div className="inspector-field-error">{error}</div>}
    </div>
  );
};

export default TypographyField;
