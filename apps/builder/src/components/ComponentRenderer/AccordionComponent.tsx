import React from 'react';
import { ComponentNode } from '@wysiwyg/core';

interface AccordionComponentProps {
  component: ComponentNode;
  isPreview?: boolean;
  convertStylesToCSS: (styles?: Record<string, string | number>) => React.CSSProperties;
  renderChild: (child: ComponentNode) => React.ReactNode;
}

export const AccordionComponent: React.FC<AccordionComponentProps> = ({ component, renderChild, convertStylesToCSS }) => {
  const [openItems, setOpenItems] = React.useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div style={convertStylesToCSS(component.styles)}>
      {component.children.map((child, index) => (
        <div key={child.id} style={{ marginBottom: '0.5rem' }}>
          <button
            onClick={() => toggleItem(index)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{child.props?.label || `Item ${index + 1}`}</span>
            <span>{openItems.includes(index) ? '▼' : '▶'}</span>
          </button>
          {openItems.includes(index) && (
            <div style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderTop: 'none' }}>
              {renderChild(child)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
