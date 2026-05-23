import React from 'react';
import { useTheme } from './ThemeProvider';
import { ThemeMode } from '../types';

interface ThemeSwitcherProps {
  className?: string;
  showLabels?: boolean;
  iconSize?: number;
}

export function ThemeSwitcher({
  className = '',
  showLabels = false,
  iconSize = 20,
}: ThemeSwitcherProps) {
  const { themeMode, setThemeMode, availableThemes, theme } = useTheme();

  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handleThemeChange = (themeId: string) => {
    setThemeMode('auto');
    // Find and set the theme
    const selectedTheme = availableThemes.find((t) => t.id === themeId);
    if (selectedTheme) {
      setThemeMode(selectedTheme.mode);
    }
  };

  return (
    <div className={`theme-switcher ${className}`}>
      {/* Theme Mode Toggle */}
      <div className="theme-mode-toggle">
        <button
          onClick={() => handleThemeModeChange('light')}
          className={`theme-mode-button ${themeMode === 'light' ? 'active' : ''}`}
          aria-label="Light mode"
          title="Light mode"
        >
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          {showLabels && <span className="theme-label">Light</span>}
        </button>

        <button
          onClick={() => handleThemeModeChange('dark')}
          className={`theme-mode-button ${themeMode === 'dark' ? 'active' : ''}`}
          aria-label="Dark mode"
          title="Dark mode"
        >
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          {showLabels && <span className="theme-label">Dark</span>}
        </button>

        <button
          onClick={() => handleThemeModeChange('auto')}
          className={`theme-mode-button ${themeMode === 'auto' ? 'active' : ''}`}
          aria-label="Auto mode"
          title="Auto mode"
        >
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="9" x2="9" y2="9" />
            <line x1="15" y1="9" x2="15" y2="9" />
            <line x1="9" y1="15" x2="9" y2="15" />
            <line x1="15" y1="15" x2="15" y2="15" />
          </svg>
          {showLabels && <span className="theme-label">Auto</span>}
        </button>
      </div>

      {/* Theme Selector */}
      {availableThemes.length > 2 && (
        <div className="theme-selector">
          <select
            value={theme.id}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="theme-select"
            aria-label="Select theme"
          >
            {availableThemes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <style jsx>{`
        .theme-switcher {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .theme-mode-toggle {
          display: flex;
          gap: 0.25rem;
          padding: 0.25rem;
          border-radius: 0.5rem;
          background-color: var(--dt-background-elevated);
          border: 1px solid var(--dt-border-default);
        }

        .theme-mode-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border: none;
          border-radius: 0.375rem;
          background: transparent;
          color: var(--dt-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-mode-button:hover {
          background-color: var(--dt-background-overlay);
          color: var(--dt-text-primary);
        }

        .theme-mode-button.active {
          background-color: var(--dt-primary);
          color: var(--dt-text-inverse);
        }

        .theme-label {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .theme-selector {
          margin-left: 0.5rem;
        }

        .theme-select {
          padding: 0.5rem;
          border-radius: 0.375rem;
          border: 1px solid var(--dt-border-default);
          background-color: var(--dt-background-elevated);
          color: var(--dt-text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .theme-select:hover {
          border-color: var(--dt-primary);
        }

        .theme-select:focus {
          outline: none;
          border-color: var(--dt-primary);
          box-shadow: 0 0 0 2px var(--dt-primary-light);
        }
      `}</style>
    </div>
  );
}
