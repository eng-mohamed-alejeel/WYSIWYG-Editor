import React from 'react';
import { ComponentNode } from '@wysiwyg/core';
import { convertStylesToCSS } from './helpers';

interface LayoutComponentsProps {
  component: ComponentNode;
  renderChild: (child: ComponentNode) => React.ReactNode;
}

export const LayoutComponents: React.FC<LayoutComponentsProps> = ({ component, renderChild }) => {
  switch (component.type) {
    case 'container':
      return (
        <div style={convertStylesToCSS(component.styles)}>
          {component.children.map(child => renderChild(child))}
        </div>
      );

    case 'row':
      return (
        <div
          style={convertStylesToCSS({
            display: 'flex',
            flexDirection: 'row',
            ...component.styles
          })}
        >
          {component.children.map(child => renderChild(child))}
        </div>
      );

    case 'column':
      return (
        <div
          style={convertStylesToCSS({
            flex: component.props?.flex || 1,
            ...component.styles
          })}
        >
          {component.children.map(child => renderChild(child))}
        </div>
      );

    case 'grid':
      return (
        <div
          style={convertStylesToCSS({
            display: 'grid',
            gridTemplateColumns: component.props?.columns || 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: component.props?.gap || '1rem',
            ...component.styles
          })}
        >
          {component.children.map(child => renderChild(child))}
        </div>
      );

    case 'section':
      return (
        <section style={convertStylesToCSS(component.styles)}>
          {component.children.map(child => renderChild(child))}
        </section>
      );

    default:
      return null;
  }
};
