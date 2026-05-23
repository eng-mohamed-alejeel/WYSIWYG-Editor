/**
 * Plugin Logger
 * 
 * Provides logging capabilities for plugins with prefixing and level filtering
 */

import { PluginLogger as PluginLoggerInterface, PluginId } from './types';

class PluginLoggerImpl implements PluginLoggerInterface {
  private prefix: string;
  private logLevel: 'debug' | 'info' | 'warn' | 'error';

  constructor(pluginId: PluginId, logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info') {
    this.prefix = `[Plugin:${pluginId}]`;
    this.logLevel = logLevel;
  }

  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.prefix, ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(this.prefix, ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.prefix, ...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(this.prefix, ...args);
    }
  }

  setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.logLevel = level;
  }
}

export const createPluginLogger = (
  pluginId: PluginId,
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
): PluginLoggerInterface => new PluginLoggerImpl(pluginId, logLevel);
