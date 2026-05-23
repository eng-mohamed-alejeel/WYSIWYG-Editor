import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@wysiwyg/ui';
import { Select } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Modal } from '@wysiwyg/ui';
import { Loading } from '@wysiwyg/ui';
import { Tabs, TabItem } from '@wysiwyg/ui';

interface AIImageGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('high');

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);

    // Simulate AI image generation
    setTimeout(() => {
      const newImages: GeneratedImage[] = Array.from({ length: 4 }, (_, i) => ({
        id: `img_${Date.now()}_${i}`,
        url: `https://via.placeholder.com/512x512?text=AI+Generated+${i + 1}`,
        prompt,
      }));

      setGeneratedImages((prev) => [...newImages, ...prev]);
      setIsGenerating(false);
    }, 3000);
  };

  const handleSelectImage = (imageUrl: string) => {
    onSelectImage(imageUrl);
    onClose();
  };

  const generateTab: TabItem = {
    id: 'generate',
    label: 'Generate',
    content: (
      <div className="space-y-4">
        <div className="property-item">
          <label className="property-item-label">Prompt</label>
          <textarea
            className="property-item-input w-full h-32"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="property-item">
            <label className="property-item-label">Style</label>
            <Select
              value={style}
              onChange={setStyle}
              options={[
                { value: 'realistic', label: 'Realistic' },
                { value: 'artistic', label: 'Artistic' },
                { value: 'cartoon', label: 'Cartoon' },
                { value: '3d', label: '3D Render' },
                { value: 'abstract', label: 'Abstract' },
              ]}
              className="w-full"
            />
          </div>

          <div className="property-item">
            <label className="property-item-label">Aspect Ratio</label>
            <Select
              value={aspectRatio}
              onChange={setAspectRatio}
              options={[
                { value: '1:1', label: 'Square (1:1)' },
                { value: '16:9', label: 'Landscape (16:9)' },
                { value: '9:16', label: 'Portrait (9:16)' },
                { value: '4:3', label: 'Standard (4:3)' },
              ]}
              className="w-full"
            />
          </div>
        </div>

        <div className="property-item">
          <label className="property-item-label">Quality</label>
          <Select
            value={quality}
            onChange={setQuality}
            options={[
              { value: 'low', label: 'Low (Fast)' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High (Best)' },
            ]}
            className="w-full"
          />
        </div>

        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loading size="small" />
              Generating...
            </>
          ) : (
            <>
              <Icon name="sparkles" size="small" />
              Generate Images
            </>
          )}
        </Button>
      </div>
    ),
  };

  const galleryTab: TabItem = {
    id: 'gallery',
    label: 'Gallery',
    content: (
      <div className="space-y-4">
        {generatedImages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No images generated yet. Start by creating your first image!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {generatedImages.map((image) => (
              <div key={image.id} className="relative group">
                <Image
                  src={image.url}
                  alt={image.prompt}
                  className="w-full rounded-lg"
                  width={400}
                  height={300}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => handleSelectImage(image.url)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="check" size="small" />
                    Use This
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
  };

  const templatesTab: TabItem = {
    id: 'templates',
    label: 'Templates',
    content: (
      <div className="space-y-4">
        <h3 className="font-semibold">Image Templates</h3>

        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => setPrompt('A modern hero section background with')}
          >
            <Icon name="layout" size="small" className="mr-2" />
            Hero Background
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => setPrompt('A professional product showcase featuring')}
          >
            <Icon name="shopping-bag" size="small" className="mr-2" />
            Product Showcase
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => setPrompt('An engaging team photo showing')}
          >
            <Icon name="users" size="small" className="mr-2" />
            Team Photo
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => setPrompt('A beautiful abstract pattern with')}
          >
            <Icon name="grid" size="small" className="mr-2" />
            Abstract Pattern
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => setPrompt('A stunning landscape featuring')}
          >
            <Icon name="image" size="small" className="mr-2" />
            Landscape
          </Button>
        </div>
      </div>
    ),
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Image Generator" size="large">
      <Tabs
        items={[generateTab, galleryTab, templatesTab]}
        defaultActiveTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />
    </Modal>
  );
};

export default AIImageGenerator;
