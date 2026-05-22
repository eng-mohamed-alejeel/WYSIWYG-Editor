/**
 * Text Component
 * 
 * A text component for displaying paragraphs and text content.
 * Supports various text styles and formatting options.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Text: React.FC<BaseComponentProps> = ({
  node,
  context,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-text ${className}`.trim();

  return (
    <p
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        fontSize: node.props.fontSize || '1rem',
        fontWeight: node.props.fontWeight || '400',
        lineHeight: node.props.lineHeight || '1.6',
        color: node.props.color || 'inherit',
        textAlign: node.props.textAlign || 'left',
        ...node.styles,
        ...parseInlineStyles(style)
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {node.props.text || node.props.children}
    </p>
  );
};