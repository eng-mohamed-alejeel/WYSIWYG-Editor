/**
 * AICodeAssistant Component
 *
 * An AI-powered code assistant component for generating,
 * explaining, and improving code with the help of artificial intelligence.
 */

import React, { useState } from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

export const AICodeAssistant: React.FC<BaseComponentProps> = ({
  node,
  context,
  style,
  className = '',
}) => {
  const { isEditable, isPreview } = context;
  const [code, setCode] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'generate' | 'explain' | 'improve'>('generate');
  const [language, setLanguage] = useState(node.props.defaultLanguage || 'javascript');

  const handleProcess = async () => {
    if ((!code && mode !== 'generate') || (!prompt && mode === 'generate') || isProcessing) return;

    setIsProcessing(true);
    try {
      // Simulate AI processing - in real implementation, this would call an AI API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (mode === 'generate') {
        const newCode =
          `// Generated code based on: "${prompt}"\n\n` +
          `// This is a simulated response. In a real implementation, this would connect to an AI service ` +
          `like OpenAI's GPT or GitHub Copilot to generate actual code.\n\n` +
          `function ${prompt.split(' ')[0] || 'example'}() {\n` +
          `  // Your AI-generated code would appear here\n` +
          `  console.log("This is a placeholder for AI-generated code");\n` +
          `  return true;\n` +
          `}`;

        setGeneratedCode(newCode);
      } else if (mode === 'explain') {
        const newExplanation =
          `Code Explanation:\n\n` +
          `This is a simulated explanation of the provided code. In a real implementation, ` +
          `the AI would analyze your code and provide a detailed explanation of what it does, ` +
          `how it works, and any potential issues or improvements.\n\n` +
          `The explanation would cover:\n` +
          `- Overall purpose and functionality\n` +
          `- Key functions and their roles\n` +
          `- Data flow and logic\n` +
          `- Best practices and potential improvements`;

        setExplanation(newExplanation);
      } else if (mode === 'improve') {
        const improvedCode =
          `// Improved version of your code\n\n` +
          `// This is a simulated improvement. In a real implementation, the AI would analyze ` +
          `your code and suggest improvements for better performance, readability, and maintainability.\n\n` +
          code +
          '\n\n' +
          `// AI would add comments explaining the improvements made\n` +
          `// and suggest refactoring options where appropriate.`;

        setGeneratedCode(improvedCode);
      }
    } catch (error) {
      console.error('Error processing code:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInsert = () => {
    if (generatedCode && node.props.onInsert) {
      node.props.onInsert(generatedCode);
    }
  };

  return (
    <div
      id={node.id}
      className={`wysiwyg-ai-code-assistant ${className}`.trim()}
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
        {node.props.title || 'AI Code Assistant'}
      </h3>

      <div
        style={mergeStyles({
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem',
        } as React.CSSProperties)}
      >
        <button
          onClick={() => setMode('generate')}
          style={mergeStyles({
            flex: 1,
            padding: '0.5rem',
            backgroundColor: mode === 'generate' ? '#3b82f6' : '#f3f4f6',
            color: mode === 'generate' ? '#ffffff' : '#111827',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
          } as React.CSSProperties)}
        >
          Generate
        </button>
        <button
          onClick={() => setMode('explain')}
          style={mergeStyles({
            flex: 1,
            padding: '0.5rem',
            backgroundColor: mode === 'explain' ? '#3b82f6' : '#f3f4f6',
            color: mode === 'explain' ? '#ffffff' : '#111827',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
          } as React.CSSProperties)}
        >
          Explain
        </button>
        <button
          onClick={() => setMode('improve')}
          style={mergeStyles({
            flex: 1,
            padding: '0.5rem',
            backgroundColor: mode === 'improve' ? '#3b82f6' : '#f3f4f6',
            color: mode === 'improve' ? '#ffffff' : '#111827',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
          } as React.CSSProperties)}
        >
          Improve
        </button>
      </div>

      {mode === 'generate' && (
        <div style={mergeStyles({ marginBottom: '1rem' } as React.CSSProperties)}>
          <label
            style={mergeStyles({
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
            } as React.CSSProperties)}
          >
            {node.props.promptLabel || 'Describe the code you want to generate'}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              node.props.promptPlaceholder ||
              'E.g., Create a function that sorts an array of numbers...'
            }
            rows={3}
            disabled={isProcessing}
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
      )}

      {mode !== 'generate' && (
        <div style={mergeStyles({ marginBottom: '1rem' } as React.CSSProperties)}>
          <label
            style={mergeStyles({
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
            } as React.CSSProperties)}
          >
            {node.props.codeLabel || 'Your Code'}
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={node.props.codePlaceholder || 'Paste your code here...'}
            rows={6}
            disabled={isProcessing}
            style={mergeStyles({
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              resize: 'vertical',
            } as React.CSSProperties)}
          />
        </div>
      )}

      <div style={mergeStyles({ marginBottom: '1rem' } as React.CSSProperties)}>
        <label
          style={mergeStyles({
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
          } as React.CSSProperties)}
        >
          {node.props.languageLabel || 'Programming Language'}
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isProcessing}
          style={mergeStyles({
            width: '100%',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid #e5e7eb',
            fontSize: '0.875rem',
            backgroundColor: '#ffffff',
          } as React.CSSProperties)}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="cpp">C++</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="sql">SQL</option>
        </select>
      </div>

      <button
        onClick={handleProcess}
        disabled={isProcessing || (mode === 'generate' ? !prompt.trim() : !code.trim())}
        style={mergeStyles({
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '0.375rem',
          cursor:
            isProcessing || (mode === 'generate' ? !prompt.trim() : !code.trim())
              ? 'not-allowed'
              : 'pointer',
          opacity: isProcessing || (mode === 'generate' ? !prompt.trim() : !code.trim()) ? 0.6 : 1,
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '1rem',
        } as React.CSSProperties)}
      >
        {isProcessing
          ? 'Processing...'
          : mode === 'generate'
            ? 'Generate Code'
            : mode === 'explain'
              ? 'Explain Code'
              : 'Improve Code'}
      </button>

      {mode === 'explain' && explanation && (
        <div>
          <label
            style={mergeStyles({
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
            } as React.CSSProperties)}
          >
            {node.props.explanationLabel || 'Code Explanation'}
          </label>
          <div
            style={mergeStyles({
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              fontSize: '0.875rem',
              whiteSpace: 'pre-wrap',
              maxHeight: '300px',
              overflow: 'auto',
            } as React.CSSProperties)}
          >
            {explanation}
          </div>
        </div>
      )}

      {mode !== 'explain' && generatedCode && (
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
              {node.props.generatedCodeLabel || 'Generated Code'}
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
                fontWeight: '600',
              } as React.CSSProperties)}
            >
              {node.props.insertButtonText || 'Insert'}
            </button>
          </div>
          <textarea
            value={generatedCode}
            onChange={(e) => setGeneratedCode(e.target.value)}
            rows={8}
            style={mergeStyles({
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              resize: 'vertical',
            } as React.CSSProperties)}
          />
        </div>
      )}
    </div>
  );
};
