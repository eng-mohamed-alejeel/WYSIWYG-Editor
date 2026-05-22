import React, { useRef, useEffect } from 'react';
import { useBuilderStore } from '../store/store';

interface CanvasProps {
  children: React.ReactNode;
}

export const Canvas: React.FC<CanvasProps> = ({ children }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { currentBreakpoint, zoom } = useBuilderStore();

  const getBreakpointWidth = () => {
    switch (currentBreakpoint) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      case 'desktop':
      default:
        return '100%';
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.transform = `scale(${zoom})`;
    }
  }, [zoom]);

  return (
    <div className="editor-canvas flex-1 overflow-auto bg-gray-100">
      <div
        ref={canvasRef}
        className="editor-viewport mx-auto bg-white shadow-lg transition-all duration-300"
        style={{
          width: getBreakpointWidth(),
          maxWidth: '1200px',
          minHeight: '100%',
          transformOrigin: 'top center'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Canvas;
