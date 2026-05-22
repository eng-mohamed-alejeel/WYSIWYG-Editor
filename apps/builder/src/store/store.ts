import { create } from 'zustand';
import { BuilderState } from './types';
import { basicActions } from './basicActions';
import { undoRedoActions } from './undoRedoActions';
import { componentActions } from './componentActions';

export const useBuilderStore = create<BuilderState>((set, get) => ({
  // Initial state
  project: null,
  currentPageId: null,
  selectedIds: [],
  hoveredId: null,
  currentBreakpoint: 'desktop',
  zoom: 1,
  isDirty: false,
  isPreviewMode: false,
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,

  // Spread all action modules
  ...basicActions(set, get),
  ...undoRedoActions(set, get),
  ...componentActions(set, get)
}));
