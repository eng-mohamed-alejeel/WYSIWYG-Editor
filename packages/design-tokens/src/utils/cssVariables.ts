import { DesignTokens, CSSVariableConfig, CSSVariableMapping } from '../types';

const DEFAULT_CONFIG: Required<CSSVariableConfig> = {
  prefix: 'dt',
  scope: ':root',
  format: 'kebab-case',
};

function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function formatVariableName(name: string, format: 'camelCase' | 'kebab-case'): string {
  return format === 'camelCase' ? toCamelCase(name) : toKebabCase(name);
}

function generateVariableName(path: string[], config: Required<CSSVariableConfig>): string {
  const formattedPath = path.map((segment) => formatVariableName(segment, config.format));
  return `--${config.prefix}-${formattedPath.join('-')}`;
}

function processTokens(
  tokens: any,
  path: string[] = [],
  config: Required<CSSVariableConfig>,
  mapping: CSSVariableMapping = {}
): CSSVariableMapping {
  Object.entries(tokens).forEach(([key, value]) => {
    const currentPath = [...path, key];

    if (value && typeof value === 'object' && 'value' in value) {
      const varName = generateVariableName(currentPath, config);
      mapping[varName] = value.value;
    } else if (typeof value === 'object') {
      processTokens(value, currentPath, config, mapping);
    }
  });

  return mapping;
}

export function generateCSSVariables(
  tokens: DesignTokens,
  config: CSSVariableConfig = {}
): CSSVariableMapping {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  return processTokens(tokens, [], finalConfig);
}

export function generateCSSString(tokens: DesignTokens, config: CSSVariableConfig = {}): string {
  const variables = generateCSSVariables(tokens, config);
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const cssLines = [
    finalConfig.scope || ':root',
    '{',
    ...Object.entries(variables).map(([name, value]) => `  ${name}: ${value};`),
    '}',
  ];

  return cssLines.join('\n');
}

export function generateCSSForTheme(
  themeId: string,
  tokens: DesignTokens,
  config: CSSVariableConfig = {}
): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const variables = generateCSSVariables(tokens, config);

  const cssLines = [
    `[data-theme="${themeId}"]`,
    '{',
    ...Object.entries(variables).map(([name, value]) => `  ${name}: ${value};`),
    '}',
  ];

  return cssLines.join('\n');
}

export function generateMediaQueryCSS(
  tokens: DesignTokens,
  config: CSSVariableConfig = {}
): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const variables = generateCSSVariables(tokens, config);

  const cssLines = [
    '@media (prefers-color-scheme: dark)',
    '{',
    finalConfig.scope || ':root',
    '{',
    ...Object.entries(variables).map(([name, value]) => `    ${name}: ${value};`),
    '}',
    '}',
  ];

  return cssLines.join('\n');
}

export function getCSSVariableValue(path: string[], config: CSSVariableConfig = {}): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const varName = generateVariableName(path, finalConfig);
  return `var(${varName})`;
}

export function createCSSVarAccessor(config: CSSVariableConfig = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return {
    color: (path: string[]) => getCSSVariableValue(['colors', ...path], finalConfig),
    spacing: (path: string[]) => getCSSVariableValue(['spacing', ...path], finalConfig),
    typography: (path: string[]) => getCSSVariableValue(['typography', ...path], finalConfig),
    radius: (path: string[]) => getCSSVariableValue(['radius', ...path], finalConfig),
    shadow: (path: string[]) => getCSSVariableValue(['shadows', ...path], finalConfig),
    zIndex: (path: string[]) => getCSSVariableValue(['zIndex', ...path], finalConfig),
    animation: (path: string[]) => getCSSVariableValue(['animation', ...path], finalConfig),
  };
}
