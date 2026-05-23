import { BaseCommand } from './ComponentCommands';
import { useBuilderStore } from '../store/store';

// Update project settings command
export class UpdateProjectSettingsCommand extends BaseCommand {
  type = 'UPDATE_PROJECT_SETTINGS';
  description = 'Update project settings';

  constructor(
    private settings: Record<string, any>,
    private previousSettings: Record<string, any>
  ) {
    super();
  }

  execute() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    setProject({
      ...project,
      settings: this.settings,
    });
  }

  undo() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    setProject({
      ...project,
      settings: this.previousSettings,
    });
  }
}

// Update project styles command
export class UpdateProjectStylesCommand extends BaseCommand {
  type = 'UPDATE_PROJECT_STYLES';
  description = 'Update project styles';

  constructor(
    private styles: Record<string, any>,
    private previousStyles: Record<string, any>
  ) {
    super();
  }

  execute() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    setProject({
      ...project,
      styles: this.styles,
    });
  }

  undo() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    setProject({
      ...project,
      styles: this.previousStyles,
    });
  }
}

// Add page command
export class AddPageCommand extends BaseCommand {
  type = 'ADD_PAGE';
  description = 'Add page';

  constructor(
    private page: any,
    private pages: any[]
  ) {
    super();
  }

  execute() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    setProject({
      ...project,
      pages: [...this.pages, this.page],
    });
  }

  undo() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    setProject({
      ...project,
      pages: this.pages,
    });
  }
}

// Delete page command
export class DeletePageCommand extends BaseCommand {
  type = 'DELETE_PAGE';
  description = 'Delete page';

  constructor(
    private pageId: string,
    private pages: any[],
    private deletedPage: any
  ) {
    super();
  }

  execute() {
    const { setProject, setCurrentPageId } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    const newPages = this.pages.filter((p: any) => p.id !== this.pageId);
    setProject({
      ...project,
      pages: newPages,
    });

    // If we deleted the current page, switch to another one
    const { currentPageId } = useBuilderStore.getState();
    if (currentPageId === this.pageId && newPages.length > 0) {
      setCurrentPageId(newPages[0].id);
    }
  }

  undo() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    setProject({
      ...project,
      pages: this.pages,
    });
  }
}

// Update page command
export class UpdatePageCommand extends BaseCommand {
  type = 'UPDATE_PAGE';
  description = 'Update page';

  constructor(
    private pageId: string,
    private updates: Partial<any>,
    private previousValues: Partial<any>
  ) {
    super();
  }

  execute() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    const newPages = project.pages.map((page: any) =>
      page.id === this.pageId ? { ...page, ...this.updates } : page
    );
    setProject({
      ...project,
      pages: newPages,
    });
  }

  undo() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    const newPages = project.pages.map((page: any) =>
      page.id === this.pageId ? { ...page, ...this.previousValues } : page
    );
    setProject({
      ...project,
      pages: newPages,
    });
  }
}

// Reorder pages command
export class ReorderPagesCommand extends BaseCommand {
  type = 'REORDER_PAGES';
  description = 'Reorder pages';

  constructor(
    private pages: any[],
    private previousOrder: any[]
  ) {
    super();
  }

  execute() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    setProject({
      ...project,
      pages: this.pages,
    });
  }

  undo() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    setProject({
      ...project,
      pages: this.previousOrder,
    });
  }
}

// Duplicate page command
export class DuplicatePageCommand extends BaseCommand {
  type = 'DUPLICATE_PAGE';
  description = 'Duplicate page';

  constructor(
    private sourcePageId: string,
    private duplicatedPage: any
  ) {
    super();
  }

  execute() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    setProject({
      ...project,
      pages: [...project.pages, this.duplicatedPage],
    });
  }

  undo() {
    const { setProject } = useBuilderStore.getState();
    const { project } = useBuilderStore.getState();
    setProject({
      ...project,
      pages: project.pages.filter((p: any) => p.id !== this.duplicatedPage.id),
    });
  }
}
