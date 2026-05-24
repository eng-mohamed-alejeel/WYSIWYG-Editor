/**
 * Visual Editor Store
 *
 * Manages state for professional visual editing tools
 * Optimized for performance with selective subscriptions
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { ComponentId } from '@wysiwyg/core';
import { VisualEditorState } from '../types';
import { initialState } from '../config/initialState';
import { createDragActions } from '../actions/dragActions';
import { createResizeActions } from '../actions/resizeActions';
import { createInteractionActions } from '../actions/interactionActions';
import { createCommonActions } from '../actions/commonActions';
import {
  updateComponentBounds,
  getComponentBounds,
  getAllBounds,
  clearBoundsCache,
} from '../utils/componentBounds';

interface VisualEditorStore extends VisualEditorState {
  // Actions
  startDrag: (ids: ComponentId[], startX: number, startY: number) => void;
  updateDrag: (currentX: number, currentY: number) => void;
  endDrag: () => void;

  startResize: (id: ComponentId, handlePosition: string, startX: number, startY: number) => void;
  updateResize: (currentX: number, currentY: number) => void;
  endResize: () => void;

  updateSnapping: (state: any) => void;

  setHovered: (id: ComponentId | null, position?: { x: number; y: number }) => void;
  showHoverOverlay: (show: boolean) => void;

  startSelectionBox: (startX: number, startY: number) => void;
  updateSelectionBox: (currentX: number, currentY: number) => void;
  endSelectionBox: () => void;

  updateKeyboardModifiers: (modifiers: any) => void;
  setKeyboardNavigationMode: (mode: 'tree' | 'spatial') => void;

  updateConfig: (config: any) => void;
  reset: () => void;

  // Bounds management
  updateComponentBounds: (
    id: ComponentId,
    bounds: DOMRect,
    parentId?: ComponentId | null,
    depth?: number
  ) => void;
  getComponentBounds: (id: ComponentId) => DOMRect | null;
  getAllBounds: () => any[];
  clearBoundsCache: () => void;
}

export const useVisualEditorStore = create<VisualEditorStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Drag actions
    ...createDragActions(set, get),

    // Resize actions
    ...createResizeActions(set, get),

    // Interaction actions
    ...createInteractionActions(set),

    // Common actions
    ...createCommonActions(set, get),

    // Bounds management
    updateComponentBounds,
    getComponentBounds,
    getAllBounds,
    clearBoundsCache,
  }))
);
