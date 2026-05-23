/**
 * Heading Component
 *
 * A heading component for displaying titles and headings.
 * Supports h1-h6 heading levels.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Heading: React.FC<BaseComponentProps> = ({ node, context, style, className = '' }) => {
  const { isEditable, isPreview } = context;
  const level = node.props.level || 'h1';
  const baseClassName = `wysiwyg-heading wysiwyg-heading-${level} ${className}`.trim();

  const Tag = level as keyof JSX.IntrinsicElements;

  return (
    <Tag
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        fontWeight: node.props.fontWeight || '700',
        lineHeight: node.props.lineHeight || '1.2',
        ...node.styles,
        ...parseInlineStyles(style),
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {node.props.text || node.props.children}
    </Tag>
  );
};
