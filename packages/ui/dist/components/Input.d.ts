/**
 * Input Component
 *
 * A reusable text input component with multiple variants and states.
 */
import React from 'react';
export interface InputProps {
    /**
     * Input variant
     */
    variant?: 'default' | 'filled' | 'outlined';
    /**
     * Input size
     */
    inputSize?: 'small' | 'medium' | 'large';
    /**
     * Is input disabled
     */
    disabled?: boolean;
    /**
     * Input error state
     */
    error?: boolean;
    /**
     * Error message
     */
    errorMessage?: string;
    /**
     * Input label
     */
    label?: string;
    /**
     * Input icon
     */
    icon?: React.ReactNode;
    /**
     * Input prefix element
     */
    prefix?: React.ReactNode;
    /**
     * Input suffix element
     */
    suffix?: React.ReactNode;
    /**
     * Is input full width
     */
    fullWidth?: boolean;
    /**
     * Standard input HTML attributes
     */
    className?: string;
    placeholder?: string;
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    type?: React.HTMLInputTypeAttribute;
    step?: string | number;
    name?: string;
    id?: string;
    required?: boolean;
    readOnly?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    autoComplete?: string;
    autoFocus?: boolean;
}
export declare const Input: React.FC<InputProps>;
export default Input;
//# sourceMappingURL=Input.d.ts.map