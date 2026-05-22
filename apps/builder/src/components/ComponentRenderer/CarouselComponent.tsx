import React from 'react';
import { ComponentNode } from '@wysiwyg/core';

interface CarouselComponentProps {
  component: ComponentNode;
  isPreview?: boolean;
  convertStylesToCSS: (styles?: Record<string, string | number>) => React.CSSProperties;
  renderChild: (child: ComponentNode) => React.ReactNode;
}

export const CarouselComponent: React.FC<CarouselComponentProps> = ({ component, renderChild, convertStylesToCSS }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % component.children.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + component.children.length) % component.children.length);

  return (
    <div style={convertStylesToCSS(component.styles)}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.3s ease-in-out',
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {component.children.map(child => (
            <div key={child.id} style={{ flex: '0 0 100%', padding: '0.5rem' }}>
              {renderChild(child)}
            </div>
          ))}
        </div>
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '2rem',
            height: '2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '2rem',
            height: '2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          ▶
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
        {component.children.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              background: index === currentIndex ? '#3b82f6' : '#d1d5db',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          />
        ))}
      </div>
    </div>
  );
};
