/**
 * Selection Outlines Component
 *
 * Displays selection outlines for selected and hovered components
 * Following Figma and Webflow UX patterns
 */

import React, { useMemo } from 'react';
import { SelectionOutline } from './types';

interface SelectionOutlinesProps {
  outlines: SelectionOutline[];
  config: {
    enabled: boolean;
    color: string;
    hoverColor: string;
    focusColor: string;
    multiSelectColor: string;
    borderWidth: number;
  };
}

export const SelectionOutlines: React.FC<SelectionOutlinesProps> = React.memo(
  ({ outlines, config }) => {
    if (!config.enabled || outlines.length === 0) {
      return null;
    }

    const containerStyle = useMemo(
      () => ({
        position: 'absolute' as const,
        pointerEvents: 'none' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9997,
      }),
      []
    );

    return (
      <div style={containerStyle}>
        {outlines.map((outline) => {
          const isMultiSelect = outlines.length > 1;
          const borderColor = outline.isFocused
            ? config.focusColor
            : outline.isSelected
              ? isMultiSelect
                ? config.multiSelectColor
                : config.color
              : outline.isHovered
                ? config.hoverColor
                : 'transparent';

          return (
            <div
              key={outline.id}
              className="selection-outline"
              style={{
                position: 'absolute' as const,
                left: `${outline.bounds.left}px`,
                top: `${outline.bounds.top}px`,
                width: `${outline.bounds.width}px`,
                height: `${outline.bounds.height}px`,
                border: `${config.borderWidth}px solid ${borderColor}`,
                borderRadius: '2px',
                zIndex: outline.zIndex,
                transition: 'border-color 0.15s ease',
              }}
            />
          );
        })}
      </div>
    );
  }
);

SelectionOutlines.displayName = 'SelectionOutlines';
