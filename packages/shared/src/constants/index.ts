/**
 * Shared Constants for WYSIWYG Visual Component Builder
 * 
 * This module contains all constants used throughout the platform.
 */

/**
 * Default breakpoints for responsive design
 */
export const DEFAULT_BREAKPOINTS = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
} as const;

/**
 * Default theme colors
 */
export const DEFAULT_THEME_COLORS = {
  primary: '#3B82F6',
  secondary: '#6366F1',
  accent: '#8B5CF6',
  background: '#FFFFFF',
  foreground: '#1F2937',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
} as const;

/**
 * Default typography settings
 */
export const DEFAULT_THEME_TYPOGRAPHY = {
  fontFamily: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'Fira Code, monospace'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
} as const;

/**
 * Default spacing scale
 */
export const DEFAULT_THEME_SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem'
} as const;

/**
 * Default border radius values
 */
export const DEFAULT_THEME_BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px'
} as const;

/**
 * Default shadow values
 */
export const DEFAULT_THEME_SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
} as const;

/**
 * Default project settings
 */
export const DEFAULT_PROJECT_SETTINGS = {
  defaultBreakpoint: 'desktop' as const,
  enableAiFeatures: true,
  enableAnalytics: false,
  customScripts: [],
  customStyles: ''
} as const;

/**
 * Default history settings
 */
export const DEFAULT_HISTORY_SETTINGS = {
  maxSize: 100,
  debounceTime: 500
} as const;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  UNDO: ['CmdOrCtrl+Z', 'CmdOrCtrl+Shift+Z'],
  REDO: ['CmdOrCtrl+Shift+Z', 'CmdOrCtrl+Y'],
  COPY: ['CmdOrCtrl+C'],
  PASTE: ['CmdOrCtrl+V'],
  CUT: ['CmdOrCtrl+X'],
  DELETE: ['Delete', 'Backspace'],
  DUPLICATE: ['CmdOrCtrl+D'],
  SAVE: ['CmdOrCtrl+S'],
  EXPORT: ['CmdOrCtrl+E'],
  PREVIEW: ['CmdOrCtrl+P'],
  ZOOM_IN: ['CmdOrCtrl+='],
  ZOOM_OUT: ['CmdOrCtrl+-'],
  ZOOM_RESET: ['CmdOrCtrl+0'],
  SELECT_ALL: ['CmdOrCtrl+A'],
  FIND: ['CmdOrCtrl+F'],
  REPLACE: ['CmdOrCtrl+H']
} as const;

/**
 * Supported export formats
 */
export const EXPORT_FORMATS = {
  HTML: 'html',
  REACT: 'react',
  WORDPRESS: 'wordpress',
  ODOO: 'odoo'
} as const;

/**
 * Supported asset types
 */
export const ASSET_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  FONT: 'font',
  FILE: 'file',
  CODE: 'code'
} as const;

/**
 * Supported image formats
 */
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
] as const;

/**
 * Supported video formats
 */
export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/webm',
  'video/ogg'
] as const;

/**
 * Maximum file sizes (in bytes)
 */
export const MAX_FILE_SIZES = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  AUDIO: 50 * 1024 * 1024, // 50MB
  FONT: 5 * 1024 * 1024, // 5MB
  FILE: 25 * 1024 * 1024 // 25MB
} as const;

/**
 * Default component categories
 */
export const COMPONENT_CATEGORIES = {
  LAYOUT: 'layout',
  TYPOGRAPHY: 'typography',
  MEDIA: 'media',
  FORMS: 'forms',
  ADVANCED: 'advanced',
  ECOMMERCE: 'ecommerce',
  AI: 'ai'
} as const;

/**
 * Default inspector field groups
 */
export const INSPECTOR_GROUPS = {
  CONTENT: 'content',
  STYLE: 'style',
  LAYOUT: 'layout',
  RESPONSIVE: 'responsive',
  ADVANCED: 'advanced',
  AI: 'ai'
} as const;

/**
 * Default zoom levels
 */
export const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2] as const;

/**
 * Default canvas settings
 */
export const DEFAULT_CANVAS_SETTINGS = {
  width: 1200,
  height: 800,
  zoom: 1,
  showGrid: true,
  snapToGrid: true,
  gridSize: 10
} as const;

/**
 * Default sandbox settings
 */
