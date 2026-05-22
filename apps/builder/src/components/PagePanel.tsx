import React, { useState } from 'react';
import { useBuilderStore } from '../store/store';
import { Button } from '@wysiwyg/ui';
import { Input } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Dropdown, DropdownItem } from '@wysiwyg/ui';
import { Modal } from '@wysiwyg/ui';

export const PagePanel: React.FC = () => {
  const { project, currentPageId, setCurrentPageId, setProject } = useBuilderStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  const handleCreatePage = () => {
    if (!newPageName.trim()) return;

    const newPage = {
      id: `page_${Date.now()}`,
      name: newPageName,
      path: `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`,
      components: [],
      settings: {}
    };

    setProject({
      ...project,
      pages: [...(project?.pages || []), newPage]
    });

    setNewPageName('');
    setIsCreateModalOpen(false);
  };

  const handleDeletePage = (pageId: string) => {
    if (project?.pages.length <= 1) {
      alert('Cannot delete the last page');
      return;
    }

    setProject({
      ...project,
      pages: project.pages.filter((p: any) => p.id !== pageId)
    });

    if (currentPageId === pageId) {
      setCurrentPageId(project.pages[0].id);
    }
  };

  const handleDuplicatePage = (pageId: string) => {
    const page = project?.pages.find((p: any) => p.id === pageId);
    if (!page) return;

    const duplicatedPage = {
      ...page,
      id: `page_${Date.now()}`,
      name: `${page.name} (Copy)`,
      path: `${page.path}-copy`
    };

    setProject({
      ...project,
      pages: [...(project?.pages || []), duplicatedPage]
    });
  };

  const getPageMenuItems = (pageId: string): DropdownItem[] => [
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: 'copy',
      onClick: () => handleDuplicatePage(pageId)
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'delete',
      onClick: () => handleDeletePage(pageId)
    }
  ];

  return (
    <>
      <div className="page-panel">
        <div className="page-panel-header">
          <h3 className="text-sm font-semibold">Pages</h3>
          <Button
            variant="ghost"
            size="small"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Icon name="plus" size="small" />
          </Button>
        </div>

        <div className="page-panel-content">
          {project?.pages.map((page: any) => (
            <div
              key={page.id}
              className={`page-item ${currentPageId === page.id ? 'page-item-active' : ''}`}
              onClick={() => setCurrentPageId(page.id)}
            >
              <div className="page-item-content">
                <Icon name="file" size="small" />
                <span className="page-item-name">{page.name}</span>
              </div>

              <Dropdown
                items={getPageMenuItems(page.id)}
                trigger={
                  <Button variant="ghost" size="small">
                    <Icon name="more-vertical" size="small" />
                  </Button>
                }
                position="bottom-right"
              />
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Page"
        size="small"
      >
        <div className="space-y-4">
          <div className="property-item">
            <label className="property-item-label">Page Name</label>
            <Input
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="My Page"
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreatePage}
              disabled={!newPageName.trim()}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PagePanel;
