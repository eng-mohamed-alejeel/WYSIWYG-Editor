/* eslint-disable max-lines */
/**
 * Advanced Render Lifecycle System
 *
 * Provides comprehensive lifecycle hooks, plugin integration,
 * middleware support, async rendering, diagnostics, and profiling.
 */

import { ComponentNode } from '@wysiwyg/core';
import { RendererContext } from './types';

/**
 * Render phase enum
 */
export enum RenderPhase {
  BEFORE_RENDER = 'beforeRender',
  RENDERING = 'rendering',
  AFTER_RENDER = 'afterRender',
  BEFORE_MOUNT = 'beforeMount',
  MOUNTING = 'mounting',
  AFTER_MOUNT = 'afterMount',
  BEFORE_UNMOUNT = 'beforeUnmount',
  UNMOUNTING = 'unmounting',
  AFTER_UNMOUNT = 'afterUnmount',
}

/**
 * Lifecycle hook context
 */
export interface LifecycleHookContext {
  phase: RenderPhase;
  node: ComponentNode;
  context: RendererContext;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * Lifecycle hook function type
 */
export type LifecycleHookFunction<T = void> = (ctx: LifecycleHookContext) => T | Promise<T>;

/**
 * Lifecycle hook definition
 */
export interface LifecycleHook {
  id: string;
  phase: RenderPhase;
  handler: LifecycleHookFunction;
  priority?: number;
  once?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Middleware context
 */
export interface MiddlewareContext {
  node: ComponentNode;
  context: RendererContext;
  phase: RenderPhase;
  next: () => Promise<unknown>;
  metadata?: Record<string, unknown>;
}

/**
 * Middleware function type
 */
export type MiddlewareFunction = (ctx: MiddlewareContext) => Promise<unknown>;

/**
 * Middleware definition
 */
export interface RendererMiddleware {
  id: string;
  name: string;
  handler: MiddlewareFunction;
  priority?: number;
  enabled?: boolean;
  phases?: RenderPhase[];
}

/**
 * Render diagnostics data
 */
export interface RenderDiagnostics {
  nodeId: string;
  phase: RenderPhase;
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  error?: Error;
  metadata?: Record<string, unknown>;
}

/**
 * Profiling data for lifecycle hooks
 */
export interface LifecycleProfileData {
  hookId: string;
  phase: RenderPhase;
  executionTime: number;
  success: boolean;
  error?: Error;
}

/**
 * Plugin lifecycle integration
 */
export interface PluginLifecycleIntegration {
  pluginId: string;
  hooks: LifecycleHook[];
  middleware?: RendererMiddleware[];
  enabled?: boolean;
}

/**
 * Render lifecycle options
 */
export interface RenderLifecycleOptions {
  enableDiagnostics?: boolean;
  enableProfiling?: boolean;
  maxDiagnosticsEntries?: number;
  profilingSampleRate?: number;
  asyncTimeout?: number;
  maxConcurrentHooks?: number;
}

/**
 * Advanced Render Lifecycle Manager
 */
export class RenderLifecycleManager {
  private hooks: Map<RenderPhase, LifecycleHook[]> = new Map();
  private middleware: RendererMiddleware[] = [];
  private pluginIntegrations: Map<string, PluginLifecycleIntegration> = new Map();
  private diagnostics: RenderDiagnostics[] = [];
  private profiles: LifecycleProfileData[] = [];
  private options: Required<RenderLifecycleOptions>;
  private executingHooks: Set<string> = new Set();

  constructor(options: RenderLifecycleOptions = {}) {
    this.options = {
      enableDiagnostics: options.enableDiagnostics ?? true,
      enableProfiling: options.enableProfiling ?? true,
      maxDiagnosticsEntries: options.maxDiagnosticsEntries ?? 1000,
      profilingSampleRate: options.profilingSampleRate ?? 1,
      asyncTimeout: options.asyncTimeout ?? 5000,
      maxConcurrentHooks: options.maxConcurrentHooks ?? 10,
    };

    // Initialize hooks map for each phase
    Object.values(RenderPhase).forEach((phase) => {
      this.hooks.set(phase as RenderPhase, []);
    });
  }

