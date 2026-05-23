/**
 * Command Bus Types
 *
 * Type definitions for the command bus architecture
 */

import { ComponentId, ComponentNode } from '@wysiwyg/core';

/**
 * Command result type
 */
export interface CommandResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error;
  undoable?: boolean;
  timestamp: number;
}

/**
 * Base command interface
 */
export interface Command<TPayload = unknown, TResult = unknown> {
  type: string;
  payload: TPayload;
  execute: (payload: TPayload) => Promise<TResult> | TResult;
  undo?: (payload: TPayload, result: TResult) => Promise<void> | void;
  validate?: (payload: TPayload) => boolean | Promise<boolean>;
  description?: string;
  category?: string;
}

/**
 * Command handler function
 */
export type CommandHandler<TPayload = unknown, TResult = unknown> = (
  payload: TPayload
) => Promise<CommandResult<TResult>> | CommandResult<TResult>;

/**
 * Command middleware function
 */
export interface CommandMiddleware {
  name: string;
  priority: number;
  before?: (command: string, payload: unknown) => unknown | Promise<unknown>;
  after?: (command: string, payload: unknown, result: CommandResult) => void | Promise<void>;
  onError?: (error: Error, command: string, payload: unknown) => void;
}

/**
 * Command history entry
 */
export interface CommandHistoryEntry {
  id: string;
  command: string;
  payload: unknown;
  result: CommandResult;
  timestamp: number;
  undoable: boolean;
}

/**
 * Keyboard shortcut configuration
 */
export interface KeyboardShortcut {
  command: string;
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description?: string;
  category?: string;
}

/**
 * Command payload types for editor actions
 */

// Duplicate command
export interface DuplicatePayload {
  componentIds: ComponentId[];
  targetParentId?: ComponentId;
  targetIndex?: number;
}

// Delete command
export interface DeletePayload {
  componentIds: ComponentId[];
}

// Move command
export interface MovePayload {
  componentIds: ComponentId[];
  targetParentId: ComponentId;
  targetIndex?: number;
}

// Wrap command
export interface WrapPayload {
  componentIds: ComponentId[];
  wrapperType: string;
  wrapperProps?: Record<string, unknown>;
}

// Group command
export interface GroupPayload {
  componentIds: ComponentId[];
  groupName?: string;
  groupId?: ComponentId;
}

// Paste command
export interface PastePayload {
  items: unknown[];
  targetParentId?: ComponentId;
  targetIndex?: number;
}

/**
 * Command categories
 */
export enum CommandCategory {
  COMPONENT = 'component',
  SELECTION = 'selection',
  HISTORY = 'history',
  VIEWPORT = 'viewport',
  PROJECT = 'project',
  CLIPBOARD = 'clipboard',
  ASSET = 'asset',
  COLLABORATION = 'collaboration',
}

/**
 * Command execution options
 */
export interface CommandOptions {
  skipHistory?: boolean;
  skipMiddleware?: boolean;
  silent?: boolean;
  transactionId?: string;
}
