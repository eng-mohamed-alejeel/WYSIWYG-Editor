import React from 'react';
import { ComponentNode } from '@wysiwyg/core';

interface SearchComponentProps {
  component: ComponentNode;
  convertStylesToCSS: (styles?: Record<string, string | number>) => React.CSSProperties;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({
  component,
  convertStylesToCSS,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div style={convertStylesToCSS(component.styles)}>
      <input
        type="text"
        placeholder={component.props?.placeholder || 'Search...'}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          component.props?.onChange?.(e.target.value);
        }}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          fontSize: '0.875rem',
          transition: 'border-color 0.2s',
          outline: 'none',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
        onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
      />
    </div>
  );
};
