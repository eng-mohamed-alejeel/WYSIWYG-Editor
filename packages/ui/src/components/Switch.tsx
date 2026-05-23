/**
 * Switch Component
 *
 * A reusable switch component for toggling between two states.
 */

import React from 'react';

export interface SwitchProps {
  /**
   * Is switch checked
   */
  checked: boolean;

  /**
   * Change callback
   */
  onChange: (checked: boolean) => void;

  /**
   * Is switch disabled
   */
  disabled?: boolean;

  /**
   * Switch label
   */
  label?: string;

  /**
   * Switch size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Switch color
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

  /**
   * Custom className
   */
  className?: string;

  /**
   * Switch id
   */
  id?: string;

  /**
   * Switch name
   */
  name?: string;

  /**
   * Show label on left side
   */
  labelOnLeft?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  size = 'medium',
  color = 'primary',
  className = '',
  id,
  name,
  labelOnLeft = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const sizeClasses = `switch-${size}`;
  const colorClasses = `switch-${color}`;
  const disabledClasses = disabled ? 'switch-disabled' : '';
  const classes = ['switch', sizeClasses, colorClasses, disabledClasses, className]
    .filter(Boolean)
    .join(' ');

  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`switch-wrapper ${labelOnLeft ? 'switch-wrapper-label-left' : ''}`}>
      {label && (
        <label htmlFor={switchId} className="switch-label">
          {label}
        </label>
      )}
      <label className={classes}>
        <input
          type="checkbox"
          id={switchId}
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="switch-input"
        />
        <span className="switch-slider" />
      </label>
    </div>
  );
};

export default Switch;
