import React, { useState } from 'react';
import { Modal } from '@wysiwyg/ui';
import { Tabs, TabItem } from '@wysiwyg/ui';
import { Role, PermissionsSystemProps, PERMISSIONS, ROLES } from './PermissionsSystem/types';
import { RolesTab } from './PermissionsSystem/RolesTab';
import { PermissionsTab } from './PermissionsSystem/PermissionsTab';
import { UsersTab } from './PermissionsSystem/UsersTab';
import { CreateRoleModal } from './PermissionsSystem/CreateRoleModal';

export const PermissionsSystem: React.FC<PermissionsSystemProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('roles');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [roles, setRoles] = useState<Role[]>(ROLES);

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;
    const newRole: Role = {
      id: newRoleName.toLowerCase().replace(/\s+/g, '_'),
      name: newRoleName,
      description: newRoleDescription,
      permissions: []
    };
    console.log('Creating role:', newRole);
    setRoles([...roles, newRole]);
    setNewRoleName('');
    setNewRoleDescription('');
    setIsCreateRoleModalOpen(false);
  };

  const handleTogglePermission = (permissionId: string) => {
    if (!selectedRole) return;
    const updatedPermissions = selectedRole.permissions.includes(permissionId)
      ? selectedRole.permissions.filter(p => p !== permissionId)
      : [...selectedRole.permissions, permissionId];
    setSelectedRole({ ...selectedRole, permissions: updatedPermissions });
  };

  const handleRoleChange = (userId: string, newRole: string) => console.log('Changing role for user:', userId, 'to:', newRole);
  const handleRemoveUser = (userId: string) => console.log('Removing user:', userId);

  const tabs: TabItem[] = [
    {
      id: 'roles',
      label: 'Roles',
      content: (
        <RolesTab
          roles={roles}
          selectedRole={selectedRole}
          onRoleSelect={setSelectedRole}
          onCreateRole={() => setIsCreateRoleModalOpen(true)}
        />
      )
    },
    {
      id: 'permissions',
      label: 'Permissions',
      content: (
        <PermissionsTab
          selectedRole={selectedRole}
          permissions={PERMISSIONS}
          onTogglePermission={handleTogglePermission}
        />
      )
    },
    {
      id: 'users',
      label: 'Users',
      content: (
        <UsersTab
          roles={roles}
          users={[
            { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'editor' },
            { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'viewer' }
          ]}
          onInviteUser={() => {}}
          onRoleChange={handleRoleChange}
          onRemoveUser={handleRemoveUser}
        />
      )
    }
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Permissions & Roles" size="large">
        <Tabs items={tabs} defaultActiveTab={activeTab} onChange={setActiveTab} variant="pills" />
      </Modal>
      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        roleName={newRoleName}
        onRoleNameChange={setNewRoleName}
        roleDescription={newRoleDescription}
        onRoleDescriptionChange={setNewRoleDescription}
        onCreateRole={handleCreateRole}
      />
    </>
  );
};

export default PermissionsSystem;
