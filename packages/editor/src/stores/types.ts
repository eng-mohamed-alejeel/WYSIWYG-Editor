/**
 * State Management Types
 *
 * Type definitions for the state management system
 */

import { ComponentId, ComponentNode, Project, Page, Breakpoint } from '@wysiwyg/core';

/**
 * Transaction state for batch operations
 */
export interface TransactionState {
  isActive: boolean;
  operations: Operation[];
  startTime: number;
}

/**
 * Single operation within a transaction
 */
export interface Operation {
  type: string;
  store: string;
  payload: unknown;
  timestamp: number;
}

/**
 * Transaction result
 */
export interface TransactionResult {
  success: boolean;
  operations: Operation[];
  error?: Error;
}

/**
 * Editor event types
 */
export type EditorEventType =
  | 'component:select'
  | 'component:deselect'
  | 'component:update'
  | 'component:delete'
  | 'component:duplicate'
  | 'component:move'
  | 'page:change'
  | 'breakpoint:change'
  | 'viewport:change'
  | 'transaction:start'
  | 'transaction:commit'
  | 'transaction:rollback'
  | 'history:push'
  | 'history:undo'
  | 'history:redo'
  | 'asset:upload'
  | 'asset:delete'
  | 'clipboard:copy'
  | 'clipboard:paste'
  | 'collaborator:join'
  | 'collaborator:leave'
  | 'collaborator:cursor:move';

/**
 * Editor event payload
 */
export interface EditorEvent<T = unknown> {
  type: EditorEventType;
  payload: T;
  timestamp: number;
  source: 'local' | 'remote';
  userId?: string;
}

/**
 * Event listener function
 */
export type EventListener<T = unknown> = (event: EditorEvent<T>) => void;

/**
 * Store middleware configuration
 */
export interface MiddlewareConfig {
  name: string;
  priority?: number;
  before?: (state: unknown, action: string, payload: unknown) => unknown | Promise<unknown>;
  after?: (state: unknown, action: string, payload: unknown) => void | Promise<void>;
  onError?: (error: Error, action: string, payload: unknown) => void;
}

/**
 * CRDT operation for collaboration
 */
export interface CRDTOperation {
  id: string;
  type: 'insert' | 'delete' | 'update' | 'move';
  path: string[];
  value?: unknown;
  timestamp: number;
  userId: string;
  vectorClock: Record<string, number>;
}

/**
 * Collaborator state
 */
export interface Collaborator {
  id: string;
  name: string;
  color: string;
  cursor?: {
    componentId: ComponentId | null;
    position: { x: number; y: number };
  };
  isActive: boolean;
  lastSeen: number;
}

/**
 * Store slice base interface
 */
export interface StoreSlice<T> {
  getState: () => T;
  setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
}

/**
 * Editor store state
 */
export interface EditorStoreState {
  project: Project | null;
  currentPageId: ComponentId | null;
  isDirty: boolean;
  isPreviewMode: boolean;
  collaborators: Collaborator[];
}

/**
 * Selection store state
 */
export interface SelectionStoreState {
  selectedIds: ComponentId[];
  hoveredId: ComponentId | null;
  focusedId: ComponentId | null;
}

/**
 * Viewport store state
 */
export interface ViewportStoreState {
  width: number;
  height: number;
  zoom: number;
  breakpoint: Breakpoint;
  isResponsive: boolean;
}

/**
 * History store state
 */
export interface HistoryStoreState {
  past: unknown[];
  present: unknown | null;
  future: unknown[];
  maxSize: number;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Assets store state
 */
export interface AssetsStoreState {
  assets: Map<ComponentId, Asset>;
  isLoading: boolean;
  error: Error | null;
  uploadQueue: UploadOperation[];
}

/**
 * Asset definition
 */
export interface Asset {
  id: ComponentId;
  name: string;
  type: 'image' | 'video' | 'audio' | 'font' | 'file' | 'code';
  url: string;
  size: number;
  mimeType?: string;
  metadata?: AssetMetadata;
}

/**
 * Asset metadata
 */
export interface AssetMetadata {
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  customData?: Record<string, unknown>;
}

/**
 * Upload operation
 */
export interface UploadOperation {
  id: ComponentId;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: Error;
}

/**
 * Clipboard store state
 */
export interface ClipboardStoreState {
  items: ClipboardItem[];
  lastCopiedAt: number | null;
}

/**
 * Clipboard item
 */
export interface ClipboardItem {
  id: string;
  type: 'component' | 'text' | 'asset';
  data: unknown;
  metadata?: Record<string, unknown>;
}

/**
 * Selector options
 */
export interface SelectorOptions<T> {
  equalityFn?: (a: T, b: T) => boolean;
  shallow?: boolean;
}

/**
 * Store actions base interface
 */
export interface StoreActions {
  reset: () => void;
  hydrate: (state: unknown) => void;
  toJSON: () => string;
}
