/**
 * Loading Component
 *
 * A reusable loading component for displaying loading states.
 */

import React from 'react';

export interface LoadingProps {
  /**
   * Loading size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Loading color
   */
  color?: string;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Loading text
   */
  text?: string;

  /**
   * Is loading full screen
   */
  fullscreen?: boolean;

  /**
   * Loading variant
   */
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';

  /**
   * Is loading overlay
   */
  overlay?: boolean;

  /**
   * Overlay background color
   */
  overlayColor?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  color,
  className = '',
  text,
  fullscreen = false,
  variant = 'spinner',
  overlay = false,
  overlayColor,
}) => {
  const sizeClasses = `loading-${size}`;
  const variantClasses = `loading-${variant}`;
  const classes = [
    'loading',
    sizeClasses,
    variantClasses,
    fullscreen ? 'loading-fullscreen' : '',
    overlay ? 'loading-overlay' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {
    ...(color && ({ '--loading-color': color } as React.CSSProperties)),
    ...(overlayColor && ({ '--loading-overlay-color': overlayColor } as React.CSSProperties)),
  };

  const renderSpinner = () => (
    <svg className="loading-spinner" viewBox="0 0 50 50">
      <circle
        className="loading-spinner-circle"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      />
    </svg>
  );

  const renderDots = () => (
    <div className="loading-dots">
      <div className="loading-dot" />
      <div className="loading-dot" />
      <div className="loading-dot" />
    </div>
  );

  const renderPulse = () => (
    <div className="loading-pulse">
      <div className="loading-pulse-circle" />
    </div>
  );

  const renderBars = () => (
    <div className="loading-bars">
      <div className="loading-bar" />
      <div className="loading-bar" />
      <div className="loading-bar" />
      <div className="loading-bar" />
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={classes} style={style}>
      <div className="loading-indicator">
        {renderVariant()}
        {text && <p className="loading-text">{text}</p>}
      </div>
    </div>
  );
};

export default Loading;
