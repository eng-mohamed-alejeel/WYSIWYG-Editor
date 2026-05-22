/**
 * Column Component
 * 
 * A column component that creates a vertical layout container.
 * Used in conjunction with Row components to create grid layouts.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';


export const Column: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-column ${className}`.trim();

  return (
    <div
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        display: 'flex',
        flexDirection: 'column',
        gap: node.props.gap || '1rem',
        alignItems: node.props.alignItems || 'stretch',
        justifyContent: node.props.justifyContent || 'flex-start',
        flex: node.props.flex || '1',
        minWidth: node.props.minWidth || '0',
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