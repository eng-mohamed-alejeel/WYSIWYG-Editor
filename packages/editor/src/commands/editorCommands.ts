/**
 * Editor Action Commands
 *
 * Implements core editor commands: duplicate, delete, move, wrap, group, paste
 */

import { ComponentId, ComponentNode } from '@wysiwyg/core';
import { Command, CommandCategory } from './types';
import { commandRegistry } from './CommandRegistry';
import { commandDispatcher } from './CommandDispatcher';
import { eventBus } from '../stores/events';

/**
 * Duplicate Command
 * Duplicates one or more components
 */
const duplicateCommand: Command<
  { componentIds: ComponentId[]; targetParentId?: ComponentId; targetIndex?: number },
  { duplicatedIds: ComponentId[] }
> = {
  type: 'component:duplicate',
  category: CommandCategory.COMPONENT,
  description: 'Duplicate selected components',

  validate: (payload) => {
    return Array.isArray(payload.componentIds) && payload.componentIds.length > 0;
  },

  execute: async (payload) => {
    // Emit event before execution
    eventBus.emit('component:duplicate:start', payload);

    // In a real implementation, this would:
    // 1. Get the components to duplicate
    // 2. Create deep copies with new IDs
    // 3. Insert them at the target location
    // 4. Update the project state

    const duplicatedIds: ComponentId[] = payload.componentIds.map(
      (id) => `duplicated-${id}-${Date.now()}`
    );

    // Emit event after execution
    eventBus.emit('component:duplicate:complete', {
      originalIds: payload.componentIds,
      duplicatedIds,
    });

    return { duplicatedIds };
  },

  undo: async (payload, result) => {
    // Remove the duplicated components
    eventBus.emit('component:duplicate:undo', {
      originalIds: payload.componentIds,
      duplicatedIds: result.duplicatedIds,
    });
  },
};

/**
 * Delete Command
 * Deletes one or more components
 */
const deleteCommand: Command<
  { componentIds: ComponentId[] },
  { deletedIds: ComponentId[]; deletedNodes: ComponentNode[] }
> = {
  type: 'component:delete',
  category: CommandCategory.COMPONENT,
  description: 'Delete selected components',

  validate: (payload) => {
    return Array.isArray(payload.componentIds) && payload.componentIds.length > 0;
  },

  execute: async (payload) => {
    eventBus.emit('component:delete:start', payload);

    // In a real implementation, this would:
    // 1. Get the components to delete
    // 2. Store them for potential undo
    // 3. Remove them from the project
    // 4. Update the project state

    const deletedIds = [...payload.componentIds];
    const deletedNodes: ComponentNode[] = []; // Would be populated in real implementation

    eventBus.emit('component:delete:complete', { deletedIds });

    return { deletedIds, deletedNodes };
  },

  undo: async (payload, result) => {
    // Restore the deleted components
    eventBus.emit('component:delete:undo', {
      deletedIds: result.deletedIds,
      deletedNodes: result.deletedNodes,
    });
  },
};

/**
 * Move Command
 * Moves components to a new parent and/or index
 */
const moveCommand: Command<
  {
    componentIds: ComponentId[];
    targetParentId: ComponentId;
    targetIndex?: number;
  },
  { movedIds: ComponentId[]; previousLocations: Array<{ parentId: ComponentId; index: number }> }
> = {
  type: 'component:move',
  category: CommandCategory.COMPONENT,
  description: 'Move components to new location',

  validate: (payload) => {
    return (
      Array.isArray(payload.componentIds) &&
      payload.componentIds.length > 0 &&
      !!payload.targetParentId
    );
  },

  execute: async (payload) => {
    eventBus.emit('component:move:start', payload);

    // In a real implementation, this would:
    // 1. Get the components to move
    // 2. Store their current locations for undo
    // 3. Move them to the new location
    // 4. Update the project state

    const movedIds = [...payload.componentIds];
    const previousLocations: Array<{ parentId: ComponentId; index: number }> = [];

    eventBus.emit('component:move:complete', { movedIds });

    return { movedIds, previousLocations };
  },

  undo: async (payload, result) => {
    // Move components back to their original locations
    eventBus.emit('component:move:undo', {
      movedIds: result.movedIds,
      previousLocations: result.previousLocations,
    });
  },
};

/**
 * Wrap Command
 * Wraps components in a new parent container
 */
const wrapCommand: Command<
  {
    componentIds: ComponentId[];
    wrapperType: string;
    wrapperProps?: Record<string, unknown>;
  },
  { wrapperId: ComponentId; wrappedIds: ComponentId[] }
