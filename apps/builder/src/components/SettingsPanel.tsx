import React, { useMemo, useCallback } from 'react';
import { useBuilderStore } from '../store/store';
import { Tabs, TabItem } from '@wysiwyg/ui';
import { GeneralTab } from './SettingsPanel/GeneralTab';
import { StylesTab } from './SettingsPanel/StylesTab';
import { AdvancedTab } from './SettingsPanel/AdvancedTab';

export const SettingsPanel: React.FC = () => {
  const { project, setProject } = useBuilderStore();

  const handleProjectUpdate = useCallback(
    (updates: any) => {
      if (project) {
        setProject({
          ...project,
          ...updates,
        });
      }
    },
    [project, setProject]
  );

  const tabs = useMemo<TabItem[]>(
    () => [
      {
        id: 'general',
        label: 'General',
        content: <GeneralTab project={project} handleProjectUpdate={handleProjectUpdate} />,
      },
      {
        id: 'styles',
        label: 'Styles',
        content: <StylesTab project={project} handleProjectUpdate={handleProjectUpdate} />,
      },
      {
        id: 'advanced',
        label: 'Advanced',
        content: <AdvancedTab project={project} handleProjectUpdate={handleProjectUpdate} />,
      },
    ],
    [project, handleProjectUpdate]
  );

  return (
    <div className="h-full flex flex-col">
      <Tabs items={tabs} variant="pills" className="flex-1" />
    </div>
  );
};
