import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Modal } from '@wysiwyg/ui';
import { Tabs, TabItem } from '@wysiwyg/ui';
import { Select } from '@wysiwyg/ui';
import { Switch } from '@wysiwyg/ui';

interface CodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: 'html' | 'css' | 'javascript' | 'typescript';
  onChange?: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  isOpen,
  onClose,
  code,
  language,
  onChange,
}) => {
  const [editorCode, setEditorCode] = useState(code);
  const [activeTab, setActiveTab] = useState('code');
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [autoIndent, setAutoIndent] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditorCode(code);
  }, [code, isOpen]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorCode(e.target.value);
    onChange?.(e.target.value);
  };

  const handleSave = () => {
    onChange?.(editorCode);
    onClose();
  };

  const handleFormat = () => {
    // Simple code formatting
    let formatted = editorCode;

    if (language === 'html') {
      // Basic HTML formatting
      formatted = formatted.replace(/></g, '>\n<');
    } else if (language === 'css') {
      // Basic CSS formatting
      formatted = formatted.replace(/;/g, ';\n');
    } else if (language === 'javascript' || language === 'typescript') {
      // Basic JS/TS formatting
      formatted = formatted.replace(/{/g, '{\n  ').replace(/}/g, '\n}').replace(/;/g, ';\n  ');
    }

    setEditorCode(formatted);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorCode);
  };

  const codeTab: TabItem = {
    id: 'code',
    label: 'Code',
    content: (
      <div className="flex flex-col h-full">
        <div className="flex gap-2 mb-4">
          <Select
            value={language}
            onChange={() => {}}
            options={[
              { value: 'html', label: 'HTML' },
              { value: 'css', label: 'CSS' },
              { value: 'javascript', label: 'JavaScript' },
              { value: 'typescript', label: 'TypeScript' },
            ]}
            className="w-32"
          />

          <Button variant="ghost" size="small" onClick={handleFormat}>
            <Icon name="format" size="small" />
            Format
          </Button>

          <Button variant="ghost" size="small" onClick={handleCopy}>
            <Icon name="copy" size="small" />
            Copy
          </Button>
        </div>

        <div className="flex-1 relative border rounded-lg overflow-hidden">
          {lineNumbers && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-100 text-gray-500 text-right pr-2 pt-2 font-mono text-sm select-none">
              {editorCode.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={editorCode}
            onChange={handleCodeChange}
            className="w-full h-full p-2 font-mono resize-none outline-none"
            style={{
              fontSize: `${fontSize}px`,
              paddingLeft: lineNumbers ? '3rem' : '0.5rem',
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              overflow: wordWrap ? 'auto' : 'auto',
            }}
            spellCheck={false}
          />
        </div>
      </div>
    ),
  };

  const settingsTab: TabItem = {
    id: 'settings',
    label: 'Settings',
    content: (
      <div className="space-y-4">
        <div className="property-item">
          <label className="property-item-label">Show Line Numbers</label>
          <Switch checked={lineNumbers} onChange={setLineNumbers} />
        </div>

        <div className="property-item">
          <label className="property-item-label">Word Wrap</label>
          <Switch checked={wordWrap} onChange={setWordWrap} />
        </div>

        <div className="property-item">
          <label className="property-item-label">Auto Indent</label>
          <Switch checked={autoIndent} onChange={setAutoIndent} />
        </div>

        <div className="property-item">
          <label className="property-item-label">Font Size</label>
          <Select
            value={fontSize.toString()}
            onChange={(value) => setFontSize(Number(value))}
            options={[
              { value: '12', label: '12px' },
              { value: '14', label: '14px' },
              { value: '16', label: '16px' },
              { value: '18', label: '18px' },
              { value: '20', label: '20px' },
            ]}
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Theme</label>
          <Select
            value="light"
            onChange={() => {}}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'monokai', label: 'Monokai' },
            ]}
            className="w-full"
          />
        </div>
      </div>
    ),
  };

  const previewTab: TabItem = {
    id: 'preview',
    label: 'Preview',
    content: (
      <div className="h-full border rounded-lg overflow-auto p-4">
        {language === 'html' ? (
          <div dangerouslySetInnerHTML={{ __html: editorCode }} />
        ) : (
          <pre className="font-mono text-sm whitespace-pre-wrap">{editorCode}</pre>
        )}
      </div>
    ),
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Code Editor" size="large">
      <div className="h-96">
        <Tabs
          items={[codeTab, settingsTab, previewTab]}
          defaultActiveTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
          className="h-full"
        />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          <Icon name="save" size="small" />
          Save Changes
        </Button>
      </div>
    </Modal>
  );
};

export default CodeEditor;
