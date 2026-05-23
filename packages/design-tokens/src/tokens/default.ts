import { DesignTokens, Theme } from '../types';

export const defaultLightTokens: DesignTokens = {
  colors: {
    primary: { value: '#3B82F6', category: 'brand' },
    primaryHover: { value: '#2563EB', category: 'brand' },
    primaryActive: { value: '#1D4ED8', category: 'brand' },
    primaryLight: { value: '#93C5FD', category: 'brand' },
    primaryDark: { value: '#1E40AF', category: 'brand' },

    secondary: { value: '#8B5CF6', category: 'brand' },
    secondaryHover: { value: '#7C3AED', category: 'brand' },
    secondaryActive: { value: '#6D28D9', category: 'brand' },
    secondaryLight: { value: '#C4B5FD', category: 'brand' },
    secondaryDark: { value: '#5B21B6', category: 'brand' },

    success: { value: '#10B981', category: 'semantic' },
    successHover: { value: '#059669', category: 'semantic' },
    successActive: { value: '#047857', category: 'semantic' },

    warning: { value: '#F59E0B', category: 'semantic' },
    warningHover: { value: '#D97706', category: 'semantic' },
    warningActive: { value: '#B45309', category: 'semantic' },

    error: { value: '#EF4444', category: 'semantic' },
    errorHover: { value: '#DC2626', category: 'semantic' },
    errorActive: { value: '#B91C1C', category: 'semantic' },

    info: { value: '#3B82F6', category: 'semantic' },
    infoHover: { value: '#2563EB', category: 'semantic' },
    infoActive: { value: '#1D4ED8', category: 'semantic' },

    neutral: {
      50: { value: '#FAFAFA' },
      100: { value: '#F5F5F5' },
      200: { value: '#E5E5E5' },
      300: { value: '#D4D4D4' },
      400: { value: '#A3A3A3' },
      500: { value: '#737373' },
      600: { value: '#525252' },
      700: { value: '#404040' },
      800: { value: '#262626' },
      900: { value: '#171717' },
    },

    background: {
      default: { value: '#FFFFFF' },
      paper: { value: '#FFFFFF' },
      elevated: { value: '#FFFFFF' },
      overlay: { value: 'rgba(0, 0, 0, 0.5)' },
    },

    text: {
      primary: { value: '#171717' },
      secondary: { value: '#525252' },
      disabled: { value: '#A3A3A3' },
      inverse: { value: '#FFFFFF' },
    },

    border: {
      default: { value: '#E5E5E5' },
      light: { value: '#F5F5F5' },
      dark: { value: '#D4D4D4' },
    },

    divider: { value: '#E5E5E5' },
  },

  typography: {
    fontFamily: {
      sans: {
        value:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
      serif: { value: 'Georgia, Cambria, "Times New Roman", Times, serif' },
      mono: {
        value:
          'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
      },
      display: {
        value:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
    },

    fontSize: {
      xs: { value: 0.75 },
      sm: { value: 0.875 },
      base: { value: 1 },
      lg: { value: 1.125 },
      xl: { value: 1.25 },
      '2xl': { value: 1.5 },
      '3xl': { value: 1.875 },
      '4xl': { value: 2.25 },
      '5xl': { value: 3 },
    },

    fontWeight: {
      light: { value: 300 },
      regular: { value: 400 },
      medium: { value: 500 },
      semibold: { value: 600 },
      bold: { value: 700 },
      extrabold: { value: 800 },
    },

    lineHeight: {
      tight: { value: 1.25 },
      normal: { value: 1.5 },
      relaxed: { value: 1.75 },
      loose: { value: 2 },
    },

    letterSpacing: {
      tight: { value: -0.025 },
      normal: { value: 0 },
      wide: { value: 0.025 },
    },
  },

  spacing: {
    '0': { value: 0 },
    '1': { value: 0.25 },
    '2': { value: 0.5 },
    '3': { value: 0.75 },
    '4': { value: 1 },
    '5': { value: 1.25 },
    '6': { value: 1.5 },
    '8': { value: 2 },
    '10': { value: 2.5 },
    '12': { value: 3 },
    '16': { value: 4 },
    '20': { value: 5 },
    '24': { value: 6 },
    '32': { value: 8 },
    '40': { value: 10 },
    '48': { value: 12 },
    '64': { value: 16 },
    '80': { value: 20 },
    '96': { value: 24 },
  },

  radius: {
    none: { value: 0 },
    xs: { value: 0.125 },
    sm: { value: 0.25 },
    md: { value: 0.375 },
    lg: { value: 0.5 },
    xl: { value: 0.75 },
    '2xl': { value: 1 },
    '3xl': { value: 1.5 },
    full: { value: 9999 },
  },

  shadows: {
    xs: { value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    sm: { value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' },
    md: { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
    lg: { value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
    xl: { value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    '2xl': { value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
    inner: { value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' },
    none: { value: 'none' },
  },

  zIndex: {
    dropdown: { value: 1000 },
    sticky: { value: 1020 },
    fixed: { value: 1030 },
    modalBackdrop: { value: 1040 },
    modal: { value: 1050 },
    popover: { value: 1060 },
    tooltip: { value: 1070 },
  },

  animation: {
    duration: {
      fast: { value: 150 },
      normal: { value: 300 },
      slow: { value: 500 },
    },
    easing: {
      easeIn: { value: 'cubic-bezier(0.4, 0, 1, 1)' },
      easeOut: { value: 'cubic-bezier(0, 0, 0.2, 1)' },
      easeInOut: { value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      bounce: { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },
  },
};

export const defaultDarkTokens: DesignTokens = {
  colors: {
    primary: { value: '#60A5FA', category: 'brand' },
    primaryHover: { value: '#3B82F6', category: 'brand' },
    primaryActive: { value: '#2563EB', category: 'brand' },
    primaryLight: { value: '#93C5FD', category: 'brand' },
    primaryDark: { value: '#1E40AF', category: 'brand' },

    secondary: { value: '#A78BFA', category: 'brand' },
    secondaryHover: { value: '#8B5CF6', category: 'brand' },
    secondaryActive: { value: '#7C3AED', category: 'brand' },
    secondaryLight: { value: '#C4B5FD', category: 'brand' },
    secondaryDark: { value: '#5B21B6', category: 'brand' },

    success: { value: '#34D399', category: 'semantic' },
    successHover: { value: '#10B981', category: 'semantic' },
    successActive: { value: '#059669', category: 'semantic' },

    warning: { value: '#FBBF24', category: 'semantic' },
    warningHover: { value: '#F59E0B', category: 'semantic' },
    warningActive: { value: '#D97706', category: 'semantic' },

    error: { value: '#F87171', category: 'semantic' },
    errorHover: { value: '#EF4444', category: 'semantic' },
    errorActive: { value: '#DC2626', category: 'semantic' },

    info: { value: '#60A5FA', category: 'semantic' },
    infoHover: { value: '#3B82F6', category: 'semantic' },
    infoActive: { value: '#2563EB', category: 'semantic' },

    neutral: {
      50: { value: '#FAFAFA' },
      100: { value: '#F5F5F5' },
      200: { value: '#E5E5E5' },
      300: { value: '#D4D4D4' },
      400: { value: '#A3A3A3' },
      500: { value: '#737373' },
      600: { value: '#525252' },
      700: { value: '#404040' },
      800: { value: '#262626' },
      900: { value: '#171717' },
    },

    background: {
      default: { value: '#0A0A0A' },
      paper: { value: '#171717' },
      elevated: { value: '#262626' },
      overlay: { value: 'rgba(0, 0, 0, 0.7)' },
    },

    text: {
      primary: { value: '#FAFAFA' },
      secondary: { value: '#A3A3A3' },
      disabled: { value: '#525252' },
      inverse: { value: '#0A0A0A' },
    },

    border: {
      default: { value: '#262626' },
      light: { value: '#404040' },
      dark: { value: '#171717' },
    },

    divider: { value: '#262626' },
  },

  typography: {
    fontFamily: {
      sans: {
        value:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
      serif: { value: 'Georgia, Cambria, "Times New Roman", Times, serif' },
      mono: {
        value:
          'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
      },
      display: {
        value:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      },
    },

    fontSize: {
      xs: { value: 0.75 },
      sm: { value: 0.875 },
      base: { value: 1 },
      lg: { value: 1.125 },
      xl: { value: 1.25 },
      '2xl': { value: 1.5 },
      '3xl': { value: 1.875 },
      '4xl': { value: 2.25 },
      '5xl': { value: 3 },
    },

    fontWeight: {
      light: { value: 300 },
      regular: { value: 400 },
      medium: { value: 500 },
      semibold: { value: 600 },
      bold: { value: 700 },
      extrabold: { value: 800 },
    },

    lineHeight: {
      tight: { value: 1.25 },
      normal: { value: 1.5 },
      relaxed: { value: 1.75 },
      loose: { value: 2 },
    },

    letterSpacing: {
      tight: { value: -0.025 },
      normal: { value: 0 },
      wide: { value: 0.025 },
    },
  },

  spacing: {
    '0': { value: 0 },
    '1': { value: 0.25 },
    '2': { value: 0.5 },
    '3': { value: 0.75 },
    '4': { value: 1 },
    '5': { value: 1.25 },
    '6': { value: 1.5 },
    '8': { value: 2 },
    '10': { value: 2.5 },
    '12': { value: 3 },
    '16': { value: 4 },
    '20': { value: 5 },
    '24': { value: 6 },
    '32': { value: 8 },
    '40': { value: 10 },
    '48': { value: 12 },
    '64': { value: 16 },
    '80': { value: 20 },
    '96': { value: 24 },
  },

  radius: {
    none: { value: 0 },
    xs: { value: 0.125 },
    sm: { value: 0.25 },
    md: { value: 0.375 },
    lg: { value: 0.5 },
    xl: { value: 0.75 },
    '2xl': { value: 1 },
    '3xl': { value: 1.5 },
    full: { value: 9999 },
  },

  shadows: {
    xs: { value: '0 1px 2px 0 rgba(0, 0, 0, 0.3)' },
    sm: { value: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)' },
    md: { value: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)' },
    lg: { value: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' },
    xl: { value: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)' },
    '2xl': { value: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' },
    inner: { value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)' },
    none: { value: 'none' },
  },

  zIndex: {
    dropdown: { value: 1000 },
    sticky: { value: 1020 },
    fixed: { value: 1030 },
    modalBackdrop: { value: 1040 },
    modal: { value: 1050 },
    popover: { value: 1060 },
    tooltip: { value: 1070 },
  },

  animation: {
    duration: {
      fast: { value: 150 },
      normal: { value: 300 },
      slow: { value: 500 },
    },
    easing: {
      easeIn: { value: 'cubic-bezier(0.4, 0, 1, 1)' },
      easeOut: { value: 'cubic-bezier(0, 0, 0.2, 1)' },
      easeInOut: { value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      bounce: { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    },
  },
};

export const defaultThemes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Default light theme',
    mode: 'light',
    tokens: defaultLightTokens,
    tags: ['default', 'light'],
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Default dark theme',
    mode: 'dark',
    tokens: defaultDarkTokens,
    tags: ['default', 'dark'],
  },
];
