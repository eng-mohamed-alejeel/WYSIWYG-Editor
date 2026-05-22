/**
 * TableCell Component
 * 
 * A table cell component for use within the TableRow component.
 * Supports various styling options and cell spanning.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';


export const TableCell: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const isHeader = node.props.isHeader || false;
  const Tag = isHeader ? 'th' : 'td';
  const baseClassName = `wysiwyg-table-cell ${isHeader ? 'wysiwyg-table-cell-header' : ''} ${className}`.trim();

  return (
    <Tag
      id={node.id}
      className={baseClassName}
      colSpan={node.props.colSpan}
      rowSpan={node.props.rowSpan}
      style={mergeStyles({
        padding: node.props.padding || '0.75rem 1rem',
        textAlign: node.props.textAlign || 'left',
        verticalAlign: node.props.verticalAlign || 'middle',
        backgroundColor: node.props.backgroundColor || 'transparent',
        fontWeight: isHeader ? '600' : '400',
        borderBottom: node.props.borderBottom || '1px solid #e5e7eb',
        borderRight: node.props.borderRight || 'none',
        ...node.styles,
        ...parseInlineStyles(style)
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {children}
    </Tag>
  );
};
