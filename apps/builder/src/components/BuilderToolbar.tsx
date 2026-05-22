import React, { useCallback } from 'react';
import { Button } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { useBuilderStore } from '../store/store';

export const BuilderToolbar: React.FC = () => {
  const {
    currentBreakpoint,
    zoom,
    isPreviewMode,
    project,
    canUndo,
    canRedo,
    setCurrentBreakpoint,
    setZoom,
    setIsPreviewMode,
    setIsDirty,
    undo,
    redo
  } = useBuilderStore();

  // Navigation functions
  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    }
  }, []);

  const handleGoForward = useCallback(() => {
    if (window.history.length > 1) {
      window.history.forward();
    }
  }, []);

  // Undo/Redo functions
  const handleUndo = useCallback(() => {
    if (canUndo) {
      undo();
    }
  }, [canUndo, undo]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      redo();
    }
  }, [canRedo, redo]);

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom + 0.1, 2);
    setZoom(newZoom);
  }, [zoom, setZoom]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom - 0.1, 0.5);
    setZoom(newZoom);
  }, [zoom, setZoom]);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, [setZoom]);

  // Breakpoint functions
  const handleBreakpointChange = useCallback((breakpoint: 'desktop' | 'tablet' | 'mobile') => {
    setCurrentBreakpoint(breakpoint);
  }, [setCurrentBreakpoint]);

  // Preview mode
  const handlePreviewToggle = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode, setIsPreviewMode]);

  // Export function
  const handleExport = useCallback(() => {
    if (!project) {
      console.warn('No project to export');
      return;
    }

    try {
      const exportData = JSON.stringify(project, null, 2);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsDirty(false);
      console.log('Project exported successfully');
    } catch (error) {
      console.error('Failed to export project:', error);
    }
  }, [project, setIsDirty]);

  // Save function
  const handleSave = useCallback(() => {
    if (!project) {
      console.warn('No project to save');
      return;
    }

    try {
      localStorage.setItem('wysiwyg-project', JSON.stringify(project));
      setIsDirty(false);
      console.log('Project saved successfully');
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  }, [project, setIsDirty]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z for Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl/Cmd + Shift + Z for Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      }
      // Ctrl/Cmd + S for Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Ctrl/Cmd + E for Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleExport();
      }
      // Ctrl/Cmd + P for Preview
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePreviewToggle();
      }
      // + for Zoom In
      if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      }
      // - for Zoom Out
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      }
      // 0 for Zoom Reset
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        handleZoomReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleSave, handleExport, handlePreviewToggle, handleZoomIn, handleZoomOut, handleZoomReset]);

  return (
    <div className="h-full flex items-center justify-between px-4 bg-white border-b border-gray-300">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="small" onClick={handleGoBack} title="Go Back (Alt+Left)">
          <Icon name="arrow-left" size="small" />
        </Button>
        <Button variant="ghost" size="small" onClick={handleGoForward} title="Go Forward (Alt+Right)">
          <Icon name="arrow-right" size="small" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        {/* Undo/Redo Section */}
        <div className="flex items-center gap-2">
          {/* Undo Button - Half Circle Left */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="small" 
              onClick={handleUndo} 
              disabled={!canUndo}
              className={`
                ${!canUndo 
                  ? 'opacity-40 cursor-not-allowed bg-gray-100' 
                  : 'hover:bg-blue-500 hover:text-white hover:shadow-lg active:scale-95'
                }
                transition-all duration-300
                rounded-l-full rounded-r-md
                min-w-[44px]
                h-[44px]
                flex items-center justify-center
                border-2 border-gray-200
                ${canUndo ? 'bg-white' : 'bg-gray-100'}
              `}
              title="Undo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </Button>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              <div className="text-center">
                <div className="font-semibold">Undo</div>
                <div className="text-gray-400 text-[10px]">Ctrl+Z</div>
              </div>
            </div>
          </div>

          {/* Redo Button - Half Circle Right */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="small" 
              onClick={handleRedo} 
              disabled={!canRedo}
              className={`
                ${!canRedo 
                  ? 'opacity-40 cursor-not-allowed bg-gray-100' 
                  : 'hover:bg-green-500 hover:text-white hover:shadow-lg active:scale-95'
                }
                transition-all duration-300
                rounded-r-full rounded-l-md
                min-w-[44px]
                h-[44px]
                flex items-center justify-center
                border-2 border-gray-200
                ${canRedo ? 'bg-white' : 'bg-gray-100'}
              `}
              title="Redo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
            </Button>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              <div className="text-center">
                <div className="font-semibold">Redo</div>
                <div className="text-gray-400 text-[10px]">Ctrl+Shift+Z</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
          <button
            className={`p-2 rounded transition-all ${currentBreakpoint === 'desktop' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
            onClick={() => handleBreakpointChange('desktop')}
            title="Desktop View"
          >
            <Icon name="layout" size="small" />
          </button>
          <button
            className={`p-2 rounded transition-all ${currentBreakpoint === 'tablet' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
            onClick={() => handleBreakpointChange('tablet')}
            title="Tablet View"
          >
            <Icon name="grid" size="small" />
          </button>
          <button
            className={`p-2 rounded transition-all ${currentBreakpoint === 'mobile' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
            onClick={() => handleBreakpointChange('mobile')}
            title="Mobile View"
          >
            <Icon name="menu" size="small" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="small" onClick={handleZoomOut} title="Zoom Out (Ctrl+-)">
            <Icon name="minus" size="small" />
          </Button>
          <span 
            className="text-sm font-medium w-12 text-center cursor-pointer hover:text-blue-600 transition-colors"
            onClick={handleZoomReset}
            title="Click to reset zoom (Ctrl+0)"
          >
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="small" onClick={handleZoomIn} title="Zoom In (Ctrl++)">
            <Icon name="plus" size="small" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="primary" size="small" onClick={handlePreviewToggle} title="Toggle Preview (Ctrl+P)">
          {isPreviewMode ? 'Edit' : 'Preview'}
        </Button>
        <Button variant="primary" size="small" onClick={handleExport} title="Export Project (Ctrl+E)">
          Export
        </Button>
      </div>
    </div>
  );
};
