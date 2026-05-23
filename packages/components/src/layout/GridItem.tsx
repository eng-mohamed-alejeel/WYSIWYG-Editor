/**
 * GridItem Component
 *
 * A grid item component for use within the Grid component.
 * Controls the spanning and positioning of grid items.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

interface GridItemProps {
  gridColumn?: string;
  gridRow?: string;
  smColSpan?: string;
  mdColSpan?: string;
  lgColSpan?: string;
  xlColSpan?: string;
}

export const GridItem: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = '',
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-grid-item ${className}`.trim();

  const gridItemProps = node.props as GridItemProps;

  return (
    <div
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        gridColumn: gridItemProps.gridColumn ?? 'auto',
        gridRow: gridItemProps.gridRow ?? 'auto',
        ...getResponsiveStyles(gridItemProps),
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

function getResponsiveStyles(props: GridItemProps): Record<string, React.CSSProperties> {
  const styles: Record<string, React.CSSProperties> = {};

  if (props.smColSpan !== undefined && props.smColSpan !== null) {
    styles['@media (min-width: 640px)'] = {
      ...styles['@media (min-width: 640px)'],
      gridColumn: `span ${props.smColSpan}`,
    };
  }

  if (props.mdColSpan !== undefined && props.mdColSpan !== null) {
    styles['@media (min-width: 768px)'] = {
      ...styles['@media (min-width: 768px)'],
      gridColumn: `span ${props.mdColSpan}`,
    };
  }

  if (props.lgColSpan !== undefined && props.lgColSpan !== null) {
    styles['@media (min-width: 1024px)'] = {
      ...styles['@media (min-width: 1024px)'],
      gridColumn: `span ${props.lgColSpan}`,
    };
  }

  if (props.xlColSpan !== undefined && props.xlColSpan !== null) {
    styles['@media (min-width: 1280px)'] = {
      ...styles['@media (min-width: 1280px)'],
      gridColumn: `span ${props.xlColSpan}`,
    };
  }

  return styles;
}
