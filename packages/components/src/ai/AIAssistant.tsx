/**
 * AIAssistant Component
 * 
 * An AI assistant component for providing AI-powered suggestions
 * and assistance within the editor.
 */

import React, { useState, useRef, useEffect } from 'react';
import { BaseComponentProps } from '../types';
import { parseInlineStyles, mergeStyles } from '../utils/styleUtils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const AIAssistant: React.FC<BaseComponentProps> = ({
  node,
  context,
  style,
  className = ''
}) => {
  const { isEditable, isPreview } = context;
  const [isOpen, setIsOpen] = useState(node.props.defaultOpen || false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response - in real implementation, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your message: "${userMessage.content}". This is a simulated response. In a real implementation, this would connect to an AI service like OpenAI's GPT or similar.`,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      id={node.id}
      className={`wysiwyg-ai-assistant ${className}`.trim()}
      style={mergeStyles({
        ...(node.styles as Record<string, any>),
        ...parseInlineStyles(style),
        position: 'fixed',
        bottom: node.props.bottom || '2rem',
        right: node.props.right || '2rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      } as React.CSSProperties)}
      data-component-type={node.type}
      data-editable={isEditable}
      data-preview={isPreview}
    >
      {isOpen && (
        <div
          className="wysiwyg-ai-assistant-chat"
          style={mergeStyles({
            width: node.props.width || '400px',
            height: node.props.height || '500px',
            backgroundColor: node.props.backgroundColor || '#ffffff',
            borderRadius: node.props.borderRadius || '0.75rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            marginBottom: '0.5rem'
          } as React.CSSProperties)}
        >
          <div
            className="wysiwyg-ai-assistant-header"
            style={mergeStyles({
              padding: '1rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: node.props.headerBackgroundColor || '#f9fafb'
            } as React.CSSProperties)}
          >
            <h3 style={mergeStyles({ margin: 0, fontSize: '1rem', fontWeight: '600' } as React.CSSProperties)}>
              {node.props.title || 'AI Assistant'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={mergeStyles({
                background: 'none',
                border: 'none',
                fontSize: '1.25rem',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                lineHeight: 1,
                color: '#6b7280'
              } as React.CSSProperties)}
            >
              ×
            </button>
          </div>

          <div
            className="wysiwyg-ai-assistant-messages"
            style={mergeStyles({
              flex: 1,
              overflow: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            } as React.CSSProperties)}
          >
            {messages.length === 0 && (
              <div style={mergeStyles({ textAlign: 'center', color: '#6b7280', marginTop: '2rem' } as React.CSSProperties)}>
                {node.props.welcomeMessage || 'How can I help you today?'}
              </div>
            )}

            {messages.map(message => (
              <div
                key={message.id}
                className={`wysiwyg-ai-assistant-message wysiwyg-ai-assistant-message-${message.role}`}
                style={mergeStyles({
                  maxWidth: '80%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: message.role === 'user' ? '#3b82f6' : '#f3f4f6',
                  color: message.role === 'user' ? '#ffffff' : '#111827'
                } as React.CSSProperties)}
              >
                {message.content}
              </div>
            ))}

            {isLoading && (
              <div
                className="wysiwyg-ai-assistant-message wysiwyg-ai-assistant-message-assistant"
                style={mergeStyles({
                  maxWidth: '80%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  alignSelf: 'flex-start',
                  backgroundColor: '#f3f4f6',
                  color: '#111827'
                } as React.CSSProperties)}
              >
                <div style={mergeStyles({ display: 'flex', gap: '0.25rem' } as React.CSSProperties)}>
                  <span style={mergeStyles({ animation: 'pulse 1.5s infinite' } as React.CSSProperties)}>●</span>
                  <span style={mergeStyles({ animation: 'pulse 1.5s infinite 0.2s' } as React.CSSProperties)}>●</span>
                  <span style={mergeStyles({ animation: 'pulse 1.5s infinite 0.4s' } as React.CSSProperties)}>●</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div
            className="wysiwyg-ai-assistant-input"
            style={mergeStyles({
              padding: '1rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '0.5rem'
            } as React.CSSProperties)}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={node.props.inputPlaceholder || 'Type your message...'}
              disabled={isLoading}
              style={mergeStyles({
                flex: 1,
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb',
                fontSize: '0.875rem'
              } as React.CSSProperties)}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              style={mergeStyles({
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !inputValue.trim() ? 0.6 : 1,
                fontSize: '0.875rem',
                fontWeight: '600'
              } as React.CSSProperties)}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="wysiwyg-ai-assistant-toggle"
        style={mergeStyles({
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: node.props.buttonBackgroundColor || '#3b82f6',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.2s'
        } as React.CSSProperties)}
      >
        {isOpen ? '×' : '🤖'}
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};


