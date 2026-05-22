/**
 * Select Component
 *
 * A reusable select dropdown component with multiple variants and states.
 */
import React from 'react';
export interface SelectOption {
    /**
     * Option value
     */
    value: string;
    /**
     * Option label
     */
    label: string;
    /**
     * Is option disabled
     */
    disabled?: boolean;
    /**
     * Option icon
     */
    icon?: React.ReactNode;
    /**
     * Custom data
     */
    data?: any;
}
export interface SelectProps {
    /**
     * Select options
     */
    options: SelectOption[];
    /**
     * Selected value
     */
    value?: string;
    /**
     * Change callback
     */
    onChange?: (value: string, option?: SelectOption) => void;
    /**
     * Select variant
     */
    variant?: 'default' | 'filled' | 'outlined';
    /**
     * Select size
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Is select disabled
     */
    disabled?: boolean;
    /**
     * Select error state
     */
    error?: boolean;
    /**
     * Error message
     */
    errorMessage?: string;
    /**
     * Select label
     */
    label?: string;
    /**
     * Placeholder text
     */
    placeholder?: string;
    /**
     * Is select full width
     */
    fullWidth?: boolean;
    /**
     * Custom className
     */
    className?: string;
}
export declare const Select: React.FC<SelectProps>;
export default Select;
//# sourceMappingURL=Select.d.ts.map