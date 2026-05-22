/**
 * TabItem Component
 * 
 * An individual tab item component used within the Tabs component.
 * Contains the tab label and content panel.
 */

import React from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

interface TabItemProps extends BaseComponentProps {
  isActive?: boolean;
  onClick?: () => void;
}

export const TabItem: React.FC<TabItemProps> = ({
  node,
  context,
  children,
  isActive = false,
  onClick,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-tab-item ${isActive ? 'wysiwyg-tab-item-active' : ''} ${className}`.trim();

  return (
    <div
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        ...(node.styles as Record<string, any>),
        ...parseInlineStyles(style),
        padding: node.props.padding || '0.5rem 1rem',
        cursor: node.props.disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        backgroundColor: isActive ? node.props.activeBackgroundColor || '#ffffff' : 'transparent',
        color: isActive ? node.props.activeColor || '#111827' : node.props.color || '#6b7280',
        borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
        borderRadius: node.props.borderRadius || '0.375rem',
        transition: 'all 0.2s',
        fontWeight: isActive ? '600' : '400'
      } as React.CSSProperties)}
      onClick={() => !node.props.disabled && onClick?.()}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {node.props.label || `Tab ${node.id}`}
      {isActive && children}
    </div>
  );
};
