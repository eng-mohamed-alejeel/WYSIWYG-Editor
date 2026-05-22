/**
 * Select Component
 *
 * A reusable select dropdown component with multiple variants and states.
 */

import React, { useState, useRef, useEffect } from 'react';

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

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  variant = 'default',
  size = 'medium',
  disabled = false,
  error = false,
  errorMessage,
  label,
  placeholder = 'Select an option',
  fullWidth = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | undefined>(
    options.find(opt => opt.value === value)
  );
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const option = options.find(opt => opt.value === value);
    setSelectedOption(option);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option: SelectOption) => {
    if (!option.disabled) {
      setSelectedOption(option);
      setIsOpen(false);
      onChange?.(option.value, option);
    }
  };

  const baseClasses = 'select';
  const variantClasses = `select-${variant}`;
  const sizeClasses = `select-${size}`;
  const disabledClasses = disabled ? 'select-disabled' : '';
  const errorClasses = error ? 'select-error' : '';
  const fullWidthClasses = fullWidth ? 'select-full-width' : '';
  const openClasses = isOpen ? 'select-open' : '';

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    disabledClasses,
    errorClasses,
    fullWidthClasses,
    openClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`select-wrapper ${fullWidth ? 'select-wrapper-full-width' : ''}`} ref={selectRef}>
      {label && (
        <label className="select-label">
          {label}
        </label>
      )}
      <div
        className={classes}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        <div className="select-value">
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <span className="select-option-icon">
                  {selectedOption.icon}
                </span>
              )}
              <span className="select-option-label">
                {selectedOption.label}
              </span>
            </>
          ) : (
            <span className="select-placeholder">{placeholder}</span>
          )}
        </div>
        <span className="select-arrow">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      {isOpen && (
        <div className="select-dropdown" role="listbox">
          {options.map((option) => (
            <div
              key={option.value}
              className={`select-option ${
                option.disabled ? 'select-option-disabled' : ''
              } ${
                selectedOption?.value === option.value
                  ? 'select-option-selected'
                  : ''
              }`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={selectedOption?.value === option.value}
              aria-disabled={option.disabled}
            >
              {option.icon && (
                <span className="select-option-icon">
                  {option.icon}
                </span>
              )}
              <span className="select-option-label">
                {option.label}
              </span>
            </div>
          ))}
        </div>
      )}
      {error && errorMessage && (
        <span className="select-error-message">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default Select;
