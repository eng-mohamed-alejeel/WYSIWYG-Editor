/**
 * Viewport Store
 *
 * Manages viewport state including dimensions, zoom, and breakpoints
 * Optimized for performance with selective subscriptions
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { Breakpoint } from '@wysiwyg/core';
import { ViewportStoreState } from './types';
import { eventBus } from './events';
import { middlewareManager } from './middleware';

interface ViewportStore extends ViewportStoreState {
  // Actions
  setDimensions: (width: number, height: number) => Promise<void>;
  setZoom: (zoom: number) => Promise<void>;
  setBreakpoint: (breakpoint: Breakpoint) => Promise<void>;
  toggleResponsive: () => Promise<void>;
  reset: () => void;
  hydrate: (state: Partial<ViewportStoreState>) => void;
  toJSON: () => string;
}

// Breakpoint configurations
const BREAKPOINT_CONFIGS: Record<Breakpoint, { width: number; height: number }> = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
  wide: { width: 1920, height: 1080 },
};

const initialState: ViewportStoreState = {
  width: 1440,
  height: 900,
  zoom: 1,
  breakpoint: 'desktop',
  isResponsive: false,
};

export const useViewportStore = create<ViewportStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    setDimensions: async (width: number, height: number) => {
      try {
        const payload = { width, height };
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'setDimensions',
          payload
        );

        set(
          (state) => ({
            ...state,
            ...processedPayload,
          }),
          false,
          'setDimensions'
        );

        await middlewareManager.executeAfter(get(), 'setDimensions', processedPayload);
        eventBus.emit('viewport:change', processedPayload);
      } catch (error) {
        console.error('Error setting viewport dimensions:', error);
        throw error;
      }
    },

    setZoom: async (zoom: number) => {
      try {
        // Clamp zoom between 0.1 and 3
        const clampedZoom = Math.max(0.1, Math.min(3, zoom));
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'setZoom',
          clampedZoom
        );

        set({ zoom: processedPayload }, false, 'setZoom');

        await middlewareManager.executeAfter(get(), 'setZoom', processedPayload);
        eventBus.emit('viewport:zoom', processedPayload);
      } catch (error) {
        console.error('Error setting zoom:', error);
        throw error;
      }
    },

    setBreakpoint: async (breakpoint: Breakpoint) => {
      try {
        const processedPayload = await middlewareManager.executeBefore(
          get(),
          'setBreakpoint',
          breakpoint
        );

        const config = BREAKPOINT_CONFIGS[processedPayload as Breakpoint];

        set(
          (state) => ({
            ...state,
            breakpoint: processedPayload as Breakpoint,
            width: config.width,
            height: config.height,
            isResponsive: true,
          }),
          false,
          'setBreakpoint'
        );

        await middlewareManager.executeAfter(get(), 'setBreakpoint', processedPayload);
        eventBus.emit('breakpoint:change', processedPayload);
      } catch (error) {
        console.error('Error setting breakpoint:', error);
        throw error;
      }
    },

    toggleResponsive: async () => {
      try {
        await middlewareManager.executeBefore(get(), 'toggleResponsive', null);

        set(
          (state) => ({
            ...state,
            isResponsive: !state.isResponsive,
          }),
          false,
          'toggleResponsive'
        );

        await middlewareManager.executeAfter(get(), 'toggleResponsive', null);
        eventBus.emit('viewport:responsive', get().isResponsive);
      } catch (error) {
        console.error('Error toggling responsive mode:', error);
        throw error;
      }
    },

    reset: () => {
      set(initialState, false, 'reset');
      eventBus.emit('viewport:reset', null);
    },

    hydrate: (state: Partial<ViewportStoreState>) => {
      set(
        (currentState) => ({
          ...currentState,
          ...state,
        }),
        false,
        'hydrate'
      );
    },

    toJSON: (): string => {
      const state = get();
      return JSON.stringify({
        width: state.width,
        height: state.height,
        zoom: state.zoom,
        breakpoint: state.breakpoint,
        isResponsive: state.isResponsive,
      });
    },
  }))
);

// Selectors with shallow equality for optimized re-renders
export const viewportSelectors = {
  dimensions: (state: ViewportStoreState) => ({ width: state.width, height: state.height }),
  zoom: (state: ViewportStoreState) => state.zoom,
  breakpoint: (state: ViewportStoreState) => state.breakpoint,
  isResponsive: (state: ViewportStoreState) => state.isResponsive,

  // Compound selectors
  viewportState: (state: ViewportStoreState) => ({
    width: state.width,
    height: state.height,
    zoom: state.zoom,
    breakpoint: state.breakpoint,
    isResponsive: state.isResponsive,
  }),

  // Computed selectors
  scaledDimensions: (state: ViewportStoreState) => ({
    width: state.width * state.zoom,
    height: state.height * state.zoom,
  }),
};

// Custom hooks for common selections
export const useViewportDimensions = () => useViewportStore(viewportSelectors.dimensions, shallow);
export const useZoom = () => useViewportStore(viewportSelectors.zoom);
export const useBreakpoint = () => useViewportStore(viewportSelectors.breakpoint);
export const useIsResponsive = () => useViewportStore(viewportSelectors.isResponsive);
export const useViewportState = () => useViewportStore(viewportSelectors.viewportState, shallow);
export const useScaledDimensions = () =>
  useViewportStore(viewportSelectors.scaledDimensions, shallow);

// Breakpoint helper functions
export const getNextBreakpoint = (current: Breakpoint): Breakpoint => {
  const breakpoints: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];
  const index = breakpoints.indexOf(current);
  return breakpoints[Math.min(index + 1, breakpoints.length - 1)];
};

export const getPreviousBreakpoint = (current: Breakpoint): Breakpoint => {
  const breakpoints: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];
  const index = breakpoints.indexOf(current);
  return breakpoints[Math.max(index - 1, 0)];
};
