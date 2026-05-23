import React from 'react';
import {
  ThemeProvider,
  ThemeSwitcher,
  GlobalStyles,
  useTheme,
  getThemeManager,
  generateCSSVariables,
  exportToJSON,
} from '@wysiwyg-editor/design-tokens';

// Example 1: Basic Setup
function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <Header />
      <MainContent />
      <Footer />
    </ThemeProvider>
  );
}

// Example 2: Using Theme Context
function Header() {
  const { theme, isDark } = useTheme();

  return (
    <header
      style={{
        backgroundColor: theme.tokens.colors.background.elevated.value,
        borderBottom: `1px solid ${theme.tokens.colors.border.default.value}`,
        padding: `${theme.tokens.spacing['4'].value}rem ${theme.tokens.spacing['6'].value}rem`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: `${theme.tokens.typography.fontSize.xl.value}rem`,
            fontWeight: theme.tokens.typography.fontWeight.bold.value,
            color: theme.tokens.colors.text.primary.value,
          }}
        >
          WYSIWYG Editor
        </h1>
        <ThemeSwitcher />
      </div>
    </header>
  );
}

// Example 3: Using CSS Variables
function MainContent() {
  return (
    <main
      style={{
        padding: `${theme.tokens.spacing['6'].value}rem`,
        backgroundColor: 'var(--dt-background-default)',
      }}
    >
      <div className="card">
        <h2 className="card-title">Welcome to the Editor</h2>
        <p className="card-text">This is an example of using CSS variables with design tokens.</p>
        <button className="btn btn-primary">Get Started</button>
      </div>
    </main>
  );
}

// Example 4: Creating Custom Themes
function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();
  const manager = getThemeManager();

  const createCustomTheme = () => {
    const customTheme = manager.createCustomTheme(
      'light',
      {
        colors: {
          primary: { value: '#FF6B6B' },
          primaryHover: { value: '#EE5A5A' },
        },
      },
      {
        name: 'Coral Theme',
        description: 'A theme with coral primary colors',
        tags: ['custom', 'coral'],
      }
    );

    setTheme(customTheme.id);
  };

  return <button onClick={createCustomTheme}>Apply Coral Theme</button>;
}

// Example 5: Exporting Tokens
function TokenExporter() {
  const { theme } = useTheme();

  const exportTokens = () => {
    const json = exportToJSON(theme.tokens);
    console.log(json);
    // Or download as file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme-tokens.json';
    a.click();
  };

  return <button onClick={exportTokens}>Export Theme Tokens</button>;
}

// Example 6: Using CSS Variables Generator
function CSSGenerator() {
  const { theme } = useTheme();

  const variables = generateCSSVariables(theme.tokens);

  return (
    <div>
      <h3>Generated CSS Variables</h3>
      <pre>
        {Object.entries(variables).map(([name, value]) => (
          <div key={name}>
            {name}: {value};
          </div>
        ))}
      </pre>
    </div>
  );
}

// Example 7: Responsive Component
function ResponsiveCard() {
  return (
    <div className="card responsive-card">
      <h3>Responsive Card</h3>
      <p>This card adapts to different screen sizes.</p>
    </div>
  );
}

// Example 8: Theme-aware Component
function ThemeAwareComponent() {
  const { isDark } = useTheme();

  return (
    <div className={`status-indicator ${isDark ? 'dark' : 'light'}`}>
      <span className="status-dot"></span>
      <span className="status-text">{isDark ? 'Dark Mode Active' : 'Light Mode Active'}</span>
    </div>
  );
}

// Example 9: Advanced Theme Management
function ThemeManager() {
  const manager = getThemeManager();

  const handleExportTheme = () => {
    const themeData = manager.exportTheme('light');
    console.log('Exported theme:', themeData);
  };

  const handleImportTheme = () => {
    // In a real app, this would come from a file upload or API
    const themeData = '{"version":"1.0.0","tokens":{...}}';
    const theme = manager.importTheme(themeData, 'imported-theme');
    console.log('Imported theme:', theme);
  };

  const handleSearchThemes = () => {
    const themes = manager.searchThemes('dark');
    console.log('Found themes:', themes);
  };

  return (
    <div>
      <button onClick={handleExportTheme}>Export Theme</button>
      <button onClick={handleImportTheme}>Import Theme</button>
      <button onClick={handleSearchThemes}>Search Themes</button>
    </div>
  );
}

// Example 10: Complete Application
function CompleteApp() {
  return (
    <ThemeProvider
      config={{
        defaultTheme: 'light',
        enableDarkMode: true,
        enableThemeSwitcher: true,
        themeStorageKey: 'wysiwyg-editor-demo',
      }}
    >
      <GlobalStyles />
      <div className="app-container">
        <Header />
        <main className="main-content">
          <ThemeCustomizer />
          <TokenExporter />
          <CSSGenerator />
          <ResponsiveCard />
          <ThemeAwareComponent />
          <ThemeManager />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      style={{
        backgroundColor: theme.tokens.colors.background.elevated.value,
        borderTop: `1px solid ${theme.tokens.colors.border.default.value}`,
        padding: `${theme.tokens.spacing['4'].value}rem`,
        textAlign: 'center',
        color: theme.tokens.colors.text.secondary.value,
      }}
    >
      <p>&copy; 2024 WYSIWYG Editor. All rights reserved.</p>
    </footer>
  );
}

export default CompleteApp;
