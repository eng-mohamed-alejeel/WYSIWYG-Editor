import { create } from 'zustand';
import { ComponentNode, ComponentId } from '@wysiwyg/core';

interface BuilderState {
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

  // Actions
  setProject: (project: any) => void;
  setCurrentPageId: (pageId: ComponentId | null) => void;
  setSelectedIds: (ids: ComponentId[]) => void;
  setHoveredId: (id: ComponentId | null) => void;
  setCurrentBreakpoint: (breakpoint: 'desktop' | 'tablet' | 'mobile') => void;
  setZoom: (zoom: number) => void;
  setIsDirty: (isDirty: boolean) => void;
  setIsPreviewMode: (isPreviewMode: boolean) => void;

  // Component actions
  addComponent: (component: ComponentNode) => void;
  updateComponent: (id: ComponentId, updates: Partial<ComponentNode>) => void;
  deleteComponent: (id: ComponentId) => void;
  duplicateComponent: (id: ComponentId) => void;
  moveComponent: (id: ComponentId, targetId: ComponentId, position: 'before' | 'after' | 'inside') => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Actions
  setProject: (project) => set({ project, isDirty: true }),
  setCurrentPageId: (pageId) => set({ currentPageId: pageId }),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  setHoveredId: (id) => set({ hoveredId: id }),
  setCurrentBreakpoint: (breakpoint) => set({ currentBreakpoint: breakpoint }),
  setZoom: (zoom) => set({ zoom }),
  setIsDirty: (isDirty) => set({ isDirty }),
  setIsPreviewMode: (isPreviewMode) => set({ isPreviewMode }),

  // Component actions
  addComponent: (component) => set((state) => {
    if (!state.project || !state.currentPageId) return state;

    const updatedPages = state.project.pages.map((page: any) => {
      if (page.id === state.currentPageId) {
        return {
          ...page,
          components: [...page.components, component]
        };
      }
      return page;
    });

    return {
      project: { ...state.project, pages: updatedPages },
      isDirty: true
    };
  }),

  updateComponent: (id, updates) => set((state) => {
    if (!state.project) return state;

    const updateNode = (nodes: ComponentNode[]): ComponentNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, ...updates };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };

    const updatedPages = state.project.pages.map((page: any) => ({
      ...page,
      components: updateNode(page.components)
    }));

    return {
      project: { ...state.project, pages: updatedPages },
      isDirty: true
    };
  }),

  deleteComponent: (id) => set((state) => {
    if (!state.project) return state;

    const deleteNode = (nodes: ComponentNode[]): ComponentNode[] => {
      return nodes.filter(node => {
        if (node.id === id) return false;
        if (node.children.length > 0) {
          node.children = deleteNode(node.children);
        }
        return true;
      });
    };

    const updatedPages = state.project.pages.map((page: any) => ({
      ...page,
      components: deleteNode(page.components)
    }));

    return {
      project: { ...state.project, pages: updatedPages },
      selectedIds: state.selectedIds.filter(selectedId => selectedId !== id),
      isDirty: true
    };
  }),

  duplicateComponent: (id) => set((state) => {
    if (!state.project) return state;

    const findAndDuplicate = (nodes: ComponentNode[]): ComponentNode[] => {
      return nodes.flatMap(node => {
        if (node.id === id) {
          const duplicated = {
            ...node,
            id: `${id}_copy_${Date.now()}`
          };
          return [node, duplicated];
        }
        if (node.children.length > 0) {
          return [{ ...node, children: findAndDuplicate(node.children) }];
        }
        return [node];
      });
    };

    const updatedPages = state.project.pages.map((page: any) => ({
      ...page,
      components: findAndDuplicate(page.components)
    }));

    return {
      project: { ...state.project, pages: updatedPages },
      isDirty: true
    };
  }),

  moveComponent: (id, targetId, position) => set((state) => {
    if (!state.project) return state;

    // Prevent moving a component into itself or its descendants
    const isDescendant = (node: ComponentNode, targetId: ComponentId): boolean => {
      if (node.id === targetId) return true;
      return node.children.some(child => isDescendant(child, targetId));
    };

    const currentPage = state.project.pages.find((page: any) => page.id === state.currentPageId);
    if (!currentPage) return state;

    const sourceNode = currentPage.components.find((node: ComponentNode) => node.id === id);
    if (!sourceNode) return state;

    if (isDescendant(sourceNode, targetId)) {
      console.warn('Cannot move component into itself or its descendants');
      return state;
    }

    const findAndRemove = (nodes: ComponentNode[]): { node: ComponentNode | null, remaining: ComponentNode[] } => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
          return {
            node: nodes[i],
            remaining: [...nodes.slice(0, i), ...nodes.slice(i + 1)]
          };
        }
        if (nodes[i].children.length > 0) {
          const result = findAndRemove(nodes[i].children);
          if (result.node) {
            return {
              node: result.node,
              remaining: [
                ...nodes.slice(0, i),
                { ...nodes[i], children: result.remaining },
                ...nodes.slice(i + 1)
              ]
            };
          }
        }
      }
      return { node: null, remaining: nodes };
    };

    const insertNode = (nodes: ComponentNode[], node: ComponentNode, targetId: ComponentId, position: 'before' | 'after' | 'inside'): ComponentNode[] => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === targetId) {
          if (position === 'before') {
            return [...nodes.slice(0, i), node, ...nodes.slice(i)];
          } else if (position === 'after') {
            return [...nodes.slice(0, i + 1), node, ...nodes.slice(i + 1)];
          } else {
            return [
              ...nodes.slice(0, i),
              { ...nodes[i], children: [...nodes[i].children, node] },
              ...nodes.slice(i + 1)
            ];
          }
        }
        if (nodes[i].children.length > 0) {
          return [
            ...nodes.slice(0, i),
            { ...nodes[i], children: insertNode(nodes[i].children, node, targetId, position) },
            ...nodes.slice(i + 1)
          ];
        }
      }
      return [...nodes, node];
    };

    const { node: movedNode, remaining } = findAndRemove(currentPage.components);

    if (!movedNode) return state;

    const updatedPages = state.project.pages.map((page: any) => {
      if (page.id === state.currentPageId) {
        return {
          ...page,
          components: insertNode(remaining, movedNode, targetId, position)
        };
      }
      return page;
    });

    return {
      project: { ...state.project, pages: updatedPages },
      isDirty: true
    };
  })
}));
