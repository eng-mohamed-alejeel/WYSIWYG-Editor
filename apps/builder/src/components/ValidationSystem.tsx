import React, { useState, useEffect, useCallback } from 'react';
import { Panel } from '@wysiwyg/ui';
import { Tabs, TabItem } from '@wysiwyg/ui';
import { ValidationIssue, ValidationSystemProps } from './ValidationSystem/types';
import { IssuesTab } from './ValidationSystem/IssuesTab';
import { SummaryTab } from './ValidationSystem/SummaryTab';

export const ValidationSystem: React.FC<ValidationSystemProps> = ({ isOpen, onClose, components, onFixIssue }) => {
  const [activeTab, setActiveTab] = useState('issues');
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const scanComponents = useCallback(async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newIssues: ValidationIssue[] = [];
    components.forEach(component => {
      if (component.type === 'image' && !component.props?.src) {
        newIssues.push({ id: `missing-src-${component.id}`, type: 'error', componentId: component.id, componentType: component.type, message: 'Image component is missing a source URL', suggestion: 'Add a valid image URL to the src property' });
      }
      if (component.type === 'link' && !component.props?.href) {
        newIssues.push({ id: `missing-href-${component.id}`, type: 'warning', componentId: component.id, componentType: component.type, message: 'Link component is missing an href attribute', suggestion: 'Add a valid URL to the href property' });
      }
      if (component.type === 'button' && !component.props?.text) {
        newIssues.push({ id: `missing-text-${component.id}`, type: 'warning', componentId: component.id, componentType: component.type, message: 'Button component is missing text content', suggestion: 'Add text to make the button accessible' });
      }
      if (component.type === 'image' && !component.props?.alt) {
        newIssues.push({ id: `missing-alt-${component.id}`, type: 'warning', componentId: component.id, componentType: component.type, message: 'Image component is missing alt text', suggestion: 'Add descriptive alt text for accessibility' });
      }
      if (!component.styles?.width && !component.styles?.maxWidth) {
        newIssues.push({ id: `missing-width-${component.id}`, type: 'info', componentId: component.id, componentType: component.type, message: 'Component has no width constraints', suggestion: 'Consider adding width or max-width for better responsiveness' });
      }
      if (component.type === 'image' && component.props?.src?.includes('large')) {
        newIssues.push({ id: `large-image-${component.id}`, type: 'warning', componentId: component.id, componentType: component.type, message: 'Image source suggests large file size', suggestion: 'Consider optimizing the image for better performance' });
      }
      if (component.type === 'heading' && component.props?.level === '1' && component.props?.text?.length > 60) {
        newIssues.push({ id: `long-heading-${component.id}`, type: 'info', componentId: component.id, componentType: component.type, message: 'H1 heading is longer than recommended', suggestion: 'Keep H1 headings under 60 characters for better SEO' });
      }
    });
    setIssues(newIssues);
    setIsScanning(false);
  }, [components]);

  useEffect(() => { if (isOpen) scanComponents(); }, [isOpen, scanComponents]);

  const handleFixIssue = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (issue?.fix) { issue.fix(); setIssues(issues.filter(i => i.id !== issueId)); }
    onFixIssue?.(issueId);
  };

  const handleFixAll = () => { issues.filter(issue => issue.fix).forEach(issue => issue.fix?.()); setIssues([]); };

  const tabs: TabItem[] = [
    { id: 'issues', label: `Issues (${issues.length})`, content: <IssuesTab issues={issues} isScanning={isScanning} onFixIssue={handleFixIssue} onFixAll={handleFixAll} onRescan={scanComponents} /> },
    { id: 'summary', label: 'Summary', content: <SummaryTab issues={issues} components={components} /> }
  ];

  return (
    <Panel isOpen={isOpen} onClose={onClose} position="right" size="medium" title="Validation" className="h-full">
      <Tabs items={tabs} defaultActiveTab={activeTab} onChange={setActiveTab} variant="pills" className="flex-1" />
    </Panel>
  );
};

export default ValidationSystem;
