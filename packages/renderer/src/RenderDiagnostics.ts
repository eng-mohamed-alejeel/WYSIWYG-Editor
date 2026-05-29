/**
 * Render Diagnostics and Profiling Utilities
 *
 * Provides comprehensive diagnostics and profiling capabilities
 * for the rendering system.
 */

import { RenderDiagnostics, LifecycleProfileData, RenderPhase } from './types';

/**
 * Diagnostics collector
 */
export class RenderDiagnosticsCollector {
  private diagnostics: RenderDiagnostics[] = [];
  private profiles: LifecycleProfileData[] = [];
  private maxEntries: number;
  private enabled: boolean;

  constructor(maxEntries: number = 1000, enabled: boolean = true) {
    this.maxEntries = maxEntries;
    this.enabled = enabled;
  }

  /**
   * Start a diagnostic entry
   */
  startDiagnostic(nodeId: string, phase: RenderPhase, metadata?: Record<string, unknown>): number {
    if (!this.enabled) return 0;

    const diagnostic: RenderDiagnostics = {
      nodeId,
      phase,
      startTime: performance.now(),
      success: false,
      metadata,
    };

    this.diagnostics.push(diagnostic);
    this.maintainLimit();

    return diagnostic.startTime;
  }

  /**
   * Complete a diagnostic entry
   */
  completeDiagnostic(nodeId: string, phase: RenderPhase, success: boolean, error?: Error): void {
    if (!this.enabled) return;

    const diagnostic = this.diagnostics.find(
      (d) => d.nodeId === nodeId && d.phase === phase && d.endTime === undefined
    );

    if (diagnostic) {
      diagnostic.endTime = performance.now();
      diagnostic.duration = diagnostic.endTime - diagnostic.startTime;
      diagnostic.success = success;
      diagnostic.error = error;
    }
  }

  /**
   * Record profiling data
   */
  recordProfile(profile: LifecycleProfileData): void {
    if (!this.enabled) return;

    this.profiles.push(profile);
    this.maintainLimit();
  }

  /**
   * Get diagnostics for a specific node or phase
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
   * Get performance statistics
   */
  getStatistics(): {
    totalRenders: number;
    successfulRenders: number;
    failedRenders: number;
    averageRenderTime: number;
    slowestRender: { nodeId: string; phase: RenderPhase; duration: number } | null;
    fastestRender: { nodeId: string; phase: RenderPhase; duration: number } | null;
  } {
    const completedDiagnostics = this.diagnostics.filter((d) => d.endTime);
    const successfulRenders = completedDiagnostics.filter((d) => d.success);
    const failedRenders = completedDiagnostics.filter((d) => !d.success);

    let averageRenderTime = 0;
    let slowestRender = null;
    let fastestRender = null;

    if (completedDiagnostics.length > 0) {
      const totalTime = completedDiagnostics.reduce((sum, d) => sum + (d.duration ?? 0), 0);
      averageRenderTime = totalTime / completedDiagnostics.length;

      const sortedByDuration = [...completedDiagnostics].sort(
        (a, b) => (b.duration ?? 0) - (a.duration ?? 0)
      );

      slowestRender =
        sortedByDuration[0] !== undefined
          ? {
              nodeId: sortedByDuration[0].nodeId,
              phase: sortedByDuration[0].phase,
              duration: sortedByDuration[0].duration ?? 0,
            }
          : null;

      fastestRender =
        sortedByDuration[sortedByDuration.length - 1] !== undefined
          ? {
              nodeId: sortedByDuration[sortedByDuration.length - 1].nodeId,
              phase: sortedByDuration[sortedByDuration.length - 1].phase,
              duration: sortedByDuration[sortedByDuration.length - 1].duration ?? 0,
            }
          : null;
    }

    return {
      totalRenders: completedDiagnostics.length,
      successfulRenders: successfulRenders.length,
      failedRenders: failedRenders.length,
      averageRenderTime,
      slowestRender,
      fastestRender,
    };
  }

