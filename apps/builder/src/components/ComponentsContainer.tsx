import React from 'react';
import { ComponentNode } from '@wysiwyg/core';
import { ComponentRenderer } from './ComponentRenderer';
import { useBuilderStore } from '../store/store';

interface ComponentsContainerProps {
  components: ComponentNode[];
}

export const ComponentsContainer: React.FC<ComponentsContainerProps> = ({ components }) => {
  const { isPreviewMode } = useBuilderStore();

  return (
    <div id="components-container" className="min-h-[200px]">
      {components?.map((component) => (
        <ComponentRenderer key={component.id} component={component} isPreview={isPreviewMode} />
      ))}
    </div>
  );
};
