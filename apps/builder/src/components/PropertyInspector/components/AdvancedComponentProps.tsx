import React from 'react';
import { Input, Switch, Select } from '@wysiwyg/ui';
import { ComponentNode } from '@wysiwyg/core';

interface PropsTabProps {
  component: ComponentNode;
  onPropChange: (key: string, value: any) => void;
}

export const MenuComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Menu Items</label>
      <textarea
        value={component.props?.items?.map((item: any) => `${item.label}:${item.href}`).join('\n') || ''}
        onChange={(e) => {
          const items = e.target.value.split('\n')
            .filter(line => line.trim())
            .map(line => {
              const [label, href] = line.split(':');
              return { label: label?.trim() || line, href: href?.trim() || '#' };
            });
          onPropChange('items', items);
        }}
        className="w-full"
        placeholder="Home:/\nAbout:/about\nContact:/contact"
        rows={6}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Orientation</label>
      <Select
        value={component.props?.orientation || 'horizontal'}
        onChange={(value: string) => onPropChange('orientation', value)}
        className="w-full"
        options={[
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' }
        ]}
      />
    </div>
  </div>
);

export const TabsComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Tabs</label>
      <textarea
        value={component.props?.tabs?.map((tab: any) => `${tab.label}:${tab.id}`).join('\n') || ''}
        onChange={(e) => {
          const tabs = e.target.value.split('\n')
            .filter(line => line.trim())
            .map((line, index) => {
              const [label, id] = line.split(':');
              return { label: label?.trim() || line, id: id?.trim() || `tab-${index}` };
            });
          onPropChange('tabs', tabs);
        }}
        className="w-full"
        placeholder="Tab 1:tab-1\nTab 2:tab-2\nTab 3:tab-3"
        rows={6}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Default Tab</label>
      <Input
        value={component.props?.defaultTab || ''}
        onChange={(e) => onPropChange('defaultTab', e.target.value)}
        className="w-full"
        placeholder="tab-1"
      />
    </div>
  </div>
);

export const AccordionComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Accordion Items</label>
      <textarea
        value={component.props?.items?.map((item: any) => `${item.title}:${item.id}`).join('\n') || ''}
        onChange={(e) => {
          const items = e.target.value.split('\n')
            .filter(line => line.trim())
            .map((line, index) => {
              const [title, id] = line.split(':');
              return { title: title?.trim() || line, id: id?.trim() || `accordion-${index}` };
            });
          onPropChange('items', items);
        }}
        className="w-full"
        placeholder="Section 1:section-1\nSection 2:section-2\nSection 3:section-3"
        rows={6}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Allow Multiple Open</label>
      <Switch
        checked={component.props?.multiple || false}
        onChange={(checked) => onPropChange('multiple', checked)}
      />
    </div>
  </div>
);

export const ModalComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Title</label>
      <Input
        value={component.props?.title || ''}
        onChange={(e) => onPropChange('title', e.target.value)}
        className="w-full"
        placeholder="Modal Title"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Width</label>
      <Input
        value={component.props?.width || '500px'}
        onChange={(e) => onPropChange('width', e.target.value)}
        className="w-full"
        placeholder="500px"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Close on Overlay Click</label>
      <Switch
        checked={component.props?.closeOnOverlayClick !== false}
        onChange={(checked) => onPropChange('closeOnOverlayClick', checked)}
      />
    </div>
  </div>
);

export const CarouselComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Auto Play</label>
      <Switch
        checked={component.props?.autoPlay || false}
        onChange={(checked) => onPropChange('autoPlay', checked)}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Interval (ms)</label>
      <input
        type="number"
        value={component.props?.interval || 3000}
        onChange={(e) => onPropChange('interval', Number(e.target.value))}
        className="w-full"
        min={1000}
        max={10000}
        step={500}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Show Navigation</label>
      <Switch
        checked={component.props?.showNav !== false}
        onChange={(checked) => onPropChange('showNav', checked)}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Show Indicators</label>
      <Switch
        checked={component.props?.showIndicators !== false}
        onChange={(checked) => onPropChange('showIndicators', checked)}
      />
    </div>
  </div>
);

export const TableComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Headers</label>
      <textarea
        value={component.props?.headers?.join(',') || ''}
        onChange={(e) => {
          const headers = e.target.value.split(',').map(h => h.trim()).filter(h => h);
          onPropChange('headers', headers);
        }}
        className="w-full"
        placeholder="Name,Email,Phone"
        rows={3}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Striped</label>
      <Switch
        checked={component.props?.striped || false}
        onChange={(checked) => onPropChange('striped', checked)}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Bordered</label>
      <Switch
        checked={component.props?.bordered || false}
        onChange={(checked) => onPropChange('bordered', checked)}
      />
    </div>
  </div>
);

export const SearchComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Placeholder</label>
      <Input
        value={component.props?.placeholder || 'Search...'}
        onChange={(e) => onPropChange('placeholder', e.target.value)}
        className="w-full"
        placeholder="Search..."
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Debounce (ms)</label>
      <input
        type="number"
        value={component.props?.debounce || 300}
        onChange={(e) => onPropChange('debounce', Number(e.target.value))}
        className="w-full"
        min={0}
        max={1000}
        step={50}
      />
    </div>
  </div>
);

export const FilterComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Filter By</label>
      <Input
        value={component.props?.filterBy || ''}
        onChange={(e) => onPropChange('filterBy', e.target.value)}
        className="w-full"
        placeholder="category"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Options</label>
      <textarea
        value={component.props?.options?.map((opt: any) => `${opt.label}:${opt.value}`).join('\n') || ''}
        onChange={(e) => {
          const options = e.target.value.split('\n')
            .filter(line => line.trim())
            .map(line => {
              const [label, value] = line.split(':');
              return { label: label?.trim() || line, value: value?.trim() || line };
            });
          onPropChange('options', options);
        }}
        className="w-full"
        placeholder="All:all\nCategory 1:cat1\nCategory 2:cat2"
        rows={6}
      />
    </div>
  </div>
);
