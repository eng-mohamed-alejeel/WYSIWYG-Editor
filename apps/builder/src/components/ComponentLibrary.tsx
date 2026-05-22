import React from 'react';
import { Icon } from '@wysiwyg/ui';

interface ComponentLibraryItem {
  id: string;
  type: string;
  label: string;
  icon: string;
  category: 'basic' | 'advanced' | 'layout' | 'media' | 'forms';
}

const COMPONENTS: ComponentLibraryItem[] = [
  // Basic components
  {
    id: 'text',
    type: 'text',
    label: 'Text',
    icon: 'text',
    category: 'basic'
  },
  {
    id: 'heading',
    type: 'heading',
    label: 'Heading',
    icon: 'heading',
    category: 'basic'
  },
  {
    id: 'paragraph',
    type: 'paragraph',
    label: 'Paragraph',
    icon: 'text',
    category: 'basic'
  },
  {
    id: 'link',
    type: 'link',
    label: 'Link',
    icon: 'link',
    category: 'basic'
  },
  {
    id: 'button',
    type: 'button',
    label: 'Button',
    icon: 'button',
    category: 'basic'
  },
  {
    id: 'image',
    type: 'image',
    label: 'Image',
    icon: 'image',
    category: 'media'
  },
  {
    id: 'video',
    type: 'video',
    label: 'Video',
    icon: 'video',
    category: 'media'
  },
  {
    id: 'divider',
    type: 'divider',
    label: 'Divider',
    icon: 'divider',
    category: 'basic'
  },
  {
    id: 'spacer',
    type: 'spacer',
    label: 'Spacer',
    icon: 'spacer',
    category: 'basic'
  },
  {
    id: 'icon',
    type: 'icon',
    label: 'Icon',
    icon: 'icon',
    category: 'basic'
  },
  // Layout components
  {
    id: 'container',
    type: 'container',
    label: 'Container',
    icon: 'layout',
    category: 'layout'
  },
  {
    id: 'row',
    type: 'row',
    label: 'Row',
    icon: 'grid',
    category: 'layout'
  },
  {
    id: 'column',
    type: 'column',
    label: 'Column',
    icon: 'grid',
    category: 'layout'
  },
  {
    id: 'grid',
    type: 'grid',
    label: 'Grid',
    icon: 'grid',
    category: 'layout'
  },
  {
    id: 'section',
    type: 'section',
    label: 'Section',
    icon: 'layout',
    category: 'layout'
  },
  // Form components
  {
    id: 'input',
    type: 'input',
    label: 'Input',
    icon: 'input',
    category: 'forms'
  },
  {
    id: 'textarea',
    type: 'textarea',
    label: 'Textarea',
    icon: 'input',
    category: 'forms'
  },
  {
    id: 'select',
    type: 'select',
    label: 'Select',
    icon: 'input',
    category: 'forms'
  },
  {
    id: 'checkbox',
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'checkbox',
    category: 'forms'
  },
  {
    id: 'radio',
    type: 'radio',
    label: 'Radio',
    icon: 'radio',
    category: 'forms'
  },
  // Advanced components
  {
    id: 'menu',
    type: 'menu',
    label: 'Menu',
    icon: 'menu',
    category: 'advanced'
  },
  {
    id: 'tabs',
    type: 'tabs',
    label: 'Tabs',
    icon: 'tabs',
    category: 'advanced'
  },
  {
    id: 'accordion',
    type: 'accordion',
    label: 'Accordion',
    icon: 'accordion',
    category: 'advanced'
  },
  {
    id: 'modal',
    type: 'modal',
    label: 'Modal',
    icon: 'modal',
    category: 'advanced'
  },
  {
    id: 'carousel',
    type: 'carousel',
    label: 'Carousel',
    icon: 'carousel',
    category: 'advanced'
  },
  {
    id: 'table',
    type: 'table',
    label: 'Table',
    icon: 'table',
    category: 'advanced'
  }
];

interface ComponentLibraryProps {
  onDragStart?: (component: ComponentLibraryItem) => void;
  onDragEnd?: () => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onDragStart,
  onDragEnd
}) => {
  const handleDragStart = (e: React.DragEvent, component: ComponentLibraryItem) => {
    e.dataTransfer.setData('componentType', component.type);
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart?.(component);
  };

  const categories = [
    { id: 'basic', label: 'Basic' },
    { id: 'layout', label: 'Layout' },
    { id: 'media', label: 'Media' },
    { id: 'forms', label: 'Forms' },
    { id: 'advanced', label: 'Advanced' }
  ];

  return (
    <div className="component-library">
      {categories.map(category => {
        const categoryComponents = COMPONENTS.filter(
          comp => comp.category === category.id
        );

        if (categoryComponents.length === 0) return null;

        return (
          <div key={category.id} className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 px-2">
              {category.label}
            </h3>
            <div className="grid grid-cols-2 gap-2 px-2">
              {categoryComponents.map(component => (
                <div
                  key={component.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                  onDragEnd={onDragEnd}
                  className="component-item"
                >
                  <div className="component-item-icon">
                    <Icon name={component.icon as any} size="medium" />
                  </div>
                  <span className="component-item-label">{component.label}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ComponentLibrary;
