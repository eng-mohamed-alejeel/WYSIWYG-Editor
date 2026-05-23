/**
 * Tabs Component
 *
 * A tabs component for displaying tabbed content panels.
 * Supports various tab styles and positions.
 */

import React, { useState } from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const Tabs: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = '',
}) => {
  const { isEditable, isPreview } = context;
  const [activeTab, setActiveTab] = useState(node.props.defaultTab || 0);
  const tabPosition = node.props.position || 'top';

  return (
    <div
      id={node.id}
      className={`wysiwyg-tabs wysiwyg-tabs-${tabPosition} ${className}`.trim()}
      style={mergeStyles({
        ...(node.styles as Record<string, any>),
        ...parseInlineStyles(style),
        display: 'flex',
        flexDirection: tabPosition === 'top' || tabPosition === 'bottom' ? 'column' : 'row',
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      <div
        className="wysiwyg-tabs-list"
        style={mergeStyles({
          display: 'flex',
          flexDirection: tabPosition === 'top' || tabPosition === 'bottom' ? 'row' : 'column',
          gap: node.props.tabGap || '0.25rem',
          padding: node.props.listPadding || '0.5rem',
          backgroundColor: node.props.listBackgroundColor || '#f9fafb',
          borderBottom: tabPosition === 'top' ? '1px solid #e5e7eb' : undefined,
          borderTop: tabPosition === 'bottom' ? '1px solid #e5e7eb' : undefined,
          borderLeft: tabPosition === 'right' ? '1px solid #e5e7eb' : undefined,
          borderRight: tabPosition === 'left' ? '1px solid #e5e7eb' : undefined,
        } as React.CSSProperties)}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              isActive: activeTab === index,
              onClick: () => setActiveTab(index),
            });
          }
          return child;
        })}
      </div>
      <div
        className="wysiwyg-tabs-content"
        style={{
          flex: 1,
          padding: node.props.contentPadding || '1rem',
          backgroundColor: node.props.contentBackgroundColor || '#ffffff',
        }}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && activeTab === index) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
};
