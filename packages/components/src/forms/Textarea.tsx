/**
 * Textarea Component
 *
 * A textarea component for multi-line text input.
 * Supports various customization options and validation states.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Textarea: React.FC<BaseComponentProps> = ({
  node,
  context,
  style,
  className = '',
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-textarea ${className}`.trim();

  return (
    <textarea
      id={node.id}
      placeholder={node.props.placeholder}
      value={node.props.value}
      disabled={node.props.disabled}
      required={node.props.required}
      readOnly={node.props.readOnly}
      maxLength={node.props.maxLength}
      minLength={node.props.minLength}
      rows={node.props.rows || 4}
      cols={node.props.cols}
      className={baseClassName}
      style={mergeStyles({
        padding: node.props.padding || '0.5rem 0.75rem',
        fontSize: node.props.fontSize || '1rem',
        borderRadius: node.props.borderRadius || '0.375rem',
        border: node.props.border || '1px solid #e5e7eb',
        backgroundColor: node.props.backgroundColor || '#ffffff',
        color: node.props.color || '#111827',
        width: node.props.width || '100%',
        minHeight: node.props.minHeight || '100px',
        resize: node.props.resize || 'vertical',
        ...node.styles,
        ...parseInlineStyles(style),
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    />
  );
};
