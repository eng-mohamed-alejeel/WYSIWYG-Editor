/**
 * Breadcrumbs Component
 *
 * Displays breadcrumb navigation for component hierarchy
 * Following Figma and Webflow UX patterns
 */

import React, { useMemo } from 'react';
import { BreadcrumbItem } from './types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  config: {
    enabled: boolean;
    maxDepth: number;
    showComponentTypes: boolean;
  };
  onSelect: (id: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = React.memo(({ items, config, onSelect }) => {
  if (!config.enabled || items.length === 0) {
    return null;
  }

  const displayItems = useMemo(() => {
    const limited = items.slice(-config.maxDepth);
    return limited.map((item, index) => ({
      ...item,
      isLast: index === limited.length - 1,
    }));
  }, [items, config.maxDepth]);

  const containerStyle = useMemo(
    () => ({
      position: 'fixed' as const,
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 10000,
      fontSize: '13px',
      fontWeight: 500,
      color: '#333',
      backdropFilter: 'blur(8px)',
    }),
    []
  );

  const itemStyle = useMemo(
    () => ({
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.15s ease',
      ':hover': {
        backgroundColor: 'rgba(0, 102, 255, 0.1)',
      },
    }),
    []
  );

  const separatorStyle = useMemo(
    () => ({
      color: '#999',
      fontSize: '12px',
    }),
    []
  );

  return (
    <div className="breadcrumbs" style={containerStyle}>
      {displayItems.map((item, index) => (
        <React.Fragment key={item.id}>
          <div
            className="breadcrumb-item"
            style={{
              ...itemStyle,
              backgroundColor: item.isLast ? 'rgba(0, 102, 255, 0.1)' : 'transparent',
            }}
            onClick={() => !item.isLast && onSelect(item.id)}
            onMouseEnter={(e) => {
              if (!item.isLast) {
                e.currentTarget.style.backgroundColor = 'rgba(0, 102, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!item.isLast) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="breadcrumb-name">{item.name}</span>
            {config.showComponentTypes && (
              <span className="breadcrumb-type" style={{ color: '#999', fontSize: '11px' }}>
                {item.type}
              </span>
            )}
          </div>
          {!item.isLast && (
            <span className="breadcrumb-separator" style={separatorStyle}>
              /
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';