  /**
   * Generate a comprehensive diagnostics report
   */
  generateReport(): string {
    const stats = this.getStatistics();
    const report: string[] = [];

    report.push('Render Diagnostics Report');
    report.push('='.repeat(50));
    report.push('');
    report.push('Summary:');
    report.push(`  Total Renders: ${stats.totalRenders}`);
    report.push(`  Successful: ${stats.successfulRenders}`);
    report.push(`  Failed: ${stats.failedRenders}`);
    report.push(`  Average Render Time: ${stats.averageRenderTime.toFixed(2)}ms`);
    report.push('');

    if (stats.slowestRender) {
      report.push('Slowest Render:');
      report.push(`  Node ID: ${stats.slowestRender.nodeId}`);
      report.push(`  Phase: ${stats.slowestRender.phase}`);
      report.push(`  Duration: ${stats.slowestRender.duration.toFixed(2)}ms`);
      report.push('');
    }

    if (stats.fastestRender) {
      report.push('Fastest Render:');
      report.push(`  Node ID: ${stats.fastestRender.nodeId}`);
      report.push(`  Phase: ${stats.fastestRender.phase}`);
      report.push(`  Duration: ${stats.fastestRender.duration.toFixed(2)}ms`);
      report.push('');
    }

    // Phase breakdown
    report.push('Phase Breakdown:');
    Object.values(RenderPhase).forEach((phase) => {
      const phaseDiagnostics = this.getDiagnostics(undefined, phase);
      const successful = phaseDiagnostics.filter((d) => d.success).length;
      const failed = phaseDiagnostics.filter((d) => !d.success).length;
      const avgTime =
        phaseDiagnostics.length > 0
          ? phaseDiagnostics.reduce((sum, d) => sum + (d.duration ?? 0), 0) /
            phaseDiagnostics.length
          : 0;

      report.push(`  ${phase}:`);
      report.push(`    Total: ${phaseDiagnostics.length}`);
      report.push(`    Successful: ${successful}`);
      report.push(`    Failed: ${failed}`);
      report.push(`    Average Time: ${avgTime.toFixed(2)}ms`);
    });

    // Failed renders
    const failedDiagnostics = this.diagnostics.filter((d) => !d.success && d.error);
    if (failedDiagnostics.length > 0) {
      report.push('');
      report.push('Failed Renders:');
      failedDiagnostics.forEach((d) => {
        report.push(`  Node ID: ${d.nodeId}`);
        report.push(`  Phase: ${d.phase}`);
        report.push(`  Error: ${d.error?.message}`);
        if (d.metadata) {
          report.push(`  Metadata: ${JSON.stringify(d.metadata)}`);
        }
        report.push('');
      });
    }

    return report.join('\n');
  }

  /**
   * Export diagnostics data as JSON
   */
  exportData(): string {
    return JSON.stringify(
      {
        diagnostics: this.diagnostics,
        profiles: this.profiles,
        statistics: this.getStatistics(),
      },
      null,
      2
    );
  }

  /**
   * Clear all diagnostics data
   */
  clear(): void {
    this.diagnostics = [];
    this.profiles = [];
  }

  /**
   * Enable or disable diagnostics collection
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if diagnostics collection is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Maintain the maximum number of entries
   */
  private maintainLimit(): void {
    if (this.diagnostics.length > this.maxEntries) {
      this.diagnostics = this.diagnostics.slice(-this.maxEntries);
    }
    if (this.profiles.length > this.maxEntries) {
      this.profiles = this.profiles.slice(-this.maxEntries);
    }
  }
}

/**
 * Global diagnostics collector instance
 */
let globalDiagnosticsCollector: RenderDiagnosticsCollector | null = null;

export function getGlobalDiagnosticsCollector(): RenderDiagnosticsCollector {
  if (!globalDiagnosticsCollector) {
    globalDiagnosticsCollector = new RenderDiagnosticsCollector();
  }
  return globalDiagnosticsCollector;
}

export function resetGlobalDiagnosticsCollector(): void {
  globalDiagnosticsCollector = null;
}

/**
 * Higher-order function for diagnostic tracking
 */
export function withDiagnostics<T extends (...args: unknown[]) => unknown>(
  nodeId: string,
  phase: RenderPhase,
  fn: T,
  metadata?: Record<string, unknown>
): T {
  return ((...args: unknown[]) => {
    const collector = getGlobalDiagnosticsCollector();
    collector.startDiagnostic(nodeId, phase, metadata);

    try {
      const result = fn(...args);
      collector.completeDiagnostic(nodeId, phase, true);
      return result;
    } catch (error) {
      collector.completeDiagnostic(nodeId, phase, false, error as Error);
      throw error;
    }
  }) as T;
}

/**
 * Async wrapper for diagnostic tracking
 */
export async function withDiagnosticsAsync<T>(
  nodeId: string,
  phase: RenderPhase,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  const collector = getGlobalDiagnosticsCollector();
  collector.startDiagnostic(nodeId, phase, metadata);

  try {
    const result = await fn();
    collector.completeDiagnostic(nodeId, phase, true);
    return result;
  } catch (error) {
    collector.completeDiagnostic(nodeId, phase, false, error as Error);
    throw error;
  }
}
