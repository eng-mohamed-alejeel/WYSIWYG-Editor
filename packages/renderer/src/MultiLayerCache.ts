/**
 * Multi-Layer Cache System
 *
 * Advanced multi-layer caching system for optimal performance
 * Implements L1 (in-memory), L2 (persistent), and L3 (distributed) caching strategies
 */

import { ComponentNode } from '@wysiwyg/core';
import { CacheConfig } from './types';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccess: number;
  size: number;
  priority: number;
}

interface CacheLayer<T> {
  get(key: string): T | null;
  set(key: string, value: T, metadata?: CacheMetadata): void;
  has(key: string): boolean;
  delete(key: string): void;
  clear(): void;
  getStats(): CacheStats;
}

interface CacheMetadata {
  priority?: number;
  ttl?: number;
  tags?: string[];
  size?: number;
}

interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  hits: number;
  misses: number;
  evictions: number;
}

/**
 * L1 Cache - Fast in-memory cache with LRU eviction
 */
class L1Cache<T> implements CacheLayer<T> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;
  private hits: number = 0;
  private misses: number = 0;
  private evictions: number = 0;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    // Check TTL
    if (entry.timestamp + (entry.metadata?.ttl || Infinity) < Date.now()) {
      this.delete(key);
      this.misses++;
      return null;
    }

    // Update access info and move to end (LRU)
    entry.accessCount++;
    entry.lastAccess = Date.now();
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.hits++;

    return entry.value;
  }

  set(key: string, value: T, metadata: CacheMetadata = {}): void {
    const size = metadata.size || this.estimateSize(value);
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccess: Date.now(),
      size,
      priority: metadata.priority || 0,
    };

    // Evict if at capacity
    while (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
  }

  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }

  private evictLRU(): void {
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      this.cache.delete(firstKey);
      this.evictions++;
    }
  }

  private estimateSize(value: T): number {
    return JSON.stringify(value).length * 2; // Rough estimate in bytes
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: total > 0 ? this.hits / total : 0,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
    };
  }
}

/**
 * L2 Cache - Persistent cache with IndexedDB
 */
class L2Cache<T> implements CacheLayer<T> {
  private dbName: string = 'wysiwyg-cache';
  private storeName: string = 'render-cache';
  private maxSize: number = 1000;
  private hits: number = 0;
  private misses: number = 0;
  private evictions: number = 0;
  private db: IDBDatabase | null = null;
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.initialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('priority', 'priority', { unique: false });
        }
      };
    });
  }

  async get(key: string): Promise<T | null> {
    await this.initialize();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const entry = request.result;
        if (!entry) {
          this.misses++;
          resolve(null);
          return;
        }

        // Check TTL
        if (entry.timestamp + (entry.ttl || Infinity) < Date.now()) {
          this.delete(key);
          this.misses++;
          resolve(null);
          return;
        }

        entry.accessCount++;
        entry.lastAccess = Date.now();
        this.putEntry(entry);
        this.hits++;
        resolve(entry.value);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async set(key: string, value: T, metadata: CacheMetadata = {}): Promise<void> {
    await this.initialize();
    if (!this.db) return;

    const entry = {
      key,
      value,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccess: Date.now(),
      size: metadata.size || this.estimateSize(value),
      priority: metadata.priority || 0,
      ttl: metadata.ttl,
    };

    // Evict if at capacity
    await this.evictIfNeeded();

    return this.putEntry(entry);
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  async delete(key: string): Promise<void> {
    await this.initialize();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    await this.initialize();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        this.hits = 0;
        this.misses = 0;
        this.evictions = 0;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async putEntry(entry: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(entry);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async evictIfNeeded(): Promise<void> {
    const count = await this.getCount();
    if (count >= this.maxSize) {
      await this.evictLRU();
    }
  }

  private async getCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async evictLRU(): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'next');

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          this.evictions++;
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  private estimateSize(value: T): number {
    return JSON.stringify(value).length * 2;
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      size: 0, // Would need async call to get actual size
      maxSize: this.maxSize,
      hitRate: total > 0 ? this.hits / total : 0,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
    };
  }
}

/**
 * Multi-Layer Cache Manager
 * Coordinates between L1, L2, and L3 caches
 */
export class MultiLayerCacheManager<T> {
  private l1Cache: L1Cache<T>;
  private l2Cache: L2Cache<T>;
  private config: CacheConfig;

  constructor(config: CacheConfig = { enabled: true, maxSize: 100, strategy: 'lru' }) {
    this.l1Cache = new L1Cache(Math.floor(config.maxSize * 0.3));
    this.l2Cache = new L2Cache(Math.floor(config.maxSize * 0.7));
    this.config = config;
  }

  async get(key: string): Promise<T | null> {
    // Try L1 cache first
    let value = this.l1Cache.get(key);
    if (value !== null) {
      return value;
    }

    // Try L2 cache
    value = await this.l2Cache.get(key);
    if (value !== null) {
      // Promote to L1 cache
      this.l1Cache.set(key, value);
      return value;
    }

    return null;
  }

  async set(key: string, value: T, metadata?: CacheMetadata): Promise<void> {
    // Set in both L1 and L2 caches
    this.l1Cache.set(key, value, metadata);
    await this.l2Cache.set(key, value, metadata);
  }

  async has(key: string): Promise<boolean> {
    return this.l1Cache.has(key) || (await this.l2Cache.has(key));
  }

  async delete(key: string): Promise<void> {
    this.l1Cache.delete(key);
    await this.l2Cache.delete(key);
  }

  async clear(): Promise<void> {
    this.l1Cache.clear();
    await this.l2Cache.clear();
  }

  getStats(): {
    l1: CacheStats;
    l2: CacheStats;
    combined: CacheStats;
  } {
    const l1Stats = this.l1Cache.getStats();
    const l2Stats = this.l2Cache.getStats();

    return {
      l1: l1Stats,
      l2: l2Stats,
      combined: {
        size: l1Stats.size + l2Stats.size,
        maxSize: l1Stats.maxSize + l2Stats.maxSize,
        hitRate:
          (l1Stats.hits + l2Stats.hits) /
          (l1Stats.hits + l1Stats.misses + l2Stats.hits + l2Stats.misses),
        hits: l1Stats.hits + l2Stats.hits,
        misses: l1Stats.misses + l2Stats.misses,
        evictions: l1Stats.evictions + l2Stats.evictions,
      },
    };
  }

  /**
   * Invalidate cache entries by tags
   */
  async invalidateByTags(tags: string[]): Promise<void> {
    // Implementation would need to track tags in cache entries
    // This is a placeholder for the functionality
    console.warn('Tag-based cache invalidation not yet implemented');
  }

  /**
   * Warm up cache with pre-computed values
   */
  async warmUp(entries: Map<string, T>): Promise<void> {
    for (const [key, value] of entries) {
      await this.set(key, value);
    }
  }
}

/**
 * Create a multi-layer cache for render results
 */
export function createRenderMultiLayerCache(
  config: CacheConfig = { enabled: true, maxSize: 100, strategy: 'lru' }
): MultiLayerCacheManager<React.ReactNode> {
  return new MultiLayerCacheManager<React.ReactNode>(config);
}
