/**
 * Shared Utilities for WYSIWYG Visual Component Builder
 * 
 * This module provides utility functions used across multiple packages.
 */

import { Breakpoint, StyleObject, StyleProperty } from '@wysiwyg/core';
import { DEFAULT_BREAKPOINTS } from '../constants';

/**
 * Get the current breakpoint based on viewport width
 */
export function getCurrentBreakpoint(width: number): Breakpoint {
  if (width < 640) return 'mobile';
  if (width < 768) return 'tablet';
  if (width < 1024) return 'desktop';
  return 'wide';
}

/**
 * Convert style object to CSS string
 */
export function styleObjectToCss(styles: StyleObject): string {
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
export function camelCaseToKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert kebab case to camel case
 */
export function kebabCaseToCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Merge responsive styles for a specific breakpoint
 */
export function getResponsiveStyles(
  styles: StyleObject,
  responsiveStyles: Record<Breakpoint, StyleObject> | undefined,
  breakpoint: Breakpoint
): StyleObject {
  const merged: StyleObject = { ...styles };

  if (responsiveStyles) {
    // Merge styles from smaller breakpoints
    if (breakpoint === 'tablet') {
      Object.assign(merged, responsiveStyles.mobile || {});
    } else if (breakpoint === 'desktop') {
      Object.assign(merged, responsiveStyles.mobile || {});
      Object.assign(merged, responsiveStyles.tablet || {});
    } else if (breakpoint === 'wide') {
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
export function generateMediaQuery(breakpoint: Breakpoint): string {
  const breakpointValue = DEFAULT_BREAKPOINTS[breakpoint];
  return `@media (min-width: ${breakpointValue})`;
}

/**
 * Parse CSS string to style object
 */
export function cssToStyleObject(css: string): StyleObject {
  const styles: StyleObject = {};
  const declarations = css.split(';').filter(Boolean);

  for (const declaration of declarations) {
    const [property, value] = declaration.split(':').map(s => s.trim());
    if (property && value) {
      const camelProperty = kebabCaseToCamelCase(property);
      styles[camelProperty as StyleProperty] = value;
    }
  }

  return styles;
}

/**
 * Generate unique class name
 */
export function generateClassName(prefix: string = 'wysiwyg'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

/**
 * Easing functions for animations
 */
export const Easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
} as const;

/**
 * Format number with separators
 */
export function formatNumber(num: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format date
 */
export function formatDate(
  date: Date | string,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date | string, locale: string = 'en-US'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
}

/**
 * Generate slug from string
 */
export function generateSlug(str: string): string {
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
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (obj instanceof Object) {
    const clonedObj = {} as any;
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
export function getPathValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Set object path value
 */
export function setPathValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if device is touch device
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get viewport dimensions
 */
export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * Scroll to element smoothly
 */
export function scrollToElement(
  element: HTMLElement,
  options: ScrollIntoViewOptions = { behavior: 'smooth' }
): void {
  element.scrollIntoView(options);
}

/**
 * Download file from URL
 */
export function downloadFile(url: string, filename: string): void {
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
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Read file as data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Generate random string
 */
export function generateRandomString(length: number = 10): string {
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
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
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
export function buildQueryString(params: Record<string, any>): string {
  const pairs = Object.entries(params)
    .filter(([_, value]) => value != null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

  return pairs.length > 0 ? `?${pairs.join('&')}` : '';
}

/**
 * Get contrast color (black or white) based on background color
 */
export function getContrastColor(hexColor: string): '#000000' | '#FFFFFF' {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
}
