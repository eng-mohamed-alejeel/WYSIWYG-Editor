import React, { useState } from 'react';
import { ComponentNode, ComponentId } from '@wysiwyg/core';
import { useBuilderStore } from '../store/store';
import { Icon } from '@wysiwyg/ui';

interface LayerItemProps {
  component: ComponentNode;
  level: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: ComponentId) => void;
  onHover: (id: ComponentId | null) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  component,
  level,
  isSelected,
  isHovered,
  onSelect,
  onHover
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = component.children && component.children.length > 0;

  return (
    <div className="layer-item">
      <div
        className={`layer-item-content ${isSelected ? 'layer-item-selected' : ''} ${
          isHovered ? 'layer-item-hovered' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(component.id)}
        onMouseEnter={() => onHover(component.id)}
        onMouseLeave={() => onHover(null)}
      >
        {hasChildren && (
          <button
            className="layer-item-expand"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <Icon
              name={isExpanded ? 'chevron-down' : 'chevron-right'}
              size="small"
            />
          </button>
        )}

        <span className="layer-item-icon">
          <Icon name="layout" size="small" />
        </span>

        <span className="layer-item-label">
          {component.type}
        </span>

        <span className="layer-item-id">
          {component.id}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div className="layer-item-children">
          {component.children.map(child => (
            <LayerItem
              key={child.id}
              component={child}
              level={level + 1}
              isSelected={isSelected}
              isHovered={isHovered}
              onSelect={onSelect}
              onHover={onHover}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface LayerPanelProps {
  components: ComponentNode[];
}

export const LayerPanel: React.FC<LayerPanelProps> = ({ components }) => {
  const { selectedIds, hoveredId, setSelectedIds, setHoveredId } = useBuilderStore();

  const handleSelect = (id: ComponentId) => {
    setSelectedIds([id]);
  };

  const handleHover = (id: ComponentId | null) => {
    setHoveredId(id);
  };

  return (
    <div className="layer-panel">
      <div className="layer-panel-header">
        <h3 className="text-sm font-semibold">Layers</h3>
      </div>

      <div className="layer-panel-content">
        {components.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No components yet
          </div>
        ) : (
          components.map(component => (
            <LayerItem
              key={component.id}
              component={component}
              level={0}
              isSelected={selectedIds.includes(component.id)}
              isHovered={hoveredId === component.id}
              onSelect={handleSelect}
              onHover={handleHover}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LayerPanel;
