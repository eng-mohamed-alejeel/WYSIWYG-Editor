import React from 'react';
import { Badge } from '@wysiwyg/ui';
import { Switch } from '@wysiwyg/ui';
import { Role, Permission } from './types';

interface PermissionsTabProps {
  selectedRole: Role | null;
  permissions: Permission[];
  onTogglePermission: (permissionId: string) => void;
}

export const PermissionsTab: React.FC<PermissionsTabProps> = ({
  selectedRole,
  permissions,
  onTogglePermission,
}) => {
  if (!selectedRole) {
    return (
      <div className="text-center text-gray-500 py-8">
        Select a role to view and edit its permissions
      </div>
    );
  }

  const categories = ['project', 'components', 'pages', 'assets', 'export', 'settings'] as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-semibold">{selectedRole.name} Permissions</h3>
        <Badge variant="secondary" size="sm">
          {selectedRole.permissions.length} granted
        </Badge>
      </div>
      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <h4 className="font-medium capitalize">{category}</h4>
          <div className="space-y-2">
            {permissions
              .filter((p) => p.category === category)
              .map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{permission.name}</div>
                    <div className="text-sm text-gray-600">{permission.description}</div>
                  </div>
                  <Switch
                    checked={selectedRole.permissions.includes(permission.id)}
                    onChange={() => onTogglePermission(permission.id)}
                    disabled={selectedRole.isDefault}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
