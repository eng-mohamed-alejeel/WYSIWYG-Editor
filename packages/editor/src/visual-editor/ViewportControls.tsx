/**
 * Viewport Controls Component
 */

import React, { memo } from 'react';
import { ViewportControlsProps } from './Canvas.types';

export const ViewportControls: React.FC<ViewportControlsProps> = memo(
  ({ zoom, onZoomChange, onReset }) => {
    return (
      <div
        className="wysiwyg-viewport-controls-panel"
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          backgroundColor: 'white',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 10000,
        }}
      >
        <button
          onClick={() => onZoomChange(zoom - 0.1)}
          disabled={zoom <= 0.1}
          style={{
            width: 32,
            height: 32,
            border: 'none',
            backgroundColor: 'transparent',
            cursor: zoom > 0.1 ? 'pointer' : 'not-allowed',
            fontSize: 18,
          }}
        >
          −
        </button>

        <span style={{ minWidth: 48, textAlign: 'center', fontSize: 13 }}>
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => onZoomChange(zoom + 0.1)}
          disabled={zoom >= 5}
          style={{
            width: 32,
            height: 32,
            border: 'none',
            backgroundColor: 'transparent',
            cursor: zoom < 5 ? 'pointer' : 'not-allowed',
            fontSize: 18,
          }}
        >
          +
        </button>

        <div style={{ width: 1, height: 24, backgroundColor: '#e5e7eb' }} />

        <button
          onClick={onReset}
          style={{
            padding: '4px 8px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Reset
        </button>
      </div>
    );
  }
);

ViewportControls.displayName = 'ViewportControls';
