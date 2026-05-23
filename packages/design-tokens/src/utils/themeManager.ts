import { Theme, DesignTokens, ThemeConfig } from '../types';
import { defaultThemes } from '../tokens/default';
import { serializeTokens, deserializeTokens, validateTokenStructure } from './serialization';

export class ThemeManager {
  private themes: Map<string, Theme> = new Map();
  private config: ThemeConfig;
  private currentThemeId: string;

  constructor(config?: Partial<ThemeConfig>) {
    this.config = {
      defaultTheme: 'light',
      themes: defaultThemes,
      enableDarkMode: true,
      enableThemeSwitcher: true,
      themeStorageKey: 'wysiwyg-editor-theme',
      ...config,
    };

    // Initialize with default themes
    this.config.themes.forEach((theme) => {
      this.themes.set(theme.id, theme);
    });

    this.currentThemeId = this.config.defaultTheme;
  }

  // Theme management
  addTheme(theme: Theme): void {
    if (validateTokenStructure(theme.tokens)) {
      this.themes.set(theme.id, theme);
    } else {
      throw new Error('Invalid theme token structure');
    }
  }

  removeTheme(themeId: string): boolean {
    // Prevent removing the default theme
    if (themeId === this.config.defaultTheme) {
      return false;
    }
    return this.themes.delete(themeId);
  }

  getTheme(themeId: string): Theme | undefined {
    return this.themes.get(themeId);
  }

  getAllThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  getCurrentTheme(): Theme {
    const theme = this.themes.get(this.currentThemeId);
    if (!theme) {
      throw new Error(`Theme ${this.currentThemeId} not found`);
    }
    return theme;
  }

  setCurrentTheme(themeId: string): void {
    if (this.themes.has(themeId)) {
      this.currentThemeId = themeId;
    } else {
      throw new Error(`Theme ${themeId} not found`);
    }
  }

  // Theme search and filtering
  searchThemes(query: string): Theme[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllThemes().filter(
      (theme) =>
        theme.name.toLowerCase().includes(lowerQuery) ||
        theme.description?.toLowerCase().includes(lowerQuery) ||
        theme.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  filterThemesByMode(mode: 'light' | 'dark' | 'auto'): Theme[] {
    return this.getAllThemes().filter((theme) => theme.mode === mode);
  }

  filterThemesByTags(tags: string[]): Theme[] {
    return this.getAllThemes().filter((theme) => tags.every((tag) => theme.tags?.includes(tag)));
  }

  // Theme import/export for marketplace
  exportTheme(themeId: string): string {
    const theme = this.getTheme(themeId);
    if (!theme) {
      throw new Error(`Theme ${themeId} not found`);
    }
    return JSON.stringify(serializeTokens(theme.tokens), null, 2);
  }

  importTheme(themeData: string, themeId?: string): Theme {
    try {
      const tokens = deserializeTokens(JSON.parse(themeData));
      const id = themeId || `custom-${Date.now()}`;

      const theme: Theme = {
        id,
        name: `Custom Theme ${id}`,
        description: 'Imported custom theme',
        mode: 'light',
        tokens,
        tags: ['custom', 'imported'],
      };

      this.addTheme(theme);
      return theme;
    } catch (error) {
      throw new Error('Failed to import theme: Invalid theme data');
    }
  }

  // Theme validation
  validateTheme(theme: Theme): boolean {
    return validateTokenStructure(theme.tokens);
  }

  // Theme customization
  createCustomTheme(
    baseThemeId: string,
    customizations: Partial<DesignTokens>,
    metadata?: Partial<Theme>
  ): Theme {
    const baseTheme = this.getTheme(baseThemeId);
    if (!baseTheme) {
      throw new Error(`Base theme ${baseThemeId} not found`);
    }

    const customTokens: DesignTokens = {
      colors: { ...baseTheme.tokens.colors, ...customizations.colors },
      typography: { ...baseTheme.tokens.typography, ...customizations.typography },
      spacing: { ...baseTheme.tokens.spacing, ...customizations.spacing },
      radius: { ...baseTheme.tokens.radius, ...customizations.radius },
      shadows: { ...baseTheme.tokens.shadows, ...customizations.shadows },
      zIndex: { ...baseTheme.tokens.zIndex, ...customizations.zIndex },
      animation: { ...baseTheme.tokens.animation, ...customizations.animation },
    };

    const customTheme: Theme = {
      id: metadata?.id || `custom-${Date.now()}`,
      name: metadata?.name || `Custom Theme`,
      description: metadata?.description || `Based on ${baseTheme.name}`,
      mode: metadata?.mode || baseTheme.mode,
      tokens: customTokens,
      tags: metadata?.tags || ['custom'],
      author: metadata?.author,
      version: metadata?.version,
    };

    this.addTheme(customTheme);
    return customTheme;
  }

  // Marketplace support
  async fetchMarketplaceThemes(): Promise<Theme[]> {
    // This is a placeholder for actual marketplace integration
    // In production, this would make API calls to fetch themes from the marketplace
    return [];
  }

  async publishThemeToMarketplace(themeId: string): Promise<boolean> {
    // This is a placeholder for actual marketplace integration
    // In production, this would make API calls to publish the theme
    return false;
  }

  // Theme persistence
  saveTheme(themeId: string): void {
    const theme = this.getTheme(themeId);
    if (!theme) {
      throw new Error(`Theme ${themeId} not found`);
    }

    if (typeof window !== 'undefined' && this.config.themeStorageKey) {
      try {
        localStorage.setItem(
          `${this.config.themeStorageKey}-${themeId}`,
          JSON.stringify(serializeTokens(theme.tokens))
        );
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    }
  }

  loadTheme(themeId: string): Theme | undefined {
    if (typeof window !== 'undefined' && this.config.themeStorageKey) {
      try {
        const data = localStorage.getItem(`${this.config.themeStorageKey}-${themeId}`);
        if (data) {
          const tokens = deserializeTokens(JSON.parse(data));
          const theme: Theme = {
            id: themeId,
            name: `Saved Theme ${themeId}`,
            description: 'Locally saved theme',
            mode: 'light',
            tokens,
            tags: ['saved'],
          };
          this.addTheme(theme);
          return theme;
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    }
    return undefined;
  }

  deleteSavedTheme(themeId: string): void {
    if (typeof window !== 'undefined' && this.config.themeStorageKey) {
      try {
        localStorage.removeItem(`${this.config.themeStorageKey}-${themeId}`);
      } catch (error) {
        console.error('Failed to delete saved theme:', error);
      }
    }
  }

  // Configuration
  updateConfig(config: Partial<ThemeConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): ThemeConfig {
    return this.config;
  }
}

// Singleton instance
let themeManagerInstance: ThemeManager | null = null;

export function getThemeManager(config?: Partial<ThemeConfig>): ThemeManager {
  if (!themeManagerInstance) {
    themeManagerInstance = new ThemeManager(config);
  }
  return themeManagerInstance;
}

export function resetThemeManager(): void {
  themeManagerInstance = null;
}
