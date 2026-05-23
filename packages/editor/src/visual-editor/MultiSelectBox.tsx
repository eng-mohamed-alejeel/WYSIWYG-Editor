/**
 * Multi-Select Box Component
 *
 * Displays selection box for multi-select operations
 * Following Figma and Webflow UX patterns
 */

import React, { useMemo } from 'react';
import { SelectionBox } from './types';

interface MultiSelectBoxProps {
  selectionBox: SelectionBox;
  config: {
    enabled: boolean;
    selectionBoxColor: string;
    selectionBoxOpacity: number;
  };
}

export const MultiSelectBox: React.FC<MultiSelectBoxProps> = React.memo(
  ({ selectionBox, config }) => {
    if (!config.enabled || !selectionBox.isActive) {
      return null;
    }

    const boxBounds = useMemo(() => {
      const left = Math.min(selectionBox.start.x, selectionBox.end.x);
      const top = Math.min(selectionBox.start.y, selectionBox.end.y);
      const width = Math.abs(selectionBox.end.x - selectionBox.start.x);
      const height = Math.abs(selectionBox.end.y - selectionBox.start.y);

      return { left, top, width, height };
    }, [selectionBox]);

    const boxStyle = useMemo(
      () => ({
        position: 'absolute' as const,
        left: `${boxBounds.left}px`,
        top: `${boxBounds.top}px`,
        width: `${boxBounds.width}px`,
        height: `${boxBounds.height}px`,
        backgroundColor: config.selectionBoxColor,
        opacity: config.selectionBoxOpacity,
        border: `1px solid ${config.selectionBoxColor}`,
        pointerEvents: 'none' as const,
        zIndex: 9999,
      }),
      [boxBounds, config.selectionBoxColor, config.selectionBoxOpacity]
    );

    return <div className="multi-select-box" style={boxStyle} />;
  }
);

MultiSelectBox.displayName = 'MultiSelectBox';
