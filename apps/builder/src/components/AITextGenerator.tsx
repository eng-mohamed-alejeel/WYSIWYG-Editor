import React, { useState } from 'react';
import { Button } from '@wysiwyg/ui';
import { Select } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Modal } from '@wysiwyg/ui';
import { Loading } from '@wysiwyg/ui';
import { Tabs, TabItem } from '@wysiwyg/ui';

interface AITextGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (text: string) => void;
  initialText?: string;
}

export const AITextGenerator: React.FC<AITextGeneratorProps> = ({
  isOpen,
  onClose,
  onGenerate,
  initialText = ''
}) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [language, setLanguage] = useState('en');

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedText('');

    // Simulate AI text generation
    setTimeout(() => {
      const text = generateText(prompt, tone, length);
      setGeneratedText(text);
      setIsGenerating(false);
    }, 2000);
  };

  const generateText = (inputPrompt: string, selectedTone: string, selectedLength: string): string => {
    const tones = {
      professional: 'This is a professionally written text that maintains a formal tone and business-appropriate language.',
      casual: "Hey there! This is a friendly and casual text that's easy to read and sounds like you're chatting with a friend.",
      creative: '✨ This is a creatively written text that uses imaginative language and engaging storytelling techniques.',
      technical: 'This is a technical text that uses precise terminology and follows industry standards.',
      persuasive: 'This is a persuasive text designed to convince and motivate the reader to take action.'
    };

    const lengths = {
      short: 'This is a concise version of the text, focusing on the key points.',
      medium: 'This is a balanced version of the text that provides enough detail without being too lengthy.',
      long: 'This is a comprehensive version of the text that covers all aspects in detail and provides extensive information.'
    };

    return `${tones[selectedTone as keyof typeof tones]}

${lengths[selectedLength as keyof typeof lengths]}

Based on your request: "${inputPrompt}"`;
  };

  const handleUseText = () => {
    if (generatedText) {
      onGenerate(generatedText);
      onClose();
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
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
            placeholder="Describe what kind of text you need..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="property-item">
            <label className="property-item-label">Tone</label>
            <Select
              value={tone}
              onChange={setTone}
              options={[
                { value: 'professional', label: 'Professional' },
                { value: 'casual', label: 'Casual' },
                { value: 'creative', label: 'Creative' },
                { value: 'technical', label: 'Technical' },
                { value: 'persuasive', label: 'Persuasive' }
              ]}
              className="w-full"
            />
          </div>

          <div className="property-item">
            <label className="property-item-label">Length</label>
            <Select
              value={length}
              onChange={setLength}
              options={[
                { value: 'short', label: 'Short' },
                { value: 'medium', label: 'Medium' },
                { value: 'long', label: 'Long' }
              ]}
              className="w-full"
            />
          </div>
        </div>

        <div className="property-item">
          <label className="property-item-label">Language</label>
          <Select
            value={language}
            onChange={setLanguage}
            options={[
              { value: 'en', label: 'English' },
              { value: 'ar', label: 'Arabic' },
              { value: 'fr', label: 'French' },
              { value: 'de', label: 'German' },
              { value: 'es', label: 'Spanish' }
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
              Generate Text
            </>
          )}
        </Button>
      </div>
    )
  };

  const improveTab: TabItem = {
    id: 'improve',
    label: 'Improve',
    content: (
      <div className="space-y-4">
        <div className="property-item">
          <label className="property-item-label">Original Text</label>
          <textarea
            className="property-item-input w-full h-32"
            value={initialText}
            readOnly
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Improvement Type</label>
          <Select
            value={tone}
            onChange={setTone}
            options={[
              { value: 'professional', label: 'Make Professional' },
              { value: 'casual', label: 'Make Casual' },
              { value: 'creative', label: 'Make Creative' },
              { value: 'concise', label: 'Make Concise' },
              { value: 'expand', label: 'Expand' }
            ]}
            className="w-full"
          />
        </div>

        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={!initialText || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loading size="small" />
              Improving...
            </>
          ) : (
            <>
              <Icon name="sparkles" size="small" />
              Improve Text
            </>
          )}
        </Button>
      </div>
    )
  };

  const templatesTab: TabItem = {
    id: 'templates',
    label: 'Templates',
    content: (
      <div className="space-y-4">
        <h3 className="font-semibold">Text Templates</h3>

        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => setPrompt('Write a compelling product description for')}
          >
            <Icon name="shopping-bag" size="small" className="mr-2" />
            Product Description
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => setPrompt('Create an engaging blog post about')}
          >
            <Icon name="file-text" size="small" className="mr-2" />
            Blog Post
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => setPrompt('Write a persuasive call-to-action for')}
          >
            <Icon name="megaphone" size="small" className="mr-2" />
            Call-to-Action
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => setPrompt('Create an informative about us section for')}
          >
            <Icon name="users" size="small" className="mr-2" />
            About Us
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => setPrompt('Write a compelling headline for')}
          >
            <Icon name="type" size="small" className="mr-2" />
            Headline
          </Button>
        </div>
      </div>
    )
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Text Generator"
      size="large"
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <Tabs
            items={[generateTab, improveTab, templatesTab]}
            defaultActiveTab={activeTab}
            onChange={setActiveTab}
            variant="pills"
          />
        </div>

        {generatedText && (
          <div className="flex-1 border-l pl-4">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-semibold">Generated Text</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="small" onClick={handleRegenerate}>
                  <Icon name="refresh" size="small" />
                </Button>
                <Button variant="ghost" size="small" onClick={() => setGeneratedText('')}>
                  <Icon name="x" size="small" />
                </Button>
              </div>
            </div>

            <textarea
              className="property-item-input w-full h-64 mb-4"
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
            />

            <Button
              variant="primary"
              onClick={handleUseText}
              className="w-full"
            >
              <Icon name="check" size="small" />
              Use This Text
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AITextGenerator;
