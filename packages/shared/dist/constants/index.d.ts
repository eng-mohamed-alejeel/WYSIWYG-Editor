/**
 * Shared Constants for WYSIWYG Visual Component Builder
 *
 * This module contains all constants used throughout the platform.
 */
/**
 * Default breakpoints for responsive design
 */
export declare const DEFAULT_BREAKPOINTS: {
    readonly mobile: "640px";
    readonly tablet: "768px";
    readonly desktop: "1024px";
    readonly wide: "1280px";
};
/**
 * Default theme colors
 */
export declare const DEFAULT_THEME_COLORS: {
    readonly primary: "#3B82F6";
    readonly secondary: "#6366F1";
    readonly accent: "#8B5CF6";
    readonly background: "#FFFFFF";
    readonly foreground: "#1F2937";
    readonly success: "#10B981";
    readonly warning: "#F59E0B";
    readonly error: "#EF4444";
    readonly info: "#3B82F6";
};
/**
 * Default typography settings
 */
export declare const DEFAULT_THEME_TYPOGRAPHY: {
    readonly fontFamily: {
        readonly heading: "Inter, system-ui, sans-serif";
        readonly body: "Inter, system-ui, sans-serif";
        readonly mono: "Fira Code, monospace";
    };
    readonly fontSize: {
        readonly xs: "0.75rem";
        readonly sm: "0.875rem";
        readonly base: "1rem";
        readonly lg: "1.125rem";
        readonly xl: "1.25rem";
        readonly '2xl': "1.5rem";
        readonly '3xl': "1.875rem";
        readonly '4xl': "2.25rem";
    };
    readonly fontWeight: {
        readonly light: 300;
        readonly normal: 400;
        readonly medium: 500;
        readonly semibold: 600;
        readonly bold: 700;
    };
    readonly lineHeight: {
        readonly tight: 1.25;
        readonly normal: 1.5;
        readonly relaxed: 1.75;
    };
};
/**
 * Default spacing scale
 */
export declare const DEFAULT_THEME_SPACING: {
    readonly xs: "0.25rem";
    readonly sm: "0.5rem";
    readonly md: "1rem";
    readonly lg: "1.5rem";
    readonly xl: "2rem";
    readonly '2xl': "3rem";
};
/**
 * Default border radius values
 */
export declare const DEFAULT_THEME_BORDER_RADIUS: {
    readonly none: "0";
    readonly sm: "0.125rem";
    readonly md: "0.375rem";
    readonly lg: "0.5rem";
    readonly xl: "0.75rem";
    readonly full: "9999px";
};
/**
 * Default shadow values
 */
export declare const DEFAULT_THEME_SHADOWS: {
    readonly sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
    readonly md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
    readonly lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
    readonly xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
};
/**
 * Default project settings
 */
export declare const DEFAULT_PROJECT_SETTINGS: {
    readonly defaultBreakpoint: "desktop";
    readonly enableAiFeatures: true;
    readonly enableAnalytics: false;
    readonly customScripts: readonly [];
    readonly customStyles: "";
};
/**
 * Default history settings
 */
export declare const DEFAULT_HISTORY_SETTINGS: {
    readonly maxSize: 100;
    readonly debounceTime: 500;
};
/**
 * Keyboard shortcuts
 */
export declare const KEYBOARD_SHORTCUTS: {
    readonly UNDO: readonly ["CmdOrCtrl+Z", "CmdOrCtrl+Shift+Z"];
    readonly REDO: readonly ["CmdOrCtrl+Shift+Z", "CmdOrCtrl+Y"];
    readonly COPY: readonly ["CmdOrCtrl+C"];
    readonly PASTE: readonly ["CmdOrCtrl+V"];
    readonly CUT: readonly ["CmdOrCtrl+X"];
    readonly DELETE: readonly ["Delete", "Backspace"];
    readonly DUPLICATE: readonly ["CmdOrCtrl+D"];
    readonly SAVE: readonly ["CmdOrCtrl+S"];
    readonly EXPORT: readonly ["CmdOrCtrl+E"];
    readonly PREVIEW: readonly ["CmdOrCtrl+P"];
    readonly ZOOM_IN: readonly ["CmdOrCtrl+="];
    readonly ZOOM_OUT: readonly ["CmdOrCtrl+-"];
    readonly ZOOM_RESET: readonly ["CmdOrCtrl+0"];
    readonly SELECT_ALL: readonly ["CmdOrCtrl+A"];
    readonly FIND: readonly ["CmdOrCtrl+F"];
    readonly REPLACE: readonly ["CmdOrCtrl+H"];
};
/**
 * Supported export formats
 */
