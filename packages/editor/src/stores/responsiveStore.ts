/**
 * Responsive Store
 *
 * Manages responsive editing state including breakpoints, devices, and style overrides
 * Optimized for performance with selective subscriptions
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { Breakpoint, StyleObject, ComponentId } from '@wysiwyg/core';
import { ResponsiveState, StylePreviewState } from '../responsive/types';
import { getGlobalBreakpointManager } from '../responsive/BreakpointManager';
import { getGlobalResponsiveStyleManager } from '../responsive/ResponsiveStyleManager';
import { eventBus } from './events';
import { middlewareManager } from './middleware';

interface ResponsiveStoreState extends ResponsiveState {
  // Preview state
  previewState: StylePreviewState | null;

  // Style overrides cache
  styleOverrides: Map<ComponentId, Record<Breakpoint, StyleObject>>;

  // Actions
  setCurrentBreakpoint: (breakpoint: Breakpoint) => Promise<void>;
  setCurrentDevice: (deviceId: string) => Promise<void>;
  setZoom: (zoom: number) => Promise<void>;
  toggleResponsiveMode: () => Promise<void>;
  toggleBreakpointVisibility: (breakpoint: Breakpoint) => Promise<void>;
  setPreviewState: (state: StylePreviewState | null) => void;
  clearPreview: () => void;
  setStyleOverride: (
    componentId: ComponentId,
    breakpoint: Breakpoint,
    property: string,
    value: any
  ) => Promise<void>;
  removeStyleOverride: (
    componentId: ComponentId,
    breakpoint: Breakpoint,
    property: string
  ) => Promise<void>;
  clearComponentOverrides: (componentId: ComponentId) => Promise<void>;
  reset: () => void;
  hydrate: (state: Partial<ResponsiveStoreState>) => void;
  toJSON: () => string;
}

const initialState: ResponsiveStoreState = {
  currentBreakpoint: 'desktop',
  currentDevice: 'desktop',
  isResponsiveMode: true,
  zoom: 1,
  showBreakpoints: true,
  activeBreakpoints: ['mobile', 'tablet', 'desktop', 'wide'],
  previewState: null,
  styleOverrides: new Map(),
};

export const useResponsiveStore = create<ResponsiveStoreState>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    setCurrentBreakpoint: async (breakpoint: Breakpoint) => {
      try {
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'setCurrentBreakpoint',
          breakpoint
        );

        const breakpointManager = getGlobalBreakpointManager();
        breakpointManager.setBreakpoint(processedPayload as Breakpoint);

        const currentDevice = breakpointManager.getCurrentDevice();

        set(
          (state) => ({
            ...state,
            currentBreakpoint: processedPayload as Breakpoint,
            currentDevice: currentDevice?.id || state.currentDevice,
          }),
          false,
          'setCurrentBreakpoint'
        );

        await middlewareManager.executeAfter(get(), 'setCurrentBreakpoint', processedPayload);
        eventBus.emit('breakpoint:change', processedPayload);
      } catch (error) {
        console.error('Error setting breakpoint:', error);
        throw error;
      }
    },

    setCurrentDevice: async (deviceId: string) => {
      try {
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'setCurrentDevice',
          deviceId
        );

        const breakpointManager = getGlobalBreakpointManager();
        breakpointManager.setDevice(processedPayload as string);

        const currentBreakpoint = breakpointManager.getCurrentBreakpoint();

        set(
          (state) => ({
            ...state,
            currentDevice: processedPayload as string,
            currentBreakpoint,
          }),
          false,
          'setCurrentDevice'
        );

        await middlewareManager.executeAfter(get(), 'setCurrentDevice', processedPayload);
        eventBus.emit('device:change', processedPayload);
      } catch (error) {
        console.error('Error setting device:', error);
        throw error;
      }
    },

    setZoom: async (zoom: number) => {
      try {
        // Clamp zoom between 0.25 and 2
        const clampedZoom = Math.max(0.25, Math.min(2, zoom));
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'setZoom',
          clampedZoom
        );

        set({ zoom: processedPayload as number }, false, 'setZoom');

        await middlewareManager.executeAfter(get(), 'setZoom', processedPayload);
        eventBus.emit('zoom:change', processedPayload);
      } catch (error) {
        console.error('Error setting zoom:', error);
        throw error;
      }
    },

    toggleResponsiveMode: async () => {
      try {
        await middlewareManager.executeBefore(get(), 'toggleResponsiveMode', null);

        set(
          (state) => ({
            ...state,
            isResponsiveMode: !state.isResponsiveMode,
          }),
          false,
          'toggleResponsiveMode'
        );

        await middlewareManager.executeAfter(get(), 'toggleResponsiveMode', null);
        eventBus.emit('responsive:mode', get().isResponsiveMode);
      } catch (error) {
        console.error('Error toggling responsive mode:', error);
        throw error;
      }
    },

    toggleBreakpointVisibility: async (breakpoint: Breakpoint) => {
      try {
        const breakpointManager = getGlobalBreakpointManager();
        breakpointManager.toggleBreakpointVisibility(breakpoint);

        const activeBreakpoints = breakpointManager.getVisibleBreakpoints();

        set(
          (state) => ({
            ...state,
            activeBreakpoints,
          }),
          false,
          'toggleBreakpointVisibility'
        );

        eventBus.emit('breakpoint:visibility', {
          breakpoint,
          visible: breakpointManager.getBreakpointVisibility(breakpoint)?.visible,
        });
      } catch (error) {
        console.error('Error toggling breakpoint visibility:', error);
        throw error;
      }
    },

    setPreviewState: (state: StylePreviewState | null) => {
      set({ previewState: state }, false, 'setPreviewState');
      eventBus.emit('preview:state', state);
    },

    clearPreview: () => {
      set({ previewState: null }, false, 'clearPreview');
      eventBus.emit('preview:clear', null);
    },

    setStyleOverride: async (
      componentId: ComponentId,
      breakpoint: Breakpoint,
      property: string,
      value: any
    ) => {
      try {
        const processedPayload = await middlewareManager.executeBefore(get(), 'setStyleOverride', {
          componentId,
          breakpoint,
          property,
          value,
        });

        const styleManager = getGlobalResponsiveStyleManager();
        const {
          componentId: id,
          breakpoint: bp,
          property: prop,
          value: val,
        } = processedPayload as {
          componentId: ComponentId;
          breakpoint: Breakpoint;
          property: string;
          value: any;
        };

        const currentOverrides = get().styleOverrides.get(id) || {};
        const newOverrides = styleManager.setStyleOverride(id, {}, currentOverrides, bp, prop, val);

        set(
          (state) => {
            const newStyleOverrides = new Map(state.styleOverrides);
            newStyleOverrides.set(id, newOverrides);
            return { ...state, styleOverrides: newStyleOverrides };
          },
          false,
          'setStyleOverride'
        );

        await middlewareManager.executeAfter(get(), 'setStyleOverride', processedPayload);
        eventBus.emit('style:override', {
          componentId: id,
          breakpoint: bp,
          property: prop,
          value: val,
        });
      } catch (error) {
        console.error('Error setting style override:', error);
        throw error;
      }
    },

    removeStyleOverride: async (
      componentId: ComponentId,
      breakpoint: Breakpoint,
      property: string
    ) => {
      try {
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'removeStyleOverride',
          { componentId, breakpoint, property }
        );

        const styleManager = getGlobalResponsiveStyleManager();
        const {
          componentId: id,
          breakpoint: bp,
          property: prop,
        } = processedPayload as {
          componentId: ComponentId;
          breakpoint: Breakpoint;
          property: string;
        };

        const currentOverrides = get().styleOverrides.get(id) || {};
        const newOverrides = styleManager.removeStyleOverride(id, currentOverrides, bp, prop);

        set(
          (state) => {
            const newStyleOverrides = new Map(state.styleOverrides);
            if (Object.keys(newOverrides).length === 0) {
              newStyleOverrides.delete(id);
            } else {
              newStyleOverrides.set(id, newOverrides);
            }
            return { ...state, styleOverrides: newStyleOverrides };
          },
          false,
          'removeStyleOverride'
        );

        await middlewareManager.executeAfter(get(), 'removeStyleOverride', processedPayload);
        eventBus.emit('style:override:remove', { componentId: id, breakpoint: bp, property: prop });
      } catch (error) {
        console.error('Error removing style override:', error);
        throw error;
      }
    },

    clearComponentOverrides: async (componentId: ComponentId) => {
      try {
        await middlewareManager.executeBefore(get(), 'clearComponentOverrides', componentId);

        set(
          (state) => {
            const newStyleOverrides = new Map(state.styleOverrides);
            newStyleOverrides.delete(componentId);
            return { ...state, styleOverrides: newStyleOverrides };
          },
          false,
          'clearComponentOverrides'
        );

        await middlewareManager.executeAfter(get(), 'clearComponentOverrides', componentId);
        eventBus.emit('style:overrides:clear', componentId);
      } catch (error) {
        console.error('Error clearing component overrides:', error);
        throw error;
      }
    },

    reset: () => {
      set(initialState, false, 'reset');
      eventBus.emit('responsive:reset', null);
    },

    hydrate: (state: Partial<ResponsiveStoreState>) => {
      set(
        (currentState) => ({
          ...currentState,
          ...state,
          styleOverrides: state.styleOverrides || new Map(),
        }),
        false,
        'hydrate'
      );
    },

    toJSON: (): string => {
      const state = get();
      return JSON.stringify({
        currentBreakpoint: state.currentBreakpoint,
        currentDevice: state.currentDevice,
        isResponsiveMode: state.isResponsiveMode,
        zoom: state.zoom,
        showBreakpoints: state.showBreakpoints,
        activeBreakpoints: state.activeBreakpoints,
        styleOverrides: Array.from(state.styleOverrides.entries()),
      });
    },
  }))
);

// Selectors with shallow equality for optimized re-renders
export const responsiveSelectors = {
  currentBreakpoint: (state: ResponsiveStoreState) => state.currentBreakpoint,
  currentDevice: (state: ResponsiveStoreState) => state.currentDevice,
  isResponsiveMode: (state: ResponsiveStoreState) => state.isResponsiveMode,
  zoom: (state: ResponsiveStoreState) => state.zoom,
  showBreakpoints: (state: ResponsiveStoreState) => state.showBreakpoints,
  activeBreakpoints: (state: ResponsiveStoreState) => state.activeBreakpoints,
  previewState: (state: ResponsiveStoreState) => state.previewState,
  styleOverrides: (state: ResponsiveStoreState) => state.styleOverrides,

  // Compound selectors
  responsiveState: (state: ResponsiveStoreState) => ({
    currentBreakpoint: state.currentBreakpoint,
    currentDevice: state.currentDevice,
    isResponsiveMode: state.isResponsiveMode,
    zoom: state.zoom,
    showBreakpoints: state.showBreakpoints,
    activeBreakpoints: state.activeBreakpoints,
  }),

  // Computed selectors
  componentOverrides: (state: ResponsiveStoreState, componentId: ComponentId) =>
    state.styleOverrides.get(componentId),
};

// Custom hooks for common selections
export const useCurrentBreakpoint = () => useResponsiveStore(responsiveSelectors.currentBreakpoint);
export const useCurrentDevice = () => useResponsiveStore(responsiveSelectors.currentDevice);
export const useIsResponsiveMode = () => useResponsiveStore(responsiveSelectors.isResponsiveMode);
export const useZoom = () => useResponsiveStore(responsiveSelectors.zoom);
export const useShowBreakpoints = () => useResponsiveStore(responsiveSelectors.showBreakpoints);
export const useActiveBreakpoints = () => useResponsiveStore(responsiveSelectors.activeBreakpoints);
export const usePreviewState = () => useResponsiveStore(responsiveSelectors.previewState);
export const useResponsiveState = () =>
  useResponsiveStore(responsiveSelectors.responsiveState, shallow);
export const useComponentOverrides = (componentId: ComponentId) =>
  useResponsiveStore((state) => responsiveSelectors.componentOverrides(state, componentId));
