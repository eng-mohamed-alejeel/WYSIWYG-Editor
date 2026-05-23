import React from 'react';
import { useBuilderStore } from '../store/store';
import { Button } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Breadcrumb, BreadcrumbItem } from '@wysiwyg/ui';

export const Toolbar: React.FC = () => {
  const {
    currentBreakpoint,
    zoom,
    setCurrentBreakpoint,
    setZoom,
    isPreviewMode,
    setIsPreviewMode,
    isDirty,
  } = useBuilderStore();

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'pages', label: 'Pages' },
    { id: 'current', label: 'Page 1', active: true },
  ];

  return (
    <div className="toolbar">
      {/* Left section - Navigation */}
      <div className="toolbar-group">
        <Button variant="ghost" size="small">
          <Icon name="arrow-left" size="small" />
        </Button>
        <Button variant="ghost" size="small">
          <Icon name="arrow-right" size="small" />
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="toolbar-group">
        <Breadcrumb items={breadcrumbItems} size="small" />
      </div>

      {/* History controls */}
      <div className="toolbar-group">
        <Button variant="ghost" size="small" title="Undo">
          <Icon name="undo" size="small" />
        </Button>
        <Button variant="ghost" size="small" title="Redo">
          <Icon name="refresh" size="small" />
        </Button>
      </div>

      {/* Breakpoint switcher */}
      <div className="toolbar-group">
        <div className="breakpoint-switcher">
          <button
            className={`breakpoint-button ${currentBreakpoint === 'desktop' ? 'active' : ''}`}
            onClick={() => setCurrentBreakpoint('desktop')}
            title="Desktop"
          >
            <Icon name="layout" size="small" />
          </button>
          <button
            className={`breakpoint-button ${currentBreakpoint === 'tablet' ? 'active' : ''}`}
            onClick={() => setCurrentBreakpoint('tablet')}
            title="Tablet"
          >
            <Icon name="grid" size="small" />
          </button>
          <button
            className={`breakpoint-button ${currentBreakpoint === 'mobile' ? 'active' : ''}`}
            onClick={() => setCurrentBreakpoint('mobile')}
            title="Mobile"
          >
            <Icon name="menu" size="small" />
          </button>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="toolbar-group">
        <div className="zoom-controls">
          <Button variant="ghost" size="small" onClick={handleZoomOut}>
            <Icon name="minus" size="small" />
          </Button>
          <span className="zoom-display">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="small" onClick={handleZoomIn}>
            <Icon name="plus" size="small" />
          </Button>
          <Button variant="ghost" size="small" onClick={handleResetZoom}>
            <Icon name="refresh" size="small" />
          </Button>
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="toolbar-group ml-auto">
        {isDirty && (
          <div className="flex items-center gap-2 mr-4">
            <span className="text-sm text-yellow-600">
              <Icon name="warning" size="small" className="inline" />
              Unsaved changes
            </span>
          </div>
        )}

        <Button
          variant={isPreviewMode ? 'primary' : 'ghost'}
          size="small"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
        >
          <Icon name={isPreviewMode ? 'edit' : 'play'} size="small" />
          {isPreviewMode ? 'Edit' : 'Preview'}
        </Button>

        <Button variant="primary" size="small">
          <Icon name="save" size="small" />
          Save
        </Button>

        <Button variant="primary" size="small">
          <Icon name="download" size="small" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
