/**
 * Performance Profiler
 *
 * Advanced performance profiling and optimization tools for the rendering system
 * Provides detailed metrics, flame graphs, and performance recommendations
 */

import { PerformanceMetrics } from './types';

interface ProfilingData {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
  children: ProfilingData[];
}

interface PerformanceSnapshot {
  timestamp: number;
  metrics: PerformanceMetrics;
  profilingData: ProfilingData[];
  memoryUsage: number;
}

interface PerformanceReport {
  summary: {
    totalRenderTime: number;
    averageRenderTime: number;
    componentCount: number;
    slowestComponents: Array<{ id: string; type: string; time: number }>;
    mostFrequentRenders: Array<{ id: string; type: string; count: number }>;
  };
  recommendations: string[];
  profilingData: ProfilingData[];
  snapshots: PerformanceSnapshot[];
}

/**
 * Performance Profiler Class
 * Tracks and analyzes rendering performance with detailed profiling
 */
export class PerformanceProfiler {
  private profilingStack: ProfilingData[] = [];
  private profilingRoot: ProfilingData | null = null;
  private snapshots: PerformanceSnapshot[] = [];
  private maxSnapshots: number = 100;
  private memoryBaseline: number = 0;
  private renderCounts: Map<string, number> = new Map();
  private renderTimes: Map<string, number[]> = new Map();

  constructor() {
    this.memoryBaseline = this.getMemoryUsage();
  }

  /**
   * Start profiling a specific operation
   */
  startProfiling(name: string, metadata?: Record<string, unknown>): void {
    const profilingData: ProfilingData = {
      name,
      startTime: performance.now(),
      metadata,
      children: [],
    };

    if (this.profilingStack.length === 0) {
      this.profilingRoot = profilingData;
    } else {
      this.profilingStack[this.profilingStack.length - 1].children.push(profilingData);
    }

    this.profilingStack.push(profilingData);
  }

  /**
   * End profiling the current operation
   */
  endProfiling(): void {
    if (this.profilingStack.length === 0) {
      console.warn('No profiling operation in progress');
      return;
    }

    const current = this.profilingStack.pop()!;
    current.endTime = performance.now();
    current.duration = current.endTime - current.startTime;

    // Track render counts and times
    const renderKey = current.name;
    this.renderCounts.set(renderKey, (this.renderCounts.get(renderKey) ?? 0) + 1);

    const times = this.renderTimes.get(renderKey) ?? [];
    times.push(current.duration);
    this.renderTimes.set(renderKey, times);

    // If we've completed the root profiling, create a snapshot
    if (this.profilingStack.length === 0 && this.profilingRoot) {
      this.createSnapshot();
    }
  }

  /**
   * Create a performance snapshot
   */
  private createSnapshot(): void {
    const snapshot: PerformanceSnapshot = {
      timestamp: Date.now(),
      metrics: this.calculateMetrics(),
      profilingData: this.profilingRoot ? [this.profilingRoot] : [],
      memoryUsage: this.getMemoryUsage(),
    };

    this.snapshots.push(snapshot);

    // Maintain max snapshots limit
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }

