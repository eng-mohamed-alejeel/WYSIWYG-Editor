/**
 * Icon Component
 *
 * A reusable icon component for displaying SVG icons.
 */

import React from 'react';

export interface IconProps {
  /**
   * Icon name
   */
  name: string;

  /**
   * Icon size
   */
  size?: number | 'small' | 'medium' | 'large' | 'xlarge';

  /**
   * Icon color
   */
  color?: string;

  /**
   * Is icon clickable
   */
  clickable?: boolean;

  /**
   * Click callback
   */
  onClick?: () => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Icon viewBox
   */
  viewBox?: string;

  /**
   * Custom SVG path
   */
  path?: string;
}

// Icon definitions
const iconPaths: Record<string, string> = {
  // Navigation icons
  'arrow-left': 'M5 12h14M12 5l7 7-7 7',
  'arrow-right': 'M19 12H5M12 19l-7-7 7-7',
  'arrow-up': 'M12 19V5M5 12l7-7 7 7',
  'arrow-down': 'M12 5v14M5 12l7 7 7-7',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'chevron-up': 'M18 15l-6-6-6 6',
  'chevron-down': 'M6 9l6 6 6-6',

  // Action icons
  'close': 'M6 18L18 6M6 6l12 12',
  'check': 'M5 13l4 4L19 7',
  'plus': 'M12 5v14M5 12h14',
  'minus': 'M5 12h14',
  'edit': 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7',
  'delete': 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',

  // UI icons
  'menu': 'M4 6h16M4 12h16M4 18h16',
  'search': 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0',
  'settings': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  'filter': 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',

  // File icons
  'file': 'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z',
  'folder': 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
  'image': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',

  // Editor icons
  'bold': 'M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z',
  'italic': 'M10 4h4',
  'underline': 'M4 12h16M4 4v4a8 8 0 0016 0V4',
  'link': 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71',
  'unlink': 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11l-4 4',

  // Layout icons
  'layout': 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
  'grid': 'M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z',

  // Status icons
  'info': 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'warning': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  'error': 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  'success': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',

  // Media icons
  'play': 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z',
  'pause': 'M10 9v6m4-6v6',
  'volume': 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',

  // Other icons
  'copy': 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
  'download': 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
  'upload': 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
  'refresh': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'medium',
  color,
  clickable = false,
  onClick,
  className = '',
  viewBox = '0 0 24 24',
  path
}) => {
  const getSize = (): number => {
    if (typeof size === 'number') return size;

    const sizes: Record<string, number> = {
      small: 16,
      medium: 20,
      large: 24,
      xlarge: 32
    };

    return sizes[size] || sizes.medium;
  };

  const iconPath = path || iconPaths[name] || '';

  const classes = ['icon', clickable ? 'icon-clickable' : '', className].filter(Boolean).join(' ');

  const style: React.CSSProperties = {
    width: getSize(),
    height: getSize(),
    ...(color && { color })
  };

  return (
    <svg
      className={classes}
      style={style}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
    >
      <path d={iconPath} />
    </svg>
  );
};

export default Icon;
