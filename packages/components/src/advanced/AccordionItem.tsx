/**
 * AccordionItem Component
 * 
 * An individual item component used within the Accordion.
 * Contains a header and collapsible content panel.
 */

import React from 'react';
import { BaseComponentProps } from '../types';

interface AccordionItemProps extends BaseComponentProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  node,
  context,
  children,
  isExpanded = false,
  onToggle,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const baseClassName = `wysiwyg-accordion-item ${className}`.trim();

  return (
    <div
      id={node.id}
      className={baseClassName}
      style={mergeStyles({
        ...(node.styles as Record<string, any>),
        ...parseInlineStyles(style),
        border: node.props.border || '1px solid #e5e7eb',
        borderRadius: node.props.borderRadius || '0.375rem',
        overflow: 'hidden'
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      <div
        className="wysiwyg-accordion-item-header"
        style={mergeStyles({
          padding: node.props.headerPadding || '0.75rem 1rem',
          backgroundColor: node.props.headerBackgroundColor || '#f9fafb',
          cursor: node.props.disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none'
        } as React.CSSProperties)}
        onClick={() => !node.props.disabled && onToggle?.()}
      >
        <span style={mergeStyles({ fontWeight: '600' } as React.CSSProperties)}>
          {node.props.title || 'Accordion Item'}
        </span>
        <span style={mergeStyles({ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' } as React.CSSProperties)}>
          {node.props.icon || '▼'}
        </span>
      </div>
      <div
        className="wysiwyg-accordion-item-content"
        style={mergeStyles({
          padding: node.props.contentPadding || '0.75rem 1rem',
          display: isExpanded ? 'block' : 'none',
          backgroundColor: node.props.contentBackgroundColor || '#ffffff'
        } as React.CSSProperties)}
      >
        {children}
      </div>
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