> = {
  type: 'component:wrap',
  category: CommandCategory.COMPONENT,
  description: 'Wrap components in a container',

  validate: (payload) => {
    return (
      Array.isArray(payload.componentIds) &&
      payload.componentIds.length > 0 &&
      !!payload.wrapperType
    );
  },

  execute: async (payload) => {
    eventBus.emit('component:wrap:start', payload);

    // In a real implementation, this would:
    // 1. Create a new wrapper component
    // 2. Move the selected components into it
    // 3. Update the project state

    const wrapperId = `wrapper-${Date.now()}`;
    const wrappedIds = [...payload.componentIds];

    eventBus.emit('component:wrap:complete', { wrapperId, wrappedIds });

    return { wrapperId, wrappedIds };
  },

  undo: async (payload, result) => {
    // Unwrap components
    eventBus.emit('component:wrap:undo', {
      wrapperId: result.wrapperId,
      wrappedIds: result.wrappedIds,
    });
  },
};

/**
 * Group Command
 * Groups components together
 */
const groupCommand: Command<
  {
    componentIds: ComponentId[];
    groupName?: string;
    groupId?: ComponentId;
  },
  { groupId: ComponentId; groupedIds: ComponentId[] }
> = {
  type: 'component:group',
  category: CommandCategory.COMPONENT,
  description: 'Group components together',

  validate: (payload) => {
    return Array.isArray(payload.componentIds) && payload.componentIds.length > 0;
  },

  execute: async (payload) => {
    eventBus.emit('component:group:start', payload);

    // In a real implementation, this would:
    // 1. Create a new group component
    // 2. Move the selected components into it
    // 3. Update the project state

    const groupId = payload.groupId || `group-${Date.now()}`;
    const groupedIds = [...payload.componentIds];

    eventBus.emit('component:group:complete', { groupId, groupedIds });

    return { groupId, groupedIds };
  },

  undo: async (payload, result) => {
    // Ungroup components
    eventBus.emit('component:group:undo', {
      groupId: result.groupId,
      groupedIds: result.groupedIds,
    });
  },
};

/**
 * Paste Command
 * Pastes components from clipboard
 */
const pasteCommand: Command<
  {
    items: unknown[];
    targetParentId?: ComponentId;
    targetIndex?: number;
  },
  { pastedIds: ComponentId[] }
> = {
  type: 'component:paste',
  category: CommandCategory.CLIPBOARD,
  description: 'Paste components from clipboard',

  validate: (payload) => {
    return Array.isArray(payload.items) && payload.items.length > 0;
  },

  execute: async (payload) => {
    eventBus.emit('component:paste:start', payload);

    // In a real implementation, this would:
    // 1. Get items from clipboard
    // 2. Create new components with new IDs
    // 3. Insert them at the target location
    // 4. Update the project state

    const pastedIds: ComponentId[] = payload.items.map(
      (_, index) => `pasted-${Date.now()}-${index}`
    );

    eventBus.emit('component:paste:complete', { pastedIds });

    return { pastedIds };
  },

  undo: async (payload, result) => {
    // Remove pasted components
    eventBus.emit('component:paste:undo', { pastedIds: result.pastedIds });
  },
};

/**
 * Register all editor commands
 */
export function registerEditorCommands(): void {
  commandRegistry.register(duplicateCommand);
  commandRegistry.register(deleteCommand);
  commandRegistry.register(moveCommand);
  commandRegistry.register(wrapCommand);
  commandRegistry.register(groupCommand);
  commandRegistry.register(pasteCommand);
}

/**
 * Export command dispatchers for convenience
 */
export const editorCommands = {
  duplicate: (payload: Parameters<typeof duplicateCommand.execute>[0]) =>
    commandDispatcher.execute(duplicateCommand.type, payload),
  delete: (payload: Parameters<typeof deleteCommand.execute>[0]) =>
    commandDispatcher.execute(deleteCommand.type, payload),
  move: (payload: Parameters<typeof moveCommand.execute>[0]) =>
    commandDispatcher.execute(moveCommand.type, payload),
  wrap: (payload: Parameters<typeof wrapCommand.execute>[0]) =>
    commandDispatcher.execute(wrapCommand.type, payload),
  group: (payload: Parameters<typeof groupCommand.execute>[0]) =>
    commandDispatcher.execute(groupCommand.type, payload),
  paste: (payload: Parameters<typeof pasteCommand.execute>[0]) =>
    commandDispatcher.execute(pasteCommand.type, payload),
};
