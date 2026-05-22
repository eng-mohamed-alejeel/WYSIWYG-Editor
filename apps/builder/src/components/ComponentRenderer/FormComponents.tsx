import React from 'react';
import { ComponentNode } from '@wysiwyg/core';
import { convertStylesToCSS } from './helpers';

interface FormComponentsProps {
  component: ComponentNode;
}

export const FormComponents: React.FC<FormComponentsProps> = ({ component }) => {
  switch (component.type) {
    case 'input':
      return (
        <input
          type={component.props?.type || 'text'}
          placeholder={component.props?.placeholder || ''}
          value={component.props?.value || ''}
          onChange={component.props?.onChange}
          style={convertStylesToCSS(component.styles)}
        />
      );

    case 'textarea':
      return (
        <textarea
          placeholder={component.props?.placeholder || ''}
          value={component.props?.value || ''}
          onChange={component.props?.onChange}
          style={convertStylesToCSS(component.styles)}
          rows={component.props?.rows || 4}
        />
      );

    case 'select':
      return (
        <select
          value={component.props?.value || ''}
          onChange={component.props?.onChange}
          style={convertStylesToCSS(component.styles)}
        >
          {component.props?.options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'checkbox':
      return (
        <input
          type="checkbox"
          checked={component.props?.checked || false}
          onChange={component.props?.onChange}
          style={convertStylesToCSS(component.styles)}
        />
      );

    case 'radio':
      return (
        <input
          type="radio"
          name={component.props?.name}
          checked={component.props?.checked || false}
          onChange={component.props?.onChange}
          style={convertStylesToCSS(component.styles)}
        />
      );

    case 'divider':
      return (
        <hr
          style={convertStylesToCSS({
            border: 'none',
            borderTop: `1px solid ${component.props?.color || '#e5e7eb'}`,
            ...component.styles
          })}
        />
      );

    case 'spacer':
      return (
        <div
          style={convertStylesToCSS({
            height: component.props?.height || '1rem',
            ...component.styles
          })}
        />
      );

    default:
      return null;
  }
};
