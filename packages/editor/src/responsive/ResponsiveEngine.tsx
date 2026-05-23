/**
 * Responsive Engine
 *
 * Main responsive editing engine that coordinates all responsive features
 * Similar to Webflow's responsive editing system
 */

import React, { createContext, useContext, useCallback, useEffect, useState, useMemo } from 'react';
import { Breakpoint, StyleObject, ComponentId, ComponentNode } from '@wysiwyg/core';
import {
  ResponsiveState,
  StylePreviewState,
  ResponsiveRendererOptions,
  SerializedResponsiveStyles,
} from './types';
import { getGlobalBreakpointManager } from './BreakpointManager';
import { getGlobalResponsiveStyleManager } from './ResponsiveStyleManager';
import { DevicePreview } from './DevicePreview';
import { ResponsiveInspector } from './ResponsiveInspector';

interface ResponsiveEngineContextValue {
  state: ResponsiveState;
  currentBreakpoint: Breakpoint;
  setBreakpoint: (breakpoint: Breakpoint) => void;
  getEffectiveStyles: (
    componentId: ComponentId,
    baseStyles: StyleObject,
    responsiveStyles?: Record<Breakpoint, StyleObject>
  ) => StyleObject;
  setStyleOverride: (
    componentId: ComponentId,
    baseStyles: StyleObject,
    responsiveStyles: Record<Breakpoint, StyleObject>,
    property: string,
    value: any
  ) => Record<Breakpoint, StyleObject>;
  removeStyleOverride: (
    componentId: ComponentId,
    responsiveStyles: Record<Breakpoint, StyleObject>,
    property: string
  ) => Record<Breakpoint, StyleObject>;
  previewStyles: (previewState: StylePreviewState) => void;
  clearPreview: () => void;
  serializeStyles: (
    componentId: ComponentId,
    baseStyles: StyleObject,
    responsiveStyles: Record<Breakpoint, StyleObject>
  ) => SerializedResponsiveStyles;
  deserializeStyles: (data: SerializedResponsiveStyles) => {
    base: StyleObject;
    responsiveStyles: Record<Breakpoint, StyleObject>;
  };
}

const ResponsiveEngineContext = createContext<ResponsiveEngineContextValue | null>(null);

interface ResponsiveEngineProviderProps {
  children: React.ReactNode;
  initialBreakpoint?: Breakpoint;
  options?: Partial<ResponsiveRendererOptions>;
}

const DEFAULT_OPTIONS: ResponsiveRendererOptions = {
  enableInheritance: true,
  enableOverrides: true,
  enablePreview: true,
  optimizeRendering: true,
  cacheStyles: true,
};

export const ResponsiveEngineProvider: React.FC<ResponsiveEngineProviderProps> = ({
  children,
  initialBreakpoint = 'desktop',
  options = {},
}) => {
  const breakpointManager = getGlobalBreakpointManager();
  const styleManager = getGlobalResponsiveStyleManager();

  const [state, setState] = useState<ResponsiveState>({
    currentBreakpoint: initialBreakpoint,
    currentDevice: breakpointManager.getCurrentDevice()?.id ?? 'desktop',
    isResponsiveMode: true,
    zoom: 1,
    showBreakpoints: true,
    activeBreakpoints: breakpointManager.getVisibleBreakpoints(),
  });

  const [previewState, setPreviewState] = useState<StylePreviewState | null>(null);
  const [rendererOptions] = useState<ResponsiveRendererOptions>({
    ...DEFAULT_OPTIONS,
    ...options,
  });

  // Set initial breakpoint
  useEffect(() => {
    breakpointManager.setBreakpoint(initialBreakpoint);
  }, [initialBreakpoint, breakpointManager]);

  // Handle breakpoint change
  const setBreakpoint = useCallback(
    (breakpoint: Breakpoint) => {
      setState((prev) => ({ ...prev, currentBreakpoint: breakpoint }));
      breakpointManager.setBreakpoint(breakpoint);
    },
    [breakpointManager]
  );

  // Get effective styles for a component
  const getEffectiveStyles = useCallback(
    (
      componentId: ComponentId,
      baseStyles: StyleObject,
      responsiveStyles?: Record<Breakpoint, StyleObject>
    ): StyleObject => {
      if (!rendererOptions.enableInheritance) {
        return baseStyles;
      }

      // Check cache first
      if (rendererOptions.cacheStyles) {
        const cached = styleManager.getCachedOverrides(componentId, state.currentBreakpoint);
        if (cached) {
          return { ...baseStyles, ...cached };
        }
      }

      return styleManager.getEffectiveStyles(baseStyles, responsiveStyles, state.currentBreakpoint);
    },
    [state.currentBreakpoint, rendererOptions, styleManager]
  );

  // Set style override
  const setStyleOverride = useCallback(
    (
      componentId: ComponentId,
      baseStyles: StyleObject,
      responsiveStyles: Record<Breakpoint, StyleObject>,
      property: string,
      value: any
    ): Record<Breakpoint, StyleObject> => {
      if (!rendererOptions.enableOverrides) {
        return responsiveStyles;
      }

      return styleManager.setStyleOverride(
        componentId,
        baseStyles,
        responsiveStyles,
        state.currentBreakpoint,
        property,
        value
      );
    },
    [state.currentBreakpoint, rendererOptions, styleManager]
  );

  // Remove style override
  const removeStyleOverride = useCallback(
    (
      componentId: ComponentId,
      responsiveStyles: Record<Breakpoint, StyleObject>,
      property: string
    ): Record<Breakpoint, StyleObject> => {
      if (!rendererOptions.enableOverrides) {
        return responsiveStyles;
      }

      return styleManager.removeStyleOverride(
        componentId,
        responsiveStyles,
        state.currentBreakpoint,
        property
      );
    },
    [state.currentBreakpoint, rendererOptions, styleManager]
  );

  // Preview styles
  const previewStyles = useCallback(
    (previewState: StylePreviewState) => {
      if (!rendererOptions.enablePreview) return;
      setPreviewState(previewState);
    },
    [rendererOptions]
  );

  // Clear preview
  const clearPreview = useCallback(() => {
    setPreviewState(null);
  }, []);

  // Serialize styles
  const serializeStyles = useCallback(
    (
      componentId: ComponentId,
      baseStyles: StyleObject,
      responsiveStyles: Record<Breakpoint, StyleObject>
    ): SerializedResponsiveStyles => {
      return styleManager.serializeResponsiveStyles(componentId, baseStyles, responsiveStyles);
    },
    [styleManager]
  );

  // Deserialize styles
  const deserializeStyles = useCallback(
    (data: SerializedResponsiveStyles) => {
      return styleManager.deserializeResponsiveStyles(data);
    },
    [styleManager]
  );

  const contextValue: ResponsiveEngineContextValue = useMemo(
    () => ({
      state,
      currentBreakpoint: state.currentBreakpoint,
      setBreakpoint,
      getEffectiveStyles,
      setStyleOverride,
      removeStyleOverride,
      previewStyles,
      clearPreview,
      serializeStyles,
      deserializeStyles,
    }),
    [
      state,
      setBreakpoint,
      getEffectiveStyles,
      setStyleOverride,
      removeStyleOverride,
      previewStyles,
      clearPreview,
      serializeStyles,
      deserializeStyles,
    ]
  );

  return (
    <ResponsiveEngineContext.Provider value={contextValue}>
      {children}
    </ResponsiveEngineContext.Provider>
  );
};

