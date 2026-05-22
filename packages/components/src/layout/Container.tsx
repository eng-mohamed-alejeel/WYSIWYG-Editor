/**
 * Container Component
 * 
 * A container component that provides a constrained width wrapper
 * for content, commonly used to center content on the page.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';


export const Container: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-container ${className}`.trim();

  return (
    <div
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        maxWidth: node.props.maxWidth || '1200px',
        margin: '0 auto',
        padding: node.props.padding || '0 1rem',
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