/**
 * Shared Utilities for WYSIWYG Visual Component Builder
 *
 * This module provides utility functions used across multiple packages.
 */
import { Breakpoint, StyleObject } from '@wysiwyg/core';
/**
 * Get the current breakpoint based on viewport width
 */
export declare function getCurrentBreakpoint(width: number): Breakpoint;
/**
 * Convert style object to CSS string
 */
export declare function styleObjectToCss(styles: StyleObject): string;
/**
 * Convert camel case to kebab case
 */
export declare function camelCaseToKebabCase(str: string): string;
/**
 * Convert kebab case to camel case
 */
export declare function kebabCaseToCamelCase(str: string): string;
/**
 * Merge responsive styles for a specific breakpoint
 */
export declare function getResponsiveStyles(styles: StyleObject, responsiveStyles: Record<Breakpoint, StyleObject> | undefined, breakpoint: Breakpoint): StyleObject;
/**
 * Generate media query for a breakpoint
 */
export declare function generateMediaQuery(breakpoint: Breakpoint): string;
/**
 * Parse CSS string to style object
 */
export declare function cssToStyleObject(css: string): StyleObject;
/**
 * Generate unique class name
 */
export declare function generateClassName(prefix?: string): string;
/**
 * Clamp a value between min and max
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * Map a value from one range to another
 */
export declare function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number;
/**
 * Linear interpolation
 */
export declare function lerp(start: number, end: number, t: number): number;
/**
 * Easing functions for animations
 */
export declare const Easing: {
    readonly linear: (t: number) => number;
    readonly easeInQuad: (t: number) => number;
    readonly easeOutQuad: (t: number) => number;
    readonly easeInOutQuad: (t: number) => number;
    readonly easeInCubic: (t: number) => number;
    readonly easeOutCubic: (t: number) => number;
    readonly easeInOutCubic: (t: number) => number;
    readonly easeInQuart: (t: number) => number;
    readonly easeOutQuart: (t: number) => number;
    readonly easeInOutQuart: (t: number) => number;
    readonly easeInQuint: (t: number) => number;
    readonly easeOutQuint: (t: number) => number;
    readonly easeInOutQuint: (t: number) => number;
};
/**
 * Format number with separators
 */
export declare function formatNumber(num: number, locale?: string): string;
/**
 * Format date
 */
export declare function formatDate(date: Date | string, locale?: string, options?: Intl.DateTimeFormatOptions): string;
/**
 * Get relative time (e.g., "2 hours ago")
 */
export declare function getRelativeTime(date: Date | string, locale?: string): string;
/**
 * Generate slug from string
 */
export declare function generateSlug(str: string): string;
/**
 * Truncate text with ellipsis
 */
export declare function truncateText(text: string, maxLength: number): string;
/**
 * Capitalize first letter
 */
export declare function capitalize(str: string): string;
/**
 * Convert string to title case
 */
export declare function toTitleCase(str: string): string;
/**
 * Check if value is empty
 */
export declare function isEmpty(value: any): boolean;
/**
 * Deep clone object
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Get object path value
 */
export declare function getPathValue(obj: any, path: string): any;
/**
 * Set object path value
 */
export declare function setPathValue(obj: any, path: string, value: any): void;
/**
 * Check if device is mobile
 */
export declare function isMobile(): boolean;
/**
 * Check if device is touch device
 */
export declare function isTouchDevice(): boolean;
/**
 * Get viewport dimensions
 */
export declare function getViewportSize(): {
    width: number;
    height: number;
};
/**
 * Scroll to element smoothly
 */
export declare function scrollToElement(element: HTMLElement, options?: ScrollIntoViewOptions): void;
/**
 * Download file from URL
 */
export declare function downloadFile(url: string, filename: string): void;
/**
 * Copy text to clipboard
 */
export declare function copyToClipboard(text: string): Promise<boolean>;
/**
 * Read file as text
 */
export declare function readFileAsText(file: File): Promise<string>;
/**
 * Read file as data URL
 */
export declare function readFileAsDataURL(file: File): Promise<string>;
/**
 * Get file extension
 */
export declare function getFileExtension(filename: string): string;
/**
 * Validate email
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Validate phone number
 */
export declare function isValidPhone(phone: string): boolean;
/**
 * Generate random string
 */
export declare function generateRandomString(length?: number): string;
/**
 * Parse query string
 */
export declare function parseQueryString(queryString: string): Record<string, string>;
/**
 * Build query string
 */
export declare function buildQueryString(params: Record<string, any>): string;
/**
 * Get contrast color (black or white) based on background color
 */
export declare function getContrastColor(hexColor: string): '#000000' | '#FFFFFF';
//# sourceMappingURL=index.d.ts.map