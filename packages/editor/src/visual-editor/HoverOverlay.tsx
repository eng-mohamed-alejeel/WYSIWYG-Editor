/**
 * Hover Overlay Component
 *
 * Displays hover overlay for components
 * Following Figma and Webflow UX patterns
 */

import React, { useMemo } from 'react';

interface HoverOverlayProps {
  bounds: DOMRect | null;
  config: {
    enabled: boolean;
    color: string;
    opacity: number;
    transition: number;
  };
}

export const HoverOverlay: React.FC<HoverOverlayProps> = React.memo(({ bounds, config }) => {
  if (!config.enabled || !bounds) {
    return null;
  }

  const overlayStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      left: `${bounds.left}px`,
      top: `${bounds.top}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
      backgroundColor: config.color,
      opacity: config.opacity,
      pointerEvents: 'none' as const,
      transition: `opacity ${config.transition}ms ease`,
      zIndex: 9996,
    }),
    [bounds, config.color, config.opacity, config.transition]
  );

  return <div className="hover-overlay" style={overlayStyle} />;
});

HoverOverlay.displayName = 'HoverOverlay';
