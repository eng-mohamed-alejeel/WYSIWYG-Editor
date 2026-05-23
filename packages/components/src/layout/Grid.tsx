/**
 * Grid Component
 *
 * A grid layout component for creating responsive grid layouts.
 * Supports custom columns, gaps, and responsive breakpoints.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

interface GridProps {
  columns?: string;
  gap?: string;
  smColumns?: string;
  mdColumns?: string;
  lgColumns?: string;
  xlColumns?: string;
}

export const Grid: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = '',
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-grid ${className}`.trim();

  const gridProps = node.props as GridProps;

  return (
    <div
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        display: 'grid',
        gridTemplateColumns: gridProps.columns ?? 'repeat(12, 1fr)',
        gap: gridProps.gap ?? '1rem',
        ...getResponsiveStyles(gridProps),
        ...node.styles,
        ...parseInlineStyles(style),
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {children}
    </div>
  );
};

function getResponsiveStyles(props: GridProps): Record<string, React.CSSProperties> {
  const styles: Record<string, React.CSSProperties> = {};

  if (props.smColumns !== undefined && props.smColumns !== null) {
    styles['@media (min-width: 640px)'] = {
      gridTemplateColumns: props.smColumns,
    };
  }

  if (props.mdColumns !== undefined && props.mdColumns !== null) {
    styles['@media (min-width: 768px)'] = {
      gridTemplateColumns: props.mdColumns,
    };
  }

  if (props.lgColumns !== undefined && props.lgColumns !== null) {
    styles['@media (min-width: 1024px)'] = {
      gridTemplateColumns: props.lgColumns,
    };
  }

  if (props.xlColumns !== undefined && props.xlColumns !== null) {
    styles['@media (min-width: 1280px)'] = {
      gridTemplateColumns: props.xlColumns,
    };
  }

  return styles;
}
