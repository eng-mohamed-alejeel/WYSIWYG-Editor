'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@wysiwyg/editor';
import { ComponentNode } from '@wysiwyg/core';
import { useBuilderStore } from '../store/store';
import { createInitialProject } from '../utils/ProjectInitializer';
import { BuilderToolbar } from '../components/BuilderToolbar';
import { ComponentsContainer } from '../components/ComponentsContainer';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { ComponentLibraryPanel } from '../components/ComponentLibraryPanel';
import { DragDropProvider } from '../components/DragDropProvider';

export default function BuilderPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { addComponent, setProject, setCurrentPageId, project, selectedIds } = useBuilderStore();
  const selectedComponentId = selectedIds.length > 0 ? selectedIds[0] : null;

  useEffect(() => {
    if (!project) {
      const initialProject = createInitialProject();
      setProject(initialProject);
      setCurrentPageId(initialProject.pages[0].id);
    }
    setIsLoaded(true);
  }, [project, setProject, setCurrentPageId]);

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    // Reset drag state if needed
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType');
    if (type) {
      const newComponent: ComponentNode = {
        id: `${type}_${Date.now()}`,
        type,
        children: [],
        props: {},
        styles: {}
      };
      addComponent(newComponent);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading builder...</p>
        </div>
      </div>
    );
  }

  return (
    <DragDropProvider>
      <div className="flex h-screen">
        {/* الشريط الجانبي الأيسر */}
        <div className="w-64 border-r border-gray-300 flex-shrink-0">
          <ComponentLibraryPanel handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />
        </div>

        {/* المنطقة الوسطى */}
        <div className="flex-1 flex flex-col">
          {/* الشريط العلوي */}
          <div className="h-16 border-b border-gray-300 flex-shrink-0">
            <BuilderToolbar />
          </div>

          {/* منطقة المحرر */}
          <div className="flex-1 overflow-auto" onDragOver={handleDragOver} onDrop={handleDrop}>
            <div className="editor-viewport">
              <Editor>
                <ComponentsContainer components={project?.pages[0]?.components || []} />
              </Editor>
            </div>
          </div>
        </div>

        {/* الشريط الجانبي الأيمن */}
        <div className="w-80 border-l border-gray-300 flex-shrink-0">
          <PropertiesPanel selectedComponentId={selectedComponentId} />
        </div>
      </div>
    </DragDropProvider>
  );
}