export const DEFAULT_SANDBOX_SETTINGS = {
  sandboxAttributes: [
    'allow-scripts',
    'allow-same-origin',
    'allow-forms',
    'allow-popups'
  ],
  allowExternalScripts: true,
  allowInlineStyles: true,
  enableConsole: false
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  COMPONENT_NOT_FOUND: 'Component not found',
  INVALID_COMPONENT_TYPE: 'Invalid component type',
  INVALID_COMPONENT_ID: 'Invalid component ID',
  PROJECT_NOT_LOADED: 'Project not loaded',
  PAGE_NOT_FOUND: 'Page not found',
  ASSET_NOT_FOUND: 'Asset not found',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_TOO_LARGE: 'File too large',
  EXPORT_FAILED: 'Export failed',
  IMPORT_FAILED: 'Import failed',
  SAVE_FAILED: 'Save failed',
  VALIDATION_ERROR: 'Validation error',
  NETWORK_ERROR: 'Network error',
  PERMISSION_DENIED: 'Permission denied'
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  PROJECT_SAVED: 'Project saved successfully',
  COMPONENT_ADDED: 'Component added successfully',
  COMPONENT_UPDATED: 'Component updated successfully',
  COMPONENT_DELETED: 'Component deleted successfully',
  ASSET_UPLOADED: 'Asset uploaded successfully',
  EXPORT_SUCCESSFUL: 'Export successful',
  IMPORT_SUCCESSFUL: 'Import successful',
  SETTINGS_SAVED: 'Settings saved successfully'
} as const;

/**
 * Warning messages
 */
export const WARNING_MESSAGES = {
  UNSUPPORTED_BROWSER: 'Unsupported browser',
  UNSAVED_CHANGES: 'You have unsaved changes',
  LARGE_FILE_SIZE: 'File size is large, upload may take time',
  COMPONENT_LIMIT_REACHED: 'Component limit reached',
  MEMORY_WARNING: 'Memory usage is high',
  NETWORK_SLOW: 'Network connection is slow'
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  PROJECT: 'wysiwyg_project',
  SETTINGS: 'wysiwyg_settings',
  THEME: 'wysiwyg_theme',
  RECENT_PROJECTS: 'wysiwyg_recent_projects',
  USER_PREFERENCES: 'wysiwyg_user_preferences'
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  PROJECTS: '/api/projects',
  ASSETS: '/api/assets',
  EXPORT: '/api/export',
  IMPORT: '/api/import',
  AI: '/api/ai',
  TEMPLATES: '/api/templates'
} as const;

/**
 * Event names
 */
export const EVENT_NAMES = {
  PROJECT_LOAD: 'project:load',
  PROJECT_SAVE: 'project:save',
  COMPONENT_SELECT: 'component:select',
  COMPONENT_UPDATE: 'component:update',
  COMPONENT_DELETE: 'component:delete',
  COMPONENT_ADD: 'component:add',
  ASSET_UPLOAD: 'asset:upload',
  EXPORT_START: 'export:start',
  EXPORT_COMPLETE: 'export:complete',
  IMPORT_START: 'import:start',
  IMPORT_COMPLETE: 'import:complete',
  ERROR: 'error',
  WARNING: 'warning'
} as const;

/**
 * Default component icons
 */
export const COMPONENT_ICONS = {
  SECTION: 'layout',
  CONTAINER: 'container',
  COLUMN: 'column',
  ROW: 'row',
  HEADING: 'type',
  PARAGRAPH: 'align-left',
  BUTTON: 'mouse-pointer',
  IMAGE: 'image',
  VIDEO: 'video',
  LINK: 'link',
  DIVIDER: 'minus',
  SPACER: 'maximize',
  FORM: 'file-text',
  INPUT: 'input',
  TEXTAREA: 'message-square',
  SELECT: 'list',
  CHECKBOX: 'check-square',
  RADIO: 'radio',
  MAP: 'map',
  SOCIAL: 'share-2',
  ICON: 'smile',
  CODE: 'code',
  EMBED: 'box',
  SLIDER: 'sliders',
  GALLERY: 'grid',
  TABLE: 'table',
  TABS: 'tabs',
  ACCORDION: 'chevron-down',
  ALERT: 'alert-circle',
  BADGE: 'badge',
  CARD: 'credit-card',
  LIST: 'list',
  NAVBAR: 'menu',
  FOOTER: 'layout-footer',
  HERO: 'zap',
  TESTIMONIAL: 'message-circle',
  PRICING: 'dollar-sign',
  FEATURE: 'star',
  TEAM: 'users',
  BLOG: 'file-text',
  CONTACT: 'mail',
  CHART: 'bar-chart',
  CALENDAR: 'calendar',
  COUNTDOWN: 'clock',
  PROGRESS: 'activity',
  SPINNER: 'loader',
  TOOLTIP: 'help-circle',
  MODAL: 'maximize-2',
  DROPDOWN: 'chevron-down',
  POPOVER: 'more-horizontal',
  TOAST: 'bell',
  SKELETON: 'loader-2',
  EMPTY: 'inbox'
} as const;
