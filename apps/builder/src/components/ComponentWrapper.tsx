import React, { useRef, useState } from 'react';
import { ComponentNode } from '@wysiwyg/core';
import { useBuilderStore } from '../store/store';
import { useDragDrop } from './DragDropProvider';

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

interface ComponentWrapperProps {
  component: ComponentNode;
  children: React.ReactNode;
  isSelected?: boolean;
  isHovered?: boolean;
  isPreview?: boolean;
}

export const ComponentWrapper: React.FC<ComponentWrapperProps> = ({
  component,
  children,
  isSelected = false,
  isHovered = false,
  isPreview = false
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setSelectedIds, setHoveredId } = useBuilderStore();
  const { isDragging, dropTargetId, dropPosition, startDrag, endDrag, setDropTarget, handleDrop } = useDragDrop();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds([component.id]);
  };

  const handleMouseEnter = () => {
    setHoveredId(component.id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    startDrag(component);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDragging) return;

    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;

    const y = e.clientY - rect.top;
    const height = rect.height;

    let position: 'before' | 'after' | 'inside' = 'inside';

    if (y < height * 0.25) {
      position = 'before';
    } else if (y > height * 0.75) {
      position = 'after';
    }

    setDropTarget(component.id, position);
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDropWrapper = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleDrop();
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = wrapperRef.current?.offsetWidth || 0;
    const startHeight = wrapperRef.current?.offsetHeight || 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!wrapperRef.current) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('e')) {
        newWidth = startWidth + deltaX;
      }
      if (direction.includes('w')) {
        newWidth = startWidth - deltaX;
      }
      if (direction.includes('s')) {
        newHeight = startHeight + deltaY;
      }
      if (direction.includes('n')) {
        newHeight = startHeight - deltaY;
      }

      wrapperRef.current.style.width = `${Math.max(50, newWidth)}px`;
      wrapperRef.current.style.height = `${Math.max(50, newHeight)}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getDropPositionClass = () => {
    if (!isDragOver || dropTargetId !== component.id) return '';
    switch (dropPosition) {
      case 'before':
        return 'drag-over-before';
      case 'after':
        return 'drag-over-after';
      case 'inside':
        return 'drag-over-inside';
      default:
        return '';
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative ${isSelected ? 'component-selected' : ''} ${
        isHovered && !isSelected ? 'component-hovered' : ''
      } ${getDropPositionClass()} ${isDragging ? 'dragging' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropWrapper}
      draggable={!isPreview}
      data-component-id={component.id}
      style={convertStylesToCSS({
        width: component.styles?.width || 'auto',
        height: component.styles?.height || 'auto',
        ...component.styles
      })}
    >
      {children}

      {isSelected && !isPreview && (
        <>
          {/* Resize handles */}
          <div
            className="resize-handle resize-handle-nw"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div
            className="resize-handle resize-handle-ne"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className="resize-handle resize-handle-sw"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            className="resize-handle resize-handle-se"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />

          {/* Component label */}
          <div className="absolute -top-6 left-0 bg-primary-600 text-white text-xs px-2 py-1 rounded">
            {component.type}
          </div>
        </>
      )}
    </div>
  );
};

export default ComponentWrapper;
