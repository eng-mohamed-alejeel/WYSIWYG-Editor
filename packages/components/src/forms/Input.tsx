/**
 * Input Component
 *
 * An input component for text input fields.
 * Supports various input types and validation states.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Input: React.FC<BaseComponentProps> = ({ node, context, style, className = '' }) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-input ${className}`.trim();

  return (
    <input
      id={node.id}
      type={node.props.type || 'text'}
      placeholder={node.props.placeholder}
      value={node.props.value}
      disabled={node.props.disabled}
      required={node.props.required}
      readOnly={node.props.readOnly}
      maxLength={node.props.maxLength}
      minLength={node.props.minLength}
      pattern={node.props.pattern}
      className={baseClassName}
      style={mergeStyles({
        padding: node.props.padding || '0.5rem 0.75rem',
        fontSize: node.props.fontSize || '1rem',
        borderRadius: node.props.borderRadius || '0.375rem',
        border: node.props.border || '1px solid #e5e7eb',
        backgroundColor: node.props.backgroundColor || '#ffffff',
        color: node.props.color || '#111827',
        width: node.props.width || '100%',
        ...node.styles,
        ...parseInlineStyles(style),
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    />
  );
};
