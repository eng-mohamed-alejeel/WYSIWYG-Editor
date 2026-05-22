import React, { useState } from 'react';
import { Icon } from '@wysiwyg/ui';

interface ComponentLibraryPanelProps {
  handleDragStart: (e: React.DragEvent, type: string) => void;
  handleDragEnd: () => void;
}

export const ComponentLibraryPanel: React.FC<ComponentLibraryPanelProps> = ({
  handleDragStart,
  handleDragEnd
}) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const basicComponents = [
    { type: 'text', icon: 'text', label: 'Text' },
    { type: 'heading', icon: 'heading', label: 'Heading' },
    { type: 'paragraph', icon: 'text', label: 'Paragraph' },
    { type: 'link', icon: 'link', label: 'Link' },
    { type: 'button', icon: 'button', label: 'Button' },
    { type: 'divider', icon: 'divider', label: 'Divider' },
    { type: 'spacer', icon: 'spacer', label: 'Spacer' },
    { type: 'icon', icon: 'icon', label: 'Icon' }
  ];

  const layoutComponents = [
    { type: 'container', icon: 'layout', label: 'Container' },
    { type: 'row', icon: 'grid', label: 'Row' },
    { type: 'column', icon: 'grid', label: 'Column' },
    { type: 'grid', icon: 'grid', label: 'Grid' },
    { type: 'section', icon: 'layout', label: 'Section' }
  ];

  const mediaComponents = [
    { type: 'image', icon: 'image', label: 'Image' },
    { type: 'video', icon: 'video', label: 'Video' }
  ];

  const formComponents = [
    { type: 'input', icon: 'input', label: 'Input' },
    { type: 'textarea', icon: 'input', label: 'Textarea' },
    { type: 'select', icon: 'input', label: 'Select' },
    { type: 'checkbox', icon: 'checkbox', label: 'Checkbox' },
    { type: 'radio', icon: 'radio', label: 'Radio' }
  ];

  const advancedComponents = [
    { type: 'menu', icon: 'menu', label: 'Menu' },
    { type: 'tabs', icon: 'tabs', label: 'Tabs' },
    { type: 'accordion', icon: 'accordion', label: 'Accordion' },
    { type: 'modal', icon: 'modal', label: 'Modal' },
    { type: 'carousel', icon: 'carousel', label: 'Carousel' },
    { type: 'table', icon: 'table', label: 'Table' },
    { type: 'search', icon: 'search', label: 'Search' },
    { type: 'filter', icon: 'filter', label: 'Filter' }
  ];

  const renderComponentItem = (type: string, icon: string, label: string) => (
    <div key={type} className="component-item p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200" draggable onDragStart={(e) => handleDragStart(e, type)} onDragEnd={handleDragEnd}>
      <div className="flex items-center gap-3">
        <Icon name={icon} size="medium" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );

  const categories = [
    { id: 'basic', label: 'Basic', components: basicComponents },
    { id: 'layout', label: 'Layout', components: layoutComponents },
    { id: 'media', label: 'Media', components: mediaComponents },
    { id: 'forms', label: 'Forms', components: formComponents },
    { id: 'advanced', label: 'Advanced', components: advancedComponents }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-300 bg-gray-50">
        <h2 className="text-lg font-semibold">Components</h2>
      </div>
      <div className="flex-1 overflow-auto">
        {categories.map(category => (
          <div key={category.id} className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion(category.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-700">{category.label}</span>
              <span className={`transform transition-transform ${openAccordion === category.id ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openAccordion === category.id && (
              <div className="component-library">
                {category.components.map(c => renderComponentItem(c.type, c.icon, c.label))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
