import React from 'react';
import { Button } from '@wysiwyg/ui';
import { Modal } from '@wysiwyg/ui';
import { Input } from '@wysiwyg/ui';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string;
  onRoleNameChange: (value: string) => void;
  roleDescription: string;
  onRoleDescriptionChange: (value: string) => void;
  onCreateRole: () => void;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  roleName,
  onRoleNameChange,
  roleDescription,
  onRoleDescriptionChange,
  onCreateRole,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Create New Role" size="small">
    <div className="space-y-4">
      <div className="property-item">
        <label className="property-item-label">Role Name</label>
        <Input
          value={roleName}
          onChange={(e) => onRoleNameChange(e.target.value)}
          placeholder="My Role"
          className="w-full"
        />
      </div>
      <div className="property-item">
        <label className="property-item-label">Description</label>
        <textarea
          className="property-item-input w-full h-24"
          value={roleDescription}
          onChange={(e) => onRoleDescriptionChange(e.target.value)}
          placeholder="Describe this role..."
        />
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onCreateRole} disabled={!roleName.trim()}>
          Create Role
        </Button>
      </div>
    </div>
  </Modal>
);
