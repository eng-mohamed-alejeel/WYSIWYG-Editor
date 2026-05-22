'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@wysiwyg/editor';
import { ComponentNode } from '@wysiwyg/core';
import { Button } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Panel } from '@wysiwyg/ui';
import { Tabs } from '@wysiwyg/ui';
import { useBuilderStore } from '../store/store';

import { createInitialProject } from '../utils/ProjectInitializer';

export default function BuilderPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedComponent] = useState<ComponentNode | null>(null);
  const { addComponent, setProject, setCurrentPageId, project } = useBuilderStore();

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
    <div className="flex h-screen">
      {/* Left Sidebar - Component Library */}
      <Panel
        isOpen={true}
        position="left"
        size="small"
        title="Components"
        className="h-full"
      >
        <Tabs
          items={[
            {
              id: 'basic',
              label: 'Basic',
              content: (
                <div className="component-library">
                  <div 
                    className="component-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'container')}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="component-item-icon">
                      <Icon name="layout" size="medium" />
                    </div>
                    <span className="component-item-label">Container</span>
                  </div>
                  <div 
                    className="component-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'grid')}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="component-item-icon">
                      <Icon name="grid" size="medium" />
                    </div>
                    <span className="component-item-label">Grid</span>
                  </div>
                  <div 
                    className="component-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'text')}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="component-item-icon">
                      <Icon name="text" size="medium" />
                    </div>
                    <span className="component-item-label">Text</span>
                  </div>
                  <div 
                    className="component-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'image')}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="component-item-icon">
                      <Icon name="image" size="medium" />
                    </div>
                    <span className="component-item-label">Image</span>
                  </div>
                </div>
              )
            },
            {
              id: 'advanced',
              label: 'Advanced',
              content: (
                <div className="component-library">
                  <div 
                    className="component-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'menu')}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="component-item-icon">
                      <Icon name="menu" size="medium" />
                    </div>
                    <span className="component-item-label">Menu</span>
                  </div>
                  <div 
                    className="component-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'search')}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="component-item-icon">
                      <Icon name="search" size="medium" />
                    </div>
                    <span className="component-item-label">Search</span>
                  </div>
                  <div 
                    className="component-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'filter')}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="component-item-icon">
                      <Icon name="filter" size="medium" />
                    </div>
                    <span className="component-item-label">Filter</span>
                  </div>
                </div>
              )
            }
          ]}
        />
      </Panel>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="toolbar">
          <div className="toolbar-group">
            <Button variant="ghost" size="small">
              <Icon name="arrow-left" size="small" />
            </Button>
            <Button variant="ghost" size="small">
              <Icon name="arrow-right" size="small" />
            </Button>
          </div>

          <div className="toolbar-group">
            <Button variant="ghost" size="small">
              <Icon name="undo" size="small" />
            </Button>
            <Button variant="ghost" size="small">
              <Icon name="refresh" size="small" />
            </Button>
          </div>

          <div className="toolbar-group">
            <div className="breakpoint-switcher">
              <button className="breakpoint-button active">
                <Icon name="layout" size="small" />
              </button>
              <button className="breakpoint-button">
                <Icon name="grid" size="small" />
              </button>
              <button className="breakpoint-button">
                <Icon name="menu" size="small" />
              </button>
            </div>
          </div>

          <div className="toolbar-group">
            <div className="zoom-controls">
              <Button variant="ghost" size="small">
                <Icon name="minus" size="small" />
              </Button>
              <span className="zoom-display">100%</span>
              <Button variant="ghost" size="small">
                <Icon name="plus" size="small" />
              </Button>
            </div>
          </div>

          <div className="toolbar-group ml-auto">
            <Button variant="primary" size="small">
              Preview
            </Button>
            <Button variant="primary" size="small">
              Export
            </Button>
          </div>
        </div>

        {/* Editor Canvas */}
        <div 
          className="editor-canvas flex-1"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="editor-viewport" style={{ width: '100%', maxWidth: '1200px', margin: '2rem auto' }}>
            <Editor>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-4">Welcome to WYSIWYG Builder</h1>
                <p className="text-gray-600 mb-4">
                  Start building your components by dragging and dropping items from the left sidebar.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Feature 1</h2>
                    <p className="text-gray-600">Description of feature 1</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Feature 2</h2>
                    <p className="text-gray-600">Description of feature 2</p>
                  </div>
                </div>
              </div>
            </Editor>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <Panel
        isOpen={true}
        position="right"
        size="medium"
        title="Properties"
        className="h-full"
      >
        {selectedComponent ? (
          <div className="property-group">
            <h3 className="property-group-title">Component Properties</h3>
            <div className="property-item">
              <label className="property-item-label">ID</label>
              <input
                type="text"
                className="property-item-input"
                value={selectedComponent.id}
                readOnly
              />
            </div>
            <div className="property-item">
              <label className="property-item-label">Type</label>
              <input
                type="text"
                className="property-item-input"
                value={selectedComponent.type}
                readOnly
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Select a component to view its properties
          </div>
        )}
      </Panel>
    </div>
  );
}
