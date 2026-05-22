/**
 * Slider Component
 *
 * A reusable slider component for selecting values from a range.
 */
import React from 'react';
export interface SliderProps {
    /**
     * Current value
     */
    value: number;
    /**
     * Change callback
     */
    onChange: (value: number) => void;
    /**
     * Minimum value
     */
    min?: number;
    /**
     * Maximum value
     */
    max?: number;
    /**
     * Step value
     */
    step?: number;
    /**
     * Is slider disabled
     */
    disabled?: boolean;
    /**
     * Show value label
     */
    showValue?: boolean;
    /**
     * Show tooltip on hover
     */
    showTooltip?: boolean;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Slider color
     */
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    /**
     * Slider size
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Slider label
     */
    label?: string;
    /**
     * Show marks
     */
    showMarks?: boolean;
    /**
     * Number of marks to display
     */
    marksCount?: number;
}
export declare const Slider: React.FC<SliderProps>;
export default Slider;
//# sourceMappingURL=Slider.d.ts.map