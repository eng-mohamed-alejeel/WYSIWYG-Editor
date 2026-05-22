/**
 * Slider Component
 *
 * A reusable slider component for selecting values from a range.
 */

import React, { useState, useRef, useEffect } from 'react';

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

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  showTooltip = true,
  className = '',
  color = 'primary',
  size = 'medium',
  label,
  showMarks = false,
  marksCount = 5
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltipValue, setShowTooltipValue] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return;
    updateValue(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const rawValue = (x / width) * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    onChange(clampedValue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const sizeClasses = `slider-${size}`;
  const colorClasses = `slider-${color}`;
  const disabledClasses = disabled ? 'slider-disabled' : '';
  const classes = [
    'slider',
    sizeClasses,
    colorClasses,
    disabledClasses,
    className
  ].filter(Boolean).join(' ');

  const marks = showMarks ? Array.from({ length: marksCount }, (_, i) => {
    const markValue = min + ((max - min) * i) / (marksCount - 1);
    return {
      value: markValue,
      percentage: ((markValue - min) / (max - min)) * 100
    };
  }) : [];

  return (
    <div className="slider-wrapper">
      {label && (
        <label className="slider-label">
          {label}
        </label>
      )}
      <div className={classes}>
        <div
          ref={sliderRef}
          className="slider-track"
          onMouseDown={handleMouseDown}
        >
          <div
            className="slider-fill"
            style={{ width: `${percentage}%` }}
          />
          {marks.map((mark, index) => (
            <div
              key={index}
              className="slider-mark"
              style={{ left: `${mark.percentage}%` }}
            />
          ))}
          <div
            ref={thumbRef}
            className="slider-thumb"
            style={{ left: `${percentage}%` }}
            onMouseEnter={() => setShowTooltipValue(true)}
            onMouseLeave={() => setShowTooltipValue(false)}
          >
            {showTooltip && (showTooltipValue || isDragging) && (
              <div className="slider-tooltip">
                {value}
              </div>
            )}
          </div>
        </div>
      </div>
      {showValue && (
        <div className="slider-value">
          {value}
        </div>
      )}
    </div>
  );
};

export default Slider;
