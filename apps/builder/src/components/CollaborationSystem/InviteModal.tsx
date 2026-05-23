import React from 'react';
import { Button } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Modal } from '@wysiwyg/ui';
import { Input } from '@wysiwyg/ui';
import { Select } from '@wysiwyg/ui';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteEmail: string;
  onEmailChange: (value: string) => void;
  inviteRole: 'editor' | 'viewer';
  onRoleChange: (value: 'editor' | 'viewer') => void;
  onInvite: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  inviteEmail,
  onEmailChange,
  inviteRole,
  onRoleChange,
  onInvite,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member" size="small">
      <div className="space-y-4">
        <div className="property-item">
          <label className="property-item-label">Email</label>
          <Input
            type="email"
            value={inviteEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="colleague@example.com"
            className="w-full"
          />
        </div>

        <div className="property-item">
          <label className="property-item-label">Role</label>
          <Select
            value={inviteRole}
            onChange={(value) => onRoleChange(value as 'editor' | 'viewer')}
            options={[
              { value: 'editor', label: 'Editor - Can edit and comment' },
              { value: 'viewer', label: 'Viewer - Can view and comment' },
            ]}
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onInvite} disabled={!inviteEmail.trim()}>
            <Icon name="send" size="small" />
            Send Invite
          </Button>
        </div>
      </div>
    </Modal>
  );
};
