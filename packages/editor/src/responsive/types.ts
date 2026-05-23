/**
 * Responsive Editing Engine Types
 *
 * Type definitions for the responsive editing system
 */

import { Breakpoint, StyleObject, ComponentId } from '@wysiwyg/core';

/**
 * Device configuration for preview
 */
export interface DeviceConfig {
  id: string;
  name: string;
  icon: string;
  width: number;
  height: number;
  breakpoint: Breakpoint;
  scale?: number;
  orientation?: 'portrait' | 'landscape';
  isDefault?: boolean;
}

/**
 * Responsive style override
 */
export interface ResponsiveStyleOverride {
  breakpoint: Breakpoint;
  styles: StyleObject;
  isOverridden: boolean;
  sourceBreakpoint?: Breakpoint;
}

/**
 * Style inheritance chain
 */
export interface StyleInheritanceChain {
  base: StyleObject;
  mobile?: StyleObject;
  tablet?: StyleObject;
  desktop?: StyleObject;
  wide?: StyleObject;
}

/**
 * Responsive state
 */
export interface ResponsiveState {
  currentBreakpoint: Breakpoint;
  currentDevice: string;
  isResponsiveMode: boolean;
  zoom: number;
  showBreakpoints: boolean;
  activeBreakpoints: Breakpoint[];
}

/**
 * Style preview state
 */
export interface StylePreviewState {
  componentId: ComponentId;
  breakpoint: Breakpoint;
  styles: StyleObject;
  isPreviewing: boolean;
}

/**
 * Inspector control state
 */
export interface InspectorControlState {
  componentId: ComponentId;
  currentBreakpoint: Breakpoint;
  property: string;
  value: any;
  isInherited: boolean;
  overriddenBreakpoints: Breakpoint[];
}

/**
 * Breakpoint transition
 */
export interface BreakpointTransition {
  from: Breakpoint;
  to: Breakpoint;
  duration: number;
  easing: string;
}

/**
 * Responsive renderer options
 */
export interface ResponsiveRendererOptions {
  enableInheritance: boolean;
  enableOverrides: boolean;
  enablePreview: boolean;
  optimizeRendering: boolean;
  cacheStyles: boolean;
}

/**
 * Serialized responsive styles
 */
export interface SerializedResponsiveStyles {
  base: StyleObject;
  overrides: Record<Breakpoint, StyleObject>;
  metadata: {
    version: string;
    lastModified: number;
    componentId: ComponentId;
  };
}

/**
 * Breakpoint visibility
 */
export interface BreakpointVisibility {
  breakpoint: Breakpoint;
  visible: boolean;
  locked: boolean;
}

/**
 * Device frame configuration
 */
export interface DeviceFrameConfig {
  showFrame: boolean;
  showLabels: boolean;
  frameColor: string;
  frameWidth: number;
  borderRadius: number;
}
