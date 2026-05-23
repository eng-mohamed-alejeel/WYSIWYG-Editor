/**
 * AIImageGenerator Component
 *
 * An AI-powered image generator component for creating images
 * with the help of artificial intelligence.
 */

import React, { useState } from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const AIImageGenerator: React.FC<BaseComponentProps> = ({
  node,
  context,
  style,
  className = '',
}) => {
  const { isEditable, isPreview } = context;
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageStyle, setImageStyle] = useState(node.props.defaultStyle || 'realistic');
  const [imageSize, setImageSize] = useState(node.props.defaultSize || 'medium');

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      // Simulate AI image generation - in real implementation, this would call an AI API
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Generate placeholder images using a service like picsum.photos
      const newImages = Array.from(
        { length: 4 },
        (_, i) =>
          `https://picsum.photos/seed/${prompt}-${Date.now()}-${i}/${getImageSizeDimensions(imageSize).width}/${getImageSizeDimensions(imageSize).height}`
      );

      setGeneratedImages(newImages);
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = () => {
    if (selectedImage && node.props.onInsert) {
      node.props.onInsert(selectedImage);
    }
  };

  const getImageSizeDimensions = (size: string) => {
    const sizes: Record<string, { width: number; height: number }> = {
      small: { width: 256, height: 256 },
      medium: { width: 512, height: 512 },
      large: { width: 768, height: 768 },
      wide: { width: 768, height: 512 },
      tall: { width: 512, height: 768 },
    };
    return sizes[size] || sizes.medium;
  };

  return (
    <div
      id={node.id}
      className={`wysiwyg-ai-image-generator ${className}`.trim()}
      style={mergeStyles({
        ...(node.styles as Record<string, any>),
        ...parseInlineStyles(style),
        padding: node.props.padding || '1.5rem',
        backgroundColor: node.props.backgroundColor || '#ffffff',
        borderRadius: node.props.borderRadius || '0.75rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      <h3
        style={mergeStyles({
          margin: '0 0 1rem 0',
          fontSize: '1.25rem',
          fontWeight: '600',
        } as React.CSSProperties)}
      >
        {node.props.title || 'AI Image Generator'}
      </h3>

      <div style={mergeStyles({ marginBottom: '1rem' } as React.CSSProperties)}>
        <label
          style={mergeStyles({
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
          } as React.CSSProperties)}
        >
          {node.props.promptLabel || 'Prompt'}
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={node.props.promptPlaceholder || 'Describe the image you want to generate...'}
          rows={3}
          disabled={isGenerating}
          style={mergeStyles({
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid #e5e7eb',
            fontSize: '0.875rem',
            resize: 'vertical',
          } as React.CSSProperties)}
        />
      </div>

      <div
        style={mergeStyles({
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
        } as React.CSSProperties)}
      >
        <div style={mergeStyles({ flex: 1 } as React.CSSProperties)}>
          <label
            style={mergeStyles({
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
            } as React.CSSProperties)}
          >
            {node.props.styleLabel || 'Style'}
          </label>
          <select
            value={imageStyle}
            onChange={(e) => setImageStyle(e.target.value)}
            disabled={isGenerating}
            style={mergeStyles({
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              fontSize: '0.875rem',
              backgroundColor: '#ffffff',
            } as React.CSSProperties)}
          >
            <option value="realistic">Realistic</option>
            <option value="artistic">Artistic</option>
            <option value="cartoon">Cartoon</option>
            <option value="abstract">Abstract</option>
            <option value="vintage">Vintage</option>
            <option value="futuristic">Futuristic</option>
          </select>
        </div>

        <div style={mergeStyles({ flex: 1 } as React.CSSProperties)}>
          <label
            style={mergeStyles({
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
            } as React.CSSProperties)}
          >
            {node.props.sizeLabel || 'Size'}
          </label>
          <select
            value={imageSize}
            onChange={(e) => setImageSize(e.target.value)}
            disabled={isGenerating}
            style={mergeStyles({
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              fontSize: '0.875rem',
              backgroundColor: '#ffffff',
            } as React.CSSProperties)}
          >
            <option value="small">Small (256x256)</option>
            <option value="medium">Medium (512x512)</option>
            <option value="large">Large (768x768)</option>
            <option value="wide">Wide (768x512)</option>
            <option value="tall">Tall (512x768)</option>
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
          marginBottom: '1rem',
        } as React.CSSProperties)}
      >
        {isGenerating ? 'Generating...' : node.props.generateButtonText || 'Generate Images'}
      </button>

      {generatedImages.length > 0 && (
        <div>
          <div
            style={mergeStyles({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
            } as React.CSSProperties)}
          >
            <label style={mergeStyles({ fontWeight: '500' } as React.CSSProperties)}>
              {node.props.generatedImagesLabel || 'Generated Images'}
            </label>
            {selectedImage && (
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
                  fontWeight: '600',
                } as React.CSSProperties)}
              >
                {node.props.insertButtonText || 'Insert Selected'}
              </button>
            )}
          </div>

          <div
            style={mergeStyles({
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
            } as React.CSSProperties)}
          >
            {generatedImages.map((image, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(image)}
                style={mergeStyles({
                  position: 'relative',
                  cursor: 'pointer',
                  border: selectedImage === image ? '3px solid #3b82f6' : '3px solid transparent',
                  borderRadius: '0.375rem',
                  overflow: 'hidden',
                } as React.CSSProperties)}
              >
                <img
                  src={image}
                  alt={`Generated image ${index + 1}`}
                  style={mergeStyles({
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                  } as React.CSSProperties)}
                />
                {selectedImage === image && (
                  <div
                    style={mergeStyles({
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '1.5rem',
                      height: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                    } as React.CSSProperties)}
                  >
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
