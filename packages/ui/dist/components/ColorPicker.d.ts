/**
 * Color Picker Component
 *
 * A reusable color picker component for selecting colors.
 */
import React from 'react';
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
export declare const ColorPicker: React.FC<ColorPickerProps>;
export default ColorPicker;
//# sourceMappingURL=ColorPicker.d.ts.map