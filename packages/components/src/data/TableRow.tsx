/**
 * TableRow Component
 *
 * A table row component for use within the Table component.
 * Supports various styling options and hover effects.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const TableRow: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = '',
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-table-row ${className}`.trim();

  return (
    <tr
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        backgroundColor: node.props.backgroundColor || 'transparent',
        ...getHoverStyles(node.props),
        ...node.styles,
        ...parseInlineStyles(style),
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {children}
    </tr>
  );
};

function getHoverStyles(props: any): React.CSSProperties {
  if (!props.hoverBackgroundColor) return {};

  return {
    transition: 'background-color 0.2s ease',
  };
}
