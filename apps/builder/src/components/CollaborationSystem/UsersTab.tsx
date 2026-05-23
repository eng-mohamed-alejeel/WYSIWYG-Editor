import React from 'react';
import Image from 'next/image';
import { Button } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Badge } from '@wysiwyg/ui';
import { Dropdown } from '@wysiwyg/ui';
import { Switch } from '@wysiwyg/ui';
import { User } from './types';

interface UsersTabProps {
  users: User[];
  onInviteClick: () => void;
  onUpdateRole: (userId: string, newRole: 'editor' | 'viewer') => void;
  onRemoveUser: (userId: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  users,
  onInviteClick,
  onUpdateRole,
  onRemoveUser,
}) => {
  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Team Members</h3>
        <Button variant="primary" size="small" onClick={onInviteClick}>
          <Icon name="user-plus" size="small" />
          Invite
        </Button>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-2 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
                <div
                  className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${getStatusColor(user.status)}`}
                />
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={user.role === 'owner' ? 'default' : 'secondary'} size="sm">
                {user.role}
              </Badge>

              {user.role !== 'owner' && (
                <Dropdown
                  items={[
                    {
                      id: 'editor',
                      label: 'Editor',
                      onClick: () => onUpdateRole(user.id, 'editor'),
                    },
                    {
                      id: 'viewer',
                      label: 'Viewer',
                      onClick: () => onUpdateRole(user.id, 'viewer'),
                    },
                    {
                      id: 'remove',
                      label: 'Remove',
                      icon: 'delete',
                      onClick: () => onRemoveUser(user.id),
                    },
                  ]}
                  trigger={
                    <Button variant="ghost" size="small">
                      <Icon name="more-vertical" size="small" />
                    </Button>
                  }
                  position="bottom-right"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="property-item">
          <label className="property-item-label">Allow Public Access</label>
          <Switch checked={false} onChange={() => {}} />
          <p className="text-sm text-gray-600 mt-1">Anyone with the link can view this project</p>
        </div>
      </div>
    </div>
  );
};
