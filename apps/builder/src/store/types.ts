import { ComponentNode, ComponentId } from '@wysiwyg/core';

export interface BuilderState {
  // Project state
  project: any;
  currentPageId: ComponentId | null;

  // Selection state
  selectedIds: ComponentId[];
  hoveredId: ComponentId | null;

  // Viewport state
  currentBreakpoint: 'desktop' | 'tablet' | 'mobile';
  zoom: number;

  // Editor state
  isDirty: boolean;
  isPreviewMode: boolean;

  // Undo/Redo state
  history: any[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  setProject: (project: any) => void;
  setCurrentPageId: (pageId: ComponentId | null) => void;
  setSelectedIds: (ids: ComponentId[]) => void;
  setHoveredId: (id: ComponentId | null) => void;
  setCurrentBreakpoint: (breakpoint: 'desktop' | 'tablet' | 'mobile') => void;
  setZoom: (zoom: number) => void;
  setIsDirty: (isDirty: boolean) => void;
  setIsPreviewMode: (isPreviewMode: boolean) => void;

  // Undo/Redo actions
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;

  // Component actions
  addComponent: (component: ComponentNode) => void;
  updateComponent: (id: ComponentId, updates: Partial<ComponentNode>) => void;
  deleteComponent: (id: ComponentId) => void;
  duplicateComponent: (id: ComponentId) => void;
  moveComponent: (id: ComponentId, targetId: ComponentId, position: 'before' | 'after' | 'inside') => void;
}
