/**
 * Performance Monitor
 *
 * This module provides performance monitoring and metrics collection for the rendering system.
 */

import { PerformanceMetrics } from './types';

interface RenderMetrics {
  nodeId: string;
  renderTime: number;
  timestamp: number;
}

interface ComponentMetrics {
  nodeId: string;
  type: string;
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  lastRenderTime: number;
  lastRenderTimestamp: number;
}

/**
 * Performance Monitor Class
 * Tracks and analyzes rendering performance
 */
export class PerformanceMonitor {
  private metrics: Map<string, ComponentMetrics>;
  private renderHistory: RenderMetrics[];
  private startTime: number;
  private componentCount: number;
  private virtualizedCount: number;
  private lazyLoadedCount: number;
  private cacheHits: number;
  private cacheMisses: number;

  constructor() {
    this.metrics = new Map();
    this.renderHistory = [];
    this.startTime = performance.now();
    this.componentCount = 0;
    this.virtualizedCount = 0;
    this.lazyLoadedCount = 0;
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  /**
   * Start timing a render operation
   */
  startRender(nodeId: string): number {
    return performance.now();
  }

  /**
   * End timing a render operation
   */
  endRender(nodeId: string, type: string, startTime: number): number {
    const renderTime = performance.now() - startTime;
    this.recordRender(nodeId, type, renderTime);
    return renderTime;
  }

  /**
   * Record a render operation
   */
  private recordRender(nodeId: string, type: string, renderTime: number): void {
    const existing = this.metrics.get(nodeId);

    if (existing) {
      existing.renderCount++;
      existing.totalRenderTime += renderTime;
      existing.averageRenderTime = existing.totalRenderTime / existing.renderCount;
      existing.lastRenderTime = renderTime;
      existing.lastRenderTimestamp = Date.now();
      this.metrics.set(nodeId, existing);
    } else {
      this.metrics.set(nodeId, {
        nodeId,
        type,
        renderCount: 1,
        totalRenderTime: renderTime,
        averageRenderTime: renderTime,
        lastRenderTime: renderTime,
        lastRenderTimestamp: Date.now(),
      });
    }

    this.renderHistory.push({
      nodeId,
      renderTime,
      timestamp: Date.now(),
    });

    // Keep only last 1000 renders in history
    if (this.renderHistory.length > 1000) {
      this.renderHistory.shift();
    }
  }

  /**
   * Track component count
   */
  incrementComponentCount(): void {
    this.componentCount++;
  }

  /**
   * Track virtualized components
   */
  incrementVirtualizedCount(): void {
    this.virtualizedCount++;
  }

  /**
   * Track lazy loaded components
   */
  incrementLazyLoadedCount(): void {
    this.lazyLoadedCount++;
  }

  /**
   * Track cache hits
   */
  incrementCacheHits(): void {
    this.cacheHits++;
  }

  /**
   * Track cache misses
   */
  incrementCacheMisses(): void {
    this.cacheMisses++;
  }

  /**
   * Get metrics for a specific component
   */
  getComponentMetrics(nodeId: string): ComponentMetrics | undefined {
    return this.metrics.get(nodeId);
  }

  /**
   * Get all component metrics
   */
  getAllComponentMetrics(): ComponentMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get render history
   */
  getRenderHistory(limit?: number): RenderMetrics[] {
    if (limit) {
      return this.renderHistory.slice(-limit);
    }
    return [...this.renderHistory];
  }

  /**
   * Get overall performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    const totalRenderTime = performance.now() - this.startTime;
    const cacheAccesses = this.cacheHits + this.cacheMisses;
    const cacheHitRate = cacheAccesses > 0 ? this.cacheHits / cacheAccesses : 0;

    // Estimate memory usage (rough approximation)
    const metricsSize = this.metrics.size * 200; // Approximate bytes per entry
    const historySize = this.renderHistory.length * 100; // Approximate bytes per entry
    const memoryUsage = metricsSize + historySize;

    return {
      renderTime: totalRenderTime,
      componentCount: this.componentCount,
      virtualizedCount: this.virtualizedCount,
      lazyLoadedCount: this.lazyLoadedCount,
      cacheHitRate,
      memoryUsage,
    };
  }

  /**
   * Get slowest rendering components
   */
  getSlowestComponents(limit: number = 10): ComponentMetrics[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.averageRenderTime - a.averageRenderTime)
      .slice(0, limit);
  }

  /**
   * Get most frequently rendered components
   */
  getMostRenderedComponents(limit: number = 10): ComponentMetrics[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.renderCount - a.renderCount)
      .slice(0, limit);
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics.clear();
    this.renderHistory = [];
    this.startTime = performance.now();
    this.componentCount = 0;
    this.virtualizedCount = 0;
    this.lazyLoadedCount = 0;
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  /**
   * Get performance report
   */
  getReport(): string {
    const metrics = this.getPerformanceMetrics();
    const slowest = this.getSlowestComponents(5);
    const mostRendered = this.getMostRenderedComponents(5);

    let report = '=== Rendering Performance Report ===\n';
    report += `Total Render Time: ${metrics.renderTime.toFixed(2)}ms\n`;
    report += `Total Components: ${metrics.componentCount}\n`;
    report += `Virtualized Components: ${metrics.virtualizedCount}\n`;
    report += `Lazy Loaded Components: ${metrics.lazyLoadedCount}\n`;
    report += `Cache Hit Rate: ${(metrics.cacheHitRate * 100).toFixed(2)}%\n`;
    report += `Memory Usage: ${metrics.memoryUsage} bytes\n\n`;

    report += '=== Slowest Components ===\n';
    slowest.forEach((component, index) => {
      report += `${index + 1}. ${component.type} (${component.nodeId}) - ${component.averageRenderTime.toFixed(2)}ms\n`;
    });

    report += '\n=== Most Rendered Components ===\n';
    mostRendered.forEach((component, index) => {
      report += `${index + 1}. ${component.type} (${component.nodeId}) - ${component.renderCount} renders\n`;
    });

    return report;
  }
}

/**
 * Global performance monitor instance
 */
let globalPerformanceMonitor: PerformanceMonitor | null = null;

export function getGlobalPerformanceMonitor(): PerformanceMonitor {
  if (!globalPerformanceMonitor) {
    globalPerformanceMonitor = new PerformanceMonitor();
  }
  return globalPerformanceMonitor;
}

export function resetGlobalPerformanceMonitor(): void {
  globalPerformanceMonitor = null;
}

/**
 * Performance measurement decorator
 */
export function measurePerformance(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const monitor = getGlobalPerformanceMonitor();

  descriptor.value = function (...args: any[]) {
    const startTime = monitor.startRender('unknown');
    try {
      const result = originalMethod.apply(this, args);
      monitor.endRender('unknown', 'function', startTime);
      return result;
    } catch (error) {
      monitor.endRender('unknown', 'function', startTime);
      throw error;
    }
  };

  return descriptor;
}
