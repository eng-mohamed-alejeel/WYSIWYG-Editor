import { ComponentNode, ComponentId } from '@wysiwyg/core';

export const componentActions = (set: any, get: any) => ({
  addComponent: (component: ComponentNode) =>
    set((state: any) => {
      if (!state.project || !state.currentPageId) return state;

      const updatedPages = state.project.pages.map((page: any) => {
        if (page.id === state.currentPageId) {
          return {
            ...page,
            components: [...page.components, component],
          };
        }
        return page;
      });

      const newProject = { ...state.project, pages: updatedPages };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.stringify(newProject));

      return {
        project: newProject,
        selectedIds: [component.id],
        isDirty: true,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      };
    }),

  updateComponent: (id: ComponentId, updates: Partial<ComponentNode>) =>
    set((state: any) => {
      if (!state.project) return state;

      const updateNode = (nodes: ComponentNode[]): ComponentNode[] => {
        return nodes.map((node) => {
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
        components: updateNode(page.components),
      }));

      const newProject = { ...state.project, pages: updatedPages };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.stringify(newProject));

      return {
        project: newProject,
        isDirty: true,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      };
    }),

  deleteComponent: (id: ComponentId) =>
    set((state: any) => {
      if (!state.project) return state;

      const deleteNode = (nodes: ComponentNode[]): ComponentNode[] => {
        return nodes.filter((node) => {
          if (node.id === id) return false;
          if (node.children.length > 0) {
            return { ...node, children: deleteNode(node.children) };
          }
          return true;
        });
      };

      const updatedPages = state.project.pages.map((page: any) => ({
        ...page,
        components: deleteNode(page.components),
      }));

      const newProject = { ...state.project, pages: updatedPages };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.stringify(newProject));

      return {
        project: newProject,
        selectedIds: state.selectedIds.filter((selectedId: ComponentId) => selectedId !== id),
        isDirty: true,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      };
    }),

  duplicateComponent: (id: ComponentId) =>
    set((state: any) => {
      if (!state.project) return state;

      const findAndDuplicate = (nodes: ComponentNode[]): ComponentNode[] => {
        return nodes
          .map((node) => {
            if (node.id === id) {
              const duplicate = {
                ...node,
                id: `${node.id}_copy_${Date.now()}`,
                children: node.children.map((child) => ({
                  ...child,
                  id: `${child.id}_copy_${Date.now()}`,
                })),
              };
              return [node, duplicate];
            }
            if (node.children.length > 0) {
              return { ...node, children: findAndDuplicate(node.children) };
            }
            return node;
          })
          .flat();
      };

      const updatedPages = state.project.pages.map((page: any) => ({
        ...page,
        components: findAndDuplicate(page.components),
      }));

      const newProject = { ...state.project, pages: updatedPages };
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.stringify(newProject));

      return {
        project: newProject,
        isDirty: true,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      };
    }),

  moveComponent: (
    id: ComponentId,
    targetId: ComponentId,
    position: 'before' | 'after' | 'inside'
  ) =>
    set((state: any) => {
      if (!state.project) return state;

      let componentToMove: ComponentNode | null = null;

      const removeComponent = (nodes: ComponentNode[]): ComponentNode[] => {
        return nodes.filter((node) => {
          if (node.id === id) {
            componentToMove = node;
            return false;
          }
          if (node.children.length > 0) {
            return { ...node, children: removeComponent(node.children) };
          }
          return true;
        });
      };

      const insertComponent = (nodes: ComponentNode[]): ComponentNode[] => {
        return nodes
          .map((node) => {
            if (node.id === targetId && componentToMove) {
              if (position === 'inside') {
                return { ...node, children: [...node.children, componentToMove] };
              }
              if (position === 'before') {
                return [componentToMove, node];
              }
              if (position === 'after') {
                return [node, componentToMove];
              }
            }
            if (node.children.length > 0) {
              return { ...node, children: insertComponent(node.children) };
            }
            return node;
          })
          .flat();
      };

      let updatedComponents = state.project.pages[0].components;
      updatedComponents = removeComponent(updatedComponents);
      updatedComponents = insertComponent(updatedComponents);

      const newProject = {
        ...state.project,
        pages: state.project.pages.map((page: any) => ({
          ...page,
          components: updatedComponents,
        })),
      };

      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.stringify(newProject));

      return {
        project: newProject,
        isDirty: true,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      };
    }),
});
