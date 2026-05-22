/**
 * Button Component
 *
 * A reusable button component with multiple variants and sizes.
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';

  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Is button disabled
   */
  disabled?: boolean;

  /**
   * Is button loading
   */
  loading?: boolean;

  /**
   * Button icon
   */
  icon?: React.ReactNode;

  /**
   * Icon position
   */
  iconPosition?: 'left' | 'right';

  /**
   * Button children
   */
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const disabledClasses = (disabled || loading) ? 'btn-disabled' : '';
  const loadingClasses = loading ? 'btn-loading' : '';
  const iconClasses = icon ? 'btn-with-icon' : '';

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    disabledClasses,
    loadingClasses,
    iconClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn-spinner" />}
      {icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      {children && <span className="btn-content">{children}</span>}
      {icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </button>
  );
};

export default Button;
