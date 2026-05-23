export const undoRedoActions = (set: any, get: any) => ({
  undo: () => {
    const state = get();
    if (state.historyIndex <= 0) return;

    const newIndex = state.historyIndex - 1;
    const previousProject = JSON.parse(state.history[newIndex]);

    set({
      project: previousProject,
      historyIndex: newIndex,
      canUndo: newIndex > 0,
      canRedo: true,
    });
  },

  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1) return;

    const newIndex = state.historyIndex + 1;
    const nextProject = JSON.parse(state.history[newIndex]);

    set({
      project: nextProject,
      historyIndex: newIndex,
      canUndo: true,
      canRedo: newIndex < state.history.length - 1,
    });
  },

  clearHistory: () => {
    const state = get();
    if (state.project) {
      set({
        history: [JSON.stringify(state.project)],
        historyIndex: 0,
        canUndo: false,
        canRedo: false,
      });
    }
  },
});
