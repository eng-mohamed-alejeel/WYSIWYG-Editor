/**
 * Template Editor Integration Component
 *
 * Integrates template functionality with the visual editor, allowing users
 * to apply templates, sections, and components to their projects.
 */

import React, { useState, useEffect } from 'react';
import { useTemplateStore } from '../store/templateStore';
import { TemplateManager } from '../services/TemplateManager';
import { ImportExportService } from '../services/ImportExportService';
import { PreviewService } from '../services/PreviewService';
import type { Template, Section, ReusableComponent, ComponentNode } from '../types';

interface TemplateEditorIntegrationProps {
  project?: any;
  currentPage?: any;
  selectedComponents?: ComponentNode[];
  onApplyTemplate?: (template: Template) => void;
  onApplySection?: (section: Section) => void;
  onApplyComponent?: (component: ReusableComponent) => void;
  onSaveAsTemplate?: (template: Template) => void;
  onSaveAsSection?: (section: Section) => void;
  onSaveAsComponent?: (component: ReusableComponent) => void;
  className?: string;
}

type IntegrationTab = 'templates' | 'sections' | 'components' | 'save';

export const TemplateEditorIntegration: React.FC<TemplateEditorIntegrationProps> = ({
  project,
  currentPage,
  selectedComponents,
  onApplyTemplate,
  onApplySection,
  onApplyComponent,
  onSaveAsTemplate,
  onSaveAsSection,
  onSaveAsComponent,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<IntegrationTab>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveForm, setSaveForm] = useState({
    name: '',
    description: '',
    category: 'landing-page',
    tags: '',
  });

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

  const handleApplyItem = async (item: Template | Section | ReusableComponent) => {
    setLoading(true);
    setError(null);

    try {
      if ('pages' in item.content) {
        onApplyTemplate?.(item as Template);
      } else if ('components' in item.content) {
        onApplySection?.(item as Section);
      } else {
        onApplyComponent?.(item as ReusableComponent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply item');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!project || !saveForm.name) {
      setError('Please provide a name for the template');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const template: Template = {
        metadata: {
          id: crypto.randomUUID(),
          name: saveForm.name,
          description: saveForm.description,
          category: saveForm.category as any,
          tags: saveForm.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          version: '1.0.0',
          author: 'User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'draft',
        },
        content: {
          pages: project.pages || [],
          theme: project.theme,
          assets: project.assets || [],
        },
      };

      onSaveAsTemplate?.(template);
      setSaveForm({
        name: '',
        description: '',
        category: 'landing-page',
        tags: '',
      });
      setActiveTab('templates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsSection = async () => {
    if (!currentPage || selectedComponents.length === 0 || !saveForm.name) {
      setError('Please select components and provide a name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const section: Section = {
        metadata: {
          id: crypto.randomUUID(),
          name: saveForm.name,
          description: saveForm.description,
          category: saveForm.category as any,
          tags: saveForm.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          version: '1.0.0',
          author: 'User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'draft',
        },
        content: {
          components: selectedComponents,
          styles: {},
        },
      };

      onSaveAsSection?.(section);
      setSaveForm({
        name: '',
        description: '',
        category: 'landing-page',
        tags: '',
      });
      setActiveTab('sections');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save section');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsComponent = async () => {
    if (selectedComponents.length !== 1 || !saveForm.name) {
      setError('Please select exactly one component and provide a name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const component: ReusableComponent = {
        metadata: {
          id: crypto.randomUUID(),
          name: saveForm.name,
          description: saveForm.description,
          category: saveForm.category,
          tags: saveForm.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          version: '1.0.0',
          author: 'User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'draft',
        },
        content: selectedComponents[0],
      };

      onSaveAsComponent?.(component);
      setSaveForm({
        name: '',
        description: '',
        category: 'custom',
        tags: '',
      });
      setActiveTab('components');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save component');
    } finally {
      setLoading(false);
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

  return (
    <div className={`template-editor-integration ${className}`}>
      {/* Tabs */}
      <div className="integration-tabs">
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
        <button
          className={`tab-button ${activeTab === 'save' ? 'active' : ''}`}
          onClick={() => setActiveTab('save')}
        >
          Save As
        </button>
      </div>

      {/* Search and Filters */}
      {activeTab !== 'save' && (
        <div className="integration-filters">
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
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-button">
            ×
          </button>
        </div>
      )}

      {/* Save Form */}
      {activeTab === 'save' && (
        <div className="save-form">
          <h3>Save Selection As</h3>

          <div className="save-options">
            {project && (
              <button
                className="save-option-button"
                onClick={() => {
                  setSaveForm((prev) => ({ ...prev, category: 'landing-page' }));
                  handleSaveAsTemplate();
                }}
              >
                Save as Template
              </button>
            )}

            {currentPage && selectedComponents.length > 0 && (
              <button
                className="save-option-button"
                onClick={() => {
                  setSaveForm((prev) => ({ ...prev, category: 'business' }));
                  handleSaveAsSection();
                }}
              >
                Save as Section
              </button>
            )}

            {selectedComponents.length === 1 && (
              <button
                className="save-option-button"
                onClick={() => {
                  setSaveForm((prev) => ({ ...prev, category: 'custom' }));
                  handleSaveAsComponent();
                }}
              >
                Save as Component
              </button>
            )}
          </div>

          <div className="form-fields">
            <div className="form-field">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                value={saveForm.name}
                onChange={(e) => setSaveForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={saveForm.description}
                onChange={(e) => setSaveForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={saveForm.category}
                onChange={(e) => setSaveForm((prev) => ({ ...prev, category: e.target.value }))}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.replace('-', ' ').replace(/\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                id="tags"
                type="text"
                value={saveForm.tags}
                onChange={(e) => setSaveForm((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g., modern, responsive, clean"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              className="save-button"
              onClick={() => {
                if (project) handleSaveAsTemplate();
                else if (currentPage && selectedComponents.length > 0) handleSaveAsSection();
                else if (selectedComponents.length === 1) handleSaveAsComponent();
              }}
              disabled={loading || !saveForm.name}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Items Grid */}
      {activeTab !== 'save' && (
        <div className="items-grid">
          {items.map((item) => (
            <div key={item.metadata.id} className="item-card">
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
                <button className="action-button primary" onClick={() => handleApplyItem(item)}>
                  Apply
                </button>
                <button
                  className="action-button danger"
                  onClick={() => handleDelete(item.metadata.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && !error && activeTab !== 'save' && (
        <div className="empty-state">
          <p>No {activeTab} found</p>
          <p>Try adjusting your filters or create a new {activeTab.slice(0, -1)}</p>
        </div>
      )}
    </div>
  );
};
