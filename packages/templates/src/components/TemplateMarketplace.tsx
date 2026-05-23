/**
 * Template Marketplace Component
 *
 * Main UI component for browsing and managing templates in the marketplace.
 */

import React, { useState, useEffect } from 'react';
import { useTemplateStore } from '../store/templateStore';
import { MarketplaceService } from '../services/MarketplaceService';
import type { MarketplaceFilters, MarketplaceItem } from '../types';

interface TemplateMarketplaceProps {
  onSelectItem?: (item: MarketplaceItem) => void;
  onDownloadItem?: (itemId: string) => void;
  className?: string;
}

export const TemplateMarketplace: React.FC<TemplateMarketplaceProps> = ({
  onSelectItem,
  onDownloadItem,
  className = '',
}) => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [selectedType, setSelectedType] = useState<'template' | 'section' | 'component' | 'all'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const marketplaceService = MarketplaceService.getInstance();

  useEffect(() => {
    loadItems();
  }, [filters, page]);

  const loadItems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await marketplaceService.browseItems({
        ...filters,
        page,
        limit: 12,
      });

      setItems((prev) => (page === 1 ? response.items : [...prev, ...response.items]));
      setHasMore(response.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setItems([]);

    if (query.trim()) {
      setLoading(true);
      try {
        const response = await marketplaceService.searchItems(query, {
          ...filters,
          type: selectedType === 'all' ? undefined : selectedType,
          page: 1,
          limit: 12,
        });

        setItems(response.items);
        setHasMore(response.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    } else {
      loadItems();
    }
  };

  const handleTypeFilter = (type: 'template' | 'section' | 'component' | 'all') => {
    setSelectedType(type);
    setPage(1);
    setItems([]);
    setFilters({
      ...filters,
      type: type === 'all' ? undefined : type,
    });
  };

  const handleCategoryFilter = (category: string) => {
    setPage(1);
    setItems([]);
    setFilters({
      ...filters,
      category: category === 'all' ? undefined : (category as any),
    });
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleItemClick = (item: MarketplaceItem) => {
    onSelectItem?.(item);
  };

  const handleDownload = async (itemId: string) => {
    try {
      await marketplaceService.downloadItem(itemId);
      onDownloadItem?.(itemId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  };

  return (
    <div className={`template-marketplace ${className}`}>
      {/* Search and Filters */}
      <div className="marketplace-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <div className="type-filters">
            <button
              className={`filter-button ${selectedType === 'all' ? 'active' : ''}`}
              onClick={() => handleTypeFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-button ${selectedType === 'template' ? 'active' : ''}`}
              onClick={() => handleTypeFilter('template')}
            >
              Templates
            </button>
            <button
              className={`filter-button ${selectedType === 'section' ? 'active' : ''}`}
              onClick={() => handleTypeFilter('section')}
            >
              Sections
            </button>
            <button
              className={`filter-button ${selectedType === 'component' ? 'active' : ''}`}
              onClick={() => handleTypeFilter('component')}
            >
              Components
            </button>
          </div>

          <div className="category-filters">
            <select
              value={filters.category || 'all'}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="category-select"
            >
              <option value="all">All Categories</option>
              <option value="landing-page">Landing Page</option>
              <option value="portfolio">Portfolio</option>
              <option value="ecommerce">E-commerce</option>
              <option value="blog">Blog</option>
              <option value="business">Business</option>
              <option value="event">Event</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
              <option value="personal">Personal</option>
              <option value="corporate">Corporate</option>
              <option value="startup">Startup</option>
              <option value="saas">SaaS</option>
              <option value="coming-soon">Coming Soon</option>
              <option value="error-page">Error Page</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-button">
            ×
          </button>
        </div>
      )}

      {/* Items Grid */}
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card" onClick={() => handleItemClick(item)}>
            <div className="item-preview">
              {item.previewUrl ? (
                <img src={item.previewUrl} alt={item.metadata.name} />
              ) : (
                <div className="placeholder-preview">{item.metadata.name}</div>
              )}
              {item.metadata.featured && <div className="featured-badge">Featured</div>}
              {item.metadata.pricingModel === 'premium' && (
                <div className="premium-badge">Premium</div>
              )}
            </div>

            <div className="item-info">
              <h3 className="item-name">{item.metadata.name}</h3>
              <p className="item-description">{item.metadata.description}</p>

              <div className="item-meta">
                <span className="item-author">by {item.metadata.author}</span>
                <span className="item-rating">
                  ⭐ {item.metadata.rating || 0}({item.metadata.ratingCount || 0})
                </span>
                <span className="item-downloads">{item.metadata.downloads || 0} downloads</span>
              </div>

              <div className="item-tags">
                {item.metadata.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="item-actions">
              <button
                className="download-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(item.id);
                }}
              >
                {item.metadata.pricingModel === 'free' ? 'Download' : 'Purchase'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && items.length > 0 && (
        <div className="load-more-container">
          <button className="load-more-button" onClick={handleLoadMore}>
            Load More
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && !error && (
        <div className="empty-state">
          <p>No items found</p>
          <p>Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
};
