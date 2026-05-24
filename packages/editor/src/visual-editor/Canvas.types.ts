/**
 * Canvas Types and Interfaces
 */

import { ComponentId } from '@wysiwyg/core';

export interface CanvasProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface ViewportState {
  zoom: number;
  pan: { x: number; y: number };
  isPanning: boolean;
  panStart: { x: number; y: number };
}

export interface LayerInfo {
  id: ComponentId;
  depth: number;
  zIndex: number;
  isVisible: boolean;
}

export interface ViewportControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onReset: () => void;
}
