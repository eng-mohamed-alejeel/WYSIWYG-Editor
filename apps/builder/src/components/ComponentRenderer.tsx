import React from 'react';
import { ComponentNode } from '@wysiwyg/core';
import { ComponentWrapper } from './ComponentWrapper';
import { useBuilderStore } from '../store/store';
import { convertStylesToCSS } from './ComponentRenderer/helpers';
import { BasicComponents } from './ComponentRenderer/BasicComponents';
import { FormComponents } from './ComponentRenderer/FormComponents';
import { LayoutComponents } from './ComponentRenderer/LayoutComponents';
import { MenuComponent } from './ComponentRenderer/MenuComponent';
import { TabsComponent } from './ComponentRenderer/TabsComponent';
import { AccordionComponent } from './ComponentRenderer/AccordionComponent';
import { ModalComponent } from './ComponentRenderer/ModalComponent';
import { CarouselComponent } from './ComponentRenderer/CarouselComponent';
import { TableComponent } from './ComponentRenderer/TableComponent';
import { SearchComponent } from './ComponentRenderer/SearchComponent';
import { FilterComponent } from './ComponentRenderer/FilterComponent';

interface ComponentRendererProps {
  component: ComponentNode;
  isPreview?: boolean;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isPreview = false,
}) => {
  const { selectedIds, hoveredId } = useBuilderStore();
  const isSelected = selectedIds.includes(component.id);
  const isHovered = hoveredId === component.id;

  const renderChild = (child: ComponentNode) => (
    <ComponentRenderer key={child.id} component={child} isPreview={isPreview} />
  );

  const renderComponentContent = () => {
    // Try basic components first
    const basicResult = BasicComponents({ component });
    if (basicResult) return basicResult;

    // Try form components
    const formResult = FormComponents({ component });
    if (formResult) return formResult;

    // Try layout components
    const layoutResult = LayoutComponents({ component, renderChild });
    if (layoutResult) return layoutResult;

    // Try advanced components
    switch (component.type) {
      case 'menu':
        return (
          <MenuComponent
            component={component}
            isPreview={isPreview}
            convertStylesToCSS={convertStylesToCSS}
            renderChild={renderChild}
          />
        );

      case 'tabs':
        return (
          <TabsComponent
            component={component}
            isPreview={isPreview}
            convertStylesToCSS={convertStylesToCSS}
            renderChild={renderChild}
          />
        );

      case 'accordion':
        return (
          <AccordionComponent
            component={component}
            isPreview={isPreview}
            convertStylesToCSS={convertStylesToCSS}
            renderChild={renderChild}
          />
        );

      case 'modal':
        return (
          <ModalComponent
            component={component}
            isPreview={isPreview}
            convertStylesToCSS={convertStylesToCSS}
            renderChild={renderChild}
          />
        );

      case 'carousel':
        return (
          <CarouselComponent
            component={component}
            isPreview={isPreview}
            convertStylesToCSS={convertStylesToCSS}
            renderChild={renderChild}
          />
        );

      case 'table':
        return <TableComponent component={component} convertStylesToCSS={convertStylesToCSS} />;

      case 'search':
        return <SearchComponent component={component} convertStylesToCSS={convertStylesToCSS} />;

      case 'filter':
        return <FilterComponent component={component} convertStylesToCSS={convertStylesToCSS} />;

      default:
        return (
          <div style={convertStylesToCSS(component.styles)}>
            {component.children.map(renderChild)}
          </div>
        );
    }
  };

  if (isPreview) {
    return <>{renderComponentContent()}</>;
  }

  return (
    <ComponentWrapper
      component={component}
      isSelected={isSelected}
      isHovered={isHovered}
      isPreview={isPreview}
    >
      {renderComponentContent()}
    </ComponentWrapper>
  );
};

export default ComponentRenderer;
