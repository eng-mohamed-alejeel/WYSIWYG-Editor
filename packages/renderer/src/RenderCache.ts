/**
 * Render Cache System
 *
 * This module provides caching functionality for rendered components.
 */

import { ComponentNode } from '@wysiwyg/core';
import { CacheConfig } from './types';

interface CacheEntry {
  value: React.ReactNode;
  timestamp: number;
  accessCount: number;
  lastAccess: number;
}

/**
 * LRU (Least Recently Used) Cache implementation
 */
export class LRUCache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private ttl?: number;

  constructor(maxSize: number = 100, ttl?: number) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  private generateKey(node: ComponentNode, context: any): string {
    return `${node.id}-${node.type}-${JSON.stringify(node.props)}-${JSON.stringify(node.styles)}`;
  }

  get(node: ComponentNode, context: any): React.ReactNode | null {
    const key = this.generateKey(node, context);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check TTL
    if (this.ttl && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access info
    entry.accessCount++;
    entry.lastAccess = Date.now();

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  set(node: ComponentNode, context: any, value: React.ReactNode): void {
    const key = this.generateKey(node, context);

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccess: Date.now(),
    });
  }

  has(node: ComponentNode, context: any): boolean {
    const key = this.generateKey(node, context);
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check TTL
    if (this.ttl && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        timestamp: entry.timestamp,
        accessCount: entry.accessCount,
        lastAccess: entry.lastAccess,
      })),
    };
  }
}

/**
 * FIFO (First In First Out) Cache implementation
 */
export class FIFOCache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private ttl?: number;
  private insertionOrder: string[];

  constructor(maxSize: number = 100, ttl?: number) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
    this.insertionOrder = [];
  }

  private generateKey(node: ComponentNode, context: any): string {
    return `${node.id}-${node.type}-${JSON.stringify(node.props)}-${JSON.stringify(node.styles)}`;
  }

  get(node: ComponentNode, context: any): React.ReactNode | null {
    const key = this.generateKey(node, context);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check TTL
    if (this.ttl && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      const index = this.insertionOrder.indexOf(key);
      if (index > -1) {
        this.insertionOrder.splice(index, 1);
      }
      return null;
    }

    entry.accessCount++;
    entry.lastAccess = Date.now();

    return entry.value;
  }

  set(node: ComponentNode, context: any, value: React.ReactNode): void {
    const key = this.generateKey(node, context);

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.insertionOrder.shift();
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccess: Date.now(),
    });

    this.insertionOrder.push(key);
  }

  has(node: ComponentNode, context: any): boolean {
    const key = this.generateKey(node, context);
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check TTL
    if (this.ttl && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      const index = this.insertionOrder.indexOf(key);
      if (index > -1) {
        this.insertionOrder.splice(index, 1);
      }
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
    this.insertionOrder = [];
  }

  get size(): number {
    return this.cache.size;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        timestamp: entry.timestamp,
        accessCount: entry.accessCount,
        lastAccess: entry.lastAccess,
      })),
    };
  }
}

/**
 * LFU (Least Frequently Used) Cache implementation
 */
export class LFUCache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private ttl?: number;

  constructor(maxSize: number = 100, ttl?: number) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  private generateKey(node: ComponentNode, context: any): string {
    return `${node.id}-${node.type}-${JSON.stringify(node.props)}-${JSON.stringify(node.styles)}`;
  }

  get(node: ComponentNode, context: any): React.ReactNode | null {
    const key = this.generateKey(node, context);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check TTL
    if (this.ttl && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    entry.accessCount++;
    entry.lastAccess = Date.now();

    return entry.value;
  }

  set(node: ComponentNode, context: any, value: React.ReactNode): void {
    const key = this.generateKey(node, context);

    // Evict least frequently used if at capacity
    if (this.cache.size >= this.maxSize) {
      let minAccessCount = Infinity;
      let lruKey: string | null = null;

      for (const [k, entry] of this.cache.entries()) {
        if (entry.accessCount < minAccessCount) {
          minAccessCount = entry.accessCount;
          lruKey = k;
        }
      }

      if (lruKey) {
        this.cache.delete(lruKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccess: Date.now(),
    });
  }

  has(node: ComponentNode, context: any): boolean {
    const key = this.generateKey(node, context);
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check TTL
    if (this.ttl && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        timestamp: entry.timestamp,
        accessCount: entry.accessCount,
        lastAccess: entry.lastAccess,
      })),
    };
  }
}

/**
 * Render Cache Factory
 * Creates appropriate cache instance based on configuration
 */
export function createRenderCache(config: CacheConfig): LRUCache | FIFOCache | LFUCache {
  const { enabled, maxSize = 100, ttl, strategy = 'lru' } = config;

  if (!enabled) {
    throw new Error('Cache is disabled');
  }

  switch (strategy) {
    case 'lru':
      return new LRUCache(maxSize, ttl);
    case 'fifo':
      return new FIFOCache(maxSize, ttl);
    case 'lfu':
      return new LFUCache(maxSize, ttl);
    default:
      throw new Error(`Unknown cache strategy: ${strategy}`);
  }
}
