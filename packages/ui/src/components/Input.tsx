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

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  inputSize = 'medium',
  disabled = false,
  error = false,
  errorMessage,
  label,
  icon,
  prefix,
  suffix,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'input';
  const variantClasses = `input-${variant}`;
  const sizeClasses = `input-${inputSize}`;
  const disabledClasses = disabled ? 'input-disabled' : '';
  const errorClasses = error ? 'input-error' : '';
  const fullWidthClasses = fullWidth ? 'input-full-width' : '';
  const iconClasses = icon ? 'input-with-icon' : '';
  const prefixClasses = prefix ? 'input-with-prefix' : '';
  const suffixClasses = suffix ? 'input-with-suffix' : '';

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    disabledClasses,
    errorClasses,
    fullWidthClasses,
    iconClasses,
    prefixClasses,
    suffixClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper-full-width' : ''}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input className={classes} disabled={disabled} {...props} />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && errorMessage && <span className="input-error-message">{errorMessage}</span>}
    </div>
  );
};

export default Input;
