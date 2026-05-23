/**
 * Spacer Component
 *
 * A spacer component for creating consistent spacing between elements.
 * Supports horizontal and vertical spacing with customizable sizes.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Spacer: React.FC<BaseComponentProps> = ({ node, context, style, className = '' }) => {
  const { isEditable, isPreview } = context;
  const direction = node.props.direction || 'vertical';
  const size = node.props.size || 'medium';
  const baseClassName = `wysiwyg-spacer wysiwyg-spacer-${direction} ${className}`.trim();

  const spacerStyle: React.CSSProperties = {
    flexShrink: 0,
  };

  if (direction === 'vertical') {
    spacerStyle.height = getSpacerSize(size);
  } else {
    spacerStyle.width = getSpacerSize(size);
  }

  return (
    <div
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        ...spacerStyle,
        ...node.styles,
        ...parseInlineStyles(style),
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    />
  );
};

function getSpacerSize(size: string): string {
  const sizes: Record<string, string> = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    medium: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  };
  return sizes[size] || sizes.md;
}
