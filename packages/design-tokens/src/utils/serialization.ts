import { DesignTokens, SerializedTokens, ThemeExportFormat } from '../types';

export function serializeTokens(tokens: DesignTokens, version: string = '1.0.0'): SerializedTokens {
  return {
    version,
    tokens,
    metadata: {
      generatedAt: new Date().toISOString(),
      generator: '@wysiwyg-editor/design-tokens',
    },
  };
}

export function deserializeTokens(data: SerializedTokens): DesignTokens {
  return data.tokens;
}

export function exportToJSON(tokens: DesignTokens): string {
  const serialized = serializeTokens(tokens);
  return JSON.stringify(serialized, null, 2);
}

export function exportToCSS(tokens: DesignTokens, themeId?: string): string {
  const { generateCSSString, generateCSSForTheme } = require('./cssVariables');

  if (themeId) {
    return generateCSSForTheme(themeId, tokens);
  }

  return generateCSSString(tokens);
}

export function exportToSCSS(tokens: DesignTokens): string {
  const variables = require('./cssVariables').generateCSSVariables(tokens);

  const scssLines = Object.entries(variables).map(([name, value]) => {
    const varName = name.replace(/--/, '$');
    return `${varName}: ${value};`;
  });

  return scssLines.join('\n');
}

export function exportToJS(tokens: DesignTokens): string {
  const variables = require('./cssVariables').generateCSSVariables(tokens);

  const jsLines = [
    'module.exports = {',
    ...Object.entries(variables).map(([name, value]) => {
      const key = name.replace(/--dt-/, '').replace(/-/g, '_');
      return `  ${key}: '${value}',`;
    }),
    '};',
  ];

  return jsLines.join('\n');
}

export function exportToTS(tokens: DesignTokens): string {
  const variables = require('./cssVariables').generateCSSVariables(tokens);

  const typeLines = [
    'export const tokens = {',
    ...Object.entries(variables).map(([name, value]) => {
      const key = name.replace(/--dt-/, '').replace(/-/g, '_');
      return `  ${key}: '${value}' as const,`;
    }),
    '};',
    '',
    'export type TokenName = keyof typeof tokens;',
    '',
    'export function getToken(name: TokenName): string {',
    '  return tokens[name];',
    '}',
  ];

  return typeLines.join('\n');
}

export function exportAllFormats(tokens: DesignTokens, themeId?: string): ThemeExportFormat {
  return {
    json: exportToJSON(tokens),
    css: exportToCSS(tokens, themeId),
    scss: exportToSCSS(tokens),
    js: exportToJS(tokens),
    ts: exportToTS(tokens),
  };
}

export function importFromJSON(jsonString: string): DesignTokens {
  const data = JSON.parse(jsonString);
  return deserializeTokens(data);
}

export function validateTokenStructure(tokens: any): boolean {
  if (!tokens || typeof tokens !== 'object') {
    return false;
  }

  const requiredCategories = [
    'colors',
    'typography',
    'spacing',
    'radius',
    'shadows',
    'zIndex',
    'animation',
  ];

  return requiredCategories.every((category) => {
    if (!tokens[category] || typeof tokens[category] !== 'object') {
      return false;
    }

    return Object.values(tokens[category]).every(
      (value: any) =>
        (typeof value === 'object' && 'value' in value) ||
        (typeof value === 'object' &&
          Object.values(value).every((v: any) => typeof v === 'object' && 'value' in v))
    );
  });
}
