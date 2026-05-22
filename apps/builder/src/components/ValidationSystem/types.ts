import { ComponentId } from '@wysiwyg/core';

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
  components: any[];
  onFixIssue?: (issueId: string) => void;
}
