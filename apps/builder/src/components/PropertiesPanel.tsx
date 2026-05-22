import React from 'react';
import { PropertyInspector } from './PropertyInspector';

interface PropertiesPanelProps {
  selectedComponentId: string | null;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedComponentId }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-300 bg-gray-50">
        <h2 className="text-lg font-semibold">Properties</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <PropertyInspector componentId={selectedComponentId} />
      </div>
    </div>
  );
};
