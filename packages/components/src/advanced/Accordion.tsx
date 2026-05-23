/**
 * Accordion Component
 *
 * An accordion component for displaying collapsible content panels.
 * Supports single and multiple panel expansion modes.
 */

import React, { useState } from 'react';
import { BaseComponentProps } from '../types';

interface AccordionItemProps {
  id: string;
  children?: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const Accordion: React.FC<BaseComponentProps> = ({
  node,
  context,
  children,
  style,
  className = '',
}) => {
  const { isEditable, isPreview } = context;
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const allowMultiple = Boolean(node.props.allowMultiple);

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
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
      style={mergeStyles(
        node.styles as Record<string, string | number>,

        parseInlineStyles(style),
        {
          display: 'flex',
          flexDirection: 'column',
          gap: (node.props.gap as string | number) ?? '0.5rem',
        }
      )}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as AccordionItemProps;
          return React.cloneElement(child as React.ReactElement<AccordionItemProps>, {
            isExpanded: expandedItems.has(childProps.id),
            onToggle: () => toggleItem(childProps.id),
          });
        }
        return child;
      })}
    </div>
  );
};

function parseInlineStyles(style?: string): Record<string, string> {
  if (style === undefined || style === null || style === '') return {};

  const styles: Record<string, string> = {};
  const declarations = style.split(';').filter(Boolean);

  for (const declaration of declarations) {
    const [property, value] = declaration.split(':').map((s) => s.trim());
    if (property && value) {
      styles[property] = value;
    }
  }

  return styles;
}

function mergeStyles(...styleObjects: Array<Record<string, string | number>>): React.CSSProperties {
  const merged: Record<string, string | number> = {};

  for (const styleObj of styleObjects) {
    if (styleObj !== null && typeof styleObj === 'object') {
      Object.assign(merged, styleObj);
    }
  }

  return merged as React.CSSProperties;
}
