/**
 * Command Bus Configuration
 *
 * Default keyboard shortcuts and command initialization
 */

import { keyboardShortcutsManager } from './KeyboardShortcutsManager';
import { registerEditorCommands } from './editorCommands';
import { CommandCategory } from './types';

/**
 * Default keyboard shortcuts configuration
 */
const defaultShortcuts = [
  // Component operations
  {
    command: 'component:duplicate',
    key: 'd',
    ctrl: true,
    description: 'Duplicate selected components',
    category: CommandCategory.COMPONENT,
  },
  {
    command: 'component:delete',
    key: 'Delete',
    description: 'Delete selected components',
    category: CommandCategory.COMPONENT,
  },
  {
    command: 'component:group',
    key: 'g',
    ctrl: true,
    description: 'Group selected components',
    category: CommandCategory.COMPONENT,
  },
  {
    command: 'component:wrap',
    key: 'w',
    ctrl: true,
    description: 'Wrap selected components',
    category: CommandCategory.COMPONENT,
  },
  {
    command: 'component:paste',
    key: 'v',
    ctrl: true,
    description: 'Paste from clipboard',
    category: CommandCategory.CLIPBOARD,
  },
  // History operations
  {
    command: 'history:undo',
    key: 'z',
    ctrl: true,
    description: 'Undo last action',
    category: CommandCategory.HISTORY,
  },
  {
    command: 'history:redo',
    key: 'z',
    ctrl: true,
    shift: true,
    description: 'Redo last action',
    category: CommandCategory.HISTORY,
  },
  // Selection operations
  {
    command: 'selection:selectAll',
    key: 'a',
    ctrl: true,
    description: 'Select all components',
    category: CommandCategory.SELECTION,
  },
  {
    command: 'selection:deselectAll',
    key: 'Escape',
    description: 'Deselect all components',
    category: CommandCategory.SELECTION,
  },
];

/**
 * Initialize command bus with default configuration
 */
export function initializeCommandBus(): void {
  // Register all editor commands
  registerEditorCommands();

  // Register default keyboard shortcuts
  defaultShortcuts.forEach((shortcut) => {
    keyboardShortcutsManager.register(shortcut);
  });
}

/**
 * Get all default shortcuts
 */
export function getDefaultShortcuts() {
  return defaultShortcuts;
}

/**
 * Register custom shortcuts
 */
export function registerCustomShortcuts(shortcuts: typeof defaultShortcuts): void {
  shortcuts.forEach((shortcut) => {
    keyboardShortcutsManager.register(shortcut);
  });
}
