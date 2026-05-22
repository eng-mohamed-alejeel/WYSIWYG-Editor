/**
 * Row Component
 * 
 * A row component that creates a horizontal layout container.
 * Used in conjunction with Column components to create grid layouts.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Row: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-row ${className}`.trim();

  return (
    <div
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        display: 'flex',
        flexDirection: 'row',
        flexWrap: node.props.wrap || 'wrap',
        gap: node.props.gap || '1rem',
        alignItems: node.props.alignItems || 'stretch',
        justifyContent: node.props.justifyContent || 'flex-start',
        ...node.styles,
        ...parseInlineStyles(style)
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {children}
    </div>
  );
};