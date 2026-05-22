export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'project' | 'components' | 'pages' | 'assets' | 'export' | 'settings';
  granted: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault?: boolean;
}

export interface PermissionsSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PERMISSIONS: Permission[] = [
  { id: 'project.view', name: 'View Project', description: 'Can view the project', category: 'project', granted: true },
  { id: 'project.edit', name: 'Edit Project', description: 'Can edit project settings', category: 'project', granted: false },
  { id: 'project.delete', name: 'Delete Project', description: 'Can delete the project', category: 'project', granted: false },
  { id: 'components.view', name: 'View Components', description: 'Can view all components', category: 'components', granted: true },
  { id: 'components.add', name: 'Add Components', description: 'Can add new components', category: 'components', granted: true },
  { id: 'components.edit', name: 'Edit Components', description: 'Can edit existing components', category: 'components', granted: true },
  { id: 'components.delete', name: 'Delete Components', description: 'Can delete components', category: 'components', granted: false },
  { id: 'pages.view', name: 'View Pages', description: 'Can view all pages', category: 'pages', granted: true },
  { id: 'pages.add', name: 'Add Pages', description: 'Can add new pages', category: 'pages', granted: true },
  { id: 'pages.edit', name: 'Edit Pages', description: 'Can edit existing pages', category: 'pages', granted: true },
  { id: 'pages.delete', name: 'Delete Pages', description: 'Can delete pages', category: 'pages', granted: false },
  { id: 'assets.view', name: 'View Assets', description: 'Can view all assets', category: 'assets', granted: true },
  { id: 'assets.upload', name: 'Upload Assets', description: 'Can upload new assets', category: 'assets', granted: true },
  { id: 'assets.delete', name: 'Delete Assets', description: 'Can delete assets', category: 'assets', granted: false },
  { id: 'export.view', name: 'View Export Options', description: 'Can view export options', category: 'export', granted: true },
  { id: 'export.execute', name: 'Execute Export', description: 'Can execute project export', category: 'export', granted: true },
  { id: 'settings.view', name: 'View Settings', description: 'Can view project settings', category: 'settings', granted: true },
  { id: 'settings.edit', name: 'Edit Settings', description: 'Can edit project settings', category: 'settings', granted: false }
];

export const ROLES: Role[] = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'Full access to all features',
    permissions: PERMISSIONS.map(p => p.id),
    isDefault: true
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Can edit components and pages',
    permissions: ['project.view', 'components.view', 'components.add', 'components.edit', 'pages.view', 'pages.add', 'pages.edit', 'assets.view', 'assets.upload', 'export.view']
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Can only view the project',
    permissions: ['project.view', 'components.view', 'pages.view', 'assets.view']
  }
];
