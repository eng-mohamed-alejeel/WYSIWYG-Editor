import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ComponentNode, ComponentId } from '@wysiwyg/core';
import { useBuilderStore } from '../store/store';
import { Tabs, TabItem } from '@wysiwyg/ui';
import { PropsTab } from './PropertyInspector/PropsTab';
import { StylesTab } from './PropertyInspector/StylesTab';
import { AdvancedTab } from './PropertyInspector/AdvancedTab';
import { StyleValue } from './PropertyInspector/types';

export const PropertyInspector: React.FC<{ componentId: ComponentId | null }> = ({ componentId }) => {
  const { project, currentPageId, updateComponent } = useBuilderStore();
  const [component, setComponent] = useState<ComponentNode | null>(null);

  useEffect(() => {
    if (!componentId || !project || !currentPageId) {
      setComponent(null);
      return;
    }

    const page = project.pages.find((p: any) => p.id === currentPageId);
    if (!page) {
      setComponent(null);
      return;
    }

    const findComponent = (nodes: ComponentNode[]): ComponentNode | null => {
      for (const node of nodes) {
        if (node.id === componentId) return node;
        if (node.children.length > 0) {
          const found = findComponent(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const found = findComponent(page.components);
    setComponent(found);
  }, [componentId, project, currentPageId]);

  const handlePropChange = useCallback((key: string, value: any) => {
    if (!componentId) return;
    updateComponent(componentId, { props: { ...component.props, [key]: value } });
  }, [componentId, component?.props, updateComponent]);

  const handleStyleChange = useCallback((key: string, value: StyleValue) => {
    if (!componentId) return;
    updateComponent(componentId, { styles: { ...component.styles, [key]: value } });
  }, [componentId, component?.styles, updateComponent]);

  const tabs = useMemo<TabItem[]>(() => [
    {
      id: 'props',
      label: 'Properties',
      content: <PropsTab component={component} onPropChange={handlePropChange} />
    },
    {
      id: 'styles',
      label: 'Styles',
      content: <StylesTab component={component} onStyleChange={handleStyleChange} />
    },
    {
      id: 'advanced',
      label: 'Advanced',
      content: <AdvancedTab component={component} onPropChange={handlePropChange} onStyleChange={handleStyleChange} />
    }
  ], [component, handlePropChange, handleStyleChange]);

  if (!component) {
    return <div className="text-center text-gray-500 py-8">Select a component to view its properties</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs items={tabs} variant="pills" className="flex-1" />
    </div>
  );
};
