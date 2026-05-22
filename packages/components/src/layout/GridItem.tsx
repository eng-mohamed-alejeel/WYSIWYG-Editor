/**
 * GridItem Component
 * 
 * A grid item component for use within the Grid component.
 * Controls the spanning and positioning of grid items.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const GridItem: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-grid-item ${className}`.trim();

  return (
    <div
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        gridColumn: node.props.gridColumn || 'auto',
        gridRow: node.props.gridRow || 'auto',
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

  if (props.smColSpan) {
    styles['@media (min-width: 640px)'] = {
      ...styles['@media (min-width: 640px)'],
      gridColumn: `span ${props.smColSpan}`
    };
  }

  if (props.mdColSpan) {
    styles['@media (min-width: 768px)'] = {
      ...styles['@media (min-width: 768px)'],
      gridColumn: `span ${props.mdColSpan}`
    };
  }

  if (props.lgColSpan) {
    styles['@media (min-width: 1024px)'] = {
      ...styles['@media (min-width: 1024px)'],
      gridColumn: `span ${props.lgColSpan}`
    };
  }

  if (props.xlColSpan) {
    styles['@media (min-width: 1280px)'] = {
      ...styles['@media (min-width: 1280px)'],
      gridColumn: `span ${props.xlColSpan}`
    };
  }

  return styles;
}