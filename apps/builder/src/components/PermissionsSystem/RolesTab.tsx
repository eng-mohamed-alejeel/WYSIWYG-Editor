import React from 'react';
import { Button } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Badge } from '@wysiwyg/ui';
import { Role } from './types';

interface RolesTabProps {
  roles: Role[];
  selectedRole: Role | null;
  onRoleSelect: (role: Role) => void;
  onCreateRole: () => void;
}

export const RolesTab: React.FC<RolesTabProps> = ({ roles, selectedRole, onRoleSelect, onCreateRole }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-semibold">Roles</h3>
      <Button variant="primary" size="small" onClick={onCreateRole}>
        <Icon name="plus" size="small" />
        Create Role
      </Button>
    </div>
    <div className="space-y-2">
      {roles.map(role => (
        <div
          key={role.id}
          className={`p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
            selectedRole?.id === role.id ? 'border-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => onRoleSelect(role)}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{role.name}</div>
              <div className="text-sm text-gray-600">{role.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" size="sm">{role.permissions.length} permissions</Badge>
              {role.isDefault && <Badge variant="default" size="sm">Default</Badge>}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
