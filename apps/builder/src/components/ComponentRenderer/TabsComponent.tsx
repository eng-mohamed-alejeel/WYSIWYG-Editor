import React from 'react';
import { ComponentNode } from '@wysiwyg/core';

interface TabsComponentProps {
  component: ComponentNode;
  isPreview?: boolean;
  convertStylesToCSS: (styles?: Record<string, string | number>) => React.CSSProperties;
  renderChild: (child: ComponentNode) => React.ReactNode;
}

export const TabsComponent: React.FC<TabsComponentProps> = ({
  component,
  renderChild,
  convertStylesToCSS,
}) => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div style={convertStylesToCSS(component.styles)}>
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
        {component.children.map((child, index) => (
          <button
            key={child.id}
            onClick={() => setActiveTab(index)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              background: index === activeTab ? '#3b82f6' : 'transparent',
              color: index === activeTab ? 'white' : 'gray',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0',
            }}
          >
            {child.props?.label || `Tab ${index + 1}`}
          </button>
        ))}
      </div>
      <div style={{ padding: '1rem' }}>
        {component.children[activeTab] && renderChild(component.children[activeTab])}
      </div>
    </div>
  );
};
