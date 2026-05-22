/**
 * Button Component
 * 
 * A button component with various styles and states.
 * Supports different button variants and sizes.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Button: React.FC<BaseComponentProps> = ({
  node,
  context,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const variant = node.props.variant || 'primary';
  const size = node.props.size || 'medium';
  const baseClassName = `wysiwyg-button wysiwyg-button-${variant} wysiwyg-button-${size} ${className}`.trim();

  const buttonStyles: React.CSSProperties = mergeStyles({
    padding: getPadding(size),
    fontSize: getFontSize(size),
    fontWeight: node.props.fontWeight || '600',
    borderRadius: node.props.borderRadius || '0.375rem',
    border: variant === 'outline' ? '1px solid' : 'none',
    cursor: node.props.disabled ? 'not-allowed' : 'pointer',
    opacity: node.props.disabled ? 0.6 : 1,
    ...node.styles,
    ...parseInlineStyles(style)
  });

  return (
    <button
      id={node.id}
      type={node.props.type || 'button'}
      className={baseClassName}
      style={buttonStyles}
      disabled={node.props.disabled}
      onClick={node.props.onClick}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {node.props.text || node.props.children}
    </button>
  );
};

function getPadding(size: string): string {
  const paddings: Record<string, string> = {
    small: '0.375rem 0.75rem',
    medium: '0.5rem 1rem',
    large: '0.75rem 1.5rem'
  };
  return paddings[size] || paddings.medium;
}

function getFontSize(size: string): string {
  const fontSizes: Record<string, string> = {
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem'
  };
  return fontSizes[size] || fontSizes.medium;
}
