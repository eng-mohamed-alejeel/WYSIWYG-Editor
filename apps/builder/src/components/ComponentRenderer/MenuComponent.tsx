import React from 'react';
import { ComponentNode } from '@wysiwyg/core';

interface MenuComponentProps {
  component: ComponentNode;
  isPreview?: boolean;
  convertStylesToCSS: (styles?: Record<string, string | number>) => React.CSSProperties;
  renderChild: (child: ComponentNode) => React.ReactNode;
}

export const MenuComponent: React.FC<MenuComponentProps> = ({
  component,
  renderChild,
  convertStylesToCSS,
}) => (
  <nav style={convertStylesToCSS(component.styles)}>
    <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', margin: 0, padding: 0 }}>
      {component.children.map((child) => (
        <li key={child.id}>{renderChild(child)}</li>
      ))}
    </ul>
  </nav>
);
