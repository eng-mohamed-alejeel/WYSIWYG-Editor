/**
 * Color Picker Component
 *
 * A reusable color picker component for selecting colors.
 */

import React, { useState, useRef, useEffect } from 'react';

export interface ColorPickerProps {
  /**
   * Current color
   */
  value: string;

  /**
   * Change callback
   */
  onChange: (color: string) => void;

  /**
   * Is color picker disabled
   */
  disabled?: boolean;

  /**
   * Show color preview
   */
  showPreview?: boolean;

  /**
   * Show color input
   */
  showInput?: boolean;

  /**
   * Show preset colors
   */
  showPresets?: boolean;

  /**
   * Preset colors
   */
  presetColors?: string[];

  /**
   * Color picker size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Custom className
   */
  className?: string;

  /**
   * Color picker label
   */
  label?: string;

  /**
   * Show alpha channel
   */
  showAlpha?: boolean;

  /**
   * Format of color value
   */
  format?: 'hex' | 'rgb' | 'hsl';

  /**
   * Position of the color picker popup
   */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  disabled = false,
  showPreview = true,
  showInput = true,
  showPresets = true,
  presetColors = [
    '#000000',
    '#FFFFFF',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#FFA500',
    '#800080',
    '#008080',
    '#FFC0CB'
  ],
  size = 'medium',
  className = '',
  label,
  showAlpha = false,
  format = 'hex',
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentColor(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor);
    onChange(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    onChange(newColor);
  };

  const handlePresetClick = (color: string) => {
    handleColorChange(color);
  };

  const sizeClasses = `color-picker-${size}`;
  const disabledClasses = disabled ? 'color-picker-disabled' : '';
  const positionClasses = `color-picker-${position}`;
  const classes = [
    'color-picker',
    sizeClasses,
    disabledClasses,
    className
  ].filter(Boolean).join(' ');

  const popupClasses = [
    'color-picker-popup',
    positionClasses,
    isOpen ? 'color-picker-popup-open' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} ref={pickerRef}>
      {label && (
        <label className="color-picker-label">
          {label}
        </label>
      )}
      <div className="color-picker-wrapper">
        {showPreview && (
          <div
            className="color-picker-preview"
            style={{ backgroundColor: currentColor }}
            onClick={handleToggle}
          />
        )}
        {showInput && (
          <input
            ref={inputRef}
            type="color"
            value={currentColor}
            onChange={handleInputChange}
            disabled={disabled}
            className="color-picker-input"
          />
        )}
        <button
          className="color-picker-button"
          onClick={handleToggle}
          disabled={disabled}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 8L8 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 2C8 2 10 4 10 6C10 8 8 8 8 8C8 8 6 8 6 6C6 4 8 2 8 2Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className={popupClasses}>
          {showPresets && (
            <div className="color-picker-presets">
              {presetColors.map((color, index) => (
                <button
                  key={index}
                  className="color-picker-preset"
                  style={{ backgroundColor: color }}
                  onClick={() => handlePresetClick(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          )}
          {showInput && (
            <div className="color-picker-value">
              <input
                type="text"
                value={currentColor}
                onChange={handleInputChange}
                disabled={disabled}
                className="color-picker-text-input"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
