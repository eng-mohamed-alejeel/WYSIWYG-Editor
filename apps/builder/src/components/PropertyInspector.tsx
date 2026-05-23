import React, { useState, useEffect, useCallback } from 'react';
import { ComponentNode, ComponentId } from '@wysiwyg/core';
import { useBuilderStore } from '../store/store';
import { PropsTab } from './PropertyInspector/PropsTab';
import { StylesTab } from './PropertyInspector/StylesTab';
import { AdvancedTab } from './PropertyInspector/AdvancedTab';
import { StyleValue } from './PropertyInspector/types';

interface AccordionItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export const PropertyInspector: React.FC<{ componentId: ComponentId | null }> = ({ componentId }) => {
  const { project, currentPageId, updateComponent } = useBuilderStore();
  const [component, setComponent] = useState<ComponentNode | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>('props');

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

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const accordionItems: AccordionItem[] = [
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
  ];

  if (!component) {
    return <div className="text-center text-gray-500 py-8">Select a component to view its properties</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-300 bg-gray-50">
        <h2 className="text-lg font-semibold">Properties</h2>
      </div>
      <div className="flex-1 overflow-auto">
        {accordionItems.map(item => (
          <div key={item.id} className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion(item.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-700">{item.label}</span>
              <span className={`transform transition-transform ${openAccordion === item.id ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openAccordion === item.id && (
              <div className="p-4 bg-white">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
