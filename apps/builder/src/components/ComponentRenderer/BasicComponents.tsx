import React from 'react';
import Image from 'next/image';
import { ComponentNode } from '@wysiwyg/core';
import { Icon } from '@wysiwyg/ui';
import { convertStylesToCSS } from './helpers';

interface BasicComponentsProps {
  component: ComponentNode;
}

export const BasicComponents: React.FC<BasicComponentsProps> = ({ component }) => {
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

    case 'icon':
      return (
        <div style={convertStylesToCSS(component.styles)}>
          <Icon name={component.props?.icon || 'star'} size={component.props?.size || 'medium'} />
        </div>
      );

    default:
      return null;
  }
};
