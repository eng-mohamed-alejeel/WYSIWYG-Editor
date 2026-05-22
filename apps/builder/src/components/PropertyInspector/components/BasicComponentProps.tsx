import React from 'react';
import { Input, Select, Switch } from '@wysiwyg/ui';
import { ComponentNode } from '@wysiwyg/core';

interface PropsTabProps {
  component: ComponentNode;
  onPropChange: (key: string, value: any) => void;
}

export const TextComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Text Content</label>
      <Input
        value={component.props?.text || ''}
        onChange={(e) => onPropChange('text', e.target.value)}
        className="w-full"
        placeholder="Enter text content"
      />
    </div>
  </div>
);

export const HeadingComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Heading Text</label>
      <Input
        value={component.props?.text || ''}
        onChange={(e) => onPropChange('text', e.target.value)}
        className="w-full"
        placeholder="Enter heading text"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Heading Level</label>
      <Select
        value={String(component.props?.level || 1)}
        onChange={(value: string) => onPropChange('level', Number(value))}
        className="w-full"
        options={[
          { label: 'H1', value: '1' },
          { label: 'H2', value: '2' },
          { label: 'H3', value: '3' },
          { label: 'H4', value: '4' },
          { label: 'H5', value: '5' },
          { label: 'H6', value: '6' }
        ]}
      />
    </div>
  </div>
);

export const ParagraphComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Paragraph Text</label>
      <textarea
        value={component.props?.text || ''}
        onChange={(e) => onPropChange('text', e.target.value)}
        className="w-full"
        placeholder="Enter paragraph text"
        rows={4}
      />
    </div>
  </div>
);

export const LinkComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Link Text</label>
      <Input
        value={component.props?.text || ''}
        onChange={(e) => onPropChange('text', e.target.value)}
        className="w-full"
        placeholder="Enter link text"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">URL</label>
      <Input
        value={component.props?.href || ''}
        onChange={(e) => onPropChange('href', e.target.value)}
        className="w-full"
        placeholder="https://example.com"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Target</label>
      <Select
        value={component.props?.target || '_self'}
        onChange={(value: string) => onPropChange('target', value)}
        className="w-full"
        options={[
          { label: 'Same Tab', value: '_self' },
          { label: 'New Tab', value: '_blank' }
        ]}
      />
    </div>
  </div>
);

export const ButtonComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Button Text</label>
      <Input
        value={component.props?.text || ''}
        onChange={(e) => onPropChange('text', e.target.value)}
        className="w-full"
        placeholder="Enter button text"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Button Type</label>
      <Select
        value={component.props?.type || 'button'}
        onChange={(value: string) => onPropChange('type', value)}
        className="w-full"
        options={[
          { label: 'Button', value: 'button' },
          { label: 'Submit', value: 'submit' },
          { label: 'Reset', value: 'reset' }
        ]}
      />
    </div>
  </div>
);

export const ImageComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Image URL</label>
      <Input
        value={component.props?.src || ''}
        onChange={(e) => onPropChange('src', e.target.value)}
        className="w-full"
        placeholder="https://example.com/image.jpg"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Alt Text</label>
      <Input
        value={component.props?.alt || ''}
        onChange={(e) => onPropChange('alt', e.target.value)}
        className="w-full"
        placeholder="Image description"
      />
    </div>
  </div>
);

export const VideoComponentProps: React.FC<PropsTabProps> = ({ component, onPropChange }) => (
  <div className="space-y-4">
    <div className="property-item">
      <label className="property-item-label">Video URL</label>
      <Input
        value={component.props?.src || ''}
        onChange={(e) => onPropChange('src', e.target.value)}
        className="w-full"
        placeholder="https://example.com/video.mp4"
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Controls</label>
      <Switch
        checked={component.props?.controls !== false}
        onChange={(checked) => onPropChange('controls', checked)}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">AutoPlay</label>
      <Switch
        checked={component.props?.autoPlay || false}
        onChange={(checked) => onPropChange('autoPlay', checked)}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Loop</label>
      <Switch
        checked={component.props?.loop || false}
        onChange={(checked) => onPropChange('loop', checked)}
      />
    </div>
    <div className="property-item">
      <label className="property-item-label">Muted</label>
      <Switch
        checked={component.props?.muted || false}
        onChange={(checked) => onPropChange('muted', checked)}
      />
    </div>
  </div>
);
