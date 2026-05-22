export const createInitialProject = () => {
  const pageId = 'page_1';

  return {
    id: 'project_1',
    name: 'Untitled Project',
    pages: [
      {
        id: pageId,
        name: 'Page 1',
        components: [
          {
            id: 'hero_section',
            type: 'section',
            props: {},
            styles: {
              padding: '4rem 2rem',
              backgroundColor: '#f9fafb'
            },
            children: [
              {
                id: 'hero_heading',
                type: 'heading',
                props: {
                  level: 1,
                  text: 'Welcome to WYSIWYG Builder'
                },
                styles: {
                  marginBottom: '1rem'
                },
                children: []
              },
              {
                id: 'hero_paragraph',
                type: 'paragraph',
                props: {
                  text: 'Start building your components by dragging and dropping items from the left sidebar.'
                },
                styles: {
                  color: '#6b7280'
                },
                children: []
              }
            ]
          }
        ]
      }
    ]
  };
};

export const initializeBuilderStore = (setProject: (project: any) => void, setCurrentPageId: (id: string) => void) => {
  const project = createInitialProject();
  setProject(project);
  setCurrentPageId(project.pages[0].id);
};
