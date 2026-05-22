import React from 'react';
import { ComponentNode } from '@wysiwyg/core';

interface FilterComponentProps {
  component: ComponentNode;
  convertStylesToCSS: (styles?: Record<string, string | number>) => React.CSSProperties;
}

export const FilterComponent: React.FC<FilterComponentProps> = ({ component, convertStylesToCSS }) => {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
    component.props?.onChange?.(selectedFilters);
  };

  return (
    <div style={convertStylesToCSS(component.styles)}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {component.props?.options?.map((option: { label: string; value: string }, index: number) => (
          <button
            key={index}
            onClick={() => toggleFilter(option.value)}
            style={{
              padding: '0.25rem 0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '9999px',
              background: selectedFilters.includes(option.value) ? '#3b82f6' : 'white',
              color: selectedFilters.includes(option.value) ? 'white' : 'gray',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              if (!selectedFilters.includes(option.value)) {
                e.currentTarget.style.borderColor = '#3b82f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!selectedFilters.includes(option.value)) {
                e.currentTarget.style.borderColor = '#e5e7eb';
              }
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
