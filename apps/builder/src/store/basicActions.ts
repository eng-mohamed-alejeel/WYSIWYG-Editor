export const basicActions = (set: any, get: any) => ({
  setProject: (project: any) => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(JSON.stringify(project));
    set({
      project,
      isDirty: true,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      canUndo: true,
      canRedo: false
    });
  },
  setCurrentPageId: (pageId: any) => set({ currentPageId: pageId }),
  setSelectedIds: (ids: any) => set({ selectedIds: ids }),
  setHoveredId: (id: any) => set({ hoveredId: id }),
  setCurrentBreakpoint: (breakpoint: any) => set({ currentBreakpoint: breakpoint }),
  setZoom: (zoom: any) => set({ zoom }),
  setIsDirty: (isDirty: any) => set({ isDirty }),
  setIsPreviewMode: (isPreviewMode: any) => set({ isPreviewMode })
});