  /**
   * Register a lifecycle hook
   */
  registerHook(hook: LifecycleHook): void {
    const phaseHooks = this.hooks.get(hook.phase) ?? [];
    phaseHooks.push(hook);
    phaseHooks.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    this.hooks.set(hook.phase, phaseHooks);
  }

  /**
   * Unregister a lifecycle hook
   */
  unregisterHook(hookId: string): void {
    for (const phase of this.hooks.keys()) {
      const phaseHooks = this.hooks.get(phase) ?? [];
      const filtered = phaseHooks.filter((h) => h.id !== hookId);
      this.hooks.set(phase, filtered);
    }
  }

  /**
   * Register middleware
   */
  registerMiddleware(middleware: RendererMiddleware): void {
    this.middleware.push(middleware);
    this.middleware.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

  /**
   * Unregister middleware
   */
  unregisterMiddleware(middlewareId: string): void {
    this.middleware = this.middleware.filter((m) => m.id !== middlewareId);
  }

  /**
   * Register plugin lifecycle integration
   */
  registerPluginIntegration(integration: PluginLifecycleIntegration): void {
    this.pluginIntegrations.set(integration.pluginId, integration);

    // Register hooks
    integration.hooks.forEach((hook) => {
      this.registerHook(hook);
    });

    // Register middleware
    if (integration.middleware) {
      integration.middleware.forEach((mw) => {
        this.registerMiddleware(mw);
      });
    }
  }

  /**
   * Unregister plugin lifecycle integration
   */
  unregisterPluginIntegration(pluginId: string): void {
    const integration = this.pluginIntegrations.get(pluginId);
    if (!integration) return;

    // Unregister hooks
    integration.hooks.forEach((hook) => {
      this.unregisterHook(hook.id);
    });

    // Unregister middleware
    if (integration.middleware) {
      integration.middleware.forEach((mw) => {
        this.unregisterMiddleware(mw.id);
      });
    }

    this.pluginIntegrations.delete(pluginId);
  }

  /**
   * Execute lifecycle hooks for a phase
   */
  async executePhase(
    phase: RenderPhase,
    node: ComponentNode,
    context: RendererContext,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const startTime = performance.now();
    const hookContext: LifecycleHookContext = {
      phase,
      node,
      context,
      timestamp: startTime,
      metadata,
    };

    // Record diagnostics
    if (this.options.enableDiagnostics) {
      this.recordDiagnostics({
        nodeId: node.id,
        phase,
        startTime,
        success: false,
        metadata,
      });
    }

    try {
      // Execute hooks
      const hooks = this.hooks.get(phase) ?? [];
      for (const hook of hooks) {
        if (
          this.executingHooks.has(hook.id) &&
          this.executingHooks.size >= this.options.maxConcurrentHooks
        ) {
          console.warn(`Max concurrent hooks reached, skipping hook: ${hook.id}`);
          continue;
        }

        if (hook.once === true && this.executingHooks.has(hook.id)) {
          continue;
        }

        this.executingHooks.add(hook.id);

        try {
          const hookStartTime = performance.now();
          await Promise.race([
            hook.handler(hookContext),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error(`Hook timeout: ${hook.id}`)),
                this.options.asyncTimeout
              )
            ),
          ]);

          // Record profiling data
          if (this.options.enableProfiling && Math.random() < this.options.profilingSampleRate) {
            this.recordProfile({
              hookId: hook.id,
              phase,
              executionTime: performance.now() - hookStartTime,
              success: true,
            });
          }
        } catch (error) {
          console.error(`Error executing lifecycle hook ${hook.id}:`, error);

          if (this.options.enableProfiling) {
            this.recordProfile({
              hookId: hook.id,
              phase,
              executionTime: performance.now() - startTime,
              success: false,
              error: error as Error,
            });
          }
        } finally {
          this.executingHooks.delete(hook.id);
        }
      }

