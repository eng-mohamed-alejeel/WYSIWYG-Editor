/**
 * Hover Overlay Component
 *
 * Displays hover overlay for components
 * Following Figma and Webflow UX patterns
 */

import React, { useMemo } from 'react';
import { Rect } from './types';

interface HoverOverlayProps {
  bounds: Rect | null;
  config: {
    enabled: boolean;
    color: string;
    opacity: number;
    transition: number;
  };
}

export const HoverOverlay: React.FC<HoverOverlayProps> = React.memo(({ bounds, config }) => {
  const overlayStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      left: `${bounds?.left ?? 0}px`,
      top: `${bounds?.top ?? 0}px`,
      width: `${bounds?.width ?? 0}px`,
      height: `${bounds?.height ?? 0}px`,
      backgroundColor: config.color,
      opacity: config.opacity,
      pointerEvents: 'none' as const,
      transition: `opacity ${config.transition}ms ease`,
      zIndex: 9996,
    }),
    [bounds, config.color, config.opacity, config.transition]
  );

  if (!config.enabled || !bounds) {
    return null;
  }

  return <div className="hover-overlay" style={overlayStyle} />;
});

HoverOverlay.displayName = 'HoverOverlay';
