import React from 'react';
import { Input, Switch } from '@wysiwyg/ui';
import { ComponentNode } from '@wysiwyg/core';
import {
  TextComponentProps,
  HeadingComponentProps,
  ParagraphComponentProps,
  LinkComponentProps,
  ButtonComponentProps,
  ImageComponentProps,
  VideoComponentProps,
} from './components/BasicComponentProps';
import {
  InputComponentProps,
  TextareaComponentProps,
  SelectComponentProps,
  CheckboxComponentProps,
  RadioComponentProps,
} from './components/FormComponentProps';
import {
  DividerComponentProps,
  SpacerComponentProps,
  IconComponentProps,
  LayoutComponentProps,
} from './components/UtilityComponentProps';
import {
  MenuComponentProps,
  TabsComponentProps,
  AccordionComponentProps,
  ModalComponentProps,
  CarouselComponentProps,
  TableComponentProps,
  SearchComponentProps,
  FilterComponentProps,
} from './components/AdvancedComponentProps';

interface PropsTabProps {
  component: ComponentNode;
  onPropChange: (key: string, value: any) => void;
}

export const PropsTab: React.FC<PropsTabProps> = ({ component, onPropChange }) => {
  const renderComponentSpecificProps = () => {
    switch (component.type) {
      case 'text':
        return <TextComponentProps component={component} onPropChange={onPropChange} />;
      case 'heading':
        return <HeadingComponentProps component={component} onPropChange={onPropChange} />;
      case 'paragraph':
        return <ParagraphComponentProps component={component} onPropChange={onPropChange} />;
      case 'link':
        return <LinkComponentProps component={component} onPropChange={onPropChange} />;
      case 'button':
        return <ButtonComponentProps component={component} onPropChange={onPropChange} />;
      case 'image':
        return <ImageComponentProps component={component} onPropChange={onPropChange} />;
      case 'video':
        return <VideoComponentProps component={component} onPropChange={onPropChange} />;
      case 'input':
        return <InputComponentProps component={component} onPropChange={onPropChange} />;
      case 'textarea':
        return <TextareaComponentProps component={component} onPropChange={onPropChange} />;
      case 'select':
        return <SelectComponentProps component={component} onPropChange={onPropChange} />;
      case 'checkbox':
        return <CheckboxComponentProps component={component} onPropChange={onPropChange} />;
      case 'radio':
        return <RadioComponentProps component={component} onPropChange={onPropChange} />;
      case 'divider':
        return <DividerComponentProps component={component} onPropChange={onPropChange} />;
      case 'spacer':
        return <SpacerComponentProps component={component} onPropChange={onPropChange} />;
      case 'icon':
        return <IconComponentProps component={component} onPropChange={onPropChange} />;
      case 'menu':
        return <MenuComponentProps component={component} onPropChange={onPropChange} />;
      case 'tabs':
        return <TabsComponentProps component={component} onPropChange={onPropChange} />;
      case 'accordion':
        return <AccordionComponentProps component={component} onPropChange={onPropChange} />;
      case 'modal':
        return <ModalComponentProps component={component} onPropChange={onPropChange} />;
      case 'carousel':
        return <CarouselComponentProps component={component} onPropChange={onPropChange} />;
      case 'table':
        return <TableComponentProps component={component} onPropChange={onPropChange} />;
      case 'search':
        return <SearchComponentProps component={component} onPropChange={onPropChange} />;
      case 'filter':
        return <FilterComponentProps component={component} onPropChange={onPropChange} />;
      case 'grid':
      case 'row':
      case 'column':
      case 'container':
      case 'section':
        return <LayoutComponentProps component={component} onPropChange={onPropChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="property-group">
        <h3 className="property-group-title">Basic Properties</h3>

        <div className="property-item">
          <label className="property-item-label">ID</label>
          <Input value={component.id} readOnly className="w-full" />
        </div>

        <div className="property-item">
          <label className="property-item-label">Type</label>
          <Input value={component.type} readOnly className="w-full" />
        </div>
      </div>

      <div className="property-group">
        <h3 className="property-group-title">Component Properties</h3>
        {renderComponentSpecificProps()}
      </div>

      <div className="property-group">
        <h3 className="property-group-title">Custom Properties</h3>
        {Object.entries(component.props || {}).map(([key, value]) => {
          // Skip already handled properties
          const handledProps = [
            'text',
            'level',
            'href',
            'target',
            'type',
            'src',
            'alt',
            'controls',
            'autoPlay',
            'loop',
            'muted',
            'placeholder',
            'value',
            'rows',
            'options',
            'checked',
            'name',
            'color',
            'height',
            'icon',
            'size',
            'columns',
            'gap',
            'flex',
            'items',
            'orientation',
            'tabs',
            'defaultTab',
            'multiple',
            'title',
            'width',
            'closeOnOverlayClick',
            'interval',
            'showNav',
            'showIndicators',
            'headers',
            'striped',
            'bordered',
            'debounce',
            'filterBy',
          ];
          if (handledProps.includes(key)) return null;

          return (
            <div key={key} className="property-item">
              <label className="property-item-label">{key}</label>
              {typeof value === 'boolean' ? (
                <Switch
                  checked={value as boolean}
                  onChange={(checked) => onPropChange(key, checked)}
                />
              ) : typeof value === 'number' ? (
                <Input
                  type="number"
                  value={value as number}
                  onChange={(e) => onPropChange(key, Number(e.target.value))}
                  className="w-full"
                />
              ) : (
                <Input
                  value={value as string}
                  onChange={(e) => onPropChange(key, e.target.value)}
                  className="w-full"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
