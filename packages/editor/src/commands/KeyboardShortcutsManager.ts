/**
 * Keyboard Shortcuts Manager
 *
 * Manages keyboard shortcuts and maps them to commands
 */

import { KeyboardShortcut } from './types';

interface KeyboardEventLike {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}

class KeyboardShortcutsManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private listeners: Set<(shortcut: KeyboardShortcut) => void> = new Set();

  /**
   * Register a keyboard shortcut
   */
  register(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKey(shortcut);
    if (this.shortcuts.has(key)) {
      console.warn(`Shortcut ${key} is already registered. Overwriting.`);
    }
    this.shortcuts.set(key, shortcut);
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregister(command: string): void {
    for (const [key, shortcut] of this.shortcuts.entries()) {
      if (shortcut.command === command) {
        this.shortcuts.delete(key);
        break;
      }
    }
  }

  /**
   * Get shortcut by command type
   */
  getShortcut(command: string): KeyboardShortcut | undefined {
    for (const shortcut of this.shortcuts.values()) {
      if (shortcut.command === command) {
        return shortcut;
      }
    }
    return undefined;
  }

  /**
   * Handle a keyboard event
   */
  handle(event: KeyboardEventLike): KeyboardShortcut | undefined {
    const key = this.getShortcutKeyFromEvent(event);
    const shortcut = this.shortcuts.get(key);

    if (shortcut) {
      this.notifyListeners(shortcut);
      return shortcut;
    }

    return undefined;
  }

  /**
   * Check if a keyboard event matches a shortcut
   */
  matches(event: KeyboardEventLike, command: string): boolean {
    const shortcut = this.getShortcut(command);
    if (!shortcut) {
      return false;
    }

    const eventKey = this.getShortcutKeyFromEvent(event);
    const shortcutKey = this.getShortcutKey(shortcut);

    return eventKey === shortcutKey;
  }

  /**
   * Get all shortcuts grouped by category
   */
  getByCategory(category: string): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values()).filter((shortcut) => shortcut.category === category);
  }

  /**
   * Get all registered shortcuts
   */
  getAll(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Subscribe to shortcut activation
   */
  subscribe(listener: (shortcut: KeyboardShortcut) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Clear all shortcuts
   */
  clear(): void {
    this.shortcuts.clear();
  }

  /**
   * Generate a unique key for a shortcut
   */
  private getShortcutKey(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.meta) parts.push('Meta');
    parts.push(shortcut.key);
    return parts.join('+');
  }

  /**
   * Generate a unique key from a keyboard event
   */
  private getShortcutKeyFromEvent(event: KeyboardEventLike): string {
    const parts: string[] = [];
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.altKey) parts.push('Alt');
    if (event.shiftKey) parts.push('Shift');
    if (event.metaKey) parts.push('Meta');
    parts.push(event.key);
    return parts.join('+');
  }

  /**
   * Notify all listeners when a shortcut is activated
   */
  private notifyListeners(shortcut: KeyboardShortcut): void {
    this.listeners.forEach((listener) => {
      try {
        listener(shortcut);
      } catch (error) {
        console.error('Error in shortcut listener:', error);
      }
    });
  }
}

// Singleton instance
export const keyboardShortcutsManager = new KeyboardShortcutsManager();
