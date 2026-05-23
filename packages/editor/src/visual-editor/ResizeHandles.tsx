/**
 * Resize Handles Component
 *
 * Provides resize handles for selected components
 * Following Figma and Webflow UX patterns
 */

import React, { useMemo } from 'react';
import { HandlePosition } from './types';

interface ResizeHandlesProps {
  bounds: DOMRect;
  isSelected: boolean;
  onResizeStart: (handle: HandlePosition, event: React.MouseEvent) => void;
  config: {
    enabled: boolean;
    size: number;
    color: string;
    hoverColor: string;
  };
}

const HANDLE_POSITIONS: HandlePosition[] = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];

const HANDLE_STYLES: Record<HandlePosition, { cursor: string; left: string; top: string }> = {
  nw: { cursor: 'nw-resize', left: '0', top: '0' },
  n: { cursor: 'n-resize', left: '50%', top: '0' },
  ne: { cursor: 'ne-resize', left: '100%', top: '0' },
  w: { cursor: 'w-resize', left: '0', top: '50%' },
  e: { cursor: 'e-resize', left: '100%', top: '50%' },
  sw: { cursor: 'sw-resize', left: '0', top: '100%' },
  s: { cursor: 's-resize', left: '50%', top: '100%' },
  se: { cursor: 'se-resize', left: '100%', top: '100%' },
};

export const ResizeHandles: React.FC<ResizeHandlesProps> = React.memo(
  ({ bounds, isSelected, onResizeStart, config }) => {
    if (!config.enabled || !isSelected) {
      return null;
    }

    const handleStyle = useMemo(
      () => ({
        position: 'absolute' as const,
        width: `${config.size}px`,
        height: `${config.size}px`,
        backgroundColor: config.color,
        borderRadius: '2px',
        transform: 'translate(-50%, -50%)',
        transition: 'background-color 0.15s ease',
        zIndex: 1000,
      }),
      [config.size, config.color]
    );

    const handles = useMemo(() => {
      return HANDLE_POSITIONS.map((position) => {
        const style = HANDLE_STYLES[position];
        return (
          <div
            key={position}
            className="resize-handle"
            style={{
              ...handleStyle,
              cursor: style.cursor,
              left:
                style.left === '50%'
                  ? `${bounds.left + bounds.width / 2}px`
                  : style.left === '0'
                    ? `${bounds.left}px`
                    : `${bounds.right}px`,
              top:
                style.top === '50%'
                  ? `${bounds.top + bounds.height / 2}px`
                  : style.top === '0'
                    ? `${bounds.top}px`
                    : `${bounds.bottom}px`,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart(position, e);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = config.hoverColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = config.color;
            }}
          />
        );
      });
    }, [bounds, handleStyle, config.color, config.hoverColor, onResizeStart]);

    return <>{handles}</>;
  }
);

ResizeHandles.displayName = 'ResizeHandles';
