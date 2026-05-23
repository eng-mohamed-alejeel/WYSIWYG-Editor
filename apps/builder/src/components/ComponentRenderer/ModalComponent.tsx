import React from 'react';
import { ComponentNode } from '@wysiwyg/core';

interface ModalComponentProps {
  component: ComponentNode;
  isPreview?: boolean;
  convertStylesToCSS: (styles?: Record<string, string | number>) => React.CSSProperties;
  renderChild: (child: ComponentNode) => React.ReactNode;
}

export const ModalComponent: React.FC<ModalComponentProps> = ({
  component,
  renderChild,
  convertStylesToCSS,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div style={convertStylesToCSS(component.styles)}>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: '0.5rem 1rem',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {component.props?.triggerText || 'Open Modal'}
      </button>
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.25rem',
              }}
            >
              ×
            </button>
            {component.children.map((child) => (
              <div key={child.id}>{renderChild(child)}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
