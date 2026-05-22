/**
 * Table Component
 * 
 * A table component for displaying tabular data.
 * Supports various styling options and responsive behavior.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Table: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-table ${className}`.trim();

  return (
    <div
      className="wysiwyg-table-wrapper"
      style={mergeStyles({
        overflowX: node.props.responsive !== false ? 'auto' : 'visible',
        width: '100%'
      } as React.CSSProperties)}
    >
      <table
        id={node.id}
        className={baseClassName}
        style={mergeStyles({
          ...(node.styles as Record<string, any>),
          ...parseInlineStyles(style),
          width: node.props.width || '100%',
          borderCollapse: node.props.borderCollapse || 'collapse',
          backgroundColor: node.props.backgroundColor || '#ffffff'
        } as React.CSSProperties)}
        data-component-type={node.type}
        data-editable={isEditable}
        data-preview={isPreview}
      >
        {children}
      </table>
    </div>
  );
};


