import React from 'react';
import { Input, Select, ColorPicker, Slider } from '@wysiwyg/ui';
import { ComponentNode } from '@wysiwyg/core';
import { ComponentStyles, StyleValue } from './types';

interface StylesTabProps {
  component: ComponentNode;
  onStyleChange: (key: string, value: StyleValue) => void;
}

const getStyleValue = (styles: ComponentStyles | undefined, key: keyof ComponentStyles, defaultValue: string): string => {
  const value = styles?.[key];
  return value !== undefined ? String(value) : defaultValue;
};

export const StylesTab: React.FC<StylesTabProps> = ({ component, onStyleChange }) => {
  const styles = component.styles as ComponentStyles | undefined;

  return (
    <div className="space-y-4">
      <div className="property-group">
        <h3 className="property-group-title">Layout</h3>

        <div className="property-item">
          <label className="property-item-label">Width</label>
          <Input
            value={getStyleValue(styles, 'width', '')}
            onChange={(e) => onStyleChange('width', e.target.value)}
            placeholder="auto, 100%, 200px..."
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Height</label>
          <Input
            value={getStyleValue(styles, 'height', '')}
            onChange={(e) => onStyleChange('height', e.target.value)}
            placeholder="auto, 100%, 200px..."
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Padding</label>
          <Input
            value={getStyleValue(styles, 'padding', '')}
            onChange={(e) => onStyleChange('padding', e.target.value)}
            placeholder="10px, 10px 20px..."
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Margin</label>
          <Input
            value={getStyleValue(styles, 'margin', '')}
            onChange={(e) => onStyleChange('margin', e.target.value)}
            placeholder="10px, 10px 20px..."
            className="w-full"
          />
        </div>
      </div>

      <div className="property-group">
        <h3 className="property-group-title">Typography</h3>

        <div className="property-item">
          <label className="property-item-label">Font Size</label>
          <Input
            value={getStyleValue(styles, 'fontSize', '')}
            onChange={(e) => onStyleChange('fontSize', e.target.value)}
            placeholder="16px, 1rem..."
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Font Weight</label>
          <Select
            value={getStyleValue(styles, 'fontWeight', 'normal')}
            onChange={(value) => onStyleChange('fontWeight', value)}
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'bold', label: 'Bold' },
              { value: '100', label: '100' },
              { value: '200', label: '200' },
              { value: '300', label: '300' },
              { value: '400', label: '400' },
              { value: '500', label: '500' },
              { value: '600', label: '600' },
              { value: '700', label: '700' },
              { value: '800', label: '800' },
              { value: '900', label: '900' }
            ]}
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Text Align</label>
          <Select
            value={getStyleValue(styles, 'textAlign', 'left')}
            onChange={(value) => onStyleChange('textAlign', value)}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
              { value: 'justify', label: 'Justify' }
            ]}
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Line Height</label>
          <Input
            value={getStyleValue(styles, 'lineHeight', '')}
            onChange={(e) => onStyleChange('lineHeight', e.target.value)}
            placeholder="1.5, 24px..."
            className="w-full"
          />
        </div>
      </div>

      <div className="property-group">
        <h3 className="property-group-title">Colors</h3>

        <div className="property-item">
          <label className="property-item-label">Background Color</label>
          <ColorPicker
            value={getStyleValue(styles, 'backgroundColor', '#ffffff')}
            onChange={(color) => onStyleChange('backgroundColor', color)}
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Text Color</label>
          <ColorPicker
            value={getStyleValue(styles, 'color', '#000000')}
            onChange={(color) => onStyleChange('color', color)}
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Border Color</label>
          <ColorPicker
            value={getStyleValue(styles, 'borderColor', '#000000')}
            onChange={(color) => onStyleChange('borderColor', color)}
            className="w-full"
          />
        </div>
      </div>

      <div className="property-group">
        <h3 className="property-group-title">Border</h3>

        <div className="property-item">
          <label className="property-item-label">Border Width</label>
          <Slider
            value={parseInt(getStyleValue(styles, 'borderWidth', '0'))}
            onChange={(value) => onStyleChange('borderWidth', `${value}px`)}
            min={0}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Border Radius</label>
          <Slider
            value={parseInt(getStyleValue(styles, 'borderRadius', '0'))}
            onChange={(value) => onStyleChange('borderRadius', `${value}px`)}
            min={0}
            max={50}
            step={1}
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Border Style</label>
          <Select
            value={getStyleValue(styles, 'borderStyle', 'solid')}
            onChange={(value) => onStyleChange('borderStyle', value)}
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'dashed', label: 'Dashed' },
              { value: 'dotted', label: 'Dotted' },
              { value: 'double', label: 'Double' }
            ]}
            className="w-full"
          />
        </div>
      </div>

      <div className="property-group">
        <h3 className="property-group-title">Effects</h3>

        <div className="property-item">
          <label className="property-item-label">Opacity</label>
          <Slider
            value={parseFloat(getStyleValue(styles, 'opacity', '1'))}
            onChange={(value) => onStyleChange('opacity', value.toString())}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Box Shadow</label>
          <Input
            value={getStyleValue(styles, 'boxShadow', '')}
            onChange={(e) => onStyleChange('boxShadow', e.target.value)}
            placeholder="0 2px 4px rgba(0,0,0,0.1)"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
