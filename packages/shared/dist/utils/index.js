/**
 * Shared Utilities for WYSIWYG Visual Component Builder
 *
 * This module provides utility functions used across multiple packages.
 */
import { DEFAULT_BREAKPOINTS } from '../constants';
/**
 * Get the current breakpoint based on viewport width
 */
export function getCurrentBreakpoint(width) {
    if (width < 640)
        return 'mobile';
    if (width < 768)
        return 'tablet';
    if (width < 1024)
        return 'desktop';
    return 'wide';
}
/**
 * Convert style object to CSS string
 */
export function styleObjectToCss(styles) {
    return Object.entries(styles)
        .map(([property, value]) => {
        const cssProperty = camelCaseToKebabCase(property);
        return `${cssProperty}: ${value};`;
    })
        .join(' ');
}
/**
 * Convert camel case to kebab case
 */
export function camelCaseToKebabCase(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
/**
 * Convert kebab case to camel case
 */
export function kebabCaseToCamelCase(str) {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
/**
 * Merge responsive styles for a specific breakpoint
 */
export function getResponsiveStyles(styles, responsiveStyles, breakpoint) {
    const merged = { ...styles };
    if (responsiveStyles) {
        // Merge styles from smaller breakpoints
        if (breakpoint === 'tablet') {
            Object.assign(merged, responsiveStyles.mobile || {});
        }
        else if (breakpoint === 'desktop') {
            Object.assign(merged, responsiveStyles.mobile || {});
            Object.assign(merged, responsiveStyles.tablet || {});
        }
        else if (breakpoint === 'wide') {
            Object.assign(merged, responsiveStyles.mobile || {});
            Object.assign(merged, responsiveStyles.tablet || {});
            Object.assign(merged, responsiveStyles.desktop || {});
        }
        // Apply current breakpoint styles
        Object.assign(merged, responsiveStyles[breakpoint] || {});
    }
    return merged;
}
/**
 * Generate media query for a breakpoint
 */
export function generateMediaQuery(breakpoint) {
    const breakpointValue = DEFAULT_BREAKPOINTS[breakpoint];
    return `@media (min-width: ${breakpointValue})`;
}
/**
 * Parse CSS string to style object
 */
export function cssToStyleObject(css) {
    const styles = {};
    const declarations = css.split(';').filter(Boolean);
    for (const declaration of declarations) {
        const [property, value] = declaration.split(':').map(s => s.trim());
        if (property && value) {
            const camelProperty = kebabCaseToCamelCase(property);
            styles[camelProperty] = value;
        }
    }
    return styles;
}
/**
 * Generate unique class name
 */
export function generateClassName(prefix = 'wysiwyg') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/**
 * Map a value from one range to another
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
/**
 * Linear interpolation
 */
export function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}
/**
 * Easing functions for animations
 */
export const Easing = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => 1 - --t * t * t * t,
    easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    easeInQuint: (t) => t * t * t * t * t,
    easeOutQuint: (t) => 1 + --t * t * t * t * t,
    easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
};
/**
 * Format number with separators
 */
export function formatNumber(num, locale = 'en-US') {
    return new Intl.NumberFormat(locale).format(num);
}
/**
 * Format date
 */
export function formatDate(date, locale = 'en-US', options) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
}
/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date, locale = 'en-US') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second');
    }
    else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    }
    else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    }
    else if (diffInSeconds < 2592000) {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    }
    else if (diffInSeconds < 31536000) {
        return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    }
    else {
        return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
    }
}
/**
 * Generate slug from string
 */
export function generateSlug(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength - 3) + '...';
}
/**
 * Capitalize first letter
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Convert string to title case
 */
export function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
}
/**
 * Check if value is empty
 */
export function isEmpty(value) {
    if (value == null)
        return true;
    if (typeof value === 'string')
        return value.trim().length === 0;
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
}
/**
 * Deep clone object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date)
        return new Date(obj.getTime());
    if (obj instanceof Array)
        return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
    return obj;
}
/**
 * Get object path value
 */
export function getPathValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}
/**
 * Set object path value
 */
export function setPathValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
        if (!current[key])
            current[key] = {};
        return current[key];
    }, obj);
    target[lastKey] = value;
}
/**
 * Check if device is mobile
 */
export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
/**
 * Check if device is touch device
 */
export function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
/**
 * Get viewport dimensions
 */
export function getViewportSize() {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}
/**
 * Scroll to element smoothly
 */
export function scrollToElement(element, options = { behavior: 'smooth' }) {
    element.scrollIntoView(options);
}
/**
 * Download file from URL
 */
export function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Read file as text
 */
export function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}
/**
 * Read file as data URL
 */
export function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
/**
 * Get file extension
 */
export function getFileExtension(filename) {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}
/**
 * Validate email
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Validate phone number
 */
export function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-+()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}
/**
 * Generate random string
 */
export function generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
/**
 * Parse query string
 */
export function parseQueryString(queryString) {
    const params = {};
    const pairs = queryString.slice(1).split('&');
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
        }
    }
    return params;
}
/**
 * Build query string
 */
export function buildQueryString(params) {
    const pairs = Object.entries(params)
        .filter(([_, value]) => value != null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    return pairs.length > 0 ? `?${pairs.join('&')}` : '';
}
/**
 * Get contrast color (black or white) based on background color
 */
export function getContrastColor(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
}
//# sourceMappingURL=index.js.map