import React from 'react';
import { Button } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Select } from '@wysiwyg/ui';
import { Role } from './types';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersTabProps {
  roles: Role[];
  users: User[];
  onInviteUser: () => void;
  onRoleChange: (userId: string, newRole: string) => void;
  onRemoveUser: (userId: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({ roles, users, onInviteUser, onRoleChange, onRemoveUser }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-semibold">Team Members</h3>
      <Button variant="primary" size="small" onClick={onInviteUser}>
        <Icon name="user-plus" size="small" />
        Invite User
      </Button>
    </div>
    <div className="space-y-2">
      {users.map(user => (
        <div key={user.id} className="p-3 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={user.role}
                onChange={(value) => onRoleChange(user.id, value)}
                options={roles.map(r => ({ value: r.id, label: r.name }))}
                className="w-32"
              />
              <Button variant="ghost" size="small" onClick={() => onRemoveUser(user.id)}>
                <Icon name="delete" size="small" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