      // Update diagnostics
      if (this.options.enableDiagnostics) {
        this.updateDiagnostics(node.id, phase, true);
      }
    } catch (error) {
      if (this.options.enableDiagnostics) {
        this.updateDiagnostics(node.id, phase, false, error as Error);
      }
      throw error;
    }
  }

  /**
   * Execute middleware for a phase
   */
  async executeMiddleware(
    phase: RenderPhase,
    node: ComponentNode,
    context: RendererContext,
    operation: () => Promise<unknown>
  ): Promise<unknown> {
    const applicableMiddleware = this.middleware.filter(
      (mw) => mw.enabled !== false && (!mw.phases || mw.phases.includes(phase))
    );

    let index = 0;
    const next = async (): Promise<unknown> => {
      if (index >= applicableMiddleware.length) {
        return operation();
      }

      const mw = applicableMiddleware[index++];
      const mwContext: MiddlewareContext = {
        node,
        context,
        phase,
        next,
        metadata: { middlewareId: mw.id },
      };

      return mw.handler(mwContext);
    };

    return next();
  }

  /**
   * Record diagnostics data
   */
  private recordDiagnostics(diagnostics: RenderDiagnostics): void {
    this.diagnostics.push(diagnostics);

    // Maintain max entries
    if (this.diagnostics.length > this.options.maxDiagnosticsEntries) {
      this.diagnostics.shift();
    }
  }

  /**
   * Update diagnostics data
   */
  private updateDiagnostics(
    nodeId: string,
    phase: RenderPhase,
    success: boolean,
    error?: Error
  ): void {
    const diagnostics = this.diagnostics.find(
      (d) => d.nodeId === nodeId && d.phase === phase && d.endTime === undefined
    );

    if (diagnostics) {
      diagnostics.endTime = performance.now();
      diagnostics.duration = diagnostics.endTime - diagnostics.startTime;
      diagnostics.success = success;
      diagnostics.error = error;
    }
  }

  /**
   * Record profiling data
   */
  private recordProfile(profile: LifecycleProfileData): void {
    this.profiles.push(profile);

    // Maintain max entries
    if (this.profiles.length > this.options.maxDiagnosticsEntries) {
      this.profiles.shift();
    }
  }

  /**
   * Get diagnostics data
   */
  getDiagnostics(nodeId?: string, phase?: RenderPhase): RenderDiagnostics[] {
    return this.diagnostics.filter((d) => {
      if (nodeId !== undefined && nodeId !== '' && d.nodeId !== nodeId) return false;
      if (phase != null && d.phase !== phase) return false;
      return true;
    });
  }

  /**
   * Get profiling data
   */
  getProfiles(hookId?: string, phase?: RenderPhase): LifecycleProfileData[] {
    return this.profiles.filter((p) => {
      if (hookId !== undefined && hookId !== '' && p.hookId !== hookId) return false;
      if (phase != null && p.phase !== phase) return false;
      return true;
    });
  }

  /**
   * Clear diagnostics
   */
  clearDiagnostics(): void {
    this.diagnostics = [];
  }

  /**
   * Clear profiling data
   */
  clearProfiles(): void {
    this.profiles = [];
  }

