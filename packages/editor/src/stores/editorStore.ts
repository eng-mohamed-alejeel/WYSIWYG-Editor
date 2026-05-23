/**
 * Editor Store
 *
 * Manages core editor state including project, pages, and dirty state
 * Optimized for performance with selective subscriptions
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { ComponentId, Project, Page, ComponentNode } from '@wysiwyg/core';
import { EditorStoreState, StoreActions, Collaborator } from './types';
import { eventBus } from './events';
import { middlewareManager } from './middleware';

interface EditorStore extends EditorStoreState {
  // Actions
  setProject: (project: Project | null) => Promise<void>;
  setCurrentPage: (pageId: ComponentId | null) => Promise<void>;
  setDirty: (isDirty: boolean) => void;
  setPreviewMode: (isPreview: boolean) => void;
  addCollaborator: (collaborator: Collaborator) => void;
  removeCollaborator: (collaboratorId: string) => void;
  updateCollaborator: (collaboratorId: string, updates: Partial<Collaborator>) => void;
  getComponentById: (id: ComponentId) => ComponentNode | null;
  getCurrentPage: () => Page | null;
  reset: () => void;
  hydrate: (state: Partial<EditorStoreState>) => void;
  toJSON: () => string;
}

const initialState: EditorStoreState = {
  project: null,
  currentPageId: null,
  isDirty: false,
  isPreviewMode: false,
  collaborators: [],
};

export const useEditorStore = create<EditorStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    setProject: async (project: Project | null) => {
      try {
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'setProject',
          project
        );

        set(
          (state) => ({
            ...state,
            project: processedPayload as Project | null,
            isDirty: true,
          }),
          false,
          'setProject'
        );

        await middlewareManager.executeAfter(get(), 'setProject', processedPayload);
        eventBus.emit('project:change', processedPayload);
      } catch (error) {
        console.error('Error setting project:', error);
        throw error;
      }
    },

    setCurrentPage: async (pageId: ComponentId | null) => {
      try {
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'setCurrentPage',
          pageId
        );

        set(
          (state) => ({
            ...state,
            currentPageId: processedPayload as ComponentId | null,
          }),
          false,
          'setCurrentPage'
        );

        await middlewareManager.executeAfter(get(), 'setCurrentPage', processedPayload);
        eventBus.emit('page:change', processedPayload);
      } catch (error) {
        console.error('Error setting current page:', error);
        throw error;
      }
    },

    setDirty: (isDirty: boolean) => {
      set({ isDirty }, false, 'setDirty');
      eventBus.emit('dirty:change', isDirty);
    },

    setPreviewMode: (isPreview: boolean) => {
      set({ isPreviewMode: isPreview }, false, 'setPreviewMode');
      eventBus.emit('preview:change', isPreview);
    },

    addCollaborator: (collaborator: Collaborator) => {
      set(
        (state) => ({
          collaborators: [...state.collaborators, collaborator],
        }),
        false,
        'addCollaborator'
      );
      eventBus.emit('collaborator:join', collaborator);
    },

    removeCollaborator: (collaboratorId: string) => {
      set(
        (state) => ({
          collaborators: state.collaborators.filter((c) => c.id !== collaboratorId),
        }),
        false,
        'removeCollaborator'
      );
      eventBus.emit('collaborator:leave', { id: collaboratorId });
    },

    updateCollaborator: (collaboratorId: string, updates: Partial<Collaborator>) => {
      set(
        (state) => ({
          collaborators: state.collaborators.map((c) =>
            c.id === collaboratorId ? { ...c, ...updates } : c
          ),
        }),
        false,
        'updateCollaborator'
      );
    },

    getComponentById: (id: ComponentId): ComponentNode | null => {
      const { project, currentPageId } = get();
      if (!project || !currentPageId) return null;

      const currentPage = project.pages.find((p) => p.id === currentPageId);
      if (!currentPage) return null;

      const findNode = (nodes: ComponentNode[]): ComponentNode | null => {
        for (const node of nodes) {
          if (node.id === id) return node;
          if (node.children.length > 0) {
            const found = findNode(node.children);
            if (found) return found;
          }
        }
        return null;
      };

      return findNode(currentPage.components);
    },

    getCurrentPage: (): Page | null => {
      const { project, currentPageId } = get();
      if (!project || !currentPageId) return null;
      return project.pages.find((p) => p.id === currentPageId) || null;
    },

    reset: () => {
      set(initialState, false, 'reset');
      eventBus.emit('editor:reset', null);
    },

    hydrate: (state: Partial<EditorStoreState>) => {
      set(
        (currentState) => ({
          ...currentState,
          ...state,
        }),
        false,
        'hydrate'
      );
    },

    toJSON: (): string => {
      const state = get();
      return JSON.stringify({
        project: state.project,
        currentPageId: state.currentPageId,
        isDirty: state.isDirty,
        isPreviewMode: state.isPreviewMode,
        collaborators: state.collaborators,
      });
    },
  }))
);

// Selectors with shallow equality for optimized re-renders
export const editorSelectors = {
  project: (state: EditorStoreState) => state.project,
  currentPageId: (state: EditorStoreState) => state.currentPageId,
  isDirty: (state: EditorStoreState) => state.isDirty,
  isPreviewMode: (state: EditorStoreState) => state.isPreviewMode,
  collaborators: (state: EditorStoreState) => state.collaborators,

  // Compound selectors
  currentProjectAndPage: (state: EditorStoreState) => ({
    project: state.project,
    currentPageId: state.currentPageId,
  }),

  collaboratorList: (state: EditorStoreState) =>
    state.collaborators.map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color,
      isActive: c.isActive,
    })),
};

// Custom hooks for common selections
export const useProject = () => useEditorStore(editorSelectors.project);
export const useCurrentPageId = () => useEditorStore(editorSelectors.currentPageId);
export const useIsDirty = () => useEditorStore(editorSelectors.isDirty);
export const useIsPreviewMode = () => useEditorStore(editorSelectors.isPreviewMode);
export const useCollaborators = () => useEditorStore(editorSelectors.collaborators);
export const useCurrentProjectAndPage = () =>
  useEditorStore(editorSelectors.currentProjectAndPage, shallow);
export const useCollaboratorList = () => useEditorStore(editorSelectors.collaboratorList, shallow);
