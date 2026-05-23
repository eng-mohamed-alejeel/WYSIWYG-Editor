/**
 * Marketplace Service
 *
 * Handles all marketplace-related operations including:
 * - Remote template loading
 * - Template browsing and searching
 * - Template downloading
 * - Template uploading
 * - User templates management
 * - License verification
 * - Purchase flow integration
 */

import type {
  MarketplaceItem,
  MarketplaceFilters,
  MarketplaceResponse,
  Template,
  Section,
  ReusableComponent,
  MarketplaceConfig,
} from '../types';

export class MarketplaceService {
  private static instance: MarketplaceService;
  private config: MarketplaceConfig;
  private cache: Map<string, { data: any; timestamp: number }>;
  private userLicenseCache: Map<string, boolean>;

  private constructor() {
    this.config = {
      enabled: true,
      apiUrl: '/api/marketplace',
      cacheEnabled: true,
      cacheDuration: 3600000, // 1 hour
    };
    this.cache = new Map();
    this.userLicenseCache = new Map();
  }

  public static getInstance(): MarketplaceService {
    if (!MarketplaceService.instance) {
      MarketplaceService.instance = new MarketplaceService();
    }
    return MarketplaceService.instance;
  }

  /**
   * Configure the marketplace service
   */
  public configure(config: Partial<MarketplaceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): MarketplaceConfig {
    return { ...this.config };
  }

  /**
   * Browse marketplace items with filters
   */
  public async browseItems(
    filters?: MarketplaceFilters
  ): Promise<MarketplaceResponse<MarketplaceItem>> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    const cacheKey = this.getCacheKey('browse', filters);
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const queryParams = this.buildQueryParams(filters);
    const response = await this.fetchFromAPI<MarketplaceResponse<MarketplaceItem>>(
      `/items?${queryParams}`
    );