/**
 * Hook to use the responsive engine
 */
export const useResponsiveEngine = (): ResponsiveEngineContextValue => {
  const context = useContext(ResponsiveEngineContext);
  if (!context) {
    throw new Error('useResponsiveEngine must be used within a ResponsiveEngineProvider');
  }
  return context;
};

/**
 * Responsive Editor Component
 * Combines device preview and responsive inspector
 */
interface ResponsiveEditorProps {
  component: ComponentNode;
  children: React.ReactNode;
  onStyleChange?: (
    componentId: ComponentId,
    breakpoint: Breakpoint,
    property: string,
    value: any
  ) => void;
  onStyleRemove?: (componentId: ComponentId, breakpoint: Breakpoint, property: string) => void;
  showInspector?: boolean;
  showDevicePreview?: boolean;
  className?: string;
}

export const ResponsiveEditor: React.FC<ResponsiveEditorProps> = ({
  component,
  children,
  onStyleChange,
  onStyleRemove,
  showInspector = true,
  showDevicePreview = true,
  className = '',
}) => {
  const { currentBreakpoint, setStyleOverride, removeStyleOverride } = useResponsiveEngine();

  const handleStyleChange = useCallback(
    (breakpoint: Breakpoint, property: string, value: any) => {
      const newResponsiveStyles = setStyleOverride(
        component.id,
        component.styles,
        component.responsiveStyles ?? {},
        property,
        value
      );
      onStyleChange?.(component.id, breakpoint, property, value);
    },
    [component, setStyleOverride, onStyleChange]
  );

  const handleStyleRemove = useCallback(
    (breakpoint: Breakpoint, property: string) => {
      const newResponsiveStyles = removeStyleOverride(
        component.id,
        component.responsiveStyles ?? {},
        property
      );
      onStyleRemove?.(component.id, breakpoint, property);
    },
    [component, removeStyleOverride, onStyleRemove]
  );

  return (
    <div className={`responsive-editor ${className}`}>
      {showDevicePreview && (
        <DevicePreview
          initialBreakpoint={currentBreakpoint}
          onBreakpointChange={(bp) => {
            // Breakpoint change is handled by the engine
          }}
        >
          {children}
        </DevicePreview>
      )}

      {showInspector && (
        <ResponsiveInspector
          componentId={component.id}
          baseStyles={component.styles}
          responsiveStyles={component.responsiveStyles ?? {}}
          onStyleChange={handleStyleChange}
          onStyleRemove={handleStyleRemove}
        />
      )}

      <style jsx>{`
        .responsive-editor {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          gap: 16px;
        }
      `}</style>
    </div>
  );
};

/**
 * Responsive Renderer Component
 * Optimized renderer for responsive components
 */
interface ResponsiveRendererProps {
  component: ComponentNode;
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveRenderer: React.FC<ResponsiveRendererProps> = ({
  component,
  children,
  className = '',
}) => {
  const { getEffectiveStyles } = useResponsiveEngine();

  const effectiveStyles = useMemo(() => {
    return getEffectiveStyles(component.id, component.styles, component.responsiveStyles);
  }, [component, getEffectiveStyles]);

  return (
    <div className={`responsive-renderer ${className}`} style={effectiveStyles}>
      {children}
    </div>
  );
};
