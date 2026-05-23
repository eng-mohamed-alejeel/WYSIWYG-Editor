import React, { createContext, useContext, useState, useCallback } from 'react';
import { ComponentNode, ComponentId } from '@wysiwyg/core';
import { useBuilderStore } from '../store/store';

interface DragDropContextType {
  isDragging: boolean;
  draggedComponent: ComponentNode | null;
  dropTargetId: ComponentId | null;
  dropPosition: 'before' | 'after' | 'inside' | null;
  startDrag: (component: ComponentNode) => void;
  endDrag: () => void;
  setDropTarget: (
    targetId: ComponentId | null,
    position: 'before' | 'after' | 'inside' | null
  ) => void;
  handleDrop: () => void;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: React.ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<ComponentNode | null>(null);
  const [dropTargetId, setDropTargetId] = useState<ComponentId | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);

  const { moveComponent } = useBuilderStore();

  const startDrag = useCallback((component: ComponentNode) => {
    setIsDragging(true);
    setDraggedComponent(component);
  }, []);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    setDraggedComponent(null);
    setDropTargetId(null);
    setDropPosition(null);
  }, []);

  const setDropTarget = useCallback(
    (targetId: ComponentId | null, position: 'before' | 'after' | 'inside' | null) => {
      setDropTargetId(targetId);
      setDropPosition(position);
    },
    []
  );

  const handleDrop = useCallback(() => {
    if (!draggedComponent || !dropTargetId || !dropPosition) return;

    // Prevent dropping on itself
    if (draggedComponent.id === dropTargetId) {
      endDrag();
      return;
    }

    moveComponent(draggedComponent.id, dropTargetId, dropPosition);

    endDrag();
  }, [draggedComponent, dropTargetId, dropPosition, moveComponent, endDrag]);

  const value = {
    isDragging,
    draggedComponent,
    dropTargetId,
    dropPosition,
    startDrag,
    endDrag,
    setDropTarget,
    handleDrop,
  };

  return <DragDropContext.Provider value={value}>{children}</DragDropContext.Provider>;
};

export default DragDropProvider;
