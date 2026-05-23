import { DesignTokens } from '../types';

export interface StyleUtils {
  spacing: (value: number) => string;
  radius: (value: number) => string;
  shadow: (value: string) => string;
  color: (value: string) => string;
  fontSize: (value: number) => string;
  fontWeight: (value: number) => string;
  lineHeight: (value: number) => string;
  zIndex: (value: number) => string;
}

export function createStyleUtils(tokens: DesignTokens): StyleUtils {
  return {
    spacing: (value: number) => {
      const spacingKey = Object.keys(tokens.spacing).find(
        (key) => tokens.spacing[key as keyof typeof tokens.spacing].value === value
      );
      return spacingKey ? `var(--dt-spacing-${spacingKey})` : `${value}rem`;
    },

    radius: (value: number) => {
      const radiusKey = Object.keys(tokens.radius).find(
        (key) => tokens.radius[key as keyof typeof tokens.radius].value === value
      );
      return radiusKey ? `var(--dt-radius-${radiusKey})` : `${value}rem`;
    },

    shadow: (value: string) => {
      const shadowKey = Object.keys(tokens.shadows).find(
        (key) => tokens.shadows[key as keyof typeof tokens.shadows].value === value
      );
      return shadowKey ? `var(--dt-shadows-${shadowKey})` : value;
    },

    color: (value: string) => {
      const colorKey = Object.keys(tokens.colors).find((key) => {
        const color = tokens.colors[key as keyof typeof tokens.colors];
        if (typeof color === 'object' && 'value' in color) {
          return color.value === value;
        }
        return false;
      });
      return colorKey ? `var(--dt-colors-${colorKey})` : value;
    },

    fontSize: (value: number) => {
      const sizeKey = Object.keys(tokens.typography.fontSize).find(
        (key) =>
          tokens.typography.fontSize[key as keyof typeof tokens.typography.fontSize].value === value
      );
      return sizeKey ? `var(--dt-typography-font-size-${sizeKey})` : `${value}rem`;
    },

    fontWeight: (value: number) => {
      const weightKey = Object.keys(tokens.typography.fontWeight).find(
        (key) =>
          tokens.typography.fontWeight[key as keyof typeof tokens.typography.fontWeight].value ===
          value
      );
      return weightKey ? `var(--dt-typography-font-weight-${weightKey})` : String(value);
    },

    lineHeight: (value: number) => {
      const heightKey = Object.keys(tokens.typography.lineHeight).find(
        (key) =>
          tokens.typography.lineHeight[key as keyof typeof tokens.typography.lineHeight].value ===
          value
      );
      return heightKey ? `var(--dt-typography-line-height-${heightKey})` : String(value);
    },

    zIndex: (value: number) => {
      const zIndexKey = Object.keys(tokens.zIndex).find(
        (key) => tokens.zIndex[key as keyof typeof tokens.zIndex].value === value
      );
      return zIndexKey ? `var(--dt-z-index-${zIndexKey})` : String(value);
    },
  };
}

export function createUtilityClasses(tokens: DesignTokens): Record<string, string> {
  const utils = createStyleUtils(tokens);

  return {
    // Spacing utilities
    'p-0': `padding: ${utils.spacing(0)};`,
    'p-1': `padding: ${utils.spacing(1)};`,
    'p-2': `padding: ${utils.spacing(2)};`,
    'p-3': `padding: ${utils.spacing(3)};`,
    'p-4': `padding: ${utils.spacing(4)};`,
    'p-6': `padding: ${utils.spacing(6)};`,
    'p-8': `padding: ${utils.spacing(8)};`,

    'm-0': `margin: ${utils.spacing(0)};`,
    'm-1': `margin: ${utils.spacing(1)};`,
    'm-2': `margin: ${utils.spacing(2)};`,
    'm-3': `margin: ${utils.spacing(3)};`,
    'm-4': `margin: ${utils.spacing(4)};`,
    'm-6': `margin: ${utils.spacing(6)};`,
    'm-8': `margin: ${utils.spacing(8)};`,

    // Radius utilities
    'rounded-none': `border-radius: ${utils.radius(0)};`,
    'rounded-sm': `border-radius: ${utils.radius(tokens.radius.sm.value)};`,
    'rounded-md': `border-radius: ${utils.radius(tokens.radius.md.value)};`,
    'rounded-lg': `border-radius: ${utils.radius(tokens.radius.lg.value)};`,
    'rounded-xl': `border-radius: ${utils.radius(tokens.radius.xl.value)};`,
    'rounded-full': `border-radius: ${utils.radius(tokens.radius.full.value)};`,

    // Shadow utilities
    'shadow-sm': `box-shadow: ${utils.shadow(tokens.shadows.sm.value)};`,
    'shadow-md': `box-shadow: ${utils.shadow(tokens.shadows.md.value)};`,
    'shadow-lg': `box-shadow: ${utils.shadow(tokens.shadows.lg.value)};`,
    'shadow-xl': `box-shadow: ${utils.shadow(tokens.shadows.xl.value)};`,
    'shadow-none': `box-shadow: ${utils.shadow(tokens.shadows.none.value)};`,

    // Typography utilities
    'text-xs': `font-size: ${utils.fontSize(tokens.typography.fontSize.xs.value)};`,
    'text-sm': `font-size: ${utils.fontSize(tokens.typography.fontSize.sm.value)};`,
    'text-base': `font-size: ${utils.fontSize(tokens.typography.fontSize.base.value)};`,
    'text-lg': `font-size: ${utils.fontSize(tokens.typography.fontSize.lg.value)};`,
    'text-xl': `font-size: ${utils.fontSize(tokens.typography.fontSize.xl.value)};`,
    'text-2xl': `font-size: ${utils.fontSize(tokens.typography.fontSize['2xl'].value)};`,

    'font-light': `font-weight: ${utils.fontWeight(tokens.typography.fontWeight.light.value)};`,
    'font-normal': `font-weight: ${utils.fontWeight(tokens.typography.fontWeight.regular.value)};`,
    'font-medium': `font-weight: ${utils.fontWeight(tokens.typography.fontWeight.medium.value)};`,
    'font-semibold': `font-weight: ${utils.fontWeight(tokens.typography.fontWeight.semibold.value)};`,
    'font-bold': `font-weight: ${utils.fontWeight(tokens.typography.fontWeight.bold.value)};`,

    'leading-tight': `line-height: ${utils.lineHeight(tokens.typography.lineHeight.tight.value)};`,
    'leading-normal': `line-height: ${utils.lineHeight(tokens.typography.lineHeight.normal.value)};`,
    'leading-relaxed': `line-height: ${utils.lineHeight(tokens.typography.lineHeight.relaxed.value)};`,
  };
}

export function createResponsiveStyles(
  tokens: DesignTokens,
  breakpoint: 'sm' | 'md' | 'lg' | 'xl'
): string {
  const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  };

  return `@media (min-width: ${breakpoints[breakpoint]})`;
}
