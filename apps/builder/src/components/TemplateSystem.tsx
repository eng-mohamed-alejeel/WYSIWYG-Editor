import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@wysiwyg/ui';
import { Input } from '@wysiwyg/ui';
import { Select } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Modal } from '@wysiwyg/ui';
import { Tabs, TabItem } from '@wysiwyg/ui';
import { EmptyState } from '@wysiwyg/ui';
import { ComponentNode } from '@wysiwyg/core';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'landing' | 'blog' | 'portfolio' | 'ecommerce' | 'dashboard' | 'custom';
  components: ComponentNode[];
  tags: string[];
  isPremium?: boolean;
}

interface TemplateSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

export const TemplateSystem: React.FC<TemplateSystemProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const templates: Template[] = [
    {
      id: 'landing-1',
      name: 'Modern Landing Page',
      description: 'A sleek, modern landing page perfect for startups',
      thumbnail: 'https://via.placeholder.com/400x300?text=Landing+Page',
      category: 'landing',
      components: [],
      tags: ['modern', 'startup', 'minimal']
    },
    {
      id: 'blog-1',
      name: 'Clean Blog Template',
      description: 'A clean, readable blog template with focus on content',
      thumbnail: 'https://via.placeholder.com/400x300?text=Blog+Template',
      category: 'blog',
      components: [],
      tags: ['clean', 'content-focused', 'minimal']
    },
    {
      id: 'portfolio-1',
      name: 'Creative Portfolio',
      description: 'Showcase your work with this creative portfolio template',
      thumbnail: 'https://via.placeholder.com/400x300?text=Portfolio',
      category: 'portfolio',
      components: [],
      tags: ['creative', 'showcase', 'modern']
    },
    {
      id: 'ecommerce-1',
      name: 'E-commerce Store',
      description: 'Complete e-commerce template with product pages',
      thumbnail: 'https://via.placeholder.com/400x300?text=E-commerce',
      category: 'ecommerce',
      components: [],
      tags: ['shop', 'products', 'modern'],
      isPremium: true
    },
    {
      id: 'dashboard-1',
      name: 'Admin Dashboard',
      description: 'Professional dashboard template for admin panels',
      thumbnail: 'https://via.placeholder.com/400x300?text=Dashboard',
      category: 'dashboard',
      components: [],
      tags: ['admin', 'professional', 'modern']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'landing', label: 'Landing Pages' },
    { id: 'blog', label: 'Blog Templates' },
    { id: 'portfolio', label: 'Portfolios' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'dashboard', label: 'Dashboards' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const browseTab: TabItem = {
    id: 'browse',
    label: 'Browse Templates',
    content: (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Icon name="search" size="small" />}
            className="flex-1"
          />
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={categories.map(c => ({ value: c.id, label: c.label }))}
            className="w-48"
          />
        </div>

        {filteredTemplates.length === 0 ? (
          <EmptyState
            icon="layout"
            title="No templates found"
            description="Try adjusting your search or category filter"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onSelectTemplate(template)}
              >
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{template.name}</h3>
                    {template.isPremium && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  };

  const myTemplatesTab: TabItem = {
    id: 'my-templates',
    label: 'My Templates',
    content: (
      <div className="space-y-4">
        <EmptyState
          icon="folder"
          title="No saved templates"
          description="Save your designs as templates to reuse them later"
          actionText="Create Template"
          onAction={() => {}}
        />
      </div>
    )
  };

  const createTab: TabItem = {
    id: 'create',
    label: 'Create Template',
    content: (
      <div className="space-y-4">
        <div className="property-item">
          <label className="property-item-label">Template Name</label>
          <Input
            placeholder="My Template"
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Description</label>
          <textarea
            className="property-item-input w-full h-24"
            placeholder="Describe your template..."
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Category</label>
          <Select
            value="custom"
            onChange={() => {}}
            options={categories.filter(c => c.id !== 'all').map(c => ({ value: c.id, label: c.label }))}
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Tags</label>
          <Input
            placeholder="tag1, tag2, tag3..."
            className="w-full"
          />
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={() => {}}
        >
          <Icon name="save" size="small" />
          Save as Template
        </Button>
      </div>
    )
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Template System"
      size="large"
    >
      <Tabs
        items={[browseTab, myTemplatesTab, createTab]}
        defaultActiveTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />
    </Modal>
  );
};

export default TemplateSystem;
