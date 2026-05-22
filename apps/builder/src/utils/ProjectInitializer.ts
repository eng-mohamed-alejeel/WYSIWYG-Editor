export const createInitialProject = () => {
  const pageId = 'page_1';

  return {
    id: 'project_1',
    name: 'Untitled Project',
    pages: [
      {
        id: pageId,
        name: 'Page 1',
        components: []
      }
    ]
  };
};

export const initializeBuilderStore = (setProject: (project: any) => void, setCurrentPageId: (id: string) => void) => {
  const project = createInitialProject();
  setProject(project);
  setCurrentPageId(project.pages[0].id);
};
