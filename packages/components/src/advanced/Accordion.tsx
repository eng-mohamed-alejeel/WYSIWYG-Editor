/**
 * Accordion Component
 * 
 * An accordion component for displaying collapsible content panels.
 * Supports single and multiple panel expansion modes.
 */

import React, { useState } from 'react';
import { BaseComponentProps } from '../types';

export const Accordion: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const allowMultiple = node.props.allowMultiple || false;
  const defaultExpanded = node.props.defaultExpanded || false;

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (allowMultiple) {
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
      } else {
        newSet.clear();
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <div
      id={node.id}
      className={`wysiwyg-accordion ${className}`.trim()}
      style={mergeStyles({
        ...(node.styles as Record<string, any>),
        ...parseInlineStyles(style),
        display: 'flex',
        flexDirection: 'column',
        gap: node.props.gap || '0.5rem'
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isExpanded: expandedItems.has((child.props as any).id),
            onToggle: () => toggleItem((child.props as any).id)
          });
        }
        return child;
      })}
    </div>
  );
};

function parseInlineStyles(style?: string): React.CSSProperties {
  if (!style) return {};

  const styles: Record<string, string> = {};
  const declarations = style.split(';').filter(Boolean);

  for (const declaration of declarations) {
    const [property, value] = declaration.split(':').map(s => s.trim());
    if (property && value) {
      styles[property] = value;
    }
  }

  return styles as React.CSSProperties;
}

function mergeStyles(...styleObjects: Array<Record<string, any>>): React.CSSProperties {
  const merged: Record<string, any> = {};
  
  for (const styleObj of styleObjects) {
    if (styleObj && typeof styleObj === 'object') {
      Object.assign(merged, styleObj);
    }
  }
  
  return merged as React.CSSProperties;
}
