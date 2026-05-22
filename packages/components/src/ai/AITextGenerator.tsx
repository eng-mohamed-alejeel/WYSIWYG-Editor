/**
 * AITextGenerator Component
 * 
 * An AI-powered text generator component for creating content
 * with the help of artificial intelligence.
 */

import React, { useState } from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const AITextGenerator: React.FC<BaseComponentProps> = ({
  node,
  context,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordCount, setWordCount] = useState(node.props.defaultWordCount || 100);
  const [tone, setTone] = useState(node.props.defaultTone || 'professional');

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      // Simulate AI text generation - in real implementation, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const generated = `Generated text based on your prompt: "${prompt}"\n\n` +
        `This is a simulated response with approximately ${wordCount} words in a ${tone} tone. ` +
        `In a real implementation, this would connect to an AI service like OpenAI's GPT to generate ` +
        `actual content based on the provided prompt, word count, and tone settings.\n\n` +
        `The AI would analyze your prompt and generate relevant content that matches your requirements. ` +
        `You could specify various parameters like style, format, length, and more to customize the output.`;

      setGeneratedText(generated);
    } catch (error) {
      console.error('Error generating text:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = () => {
    if (generatedText && node.props.onInsert) {
      node.props.onInsert(generatedText);
    }
  };

  return (
    <div
      id={node.id}
      className={`wysiwyg-ai-text-generator ${className}`.trim()}
      style={mergeStyles({
        ...(node.styles as Record<string, any>),
        ...parseInlineStyles(style),
        padding: node.props.padding || '1.5rem',
        backgroundColor: node.props.backgroundColor || '#ffffff',
        borderRadius: node.props.borderRadius || '0.75rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      <h3 style={mergeStyles({ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' } as React.CSSProperties)}>
        {node.props.title || 'AI Text Generator'}
      </h3>

      <div style={mergeStyles({ marginBottom: '1rem' } as React.CSSProperties)}>
        <label style={mergeStyles({ display: 'block', marginBottom: '0.5rem', fontWeight: '500' } as React.CSSProperties)}>
          {node.props.promptLabel || 'Prompt'}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={node.props.promptPlaceholder || 'Describe the content you want to generate...'}
          rows={4}
          disabled={isGenerating}
          style={mergeStyles({
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid #e5e7eb',
            fontSize: '0.875rem',
            resize: 'vertical'
          } as React.CSSProperties)}
        />
      </div>

      <div style={mergeStyles({ display: 'flex', gap: '1rem', marginBottom: '1rem' } as React.CSSProperties)}>
        <div style={mergeStyles({ flex: 1 } as React.CSSProperties)}>
          <label style={mergeStyles({ display: 'block', marginBottom: '0.5rem', fontWeight: '500' } as React.CSSProperties)}>
            {node.props.wordCountLabel || 'Word Count'}
          </label>
          <input
            type="number"
            value={wordCount}
            onChange={(e) => setWordCount(parseInt(e.target.value) || 100)}
            min={10}
            max={1000}
            disabled={isGenerating}
            style={mergeStyles({
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              fontSize: '0.875rem'
            } as React.CSSProperties)}
          />
        </div>

        <div style={mergeStyles({ flex: 1 } as React.CSSProperties)}>
          <label style={mergeStyles({ display: 'block', marginBottom: '0.5rem', fontWeight: '500' } as React.CSSProperties)}>
            {node.props.toneLabel || 'Tone'}
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={isGenerating}
            style={mergeStyles({
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              fontSize: '0.875rem',
              backgroundColor: '#ffffff'
            } as React.CSSProperties)}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="creative">Creative</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        style={mergeStyles({
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer',
          opacity: isGenerating || !prompt.trim() ? 0.6 : 1,
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '1rem'
        } as React.CSSProperties)}
      >
        {isGenerating ? 'Generating...' : node.props.generateButtonText || 'Generate Text'}
      </button>

      {generatedText && (
        <div>
          <div style={mergeStyles({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' } as React.CSSProperties)}>
            <label style={mergeStyles({ fontWeight: '500' } as React.CSSProperties)}>
              {node.props.generatedTextLabel || 'Generated Text'}
            </label>
            <button
              onClick={handleInsert}
              style={mergeStyles({
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              } as React.CSSProperties)}
            >
              {node.props.insertButtonText || 'Insert'}
            </button>
          </div>
          <textarea
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
            rows={8}
            style={mergeStyles({
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              fontSize: '0.875rem',
              resize: 'vertical'
            } as React.CSSProperties)}
          />
        </div>
      )}
    </div>
  );
};


