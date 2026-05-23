/**
 * Tooltip Component
 *
 * A reusable tooltip component for displaying additional information on hover.
 */

import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  /**
   * Tooltip content
   */
  content: React.ReactNode;

  /**
   * Tooltip position
   */
  position?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Tooltip trigger element
   */
  children: React.ReactElement;

  /**
   * Tooltip delay in milliseconds
   */
  delay?: number;

  /**
   * Is tooltip disabled
   */
  disabled?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom arrow className
   */
  arrowClassName?: string;

  /**
   * Custom content className
   */
  contentClassName?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  delay = 200,
  disabled = false,
  className = '',
  arrowClassName = '',
  contentClassName = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!disabled) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = `tooltip-${position}`;
  const classes = ['tooltip', positionClasses, className].filter(Boolean).join(' ');

  return (
    <div
      className="tooltip-wrapper"
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && !disabled && (
        <div ref={tooltipRef} className={classes} role="tooltip">
          <div className={`tooltip-arrow ${arrowClassName}`} />
          <div className={`tooltip-content ${contentClassName}`}>{content}</div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
