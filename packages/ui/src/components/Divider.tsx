/**
 * Divider Component
 *
 * A reusable divider component for separating content.
 */

import React from 'react';

export interface DividerProps {
  /**
   * Divider orientation
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Divider variant
   */
  variant?: 'solid' | 'dashed' | 'dotted';

  /**
   * Divider text
   */
  text?: string;

  /**
   * Divider color
   */
  color?: string;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Divider thickness
   */
  thickness?: number;

  /**
   * Is divider full width
   */
  fullWidth?: boolean;

  /**
   * Divider spacing
   */
  spacing?: 'none' | 'small' | 'medium' | 'large';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  text,
  color,
  className = '',
  thickness = 1,
  fullWidth = true,
  spacing = 'medium',
}) => {
  const orientationClasses = `divider-${orientation}`;
  const variantClasses = `divider-${variant}`;
  const spacingClasses = `divider-spacing-${spacing}`;
  const fullWidthClasses = fullWidth ? 'divider-full-width' : '';
  const classes = [
    'divider',
    orientationClasses,
    variantClasses,
    spacingClasses,
    fullWidthClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {
    ...(color && { borderColor: color }),
    ...(thickness && { borderWidth: `${thickness}px` }),
  };

  return (
    <div className={classes} style={style}>
      {text && <span className="divider-text">{text}</span>}
    </div>
  );
};

export default Divider;
