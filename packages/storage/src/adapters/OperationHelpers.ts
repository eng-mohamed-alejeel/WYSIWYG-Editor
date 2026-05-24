/**
 * Operation Helpers
 *
 * Common helper functions for storage operations.
 */

import { StorageResult } from '../types';

/**
 * Wrap an operation with error handling
 */
export async function withErrorHandling<T>(
  operation: () => T | Promise<T>
): Promise<StorageResult<T>> {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Wrap a void operation with error handling
 */
export async function withVoidErrorHandling(
  operation: () => void | Promise<void>
): Promise<StorageResult> {
  try {
    await operation();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create a not found error result
 */
export function createNotFoundError(target: string, id: string): StorageResult {
  return {
    success: false,
    error: `${target} with id ${id} not found`,
  };
}
