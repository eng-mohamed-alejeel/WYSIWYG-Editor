import React, { useState } from 'react';
import { useBuilderStore } from '../store/store';
import { Toolbar } from './Toolbar';
import { Canvas } from './Canvas';
import { ComponentLibrary } from './ComponentLibrary';
import { PropertyInspector } from './PropertyInspector';
import { LayerPanel } from './LayerPanel';
import { SettingsPanel } from './SettingsPanel';
import { PagePanel } from './PagePanel';
import { AssetPanel } from './AssetPanel';
import { ExportDialog, ExportOptions } from './ExportDialog';
import { Panel } from '@wysiwyg/ui';
import { Tabs, TabItem } from '@wysiwyg/ui';
import { ComponentRenderer } from './ComponentRenderer';
import { DragDropProvider } from './DragDropProvider';
import { ComponentNode } from '@wysiwyg/core';

export const EditorLayout: React.FC = () => {
  const { project, currentPageId, selectedIds, isPreviewMode, addComponent, setSelectedIds } =
    useBuilderStore();

  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState('components');
  const [activeRightTab, setActiveRightTab] = useState('properties');
  const [draggedComponentType, setDraggedComponentType] = useState<string | null>(null);

  const handleExport = (options: ExportOptions) => {
    console.log('Exporting with options:', options);
    // Implement export logic here
  };

  const handleDragStart = (component: any) => {
    setDraggedComponentType(component.type);
  };

  const handleDragEnd = () => {
    setDraggedComponentType(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedComponentType || !currentPageId) return;

    // Check if dropping on a component
    const targetComponent = (e.target as HTMLElement).closest('[data-component-id]');

    const newComponent: ComponentNode = {
      id: `component_${Date.now()}`,
      type: draggedComponentType,
      props: {},
      styles: {},
      children: [],
    };

    if (targetComponent) {
      const targetId = targetComponent.getAttribute('data-component-id');
      if (targetId) {
        // Add component as child of the target
        addComponent(newComponent);
      }
    } else {
      // Add to the page root
      addComponent(newComponent);
    }

    // Select the newly added component
    setSelectedIds([newComponent.id]);
    setDraggedComponentType(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getCurrentPageComponents = (): ComponentNode[] => {
    if (!project || !currentPageId) return [];
    const page = project.pages.find((p: any) => p.id === currentPageId);
    return page?.components || [];
  };

  const leftTabs: TabItem[] = [
    {
      id: 'components',
      label: 'Components',
      content: <ComponentLibrary onDragStart={handleDragStart} onDragEnd={handleDragEnd} />,
    },
    {
      id: 'layers',
      label: 'Layers',
      content: <LayerPanel components={getCurrentPageComponents()} />,
    },
    {
      id: 'pages',
      label: 'Pages',
      content: <PagePanel />,
    },
    {
      id: 'assets',
      label: 'Assets',
      content: <AssetPanel />,
    },
  ];

  const rightTabs: TabItem[] = [
    {
      id: 'properties',
      label: 'Properties',
      content: <PropertyInspector componentId={selectedIds[0] || null} />,
    },
    {
      id: 'settings',
      label: 'Settings',
      content: <SettingsPanel />,
    },
  ];

  return (
    <DragDropProvider>
      <div className="flex flex-col h-screen">
        {/* Top Toolbar */}
        <Toolbar />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <Panel isOpen={true} position="left" size="small" className="h-full">
            <Tabs
              items={leftTabs}
              activeTab={activeLeftTab}
              onChange={setActiveLeftTab}
              variant="pills"
              className="flex-1"
            />
          </Panel>

          {/* Center Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Canvas>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`min-h-full ${isPreviewMode ? 'preview-mode' : 'edit-mode'}`}
              >
                {getCurrentPageComponents().map((component) => (
                  <ComponentRenderer
                    key={component.id}
                    component={component}
                    isPreview={isPreviewMode}
                  />
                ))}
              </div>
            </Canvas>
          </div>

          {/* Right Sidebar */}
          <Panel isOpen={true} position="right" size="medium" className="h-full">
            <Tabs
              items={rightTabs}
              activeTab={activeRightTab}
              onChange={setActiveRightTab}
              variant="pills"
              className="flex-1"
            />
          </Panel>
        </div>

        {/* Export Dialog */}
        <ExportDialog
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
          onExport={handleExport}
        />
      </div>
    </DragDropProvider>
  );
};
