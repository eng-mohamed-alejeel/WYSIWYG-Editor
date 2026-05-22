import { ComponentNode, ComponentId, Command } from '@wysiwyg/core';
import { useBuilderStore } from '../store/store';

// Base command class
export abstract class BaseCommand implements Command {
  abstract type: string;
  abstract execute(): void;
  abstract undo(): void;
  abstract description: string;

  timestamp: number = Date.now();
}

// Add component command
export class AddComponentCommand extends BaseCommand {
  type = 'ADD_COMPONENT';
  description = 'Add component';

  constructor(
    private component: ComponentNode,
    private targetId: ComponentId | null,
    private position: 'before' | 'after' | 'inside' | null = null
  ) {
    super();
  }

  execute() {
    const { addComponent } = useBuilderStore.getState();
    addComponent(this.component);
  }

  undo() {
    const { deleteComponent } = useBuilderStore.getState();
    deleteComponent(this.component.id);
  }
}

// Update component command
export class UpdateComponentCommand extends BaseCommand {
  type = 'UPDATE_COMPONENT';
  description = 'Update component';

  constructor(
    private componentId: ComponentId,
    private updates: Partial<ComponentNode>,
    private previousValues: Partial<ComponentNode>
  ) {
    super();
  }

  execute() {
    const { updateComponent } = useBuilderStore.getState();
    updateComponent(this.componentId, this.updates);
  }

  undo() {
    const { updateComponent } = useBuilderStore.getState();
    updateComponent(this.componentId, this.previousValues);
  }
}

// Delete component command
export class DeleteComponentCommand extends BaseCommand {
  type = 'DELETE_COMPONENT';
  description = 'Delete component';

  constructor(
    private component: ComponentNode,
    private parentId: ComponentId | null,
    private position: number
  ) {
    super();
  }

  execute() {
    const { deleteComponent } = useBuilderStore.getState();
    deleteComponent(this.component.id);
  }

  undo() {
    const { addComponent } = useBuilderStore.getState();
    addComponent(this.component);
  }
}

// Duplicate component command
export class DuplicateComponentCommand extends BaseCommand {
  type = 'DUPLICATE_COMPONENT';
  description = 'Duplicate component';

  constructor(
    private sourceId: ComponentId,
    private duplicatedId: ComponentId
  ) {
    super();
  }

  execute() {
    const { duplicateComponent } = useBuilderStore.getState();
    duplicateComponent(this.sourceId);
  }

  undo() {
    const { deleteComponent } = useBuilderStore.getState();
    deleteComponent(this.duplicatedId);
  }
}

// Move component command
export class MoveComponentCommand extends BaseCommand {
  type = 'MOVE_COMPONENT';
  description = 'Move component';

  constructor(
    private componentId: ComponentId,
    private fromParentId: ComponentId | null,
    private fromPosition: number,
    private toParentId: ComponentId | null,
    private toPosition: number
  ) {
    super();
  }

  execute() {
    const { moveComponent } = useBuilderStore.getState();
    moveComponent(
      this.componentId,
      this.toParentId || this.componentId,
      'inside'
    );
  }

  undo() {
    const { moveComponent } = useBuilderStore.getState();
    moveComponent(
      this.componentId,
      this.fromParentId || this.componentId,
      'inside'
    );
  }
}

// Batch command for multiple operations
export class BatchCommand extends BaseCommand {
  type = 'BATCH_COMMAND';
  description = 'Batch operation';

  constructor(private commands: BaseCommand[]) {
    super();
  }

  execute() {
    this.commands.forEach(command => command.execute());
  }

  undo() {
    [...this.commands].reverse().forEach(command => command.undo());
  }
}

// Style update command
export class UpdateStyleCommand extends BaseCommand {
  type = 'UPDATE_STYLE';
  description = 'Update style';

  constructor(
    private componentId: ComponentId,
    private styleUpdates: Record<string, any>,
    private previousStyles: Record<string, any>
  ) {
    super();
  }

  execute() {
    const { updateComponent } = useBuilderStore.getState();
    updateComponent(this.componentId, {
      styles: this.styleUpdates
    });
  }

  undo() {
    const { updateComponent } = useBuilderStore.getState();
    updateComponent(this.componentId, {
      styles: this.previousStyles
    });
  }
}

// Prop update command
export class UpdatePropCommand extends BaseCommand {
  type = 'UPDATE_PROP';
  description = 'Update property';

  constructor(
    private componentId: ComponentId,
    private propUpdates: Record<string, any>,
    private previousProps: Record<string, any>
  ) {
    super();
  }

  execute() {
    const { updateComponent } = useBuilderStore.getState();
    updateComponent(this.componentId, {
      props: this.propUpdates
    });
  }

  undo() {
    const { updateComponent } = useBuilderStore.getState();
    updateComponent(this.componentId, {
      props: this.previousProps
    });
  }
}
