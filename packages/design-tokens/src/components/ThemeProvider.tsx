import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeMode, ThemeConfig } from '../types';
import { defaultThemes } from '../tokens/default';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setTheme: (themeId: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  availableThemes: Theme[];
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  config?: Partial<ThemeConfig>;
  defaultTheme?: string;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({
  children,
  config,
  defaultTheme = 'light',
  defaultMode = 'light',
}: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultMode);
  const [currentThemeId, setCurrentThemeId] = useState<string>(defaultTheme);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(defaultThemes);

  const themeConfig: ThemeConfig = {
    defaultTheme,
    themes: defaultThemes,
    enableDarkMode: true,
    enableThemeSwitcher: true,
    themeStorageKey: 'wysiwyg-editor-theme',
    ...config,
  };

  // Load saved theme from localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !themeConfig.themeStorageKey) return;

    try {
      const savedTheme = localStorage.getItem(themeConfig.themeStorageKey);
      if (savedTheme) {
        const parsed = JSON.parse(savedTheme);
        if (parsed.themeId) setCurrentThemeId(parsed.themeId);
        if (parsed.mode) setThemeModeState(parsed.mode);
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
  }, [themeConfig.themeStorageKey]);

  // Apply theme to document
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const theme = availableThemes.find((t) => t.id === currentThemeId);

    if (theme) {
      // Apply theme-specific variables
      root.setAttribute('data-theme', theme.id);

      // Apply dark mode if needed
      if (
        themeMode === 'dark' ||
        (themeMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [currentThemeId, themeMode, availableThemes]);

  // Save theme to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !themeConfig.themeStorageKey) return;

    try {
      localStorage.setItem(
        themeConfig.themeStorageKey,
        JSON.stringify({ themeId: currentThemeId, mode: themeMode })
      );
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [currentThemeId, themeMode, themeConfig.themeStorageKey]);

  const setTheme = (themeId: string) => {
    const newTheme = availableThemes.find((t) => t.id === themeId);
    if (newTheme) {
      setCurrentThemeId(themeId);
      if (newTheme.mode !== 'auto') {
        setThemeModeState(newTheme.mode);
      }
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const currentTheme = availableThemes.find((t) => t.id === currentThemeId) || availableThemes[0];
  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'auto' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        themeMode,
        setTheme,
        setThemeMode,
        availableThemes,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
