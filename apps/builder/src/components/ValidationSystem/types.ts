import { ComponentId, ComponentNode } from '@wysiwyg/core';

export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  componentId: ComponentId;
  componentType: string;
  message: string;
  suggestion?: string;
  fix?: () => void;
}

export interface ValidationSystemProps {
  isOpen: boolean;
  onClose: () => void;
  components: ComponentNode[];
  onFixIssue?: (issueId: string) => void;
}