export declare const EXPORT_FORMATS: {
    readonly HTML: "html";
    readonly REACT: "react";
    readonly WORDPRESS: "wordpress";
    readonly ODOO: "odoo";
};
/**
 * Supported asset types
 */
export declare const ASSET_TYPES: {
    readonly IMAGE: "image";
    readonly VIDEO: "video";
    readonly AUDIO: "audio";
    readonly FONT: "font";
    readonly FILE: "file";
    readonly CODE: "code";
};
/**
 * Supported image formats
 */
export declare const SUPPORTED_IMAGE_FORMATS: readonly ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
/**
 * Supported video formats
 */
export declare const SUPPORTED_VIDEO_FORMATS: readonly ["video/mp4", "video/webm", "video/ogg"];
/**
 * Maximum file sizes (in bytes)
 */
export declare const MAX_FILE_SIZES: {
    readonly IMAGE: number;
    readonly VIDEO: number;
    readonly AUDIO: number;
    readonly FONT: number;
    readonly FILE: number;
};
/**
 * Default component categories
 */
export declare const COMPONENT_CATEGORIES: {
    readonly LAYOUT: "layout";
    readonly TYPOGRAPHY: "typography";
    readonly MEDIA: "media";
    readonly FORMS: "forms";
    readonly ADVANCED: "advanced";
    readonly ECOMMERCE: "ecommerce";
    readonly AI: "ai";
};
/**
 * Default inspector field groups
 */
export declare const INSPECTOR_GROUPS: {
    readonly CONTENT: "content";
    readonly STYLE: "style";
    readonly LAYOUT: "layout";
    readonly RESPONSIVE: "responsive";
    readonly ADVANCED: "advanced";
    readonly AI: "ai";
};
/**
 * Default zoom levels
 */
