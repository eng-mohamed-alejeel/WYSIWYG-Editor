/**
 * Common Types for WYSIWYG Visual Component Builder
 *
 * This module defines common types used throughout the platform.
 */

/**
 * Generic record type for key-value pairs with unknown values
 */
export type UnknownRecord = Record<string, unknown>;

/**
 * Inspector option type
 */
export interface InspectorOption {
  label: string;
  value: unknown;
}

/**
 * Validation function type
 */
export type ValidationFunction = (value: unknown) => boolean;

/**
 * Export data type
 */
export type ExportData = {
  project?: unknown;
  components?: unknown[];
  pages?: unknown[];
  [key: string]: unknown;
};
