/**
 * Drag Handles Component
 *
 * Provides drag handles for selected components
 * Following Figma and Webflow UX patterns
 */

import React, { useMemo } from 'react';
import { Rect } from './types';

interface DragHandlesProps {
  bounds: Rect;
  isSelected: boolean;
  onDragStart: (event: React.MouseEvent) => void;
  config: {
    enabled: boolean;
    size: number;
    color: string;
  };
}

export const DragHandles: React.FC<DragHandlesProps> = React.memo(
  ({ bounds, isSelected, onDragStart, config }) => {
    const handleStyle = useMemo(
      () => ({
        position: 'absolute' as const,
        width: `${config.size}px`,
        height: `${config.size}px`,
        backgroundColor: config.color,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.15s ease',
        cursor: 'grab',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }),
      [config.size, config.color]
    );

    const topHandlePosition = useMemo(
      () => ({
        left: `${bounds.left + bounds.width / 2}px`,
        top: `${bounds.top - config.size / 2}px`,
      }),
      [bounds, config.size]
    );

    const leftHandlePosition = useMemo(
      () => ({
        left: `${bounds.left - config.size / 2}px`,
        top: `${bounds.top + bounds.height / 2}px`,
      }),
      [bounds, config.size]
    );

    if (!config.enabled || !isSelected) {
      return null;
    }

    return (
      <>
        {/* Top drag handle */}
        <div
          className="drag-handle drag-handle-top"
          role="button"
          tabIndex={0}
          aria-label="Drag handle top"
          style={{
            ...handleStyle,
            ...topHandlePosition,
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onDragStart(e);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onDragStart(e as unknown as React.MouseEvent);
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
          }}
        >
          <svg
            width={config.size * 0.6}
            height={config.size * 0.6}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>

        {/* Left drag handle */}
        <div
          className="drag-handle drag-handle-left"
          role="button"
          tabIndex={0}
          aria-label="Drag handle left"
          style={{
            ...handleStyle,
            ...leftHandlePosition,
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onDragStart(e);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onDragStart(e as unknown as React.MouseEvent);
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
          }}
        >
          <svg
            width={config.size * 0.6}
            height={config.size * 0.6}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </div>
      </>
    );
  }
);

DragHandles.displayName = 'DragHandles';