    // Reset for next profiling session
    this.profilingRoot = null;
  }

  /**
   * Calculate current performance metrics
   */
  private calculateMetrics(): PerformanceMetrics {
    const totalRenderTime = this.profilingRoot?.duration ?? 0;
    const componentCount = this.renderCounts.size;
    const memoryUsage = this.getMemoryUsage() - this.memoryBaseline;

    return {
      renderTime: totalRenderTime,
      componentCount,
      virtualizedCount: 0,
      lazyLoadedCount: 0,
      cacheHitRate: 0,
      memoryUsage,
    };
  }

  /**
   * Get current memory usage
   */
  private getMemoryUsage(): number {
    const perf = performance as unknown as { memory?: { usedJSHeapSize?: number } };
    if (perf.memory && typeof perf.memory.usedJSHeapSize === 'number') {
      return perf.memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * Generate a comprehensive performance report
   */
  generateReport(): PerformanceReport {
    const metrics = this.calculateMetrics();
    const slowestComponents = this.getSlowestComponents(10);
    const mostFrequentRenders = this.getMostFrequentRenders(10);
    const averageRenderTime = this.calculateAverageRenderTime();

    return {
      summary: {
        totalRenderTime: metrics.renderTime,
        averageRenderTime,
        componentCount: metrics.componentCount,
        slowestComponents,
        mostFrequentRenders,
      },
      recommendations: this.generateRecommendations(),
      profilingData: this.profilingRoot ? [this.profilingRoot] : [],
      snapshots: [...this.snapshots],
    };
  }

  /**
   * Get the slowest rendering components
   */
  private getSlowestComponents(limit: number): Array<{ id: string; type: string; time: number }> {
    const entries = Array.from(this.renderTimes.entries())
      .map(([name, times]) => ({
        id: name,
        type: name,
        time: times.reduce((sum, time) => sum + time, 0) / times.length,
      }))
      .sort((a, b) => b.time - a.time)
      .slice(0, limit);

    return entries;
  }

  /**
   * Get the most frequently rendered components
   */
  private getMostFrequentRenders(
    limit: number
  ): Array<{ id: string; type: string; count: number }> {
    return Array.from(this.renderCounts.entries())
      .map(([name, count]) => ({ id: name, type: name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Calculate average render time
   */
  private calculateAverageRenderTime(): number {
    const allTimes = Array.from(this.renderTimes.values()).flat();
    if (allTimes.length === 0) return 0;
    return allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length;
  }

  /**
   * Generate performance optimization recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.calculateMetrics();
    const averageRenderTime = this.calculateAverageRenderTime();

    // Check for slow renders
    if (averageRenderTime > 16) {
      recommendations.push(
        `Average render time (${averageRenderTime.toFixed(2)}ms) exceeds 60fps threshold. Consider virtualization or memoization.`
      );
    }

    // Check for high memory usage
    if (typeof metrics.memoryUsage === 'number' && metrics.memoryUsage > 50 * 1024 * 1024) {
      recommendations.push(
        `High memory usage detected (${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB). Consider implementing cache limits or cleanup strategies.`
      );
    }

    // Check for frequent re-renders
    const frequentRenders = this.getMostFrequentRenders(5);
    frequentRenders.forEach((component) => {
      if (component.count > 100) {
        recommendations.push(
          `Component "${component.type}" rendered ${component.count} times. Consider using React.memo or optimizing dependencies.`
        );
      }
    });

    // Check for slow components
    const slowComponents = this.getSlowestComponents(5);
    slowComponents.forEach((component) => {
      if (component.time > 16) {
        recommendations.push(
          `Component "${component.type}" has average render time of ${component.time.toFixed(2)}ms. Consider code splitting or lazy loading.`
        );
      }
    });

    return recommendations;
  }

  /**
   * Get profiling data as a flame graph structure
   */
  getFlameGraph(): ProfilingData | null {
    return this.profilingRoot;
  }

  /**
   * Get all snapshots
   */
  getSnapshots(): PerformanceSnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Clear all profiling data
   */
  clear(): void {
    this.profilingStack = [];
    this.profilingRoot = null;
    this.snapshots = [];
    this.renderCounts.clear();
    this.renderTimes.clear();
    this.memoryBaseline = this.getMemoryUsage();
  }

  /**
   * Export profiling data for analysis
   */
  exportData(): string {
    return JSON.stringify(
      {
        snapshots: this.snapshots,
        renderCounts: Object.fromEntries(this.renderCounts),
        renderTimes: Object.fromEntries(this.renderTimes),
      },
      null,
      2
    );
  }
}

/**
 * Global performance profiler instance
 */
let globalPerformanceProfiler: PerformanceProfiler | null = null;

export function getGlobalPerformanceProfiler(): PerformanceProfiler {
  if (!globalPerformanceProfiler) {
    globalPerformanceProfiler = new PerformanceProfiler();
  }
  return globalPerformanceProfiler;
}

export function resetGlobalPerformanceProfiler(): void {
  globalPerformanceProfiler = null;
}

/**
 * Higher-order function for profiling operations
 */
export function withProfiling<T extends (...args: unknown[]) => unknown>(
  name: string,
  fn: T,
  metadata?: Record<string, unknown>
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const profiler = getGlobalPerformanceProfiler();
    profiler.startProfiling(name, metadata);
    try {
      const result = fn(...args);
      profiler.endProfiling();
      return result as ReturnType<T>;
    } catch (error) {
      profiler.endProfiling();
      throw error;
    }
  }) as T;
}
