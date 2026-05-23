import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@wysiwyg/ui';
import { Input } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Panel } from '@wysiwyg/ui';
import { Tabs, TabItem } from '@wysiwyg/ui';
import { Loading } from '@wysiwyg/ui';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI assistant. How can I help you build your project today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const text = customPrompt || inputValue;
    if (!text.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(text),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('help') || lowerInput.includes('assist')) {
      return 'I can help you with:\n\n• Creating components and layouts\n• Writing content and copy\n• Generating designs and styles\n• Optimizing performance\n• Debugging issues\n• Exporting your project\n\nWhat would you like to work on?';
    }

    if (lowerInput.includes('create') || lowerInput.includes('add')) {
      return 'I can help you create new components! You can either:\n\n1. Drag and drop components from the left panel\n2. Ask me to create a specific component (e.g., "create a hero section")\n3. Describe what you need and I\'ll suggest the best approach\n\nWhat kind of component would you like to create?';
    }

    if (lowerInput.includes('style') || lowerInput.includes('design')) {
      return 'I can help you style your components! Here are some options:\n\n• Apply a color scheme\n• Adjust spacing and layout\n• Add animations and effects\n• Make it responsive\n• Match a specific design style\n\nWhat styling would you like to apply?';
    }

    if (lowerInput.includes('export')) {
      return 'I can help you export your project! Here are the available export options:\n\n• HTML Website\n• React Components\n• WordPress Blocks\n• Odoo Snippets\n\nWould you like me to guide you through the export process?';
    }

    if (lowerInput.includes('responsive') || lowerInput.includes('mobile')) {
      return "I can help make your design responsive! Here's what I can do:\n\n• Preview different breakpoints (mobile, tablet, desktop)\n• Suggest responsive layouts\n• Optimize for touch interactions\n• Adjust typography and spacing\n\nWhich device would you like to optimize for?";
    }

    return (
      'I understand you\'re asking about: "' +
      userInput +
      '". Could you provide more details so I can better assist you? You can ask me about:\n\n• Creating components\n• Styling and design\n• Responsive design\n• Exporting\n• Performance optimization\n• And much more!'
    );
  };

  const ChatMessage: React.FC<{ message: AIMessage }> = ({ message }) => (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
          message.role === 'user'
            ? 'bg-primary-600 text-white rounded-br-none'
            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <div
          className={`text-[10px] mt-2 flex items-center gap-1 opacity-60 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <Icon name="clock" size="small" />
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );

  const chatTab: TabItem = {
    id: 'chat',
    label: 'Chat',
    icon: <Icon name="message-square" size="small" />,
    content: (
      <div className="flex flex-col h-[calc(100vh-180px)] bg-gray-50/50">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm">
                <Loading size="small" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t p-4 pb-6">
          <div className="flex gap-2 items-center bg-gray-50 p-1 rounded-xl border border-gray-200 focus-within:border-primary-500 transition-colors">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="How can I help you today?"
              className="flex-1 border-none bg-transparent focus:ring-0 shadow-none"
            />
            <Button
              variant="primary"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="rounded-lg h-9 w-9 p-0 flex items-center justify-center"
            >
              <Icon name="send" size="small" />
            </Button>
          </div>
        </div>
      </div>
    ),
  };

  const suggestionsTab: TabItem = {
    id: 'suggestions',
    label: 'Suggestions',
    icon: <Icon name="lightbulb" size="small" />,
    content: (
      <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-180px)] bg-white">
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon name="zap" size="small" className="text-yellow-500" />
            Quick Actions
          </h3>

          <div className="grid gap-3">
            {[
              {
                label: 'Create a hero section',
                icon: 'layout',
                prompt: 'Create a hero section with a call-to-action',
              },
              {
                label: 'Make design responsive',
                icon: 'smartphone',
                prompt: 'Help me make my design responsive',
              },
              {
                label: 'Suggest color scheme',
                icon: 'palette',
                prompt: 'Suggest a color scheme for my project',
              },
              {
                label: 'Optimize performance',
                icon: 'activity',
                prompt: 'Optimize my page for performance',
              },
              { label: 'Export project', icon: 'download', prompt: 'Help me export my project' },
            ].map((action) => (
              <Button
                key={action.label}
                variant="secondary"
                className="w-full justify-start text-left border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all group"
                onClick={() => handleSendMessage(action.prompt)}
              >
                <Icon
                  name={action.icon}
                  size="small"
                  className="mr-3 text-gray-400 group-hover:text-primary-500"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                  {action.label}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon name="history" size="small" className="text-blue-500" />
            Recent Insights
          </h3>
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
            <ul className="space-y-3">
              {[
                'Consider adding more contrast to your primary button',
                'Your hero image is slightly large, might affect LCP',
                'The layout is looking great on mobile viewports',
              ].map((insight, i) => (
                <li key={i} className="flex gap-3 text-sm text-blue-800/80">
                  <span className="text-blue-400 mt-1">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="medium"
      title="AI Builder Assistant"
      className="flex flex-col h-full"
    >
      <Tabs
        items={[chatTab, suggestionsTab]}
        variant="underline"
        fullWidth
        className="flex-1"
        tabListClassName="px-4 border-b border-gray-100"
        tabPanelClassName="flex-1 overflow-hidden"
      />
    </Panel>
  );
};

export default AIAssistant;
