/**
 * Smart Spacing Indicators Component
 *
 * Displays spacing measurements between components
 * Following Figma and Webflow UX patterns
 */

import React, { useMemo } from 'react';
import { SmartSpacingIndicator } from './types';

interface SmartSpacingIndicatorsProps {
  indicators: SmartSpacingIndicator[];
  config: {
    enabled: boolean;
    showOnHover: boolean;
    showOnDrag: boolean;
    color: string;
    fontSize: number;
  };
  isHovering: boolean;
  isDragging: boolean;
}

export const SmartSpacingIndicators: React.FC<SmartSpacingIndicatorsProps> = React.memo(
  ({ indicators, config, isHovering, isDragging }) => {
    const shouldShow = useMemo(() => {
      if (!config.enabled) return false;
      if (isDragging && config.showOnDrag) return true;
      if (isHovering && config.showOnHover) return true;
      return false;
    }, [config.enabled, config.showOnDrag, config.showOnHover, isDragging, isHovering]);

    if (!shouldShow || indicators.length === 0) {
      return null;
    }

    const containerStyle = useMemo(
      () => ({
        position: 'absolute' as const,
        pointerEvents: 'none' as const,
        zIndex: 9998,
      }),
      []
    );

    const labelStyle = useMemo(
      () => ({
        position: 'absolute' as const,
        transform: 'translate(-50%, -50%)',
        backgroundColor: config.color,
        color: 'white',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: `${config.fontSize}px`,
        fontWeight: 500,
        whiteSpace: 'nowrap' as const,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
      }),
      [config.color, config.fontSize]
    );

    const lineStyle = useMemo(
      () => ({
        position: 'absolute' as const,
        backgroundColor: config.color,
        opacity: 0.8,
      }),
      [config.color]
    );

    return (
      <div style={containerStyle}>
        {indicators.map((indicator, index) => {
          const isHorizontal = indicator.direction === 'horizontal';

          return (
            <div key={index} className="smart-spacing-indicator">
              {/* Spacing line */}
              <div
                style={{
                  ...lineStyle,
                  left: isHorizontal ? `${indicator.position.x}px` : `${indicator.position.x}px`,
                  top: isHorizontal
                    ? `${indicator.position.y}px`
                    : `${indicator.position.y - indicator.value / 2}px`,
                  width: isHorizontal ? '1px' : `${indicator.value}px`,
                  height: isHorizontal ? `${indicator.value}px` : '1px',
                }}
              />

              {/* Spacing label */}
              <div
                style={{
                  ...labelStyle,
                  left: isHorizontal ? `${indicator.position.x}px` : `${indicator.position.x}px`,
                  top: isHorizontal ? `${indicator.position.y}px` : `${indicator.position.y}px`,
                }}
              >
                {indicator.value}
                {indicator.unit}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

SmartSpacingIndicators.displayName = 'SmartSpacingIndicators';
