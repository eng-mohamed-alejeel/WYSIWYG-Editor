import type { CSSProperties } from 'csstype';

// Base token types
export type TokenValue = string | number;

export interface Token<T extends TokenValue = TokenValue> {
  value: T;
  description?: string;
  deprecated?: boolean;
  category?: string;
}

// Color tokens
export interface ColorTokens {
  primary: Token<string>;
  primaryHover: Token<string>;
  primaryActive: Token<string>;
  primaryLight: Token<string>;
  primaryDark: Token<string>;

  secondary: Token<string>;
  secondaryHover: Token<string>;
  secondaryActive: Token<string>;
  secondaryLight: Token<string>;
  secondaryDark: Token<string>;

  success: Token<string>;
  successHover: Token<string>;
  successActive: Token<string>;

  warning: Token<string>;
  warningHover: Token<string>;
  warningActive: Token<string>;

  error: Token<string>;
  errorHover: Token<string>;
  errorActive: Token<string>;

  info: Token<string>;
  infoHover: Token<string>;
  infoActive: Token<string>;

  neutral: {
    50: Token<string>;
    100: Token<string>;
    200: Token<string>;
    300: Token<string>;
    400: Token<string>;
    500: Token<string>;
    600: Token<string>;
    700: Token<string>;
    800: Token<string>;
    900: Token<string>;
  };

  background: {
    default: Token<string>;
    paper: Token<string>;
    elevated: Token<string>;
    overlay: Token<string>;
  };

  text: {
    primary: Token<string>;
    secondary: Token<string>;
    disabled: Token<string>;
    inverse: Token<string>;
  };

  border: {
    default: Token<string>;
    light: Token<string>;
    dark: Token<string>;
  };

  divider: Token<string>;
}

// Typography tokens
export interface TypographyTokens {
  fontFamily: {
    sans: Token<string>;
    serif: Token<string>;
    mono: Token<string>;
    display: Token<string>;
  };

  fontSize: {
    xs: Token<number>;
    sm: Token<number>;
    base: Token<number>;
    lg: Token<number>;
    xl: Token<number>;
    '2xl': Token<number>;
    '3xl': Token<number>;
    '4xl': Token<number>;
    '5xl': Token<number>;
  };

  fontWeight: {
    light: Token<number>;
    regular: Token<number>;
    medium: Token<number>;
    semibold: Token<number>;
    bold: Token<number>;
    extrabold: Token<number>;
  };

  lineHeight: {
    tight: Token<number>;
    normal: Token<number>;
    relaxed: Token<number>;
    loose: Token<number>;
  };

  letterSpacing: {
    tight: Token<number>;
    normal: Token<number>;
    wide: Token<number>;
  };
}

// Spacing tokens
export interface SpacingTokens {
  '0': Token<number>;
  '1': Token<number>;
  '2': Token<number>;
  '3': Token<number>;
  '4': Token<number>;
  '5': Token<number>;
  '6': Token<number>;
  '8': Token<number>;
  '10': Token<number>;
  '12': Token<number>;
  '16': Token<number>;
  '20': Token<number>;
  '24': Token<number>;
  '32': Token<number>;
  '40': Token<number>;
  '48': Token<number>;
  '64': Token<number>;
  '80': Token<number>;
  '96': Token<number>;
}

// Radius tokens
export interface RadiusTokens {
  none: Token<number>;
  xs: Token<number>;
  sm: Token<number>;
  md: Token<number>;
  lg: Token<number>;
  xl: Token<number>;
  '2xl': Token<number>;
  '3xl': Token<number>;
  full: Token<number>;
}

// Shadow tokens
export interface ShadowTokens {
  xs: Token<string>;
  sm: Token<string>;
  md: Token<string>;
  lg: Token<string>;
  xl: Token<string>;
  '2xl': Token<string>;
  inner: Token<string>;
  none: Token<string>;
}

// Z-index tokens
export interface ZIndexTokens {
  dropdown: Token<number>;
  sticky: Token<number>;
  fixed: Token<number>;
  modalBackdrop: Token<number>;
  modal: Token<number>;
  popover: Token<number>;
  tooltip: Token<number>;
}

// Animation tokens
export interface AnimationTokens {
  duration: {
    fast: Token<number>;
    normal: Token<number>;
    slow: Token<number>;
  };
  easing: {
    easeIn: Token<string>;
    easeOut: Token<string>;
    easeInOut: Token<string>;
    bounce: Token<string>;
  };
}

// Complete design token set
export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadows: ShadowTokens;
  zIndex: ZIndexTokens;
  animation: AnimationTokens;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface Theme {
  id: string;
  name: string;
  description?: string;
  mode: ThemeMode;
  tokens: DesignTokens;
  preview?: string;
  author?: string;
  version?: string;
  tags?: string[];
}

export interface ThemeConfig {
  defaultTheme: string;
  themes: Theme[];
  enableDarkMode: boolean;
  enableThemeSwitcher: boolean;
  themeStorageKey?: string;
}

// CSS variable types
export interface CSSVariableMapping {
  [key: string]: string;
}

export interface CSSVariableConfig {
  prefix?: string;
  scope?: string;
  format?: 'camelCase' | 'kebab-case';
}

// Token serialization types
export interface SerializedTokens {
  version: string;
  tokens: DesignTokens;
  metadata?: {
    generatedAt: string;
    generator: string;
  };
}

export interface ThemeExportFormat {
  json: SerializedTokens;
  css: string;
  scss: string;
  js: string;
  ts: string;
}
