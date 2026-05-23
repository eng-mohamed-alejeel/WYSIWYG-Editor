/**
 * Image Component
 *
 * An image component for displaying images with various
 * customization options like size, alignment, and styling.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Image: React.FC<BaseComponentProps> = ({ node, context, style, className = '' }) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-image ${className}`.trim();

  return (
    <img
      id={node.id}
      src={node.props.src || ''}
      alt={node.props.alt || ''}
      className={baseClassName}
      style={mergeStyles({
        width: node.props.width || '100%',
        height: node.props.height || 'auto',
        maxWidth: node.props.maxWidth || '100%',
        objectFit: node.props.objectFit || 'cover',
        borderRadius: node.props.borderRadius || '0',
        ...node.styles,
        ...parseInlineStyles(style),
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    />
  );
};