  /**
   * Generate diagnostics report
   */
  generateDiagnosticsReport(): string {
    const report: string[] = ['Render Lifecycle Diagnostics Report'];
    report.push('='.repeat(50));

    // Summary statistics
    const totalPhases = this.diagnostics.length;
    const successfulPhases = this.diagnostics.filter((d) => d.success).length;
    const failedPhases = totalPhases - successfulPhases;
    const avgDuration =
      totalPhases > 0
        ? this.diagnostics.reduce((sum, d) => sum + (d.duration ?? 0), 0) / totalPhases
        : 0;

    report.push(`Total phases executed: ${totalPhases}`);
    report.push(`Successful phases: ${successfulPhases}`);
    report.push(`Failed phases: ${failedPhases}`);
    report.push(`Average duration: ${avgDuration.toFixed(2)}ms`);
    report.push('');

    // Phase breakdown
    report.push('Phase Breakdown:');
    Object.values(RenderPhase).forEach((phase) => {
      const phaseDiagnostics = this.diagnostics.filter((d) => d.phase === phase);
      if (phaseDiagnostics.length > 0) {
        const phaseAvgDuration =
          phaseDiagnostics.reduce((sum, d) => sum + (d.duration ?? 0), 0) / phaseDiagnostics.length;
        report.push(`  ${phase}:`);
        report.push(`    Count: ${phaseDiagnostics.length}`);
        report.push(`    Average duration: ${phaseAvgDuration.toFixed(2)}ms`);
        report.push(
          `    Success rate: ${((phaseDiagnostics.filter((d) => d.success).length / phaseDiagnostics.length) * 100).toFixed(2)}%`
        );
      }
    });

    // Failed phases
    const failedDiagnostics = this.diagnostics.filter((d) => !d.success);
    if (failedDiagnostics.length > 0) {
      report.push('');
      report.push('Failed Phases:');
      failedDiagnostics.forEach((d) => {
        report.push(`  Node: ${d.nodeId}`);
        report.push(`  Phase: ${d.phase}`);
        report.push(`  Error: ${d.error?.message ?? 'Unknown error'}`);
        report.push('');
      });
    }

    return report.join('\n');
  }

  /**
   * Generate profiling report
   */
  generateProfilingReport(): string {
    const report: string[] = ['Render Lifecycle Profiling Report'];
    report.push('='.repeat(50));

    // Summary statistics
    const totalProfiles = this.profiles.length;
    const successfulProfiles = this.profiles.filter((p) => p.success).length;
    const failedProfiles = totalProfiles - successfulProfiles;
    const avgExecutionTime =
      totalProfiles > 0
        ? this.profiles.reduce((sum, p) => sum + p.executionTime, 0) / totalProfiles
        : 0;

    report.push(`Total hook executions: ${totalProfiles}`);
    report.push(`Successful executions: ${successfulProfiles}`);
    report.push(`Failed executions: ${failedProfiles}`);
    report.push(`Average execution time: ${avgExecutionTime.toFixed(2)}ms`);
    report.push('');

    // Slowest hooks
    const slowestHooks = [...this.profiles]
      .sort((a, b) => b.executionTime - a.executionTime)
      .slice(0, 10);

    if (slowestHooks.length > 0) {
      report.push('Slowest Hooks:');
      slowestHooks.forEach((p, i) => {
        report.push(`  ${i + 1}. ${p.hookId} (${p.phase}): ${p.executionTime.toFixed(2)}ms`);
      });
      report.push('');
    }

    // Failed hooks
    const erroredProfiles = this.profiles.filter((p) => !p.success);
    if (erroredProfiles.length > 0) {
      report.push('Failed Hooks:');
      erroredProfiles.forEach((p) => {
        report.push(`  Hook: ${p.hookId} (${p.phase})`);
        report.push(`  Error: ${p.error?.message ?? 'Unknown error'}`);
        report.push('');
      });
    }

    return report.join('\n');
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.hooks.clear();
    this.middleware = [];
    this.pluginIntegrations.clear();
    this.diagnostics = [];
    this.profiles = [];
    this.executingHooks.clear();
  }
}

/**
 * Global lifecycle manager instance
 */
let globalLifecycleManager: RenderLifecycleManager | null = null;

export function getGlobalLifecycleManager(): RenderLifecycleManager {
  if (!globalLifecycleManager) {
    globalLifecycleManager = new RenderLifecycleManager();
  }
  return globalLifecycleManager;
}

export function resetGlobalLifecycleManager(): void {
  globalLifecycleManager = null;
}

/**
 * Create a custom lifecycle manager
 */
export function createLifecycleManager(options?: RenderLifecycleOptions): RenderLifecycleManager {
  return new RenderLifecycleManager(options);
}