export declare const ZOOM_LEVELS: readonly [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
/**
 * Default canvas settings
 */
export declare const DEFAULT_CANVAS_SETTINGS: {
    readonly width: 1200;
    readonly height: 800;
    readonly zoom: 1;
    readonly showGrid: true;
    readonly snapToGrid: true;
    readonly gridSize: 10;
};
/**
 * Default sandbox settings
 */
export declare const DEFAULT_SANDBOX_SETTINGS: {
    readonly sandboxAttributes: readonly ["allow-scripts", "allow-same-origin", "allow-forms", "allow-popups"];
    readonly allowExternalScripts: true;
    readonly allowInlineStyles: true;
    readonly enableConsole: false;
};
/**
 * Error messages
 */
export declare const ERROR_MESSAGES: {
    readonly COMPONENT_NOT_FOUND: "Component not found";
    readonly INVALID_COMPONENT_TYPE: "Invalid component type";
    readonly INVALID_COMPONENT_ID: "Invalid component ID";
    readonly PROJECT_NOT_LOADED: "Project not loaded";
    readonly PAGE_NOT_FOUND: "Page not found";
    readonly ASSET_NOT_FOUND: "Asset not found";
    readonly INVALID_FILE_TYPE: "Invalid file type";
    readonly FILE_TOO_LARGE: "File too large";
    readonly EXPORT_FAILED: "Export failed";
    readonly IMPORT_FAILED: "Import failed";
    readonly SAVE_FAILED: "Save failed";
    readonly VALIDATION_ERROR: "Validation error";
    readonly NETWORK_ERROR: "Network error";
    readonly PERMISSION_DENIED: "Permission denied";
};
/**
 * Success messages
 */
export declare const SUCCESS_MESSAGES: {
    readonly PROJECT_SAVED: "Project saved successfully";
    readonly COMPONENT_ADDED: "Component added successfully";
    readonly COMPONENT_UPDATED: "Component updated successfully";
    readonly COMPONENT_DELETED: "Component deleted successfully";
    readonly ASSET_UPLOADED: "Asset uploaded successfully";
    readonly EXPORT_SUCCESSFUL: "Export successful";
    readonly IMPORT_SUCCESSFUL: "Import successful";
    readonly SETTINGS_SAVED: "Settings saved successfully";
};
/**
 * Warning messages
 */
export declare const WARNING_MESSAGES: {
    readonly UNSUPPORTED_BROWSER: "Unsupported browser";
    readonly UNSAVED_CHANGES: "You have unsaved changes";
    readonly LARGE_FILE_SIZE: "File size is large, upload may take time";
    readonly COMPONENT_LIMIT_REACHED: "Component limit reached";
    readonly MEMORY_WARNING: "Memory usage is high";
    readonly NETWORK_SLOW: "Network connection is slow";
};
/**
 * Local storage keys
 */
export declare const STORAGE_KEYS: {
    readonly PROJECT: "wysiwyg_project";
    readonly SETTINGS: "wysiwyg_settings";
    readonly THEME: "wysiwyg_theme";
    readonly RECENT_PROJECTS: "wysiwyg_recent_projects";
    readonly USER_PREFERENCES: "wysiwyg_user_preferences";
};
/**
 * API endpoints
 */
export declare const API_ENDPOINTS: {
    readonly PROJECTS: "/api/projects";
    readonly ASSETS: "/api/assets";
    readonly EXPORT: "/api/export";
    readonly IMPORT: "/api/import";
    readonly AI: "/api/ai";
    readonly TEMPLATES: "/api/templates";
};
/**
 * Event names
 */
export declare const EVENT_NAMES: {
    readonly PROJECT_LOAD: "project:load";
    readonly PROJECT_SAVE: "project:save";
    readonly COMPONENT_SELECT: "component:select";
    readonly COMPONENT_UPDATE: "component:update";
    readonly COMPONENT_DELETE: "component:delete";
    readonly COMPONENT_ADD: "component:add";
    readonly ASSET_UPLOAD: "asset:upload";
    readonly EXPORT_START: "export:start";
    readonly EXPORT_COMPLETE: "export:complete";
    readonly IMPORT_START: "import:start";
    readonly IMPORT_COMPLETE: "import:complete";
    readonly ERROR: "error";
    readonly WARNING: "warning";
};
/**
 * Default component icons
 */
export declare const COMPONENT_ICONS: {
    readonly SECTION: "layout";
    readonly CONTAINER: "container";
    readonly COLUMN: "column";
    readonly ROW: "row";
    readonly HEADING: "type";
    readonly PARAGRAPH: "align-left";
    readonly BUTTON: "mouse-pointer";
    readonly IMAGE: "image";
    readonly VIDEO: "video";
    readonly LINK: "link";
    readonly DIVIDER: "minus";
    readonly SPACER: "maximize";
    readonly FORM: "file-text";
    readonly INPUT: "input";
    readonly TEXTAREA: "message-square";
    readonly SELECT: "list";
    readonly CHECKBOX: "check-square";
    readonly RADIO: "radio";
    readonly MAP: "map";
    readonly SOCIAL: "share-2";
    readonly ICON: "smile";
    readonly CODE: "code";
    readonly EMBED: "box";
    readonly SLIDER: "sliders";
    readonly GALLERY: "grid";
    readonly TABLE: "table";
    readonly TABS: "tabs";
    readonly ACCORDION: "chevron-down";
    readonly ALERT: "alert-circle";
    readonly BADGE: "badge";
    readonly CARD: "credit-card";
    readonly LIST: "list";
    readonly NAVBAR: "menu";
    readonly FOOTER: "layout-footer";
    readonly HERO: "zap";
    readonly TESTIMONIAL: "message-circle";
    readonly PRICING: "dollar-sign";
    readonly FEATURE: "star";
    readonly TEAM: "users";
    readonly BLOG: "file-text";
    readonly CONTACT: "mail";
    readonly CHART: "bar-chart";
    readonly CALENDAR: "calendar";
    readonly COUNTDOWN: "clock";
    readonly PROGRESS: "activity";
    readonly SPINNER: "loader";
    readonly TOOLTIP: "help-circle";
    readonly MODAL: "maximize-2";
    readonly DROPDOWN: "chevron-down";
    readonly POPOVER: "more-horizontal";
    readonly TOAST: "bell";
    readonly SKELETON: "loader-2";
    readonly EMPTY: "inbox";
};
//# sourceMappingURL=index.d.ts.map