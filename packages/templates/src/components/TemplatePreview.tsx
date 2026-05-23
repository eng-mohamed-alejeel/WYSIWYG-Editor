/**
 * Template Preview Component
 *
 * Displays a preview of a template, section, or component with options
 * to view in different breakpoints and interact with the content.
 */

import React, { useState, useEffect } from 'react';
import { PreviewService } from '../services/PreviewService';
import type { Template, Section, ReusableComponent, Breakpoint } from '../types';

interface TemplatePreviewProps {
  item: Template | Section | ReusableComponent;
  onUseTemplate?: (item: Template | Section | ReusableComponent) => void;
  onClose?: () => void;
  className?: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  item,
  onUseTemplate,
  onClose,
  className = '',
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('desktop');
  const [scale, setScale] = useState(1);

  const previewService = PreviewService.getInstance();

  useEffect(() => {
    loadPreview();
  }, [item]);

  const loadPreview = async () => {
    setLoading(true);
    setError(null);

    try {
      let url: string;

      if ('pages' in item.content) {
        url = await previewService.generateTemplatePreview(item as Template);
      } else if ('components' in item.content) {
        url = await previewService.generateSectionPreview(item as Section);
      } else {
        url = await previewService.generateComponentPreview(item as ReusableComponent);
      }

      setPreviewUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  const handleBreakpointChange = (breakpoint: Breakpoint) => {
    setCurrentBreakpoint(breakpoint);
    // Adjust scale based on breakpoint
    const scales: Record<Breakpoint, number> = {
      mobile: 0.5,
      tablet: 0.75,
      desktop: 1,
      wide: 1.25,
    };
    setScale(scales[breakpoint]);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.25));
  };

  const handleResetZoom = () => {
    const scales: Record<Breakpoint, number> = {
      mobile: 0.5,
      tablet: 0.75,
      desktop: 1,
      wide: 1.25,
    };
    setScale(scales[currentBreakpoint]);
  };

  const getItemType = () => {
    if ('pages' in item.content) return 'Template';
    if ('components' in item.content) return 'Section';
    return 'Component';
  };

  return (
    <div className={`template-preview ${className}`}>
      {/* Header */}
      <div className="preview-header">
        <div className="preview-title">
          <h2>{item.metadata.name}</h2>
          <span className="item-type">{getItemType()}</span>
        </div>

        <div className="preview-actions">
          <button className="action-button primary" onClick={() => onUseTemplate?.(item)}>
            Use This {getItemType()}
          </button>
          {onClose && (
            <button className="action-button" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="preview-metadata">
        <div className="metadata-section">
          <h3>Description</h3>
          <p>{item.metadata.description}</p>
        </div>

        <div className="metadata-section">
          <h3>Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Version:</span>
              <span className="value">{item.metadata.version}</span>
            </div>
            <div className="detail-item">
              <span className="label">Author:</span>
              <span className="value">{item.metadata.author}</span>
            </div>
            <div className="detail-item">
              <span className="label">Category:</span>
              <span className="value">
                {item.metadata.category.replace('-', ' ').replace(/\w/g, (l) => l.toUpperCase())}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Last Updated:</span>
              <span className="value">
                {new Date(item.metadata.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {item.metadata.tags.length > 0 && (
          <div className="metadata-section">
            <h3>Tags</h3>
            <div className="tags-list">
              {item.metadata.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {item.metadata.pricingModel && (
          <div className="metadata-section">
            <h3>Pricing</h3>
            <div className="pricing-info">
              <span className={`pricing-model ${item.metadata.pricingModel}`}>
                {item.metadata.pricingModel === 'free' ? 'Free' : 'Premium'}
              </span>
              {item.metadata.price && (
                <span className="price">
                  {item.metadata.currency || '$'}
                  {item.metadata.price}
                </span>
              )}
            </div>
          </div>
        )}

        {item.metadata.rating !== undefined && (
          <div className="metadata-section">
            <h3>Rating</h3>
            <div className="rating-info">
              <span className="rating-value">⭐ {item.metadata.rating.toFixed(1)}</span>
              <span className="rating-count">({item.metadata.ratingCount || 0} reviews)</span>
            </div>
          </div>
        )}

        {item.metadata.downloads !== undefined && (
          <div className="metadata-section">
            <h3>Downloads</h3>
            <span className="downloads-count">{item.metadata.downloads.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Preview Controls */}
      <div className="preview-controls">
        <div className="breakpoint-controls">
          <button
            className={`breakpoint-button ${currentBreakpoint === 'mobile' ? 'active' : ''}`}
            onClick={() => handleBreakpointChange('mobile')}
          >
            Mobile
          </button>
          <button
            className={`breakpoint-button ${currentBreakpoint === 'tablet' ? 'active' : ''}`}
            onClick={() => handleBreakpointChange('tablet')}
          >
            Tablet
          </button>
          <button
            className={`breakpoint-button ${currentBreakpoint === 'desktop' ? 'active' : ''}`}
            onClick={() => handleBreakpointChange('desktop')}
          >
            Desktop
          </button>
          <button
            className={`breakpoint-button ${currentBreakpoint === 'wide' ? 'active' : ''}`}
            onClick={() => handleBreakpointChange('wide')}
          >
            Wide
          </button>
        </div>

        <div className="zoom-controls">
          <button className="zoom-button" onClick={handleZoomOut} title="Zoom Out">
            −
          </button>
          <span className="zoom-level">{Math.round(scale * 100)}%</span>
          <button className="zoom-button" onClick={handleZoomIn} title="Zoom In">
            +
          </button>
          <button className="zoom-button" onClick={handleResetZoom} title="Reset Zoom">
            Reset
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="preview-content">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading preview...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadPreview} className="retry-button">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && previewUrl && (
          <div
            className="preview-iframe-container"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <iframe
              src={previewUrl}
              title={`${item.metadata.name} Preview`}
              className="preview-iframe"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}
      </div>
    </div>
  );
};
