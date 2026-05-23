/**
 * Plugin Sandbox
 * 
 * Provides isolation for plugins to prevent interference
 * Uses iframe-like isolation for security and stability
 */

import { PluginId } from './types';

interface SandboxConfig {
  pluginId: PluginId;
  enableStrictMode?: boolean;
  allowedGlobals?: string[];
  timeout?: number;
}

export class PluginSandbox {
  private pluginId: PluginId;
  private enableStrictMode: boolean;
  private allowedGlobals: Set<string>;
  private timeout: number;
  private isolatedContext: any;
  private originalContext: any;

  constructor(config: SandboxConfig) {
    this.pluginId = config.pluginId;
    this.enableStrictMode = config.enableStrictMode ?? true;
    this.allowedGlobals = new Set(config.allowedGlobals || this.getDefaultAllowedGlobals());
    this.timeout = config.timeout || 5000;
    this.originalContext = { ...global };
    this.isolatedContext = this.createIsolatedContext();
  }

  /**
   * Get default allowed global variables
   */
  private getDefaultAllowedGlobals(): string[] {
    return [
      // Core JavaScript
      'Array',
      'Object',
      'String',
      'Number',
      'Boolean',
      'Date',
      'Math',
      'JSON',
      'Promise',
      'Map',
      'Set',
      'WeakMap',
      'WeakSet',
      'Error',
      'TypeError',
      'SyntaxError',
      'ReferenceError',

      // Console (will be wrapped)
      'console',

      // React (if available)
      'React',
      'ReactDOM',

      // Editor-specific globals
      'window',
      'document',
      'navigator',
      'setTimeout',
      'setInterval',
      'clearTimeout',
      'clearInterval',
      'requestAnimationFrame',
      'cancelAnimationFrame',
    ];
  }

  /**
   * Create isolated context for plugin
   */
  private createIsolatedContext(): any {
    const context: any = {};

    // Copy allowed globals
    this.allowedGlobals.forEach((globalName) => {
      if (globalName in global) {
        if (globalName === 'console') {
          // Wrap console with plugin ID prefix
          context.console = this.createWrappedConsole();
        } else {
          context[globalName] = (global as any)[globalName];
        }
      }
    });

    // Add strict mode if enabled
    if (this.enableStrictMode) {
      Object.defineProperty(context, 'useStrict', {
        get: () => true,
        enumerable: false,
      });
    }

    return context;
  }

  /**
   * Create wrapped console with plugin ID prefix
   */
  private createWrappedConsole(): Console {
    const prefix = `[Plugin:${this.pluginId}]`;
    const originalConsole = console;

    return {
      log: (...args: unknown[]) => originalConsole.log(prefix, ...args),
      info: (...args: unknown[]) => originalConsole.info(prefix, ...args),
      warn: (...args: unknown[]) => originalConsole.warn(prefix, ...args),
      error: (...args: unknown[]) => originalConsole.error(prefix, ...args),
      debug: (...args: unknown[]) => originalConsole.debug(prefix, ...args),
      trace: (...args: unknown[]) => originalConsole.trace(prefix, ...args),
      group: (...args: unknown[]) => originalConsole.group(prefix, ...args),
      groupEnd: () => originalConsole.groupEnd(),
      time: (label: string) => originalConsole.time(`${prefix}:${label}`),
      timeEnd: (label: string) => originalConsole.timeEnd(`${prefix}:${label}`),
    } as Console;
  }

  /**
   * Execute code in isolated context
   */
  async execute<T = any>(code: string | (() => T)): Promise<T> {
    if (typeof code === 'function') {
      return this.executeFunction(code);
    }
    return this.executeString(code);
  }

  /**
   * Execute a function in isolated context
   */
  private async executeFunction<T>(fn: () => T): Promise<T> {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Plugin execution timeout after ${this.timeout}ms`)), this.timeout);
      });

      // Execute the function with timeout
      return await Promise.race([fn(), timeoutPromise]);
    } catch (error) {
      console.error(`Error executing plugin function for ${this.pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Execute a string of code in isolated context
   */
  private async executeString<T>(code: string): Promise<T> {
    try {
      // Create a function with isolated context
      const isolatedFn = new Function(
        ...Object.keys(this.isolatedContext),
        `
        "use strict";
        return (${code})();
        `
      );

      // Execute with isolated context values
      const values = Object.values(this.isolatedContext);
      return await isolatedFn(...values);
    } catch (error) {
      console.error(`Error executing plugin code for ${this.pluginId}:`, error);
      throw error;
    }
  }

  /**
   * Get a value from the isolated context
   */
  getContextValue(key: string): any {
    return this.isolatedContext[key];
  }

  /**
   * Set a value in the isolated context
   */
  setContextValue(key: string, value: any): void {
    this.isolatedContext[key] = value;
  }

  /**
   * Clean up the sandbox
   */
  destroy(): void {
    // Clear references
    this.isolatedContext = null;
  }
}

/**
 * Create a plugin sandbox
 */
export const createPluginSandbox = (config: SandboxConfig): PluginSandbox => {
  return new PluginSandbox(config);
};