    this.setCache(cacheKey, response);
    return response;
  }

  /**
   * Search marketplace items
   */
  public async searchItems(
    query: string,
    filters?: MarketplaceFilters
  ): Promise<MarketplaceResponse<MarketplaceItem>> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    const cacheKey = this.getCacheKey('search', { query, ...filters });
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const queryParams = this.buildQueryParams({ ...filters, search: query });
    const response = await this.fetchFromAPI<MarketplaceResponse<MarketplaceItem>>(
      `/items/search?${queryParams}`
    );

    this.setCache(cacheKey, response);
    return response;
  }

  /**
   * Get featured items
   */
  public async getFeaturedItems(
    type?: 'template' | 'section' | 'component',
    limit: number = 10
  ): Promise<MarketplaceItem[]> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    const cacheKey = this.getCacheKey('featured', { type, limit });
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await this.fetchFromAPI<MarketplaceItem[]>(
      `/items/featured?type=${type || ''}&limit=${limit}`
    );

    this.setCache(cacheKey, response);
    return response;
  }

  /**
   * Get trending items
   */
  public async getTrendingItems(
    type?: 'template' | 'section' | 'component',
    limit: number = 10
  ): Promise<MarketplaceItem[]> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    const cacheKey = this.getCacheKey('trending', { type, limit });
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await this.fetchFromAPI<MarketplaceItem[]>(
      `/items/trending?type=${type || ''}&limit=${limit}`
    );

    this.setCache(cacheKey, response);
    return response;
  }

  /**
   * Get item details
   */
  public async getItemDetails(itemId: string): Promise<MarketplaceItem> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    const cacheKey = this.getCacheKey('details', { itemId });
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await this.fetchFromAPI<MarketplaceItem>(`/items/${itemId}`);
    this.setCache(cacheKey, response);
    return response;
  }

  /**
   * Download a marketplace item
   */
  public async downloadItem(itemId: string): Promise<Template | Section | ReusableComponent> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    // Check license before download
    const item = await this.getItemDetails(itemId);
    const hasLicense = await this.verifyLicense(itemId);

    if (item.metadata.pricingModel !== 'free' && !hasLicense) {
      throw new Error('License required to download this item');
    }

    const response = await this.fetchFromAPI<Template | Section | ReusableComponent>(
      `/items/${itemId}/download`,
      { method: 'POST' }
    );

    return response;
  }

  /**
   * Upload an item to the marketplace
   */
  public async uploadItem(
    item: Template | Section | ReusableComponent,
    isPublic: boolean = false,
    pricing?: { model: 'free' | 'premium' | 'enterprise'; price?: number; currency?: string }
  ): Promise<MarketplaceItem> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    const itemType = this.getItemType(item);
    const payload = {
      type: itemType,
      item,
      isPublic,
      pricing,
    };

    const response = await this.fetchFromAPI<MarketplaceItem>('/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // Clear relevant caches
    this.clearCacheByPattern('browse');
    this.clearCacheByPattern('search');

    return response;
  }

  /**
   * Update an item in the marketplace
   */
  public async updateItem(
    itemId: string,
    item: Template | Section | ReusableComponent
  ): Promise<MarketplaceItem> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    const itemType = this.getItemType(item);
    const payload = {
      type: itemType,
      item,
    };

    const response = await this.fetchFromAPI<MarketplaceItem>(`/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    // Clear relevant caches
    this.clearCacheByPattern(`details:${itemId}`);
    this.clearCacheByPattern('browse');
    this.clearCacheByPattern('search');

    return response;
  }

  /**
   * Delete an item from the marketplace
   */
  public async deleteItem(itemId: string): Promise<void> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    await this.fetchFromAPI<void>(`/items/${itemId}`, { method: 'DELETE' });

    // Clear relevant caches
    this.clearCacheByPattern(`details:${itemId}`);
    this.clearCacheByPattern('browse');
    this.clearCacheByPattern('search');
  }

  /**
   * Get user's uploaded items
   */
  public async getUserItems(
    type?: 'template' | 'section' | 'component'
  ): Promise<MarketplaceItem[]> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    const cacheKey = this.getCacheKey('user-items', { type });
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await this.fetchFromAPI<MarketplaceItem[]>(`/user/items?type=${type || ''}`);

    this.setCache(cacheKey, response);
    return response;
  }

  /**
   * Verify if user has license for an item
   */
  public async verifyLicense(itemId: string): Promise<boolean> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    // Check cache first
    if (this.userLicenseCache.has(itemId)) {
      return this.userLicenseCache.get(itemId)!;
    }

    try {
      const response = await this.fetchFromAPI<{ hasLicense: boolean }>(
        `/items/${itemId}/license/verify`
      );

      this.userLicenseCache.set(itemId, response.hasLicense);
      return response.hasLicense;
    } catch (error) {
      console.error('License verification failed:', error);
      return false;
    }
  }

  /**
   * Purchase a license for an item
   */
  public async purchaseLicense(
    itemId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; licenseId?: string; error?: string }> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    const response = await this.fetchFromAPI<{
      success: boolean;
      licenseId?: string;
      error?: string;
    }>(`/items/${itemId}/license/purchase`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId }),
    });

    if (response.success && response.licenseId) {
      this.userLicenseCache.set(itemId, true);
    }

    return response;
  }

  /**
   * Get item reviews
   */
  public async getItemReviews(itemId: string): Promise<any[]> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    const cacheKey = this.getCacheKey('reviews', { itemId });
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await this.fetchFromAPI<any[]>(`/items/${itemId}/reviews`);
    this.setCache(cacheKey, response);
    return response;
  }

  /**
   * Submit a review for an item
   */
  public async submitReview(
    itemId: string,
    review: { rating: number; comment?: string }
  ): Promise<void> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    await this.fetchFromAPI<void>(`/items/${itemId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });

    // Clear reviews cache
    this.clearCacheByPattern(`reviews:${itemId}`);
  }

  /**
   * Report an item
   */
  public async reportItem(itemId: string, reason: string, details?: string): Promise<void> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    await this.fetchFromAPI<void>(`/items/${itemId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details }),
    });
  }

  /**
   * Get marketplace statistics
   */
  public async getStatistics(): Promise<{
    totalItems: number;
    totalDownloads: number;
    totalAuthors: number;
    categories: Record<string, number>;
  }> {
    if (!this.config.enabled) {
      throw new Error('Marketplace is not enabled');
    }

    const cacheKey = this.getCacheKey('statistics', {});
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await this.fetchFromAPI<any>('/statistics');
    this.setCache(cacheKey, response);
    return response;
  }

  // Private helper methods

  private async fetchFromAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.apiUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Request failed',
      }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  private buildQueryParams(filters?: MarketplaceFilters): string {
    if (!filters) {
      return '';
    }

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
    });

    return params.toString();
  }

  private getCacheKey(operation: string, params: any = {}): string {
    return `${operation}:${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    if (!this.config.cacheEnabled) {
      return null;
    }

    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    const now = Date.now();
    if (now - cached.timestamp > this.config.cacheDuration!) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  private setCache(key: string, data: any): void {
    if (!this.config.cacheEnabled) {
      return;
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Implement cache size limit if configured
    if (this.config.maxCacheSize && this.cache.size > this.config.maxCacheSize) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = entries.slice(0, entries.length - this.config.maxCacheSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  private clearCacheByPattern(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach((key) => {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  private getItemType(item: any): 'template' | 'section' | 'component' {
    if (item.content && item.content.pages) {
      return 'template';
    } else if (item.content && item.content.components) {
      return 'section';
    } else {
      return 'component';
    }
  }
}
