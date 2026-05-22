/**
 * Grid Component
 * 
 * A grid layout component for creating responsive grid layouts.
 * Supports custom columns, gaps, and responsive breakpoints.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Grid: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-grid ${className}`.trim();

  return (
    <div
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        display: 'grid',
        gridTemplateColumns: node.props.columns || 'repeat(12, 1fr)',
        gap: node.props.gap || '1rem',
        ...getResponsiveStyles(node.props),
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

function getResponsiveStyles(props: any): React.CSSProperties {
  const styles: React.CSSProperties = {};

  if (props.smColumns) {
    styles['@media (min-width: 640px)'] = {
      gridTemplateColumns: props.smColumns
    };
  }

  if (props.mdColumns) {
    styles['@media (min-width: 768px)'] = {
      gridTemplateColumns: props.mdColumns
    };
  }

  if (props.lgColumns) {
    styles['@media (min-width: 1024px)'] = {
      gridTemplateColumns: props.lgColumns
    };
  }

  if (props.xlColumns) {
    styles['@media (min-width: 1280px)'] = {
      gridTemplateColumns: props.xlColumns
    };
  }

  return styles;
}