/**
 * Template Library Component
 *
 * UI component for managing local templates, sections, and reusable components.
 */

import React, { useState, useEffect } from 'react';
import { useTemplateStore } from '../store/templateStore';
import { TemplateManager } from '../services/TemplateManager';
import { ImportExportService } from '../services/ImportExportService';
import { PreviewService } from '../services/PreviewService';
import type { Template, Section, ReusableComponent } from '../types';

interface TemplateLibraryProps {
  onSelectTemplate?: (template: Template) => void;
  onSelectSection?: (section: Section) => void;
  onSelectComponent?: (component: ReusableComponent) => void;
  className?: string;
}

type LibraryTab = 'templates' | 'sections' | 'components';

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onSelectTemplate,
  onSelectSection,
  onSelectComponent,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<LibraryTab>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    getAllTemplates,
    getAllSections,
    getAllReusableComponents,
    getTemplatesByCategory,
    getSectionsByCategory,
    deleteTemplate,
    deleteSection,
    deleteReusableComponent,
    getAllCategories,
    searchTemplates,
    searchSections,
    searchReusableComponents,
  } = useTemplateStore();

  const templateManager = TemplateManager.getInstance();
  const importExportService = ImportExportService.getInstance();
  const previewService = PreviewService.getInstance();

  const categories = getAllCategories();

  const getFilteredItems = () => {
    let items: any[] = [];

    switch (activeTab) {
      case 'templates':
        items =
          selectedCategory === 'all'
            ? getAllTemplates()
            : getTemplatesByCategory(selectedCategory as any);
        if (searchQuery) {
          items = searchTemplates(searchQuery);
        }
        break;
      case 'sections':
        items =
          selectedCategory === 'all'
            ? getAllSections()
            : getSectionsByCategory(selectedCategory as any);
        if (searchQuery) {
          items = searchSections(searchQuery);
        }
        break;
      case 'components':
        items = getAllReusableComponents();
        if (searchQuery) {
          items = searchReusableComponents(searchQuery);
        }
        break;
    }

    return items;
  };

  const items = getFilteredItems();

  const handleImport = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const imported = await importExportService.importFromFile(file);

      if ('pages' in imported.content) {
        onSelectTemplate?.(imported as Template);
      } else if ('components' in imported.content) {
        onSelectSection?.(imported as Section);
      } else {
        onSelectComponent?.(imported as ReusableComponent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (item: Template | Section | ReusableComponent) => {
    setLoading(true);
    setError(null);

    try {
      const blob = await importExportService.exportToFile(item, `${item.metadata.name}.json`);
      importExportService.downloadExport(blob, `${item.metadata.name}.json`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = (item: Template | Section | ReusableComponent) => {
    try {
      if ('pages' in item.content) {
        const duplicated = templateManager.cloneTemplate(item as Template);
        onSelectTemplate?.(duplicated);
      } else if ('components' in item.content) {
        const duplicated = templateManager.cloneSection(item as Section);
        onSelectSection?.(duplicated);
      } else {
        const duplicated = templateManager.cloneReusableComponent(item as ReusableComponent);
        onSelectComponent?.(duplicated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Duplicate failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      switch (activeTab) {
        case 'templates':
          deleteTemplate(id);
          break;
        case 'sections':
          deleteSection(id);
          break;
        case 'components':
          deleteReusableComponent(id);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleItemClick = (item: Template | Section | ReusableComponent) => {
    if ('pages' in item.content) {
      onSelectTemplate?.(item as Template);
    } else if ('components' in item.content) {
      onSelectSection?.(item as Section);
    } else {
      onSelectComponent?.(item as ReusableComponent);
    }
  };

  return (
    <div className={`template-library ${className}`}>
      {/* Header */}
      <div className="library-header">
        <h2>Template Library</h2>

        <div className="library-actions">
          <label className="import-button">
            Import
            <input
              type="file"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImport(file);
                }
              }}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="library-tabs">
        <button
          className={`tab-button ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button
          className={`tab-button ${activeTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          Sections
        </button>
        <button
          className={`tab-button ${activeTab === 'components' ? 'active' : ''}`}
          onClick={() => setActiveTab('components')}
        >
          Components
        </button>
      </div>

      {/* Search and Filters */}
      <div className="library-filters">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        {activeTab !== 'components' && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.replace('-', ' ').replace(/\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        )}
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
          <div key={item.metadata.id} className="item-card" onClick={() => handleItemClick(item)}>
            <div className="item-preview">
              {item.metadata.thumbnailUrl ? (
                <img src={item.metadata.thumbnailUrl} alt={item.metadata.name} />
              ) : (
                <div className="placeholder-preview">{item.metadata.name}</div>
              )}
              {item.metadata.featured && <div className="featured-badge">Featured</div>}
            </div>

            <div className="item-info">
              <h3 className="item-name">{item.metadata.name}</h3>
              <p className="item-description">{item.metadata.description}</p>

              <div className="item-meta">
                <span className="item-version">v{item.metadata.version}</span>
                <span className="item-date">
                  {new Date(item.metadata.updatedAt).toLocaleDateString()}
                </span>
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
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleExport(item);
                }}
                title="Export"
              >
                Export
              </button>
              <button
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicate(item);
                }}
                title="Duplicate"
              >
                Duplicate
              </button>
              <button
                className="action-button danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.metadata.id);
                }}
                title="Delete"
              >
                Delete
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

      {/* Empty State */}
      {!loading && items.length === 0 && !error && (
        <div className="empty-state">
          <p>No {activeTab} found</p>
          <p>Try adjusting your filters or import a new {activeTab.slice(0, -1)}</p>
        </div>
      )}
    </div>
  );
};
