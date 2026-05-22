import React from 'react';
import Image from 'next/image';
import { ComponentNode } from '@wysiwyg/core';
import { ComponentWrapper } from './ComponentWrapper';
import { useBuilderStore } from '../store/store';
import { Icon } from '@wysiwyg/ui';

// Helper function to convert StyleObject to CSSProperties
const convertStylesToCSS = (styles?: Record<string, string | number>): React.CSSProperties => {
  if (!styles) return {};
  
  const cssStyles: React.CSSProperties = {};
  
  for (const [key, value] of Object.entries(styles)) {
    // Convert camelCase to kebab-case for CSS properties
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    
    // Handle specific CSS properties that need special treatment
    if (key === 'alignItems' || key === 'justifyContent' || key === 'flexDirection') {
      // Ensure these are strings, not numbers
      cssStyles[key as keyof React.CSSProperties] = String(value) as any;
    } else {
      cssStyles[cssKey as keyof React.CSSProperties] = value as any;
    }
  }
  
  return cssStyles;
};

interface ComponentRendererProps {
  component: ComponentNode;
  isPreview?: boolean;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isPreview = false
}) => {
  const { selectedIds, hoveredId } = useBuilderStore();
  const isSelected = selectedIds.includes(component.id);
  const isHovered = hoveredId === component.id;

  const renderComponentContent = () => {
    switch (component.type) {
      case 'text':
        return (
          <p style={convertStylesToCSS(component.styles)}>
            {component.props?.text || 'Text content'}
          </p>
        );

      case 'heading':
        const HeadingTag = `h${component.props?.level || 1}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag style={convertStylesToCSS(component.styles)}>
            {component.props?.text || 'Heading'}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p style={convertStylesToCSS(component.styles)}>
            {component.props?.text || 'Paragraph content'}
          </p>
        );

      case 'link':
        return (
          <a
            href={component.props?.href || '#'}
            style={convertStylesToCSS(component.styles)}
            target={component.props?.target || '_self'}
            rel={component.props?.target === '_blank' ? 'noopener noreferrer' : undefined}
          >
            {component.props?.text || 'Link'}
          </a>
        );

      case 'button':
        return (
          <button
            type={component.props?.type || 'button'}
            style={convertStylesToCSS(component.styles)}
            onClick={component.props?.onClick}
          >
            {component.props?.text || 'Button'}
          </button>
        );

      case 'image':
        return (
          <Image
            src={component.props?.src || 'https://via.placeholder.com/400x300'}
            alt={component.props?.alt || 'Image'}
            width={400}
            height={300}
            style={convertStylesToCSS(component.styles)}
          />
        );

      case 'video':
        return (
          <video
            src={component.props?.src || ''}
            controls={component.props?.controls !== false}
            autoPlay={component.props?.autoPlay || false}
            loop={component.props?.loop || false}
            muted={component.props?.muted || false}
            style={convertStylesToCSS(component.styles)}
          />
        );

      case 'container':
        return (
          <div style={convertStylesToCSS(component.styles)}>
            {component.children.map(child => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isPreview={isPreview}
              />
            ))}
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
            {component.children.map(child => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isPreview={isPreview}
              />
            ))}
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
            {component.children.map(child => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isPreview={isPreview}
              />
            ))}
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
            {component.children.map(child => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isPreview={isPreview}
              />
            ))}
          </div>
        );

      case 'section':
        return (
          <section style={convertStylesToCSS(component.styles)}>
            {component.children.map(child => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isPreview={isPreview}
              />
            ))}
          </section>
        );

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

      case 'icon':
        return (
          <div style={convertStylesToCSS(component.styles)}>
            <Icon
              name={component.props?.icon || 'star'}
              size={component.props?.size || 'medium'}
            />
          </div>
        );

      default:
        return (
          <div style={convertStylesToCSS(component.styles)}>
            {component.children.map(child => (
              <ComponentRenderer
                key={child.id}
                component={child}
                isPreview={isPreview}
              />
            ))}
          </div>
        );
    }
  };

  if (isPreview) {
    return <>{renderComponentContent()}</>;
  }

  return (
    <ComponentWrapper
      component={component}
      isSelected={isSelected}
      isHovered={isHovered}
      isPreview={isPreview}
    >
      {renderComponentContent()}
    </ComponentWrapper>
  );
};

export default ComponentRenderer;
