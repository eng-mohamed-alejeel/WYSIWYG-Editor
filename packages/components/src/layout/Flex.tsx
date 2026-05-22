/**
 * Flex Component
 * 
 * A flexbox layout component for creating flexible layouts.
 * Supports various flex properties and responsive breakpoints.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';


export const Flex: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-flex ${className}`.trim();

  return (
    <div
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        display: 'flex',
        flexDirection: node.props.flexDirection || 'row',
        justifyContent: node.props.justifyContent || 'flex-start',
        alignItems: node.props.alignItems || 'stretch',
        flexWrap: node.props.flexWrap || 'nowrap',
        gap: node.props.gap || '0',
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

  if (props.smDirection) {
    styles['@media (min-width: 640px)'] = {
      flexDirection: props.smDirection
    };
  }

  if (props.mdDirection) {
    styles['@media (min-width: 768px)'] = {
      flexDirection: props.mdDirection
    };
  }

  if (props.lgDirection) {
    styles['@media (min-width: 1024px)'] = {
      flexDirection: props.lgDirection
    };
  }

  if (props.xlDirection) {
    styles['@media (min-width: 1280px)'] = {
      flexDirection: props.xlDirection
    };
  }

  return styles;
}